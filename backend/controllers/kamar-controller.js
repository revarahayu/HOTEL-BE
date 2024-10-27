const { Op } = require("sequelize");
const kamarModel = require("../models/index").kamar;
const tipe_kamarModel = require("../models/index").tipe_kamar;
const moment = require(`moment`);
const joi = require(`joi`);
const detail_pemesananModel = require("../models/index").detail_pemesanan;


const validateKamar = (input, isUpdate = false) => {
    let rules = joi.object().keys({
      nama_tipe_kamar: isUpdate ? joi.string().optional() : joi.string().required(),  // nama_tipe_kamar hanya diperlukan saat add
      nomor_kamar: joi.number().required(),
      id_tipe_kamar: isUpdate ? joi.number().required() : joi.number().optional() // id_tipe_kamar diperlukan saat update, tidak saat add
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

exports.getKamar = async (request, response) => {
    try {
        let kamars = await kamarModel.findAll({
            include: {
                model: tipe_kamarModel,
                as: 'tipe_kamar', 
                attributes: ['nama_tipe_kamar']
            },
            order: [['createdAt', 'DESC']]
        });
        return response.json({
            success: true,
            data: kamars,
            message: "All rooms have been loaded",
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message,
        });
    }
};

exports.addKamar = async (request, response) => {
    try {
      let resultValidation = validateKamar(request.body);
      if (resultValidation.status === false) {
        return response.json({
          success: false,
          message: resultValidation.message,
        });
      }
  
      const { nama_tipe_kamar, nomor_kamar } = request.body;
  
      const tipe_kamar = await tipe_kamarModel.findOne({
        where: {
          nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar },
        },
      });
  
      if (!tipe_kamar) {
        return response.json({
          success: false,
          message: `Tipe kamar yang anda inputkan tidak ada`,
        });
      }
  
      const newRoom = {
        nomor_kamar: nomor_kamar,
        id_tipe_kamar: tipe_kamar.id_tipe_kamar,
      };
  
      const kamarExists = await kamarModel.findOne({
        where: {
          nomor_kamar: newRoom.nomor_kamar,
          id_tipe_kamar: newRoom.id_tipe_kamar,
        },
      });
  
      if (kamarExists) {
        return response.json({
          success: false,
          message: `Kamar yang anda inputkan sudah ada`,
        });
      }
  
      const kamar = await kamarModel.create(newRoom);
      return response.json({
        success: true,
        data: kamar,
        message: `New Room has been inserted`,
      });
    } catch (error) {
      return response.json({
        success: false,
        message: error.message,
      });
    }
  };

  exports.updateKamar = async (request, response) => {
    const { nomor_kamar } = request.body; 
    const id_kamar = request.params.id_kamar;

    try {
        let resultValidation = validateKamar(request.body, true); // isUpdate = true untuk skip validasi nama_tipe_kamar
        if (resultValidation.status === false) {
            return response.json({
                success: false,
                message: resultValidation.message,
            });
        }

        const dataKamar = {
            nomor_kamar: nomor_kamar,
        };

        await kamarModel.update(dataKamar, { where: { id_kamar: id_kamar } });
        return response.json({
            success: true,
            message: `Data room has been updated`,
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message,
        });
    }
};



exports.findKamar = async (request, response) => {
    let keyword = request.body.keyword;
    try {
        let kamars = await kamarModel.findAll({
            where: {
                nomor_kamar: { [Op.substring]: keyword },
            },
            include: {
                model: tipe_kamarModel,
                attributes: ['nama_tipe_kamar']
            },
            order: [['createdAt', 'DESC']]
        });
        return response.json({
            success: true,
            data: kamars,
            message: "Rooms have been loaded based on keyword",
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteKamar = async (request, response) => {
    let id_kamar = request.params.id_kamar;
    try {
        await kamarModel.destroy({ where: { id_kamar: id_kamar } });
        return response.json({
            success: true,
            message: `Data room has been deleted`,
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message,
        });
    }
};

exports.getKamarAvaible = async (request, response) => {
    const tgl_checkin = request.body.tgl_checkin;
    const tgl_checkout = request.body.tgl_checkout;

    if (!tgl_checkin && !tgl_checkout) {
        return response.json({
            success: false,
            message: "Tanggal checkin dan checkoutnya diisi dulu yang mulia."
        });
    }
    if (!tgl_checkin) {
        return response.json({
            success: false,
            message: "Tanggal checkin diisi dulu yang mulia."
        });
    }
    if (!tgl_checkout) {
        return response.json({
            success: false,
            message: "Tanggal checkout diisi dulu yang mulia."
        });
    }

    const checkInDate = moment(tgl_checkin);
    const checkOutDate = moment(tgl_checkout);

    if (!checkInDate.isValid()) {
        return response.json({
            success: false,
            message: "yahh tanggalnya salah nihh pastikan pake format YYYY-MM-DD."
        });
    }

    if (!checkOutDate.isValid()) {
        return response.json({
            success: false,
            message: "yahh tanggalnya salah nihh pastikan pastikan format YYYY-MM-DD."
        });
    }

    if (checkInDate.isSameOrAfter(checkOutDate)) {
        return response.json({
            success: false,
            message: "Tanggal check-in tidak boleh lebih besar atau sama dengan tanggal check-out."
        });
    }

    try {
        const bookedRoomIds = await detail_pemesananModel.findAll({
            attributes: ['id_kamar'],
            where: {
                tgl_akses: {
                    [Op.between]: [tgl_checkin, tgl_checkout]
                }
            },
            raw: true
        }).then(records => records.map(record => record.id_kamar));

        const availableRooms = await kamarModel.findAll({
            where: {
                id_kamar: {
                    [Op.notIn]: bookedRoomIds 
                }
            },
            include: {
                model: tipe_kamarModel,
                as: 'tipe_kamar',
                attributes: ['nama_tipe_kamar', 'harga']
            },
            attributes: ['id_kamar', 'nomor_kamar'],
        });

        const dataSisaKamar = availableRooms.map(room => ({
            id: room.id_kamar,
            nomor_kamar: room.nomor_kamar,
            nama_tipe_kamar: room.tipe_kamar.nama_tipe_kamar,
            harga: room.tipe_kamar.harga
        }));

        return response.json({
            success: true,
            sisa_kamar: dataSisaKamar.length,
            data: dataSisaKamar,
            message: "Monggo niki kamar yang tersedia"
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message,
        });
    }
};