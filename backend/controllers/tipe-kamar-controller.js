const tipe_kamarModel = require(`../models/index`).tipe_kamar;
const upload = require(`./upload-tipe-kamar`);
const path = require(`path`);
const fs = require(`fs`);
const joi = require(`joi`);
const { Op } = require("sequelize");

const validateTipeKamar = (input) => {
  let rules = joi.object().keys({
    nama_tipe_kamar: joi.string().required(),
    deskripsi: joi.string().required(),
    harga: joi.number().required(),
  });
  let { error } = rules.validate(input);
  if (error) {
    let message = error.details.map((item) => item.message).join(`,`);

    return {
      status: false,
      message: message,
    };
  }
  return {
    status: true,
  };
};

exports.addTipeKamar = async (request, response) => {
  try {
    const uploadTipeKamar = upload.single(`foto`);
    uploadTipeKamar(request, response, async (error) => {
      if (error) {
        return response.json({
          status: false,
          message: error,
        });
      }

      if (!request.file) {
        return response.json({
          status: false,
          message: `Ngga ada file yang bisa diupload nih`,
        });
      }

      let resultValidation = validateTipeKamar(request.body);
      if (resultValidation.status === false) {
        fs.unlinkSync(path.join(__dirname, `../images/foto-tipe-kamar/${request.file.filename}`));
        return response.json({
          status: false,
          message: resultValidation.message,
        });
      }

      // cek harga (gabole kurang dari 0)
      if (request.body.harga < 0) {
        fs.unlinkSync(path.join(__dirname, `../images/foto-tipe-kamar/${request.file.filename}`));
        return response.json({
          status: false,
          message: `Harga tidak boleh ${request.body.harga} yang mulia`,
        });
      }

      request.body.foto = request.file.filename;

      await tipe_kamarModel.create(request.body);

      return response.json({
        status: true,
        message: `Data tipe kamar berhasil ditambahkan`,
      });
    });
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};


exports.getTipeKamar = async (request, response) => {
  try {
    const result = await tipe_kamarModel.findAll();
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

exports.filterTipeKamar = async (request, response) => {
  try {
    let keyword = request.body.keyword;
    const result = await tipe_kamarModel.findAll({
      where: {
        [Op.or]: {
          nama_tipe_kamar: { [Op.substring]: keyword },
          harga: { [Op.substring]: keyword },
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

exports.deleteTipeKamar = async (request, response) => {
  try {
    let id_tipe_kamar = request.params.id_tipe_kamar;
    const selectedTipeKamar = await tipe_kamarModel.findOne({
      where: { id_tipe_kamar: id_tipe_kamar },
    });
    let pathFile = path.join(
      __dirname,
      `../foto-tipe-kamar`,
      selectedTipeKamar.foto
    );
    if (fs.existsSync(pathFile)) {
      fs.unlinkSync(pathFile, (error) => {
        console.log(error);
      });
    }
    await tipe_kamarModel.destroy({ where: { id_tipe_kamar: id_tipe_kamar } });
    return response.json({
      status: true,
      message: `Data tipe kamar berhasil dihapus`,
    });
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};

exports.updateTipeKamar = async (request, response) => {
  try {
    const uploadTipeKamar = upload.single("foto");
    uploadTipeKamar(request, response, async (error) => {
      if (error) {
        return response.json({
          status: false,
          message: error.message,
        });
      }
      let id_tipe_kamar = request.params.id_tipe_kamar;
      let selectedTipeKamar = await tipe_kamarModel.findOne({
        where: { id_tipe_kamar: id_tipe_kamar },
      });
      if (!selectedTipeKamar) {
        return response.json({
          status: false,
          message: "Tipe kamar tidak ditemukan",
        });
      }
      
      let dataUpdate = {};

      // Cek setiap kolom dan simpan nilai yang ada jika tidak disediakan
      dataUpdate.nama_tipe_kamar = request.body.nama_tipe_kamar || selectedTipeKamar.nama_tipe_kamar;
      dataUpdate.deskripsi = request.body.deskripsi || selectedTipeKamar.deskripsi;
      
      if (request.body.harga !== undefined) {
        if (request.body.harga < 0) {
          return response.json({
            status: false,
            message: `Harga tidak boleh ${request.body.harga}`,
          });
        }
        dataUpdate.harga = request.body.harga;
      } else {
        dataUpdate.harga = selectedTipeKamar.harga; 
      }

      if (request.file) {
        let oldFilename = selectedTipeKamar.foto;
        let pathFile = path.join(__dirname, "../foto-tipe-kamar", oldFilename);

        if (fs.existsSync(pathFile)) {
          try {
            fs.unlinkSync(pathFile); 
            console.log("File berhasil dihapus");
          } catch (err) {
            console.error("Gagal menghapus file:", err.message);
          }
        } else {
          console.log("File tidak ditemukan:", pathFile);
        }
        dataUpdate.foto = request.file.filename;
      } else {
        dataUpdate.foto = selectedTipeKamar.foto; 
      }

      
      await tipe_kamarModel.update(dataUpdate, {
        where: { id_tipe_kamar: id_tipe_kamar },
      });

      return response.json({
        status: true,
        message: "Data tipe kamar berhasil diubah",
      });
    });
  } catch (error) {
    return response.json({
      status: false,
      message: error.message,
    });
  }
};

