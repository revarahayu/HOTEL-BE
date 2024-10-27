const userModel = require(`../models/index`).user;
const upload = require(`./upload-user`);
const { Op } = require("sequelize");
const path = require(`path`);
const fs = require(`fs`);
const joi = require(`joi`);
const md5 = require(`md5`);

const jsonwebtoken = require("jsonwebtoken")
const SECRET_KEY = "secretcode"

const validateUser = (input, isUpdate = false) => {
  let rules = joi.object().keys({
    nama_user: joi.string().required(),
    role: joi.string().valid("admin", "resepsionis", "customer").required(),
    email: joi.string().email().required(),
    password: isUpdate ? joi.string().optional() : joi.string().min(8).required(),
    foto: isUpdate ? joi.string().optional() : joi.string().required(),
  });

  let { error } = rules.validate(input);
  if (error) {
    let message = error.details.map((item) => item.message).join(",");
    return {
      status: false,
      message: message,
    };
  }
  return {
    status: true,
  };
};

// Login
const validateLogin = (input) => {
  let rules = joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().required(),
  });

  let { error } = rules.validate(input);
  if (error) {
      let message = error.details.map((item) => item.message).join(", ");
      return {
          status: false,
          message: message,
      };
  }
  return {
      status: true,
  };
};
exports.login = async (request, response) => {
  try {
      const resultValidation = validateLogin(request.body);
      if (resultValidation.status === false) {
          return response.status(400).json({
              message: resultValidation.message,
          });
      }

      const params = {
          email: request.body.email,
          password: md5(request.body.password),
      };

      const findUser = await userModel.findOne({ where: params });
      if (findUser == null) {
          return response.status(400).json({
              message: "Email or password doesn't match",
          });
      }

      let tokenPayLoad = {
          id: findUser.id_user,
          email: findUser.email,
          role: findUser.role,
          nama_user: findUser.nama_user,
      };

      const expiresIn = '1h'; // nilai default expired token
      let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY, { expiresIn });

      return response.status(200).json({
          message: "Success login",
          data: {
              token: token,
              id: findUser.id,
              nama_user: findUser.nama_user,
              email: findUser.email,
              role: findUser.role,
          },
      });
  } catch (error) {
      console.log(error);
      return response.status(500).json({
          message: error.message,
      });
  }
};

// Register
exports.register = async (request, response) => {
  try {
    const uploadUser = upload.single("foto");
    uploadUser(request, response, async (error) => {
      if (error) {
        return response.json({
          status: false,
          message: error.message,
        });
      }

      if (!request.file) {
        return response.json({
          status: false,
          message: "eitss fotonya harus diisi yaa",
        });
      }
      
      const ceknamaUser = await userModel.findOne({
        where: { nama_user: request.body.nama_user }
      });

      if (ceknamaUser) {
        if (request.file) {
          fs.unlinkSync(path.join(__dirname, `../images/foto-user/${request.file.filename}`));
        }
        return response.json({
          status: false,
          message: `Nama user ${request.body.nama_user} sudah digunakan yang mulia`,
        });
      }

      const cekEmailUser = await userModel.findOne({
        where: { email: request.body.email },
      });

      if (cekEmailUser) {
        if (request.file) {
          fs.unlinkSync(path.join(__dirname, `../images/foto-user/${request.file.filename}`));
        }
        return response.json({
          status: false,
          message: `Email sudah digunakan yang mulia`,
        });
      }

      request.body.foto = request.file.filename;
      request.body.role = 'customer';

      let resultValidation = validateUser(request.body);
      if (resultValidation.status === false) {
        fs.unlinkSync(path.join(__dirname, `../images/foto-user/${request.file.filename}`));
        return response.json({
          status: false,
          message: resultValidation.message,
        });
      }

      request.body.password = md5(request.body.password);

      try {
        await userModel.create(request.body);
        return response.json({
          status: true,
          message: "Data user berhasil ditambahkan",
        });
      } catch (error) {
        fs.unlinkSync(path.join(__dirname, `../images/foto-user/${request.file.filename}`));
        throw error;
      }
    });
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};






exports.getUser = async (request, response) => {
  try {
    let result = await userModel.findAll();
    return response.json({
      status: true,
      data: result,
    });
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};

exports.addUser = async (request, response) => {
  try {
      const uploadUser = upload.single("foto");
      uploadUser(request, response, async (error) => {
          if (error) {
              return response.json({
                  status: false,
                  message: error.message,
              });
          }

          if (!request.file) {
              return response.json({
                  status: false,
                  message: "Eitss, fotonya harus diisi yaa",
              });
          }

          const cekEmailUser = await userModel.findOne({
              where: { email: request.body.email },
          });

          if (cekEmailUser) {
              fs.unlinkSync(path.join(__dirname, `../images/foto-user/${request.file.filename}`));
              return response.json({
                  status: false,
                  message: `Email sudah digunakan yang mulia`,
              });
          }

          const cekNamaUser = await userModel.findOne({
              where: { nama_user: request.body.nama_user },
          });

          if (cekNamaUser) {
              fs.unlinkSync(path.join(__dirname, `../images/foto-user/${request.file.filename}`));
              return response.json({
                  status: false,
                  message: `Nama user ${request.body.nama_user} sudah digunakan yang mulia`,
              });
          }

          request.body.foto = request.file.filename;

          let resultValidation = validateUser(request.body);
          if (resultValidation.status === false) {
              fs.unlinkSync(path.join(__dirname, `../images/foto-user/${request.file.filename}`));
              return response.json({
                  status: false,
                  message: resultValidation.message,
              });
          }

          request.body.password = md5(request.body.password);

          try {
              await userModel.create(request.body);
              return response.json({
                  status: true,
                  message: "Data user berhasil ditambahkan",
              });
          } catch (error) {
              fs.unlinkSync(path.join(__dirname, `../images/foto-user/${request.file.filename}`));
              return response.json({
                  status: false,
                  message: error.message,
              });
          }
      });
  } catch (error) {
      return response.json({
          status: false,
          message: error.message,
      });
  }
};

  

exports.findUser = async (request, response) => {
  try {
    let keyword = request.body.keyword;
    let result = await userModel.findAll({
      where: {
        [Op.or]: {
          nama_user: { [Op.substring]: keyword },
          role: { [Op.substring]: keyword },
          email: { [Op.substring]: keyword },
        },
      },
    });
    return response.json({
      status: true,
      data: result,
    });
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};

exports.deleteUser = async (request, response) => {
  try {
    let id_user = request.params.id_user;
    await userModel.destroy({ where: { id_user: id_user } });
    return response.json({
      status: true,
      message: `Data user berhasil dihapus`,
    });
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};

exports.updateUser = async (request, response) => {
  try {
    const uploadUser = upload.single('foto');
    uploadUser(request, response, async (error) => {
      if (error) {
        return response.json({
          status: false,
          message: error.message 
        });
      }

      let id_user = request.params.id_user;
      let selectedUser = await userModel.findOne({ where: { id_user: id_user } });

      if (!selectedUser) {
        return response.json({
          status: false,
          message: 'yahh usernya ngga ada nihh' 
        });
      }

      let dataUpdate = {
        nama_user: request.body.nama_user || selectedUser.nama_user,
        email: request.body.email || selectedUser.email,
        role: request.body.role || selectedUser.role,
      };

      if (request.body.nama_user && request.body.nama_user !== selectedUser.nama_user) {
        const cekNamaUser = await userModel.findOne({
          where: { nama_user: request.body.nama_user }
        });

        if (cekNamaUser) {
          return response.json({
            status: false,
            message: `Nama pengguna ${request.body.nama_user} sudah digunakan yang mulia`
          });
        }
      }

      if (request.body.email && request.body.email !== selectedUser.email) {
        const cekEmailUser = await userModel.findOne({
          where: { email: request.body.email }
        });

        if (cekEmailUser) {
          return response.json({
            status: false,
            message: `Email ${request.body.email} sudah digunakan yang mulia`
          });
        }
      }

      if (request.file) {
        let oldFilename = selectedUser.foto; 
        let pathFile = path.join(__dirname, `../foto-user`, oldFilename);
        if (fs.existsSync(pathFile)) {
          fs.unlinkSync(pathFile);
        }
        dataUpdate.foto = request.file.filename;
      } else {
        dataUpdate.foto = selectedUser.foto;
      }

      if (request.body.password) {
        dataUpdate.password = md5(request.body.password); 
      } else {
        dataUpdate.password = selectedUser.password;
      }

      let resultValidation = validateUser(dataUpdate, true); 
      if (resultValidation.status === false) {
        return response.json({
          status: false,
          message: resultValidation.message 
        });
      }

      await userModel.update(dataUpdate, { where: { id_user: id_user } });
      return response.json({
        status: true,
        message: 'Data user berhasil diupdate' 
      });
    });
  } catch (error) {
    return response.json({
      status: false,
      message: error.message 
    });
  }
};
