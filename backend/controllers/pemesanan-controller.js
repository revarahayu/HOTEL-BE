const pemesananModel = require("../models/index").pemesanan;
const detail_pemesananModel = require("../models/index").detail_pemesanan;
const kamarModel = require("../models/index").kamar;
const tipe_kamarModel = require("../models/index").tipe_kamar;
const userModel = require("../models/index").user;
const { Op } = require("sequelize");
const joi = require("joi");
const moment = require("moment");

const validatePemesanan = (input) => {
  let rules = joi.object().keys({
    nama_tipe_kamar: joi.string().required(), 
    nama_user: joi.string().required(), 
    tgl_checkin: joi.date().iso().required(),  
    tgl_checkout: joi.date().iso().required(), 
    nama_pemesan: joi.string().required(), 
    email_pemesan: joi.string().email().required(), 
    nama_tamu: joi.string().required(), 
    jumlah_kamar: joi.number().required(), 
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

exports.addPemesanan = async (request, response) => {
  let resultValidation = validatePemesanan(request.body);
  if (resultValidation.status === false) {
    return response.json({
      success: false,
      message: resultValidation.message,
    });
  }
  const {
    nama_tipe_kamar,
    nama_user,
    tgl_checkin,
    tgl_checkout,
    nama_pemesan,
    email_pemesan,
    nama_tamu,
    jumlah_kamar,
  } = request.body;

  try {
    const checkInDate = moment(tgl_checkin, "YYYY-MM-DD", true);
    const checkOutDate = moment(tgl_checkout, "YYYY-MM-DD", true);

    if (!checkInDate.isValid() || !checkOutDate.isValid()) {
      return response.status(400).json({
        success: false,
        message:
          "Tanggal check-in atau check-out tidak valid. Gunakan format YYYY-MM-DD.",
      });
    }

    if (checkInDate.isSameOrAfter(checkOutDate)) {
      return response.status(400).json({
        success: false,
        message:
          "Tanggal check-in tidak boleh lebih besar atau sama dengan tanggal check-out.",
      });
    }

    const tipe = await tipe_kamarModel.findOne({
      where: {
        nama_tipe_kamar: {
          [Op.substring]: nama_tipe_kamar,
        },
      },
    });

    if (!tipe) {
      return response.status(404).json({
        success: false,
        message: `Tipe Kamar '${nama_tipe_kamar}' tidak ditemukan`,
      });
    }

    const user = await userModel.findOne({
      where: {
        nama_user: {
          [Op.substring]: nama_user,
        },
      },
    });

    if (!user) {
      return response.status(404).json({
        success: false,
        message: `User '${nama_user}' tidak ditemukan`,
      });
    }

    const bookedRoomIds = await detail_pemesananModel
      .findAll({
        attributes: ["id_kamar"],
        where: {
          tgl_akses: {
            [Op.between]: [tgl_checkin, tgl_checkout],
          },
        },
        raw: true,
      })
      .then((records) => records.map((record) => record.id_kamar));

    const availableRooms = await kamarModel.findAll({
      where: {
        id_tipe_kamar: tipe.id_tipe_kamar,
        id_kamar: {
          [Op.notIn]: bookedRoomIds,
        },
      },
      attributes: ["id_kamar", "nomor_kamar"],
    });

    if (availableRooms.length < jumlah_kamar) {
      return response.status(400).json({
        success: false,
        message: `Hanya tersedia ${availableRooms.length} kamar untuk tipe kamar '${nama_tipe_kamar}'`,
      });
    }

    const nomor_pemesanan = Math.floor(10000000 + Math.random() * 90000000);

    const newPemesanan = await pemesananModel.create({
      nomor_pemesanan,
      nama_pemesan,
      email_pemesan,
      tgl_pemesanan: new Date(),
      tgl_checkin,
      tgl_checkout,
      nama_tamu,
      jumlah_kamar,
      id_tipe_kamar: tipe.id_tipe_kamar,
      status_pemesanan: "baru",
      id_user: user.id_user,
    });

    const pemesananID = newPemesanan.id_pemesanan;
    const totalDays = checkOutDate.diff(checkInDate, "days");

    for (let i = 0; i < jumlah_kamar; i++) {
      const room = availableRooms[i];

      for (let day = 0; day < totalDays; day++) {
        const tgl_akses = checkInDate
          .clone()
          .add(day, "days")
          .format("YYYY-MM-DD");

        await detail_pemesananModel.create({
          id_pemesanan: pemesananID,
          id_kamar: room.id_kamar,
          tgl_akses,
          harga: tipe.harga,
        });
      }
    }

    return response.json({
      success: true,
      message: "Pemesanan berhasil dibuat",
      nomor_pemesanan,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllPemesanan = async (request, response) => {
  try {
    const pemesananList = await pemesananModel.findAll({
      include: [
        {
          model: userModel,
          as: "user",
          attributes: ["nama_user"],
        },
        {
          model: tipe_kamarModel,
          as: "tipe_kamar",
          attributes: ["nama_tipe_kamar", "harga"], 
        },
        {
          model: detail_pemesananModel,
          as: 'detail_pemesanan',
          include: [
            {
              model: kamarModel, 
              as: 'kamar', 
              attributes: ["nomor_kamar"] 
            }
          ]
        }
      ],
    });

    const responseData = pemesananList.map((item) => {
      const totalHarga = item.jumlah_kamar * item.tipe_kamar.harga * moment(item.tgl_checkout).diff(moment(item.tgl_checkin), "days"); // Hitung total harga tanpa mendeklarasikan variabel terpisah
      const nomor_kamar_set = new Set(item.detail_pemesanan.map(detail => detail.kamar.nomor_kamar));
      const nomor_kamar = Array.from(nomor_kamar_set).join(", ");

      return {
        id: item.id_pemesanan,
        id_user: item.id_user,
        nomor_pemesanan: item.nomor_pemesanan,
        nama_user: item.user.nama_user,
        nama_pemesan: item.nama_pemesan,
        nama_tamu: item.nama_tamu,
        email_pemesan: item.email_pemesan,
        tgl_checkin: moment(item.tgl_checkin).format("YYYY-MM-DD"), 
        tgl_checkout: moment(item.tgl_checkout).format("YYYY-MM-DD"),
        jumlah_kamar: item.jumlah_kamar,
        nomor_kamar: nomor_kamar,
        nama_tipe_kamar: item.tipe_kamar.nama_tipe_kamar,
        harga: item.tipe_kamar.harga, 
        total_harga: totalHarga, 
        status_pemesanan: item.status_pemesanan,
        tgl_pemesanan: moment(item.tgl_pemesanan).format("YYYY-MM-DD"),
      };
    });

    return response.json({
      success: true,
      data: responseData,
      message: `All pemesanan have been loaded`,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePemesanan = async (request, response) => {
  const validStatuses = ['baru', 'checkin', 'checkout']; 
  const { status_pemesanan } = request.body; 

  if (!validStatuses.includes(status_pemesanan)) {
    return response.status(400).json({
      success: false,
      message: "Statusnya salah nih, hanya boleh 'baru', 'checkin', 'checkout'."
    });
  }

  let id_pemesanan = request.params.id_pemesanan;
  let getIdPemesanan = await pemesananModel.findOne({
    where: { id_pemesanan: id_pemesanan },
    attributes: [
      "id_pemesanan", "nomor_pemesanan", "nama_pemesan", "email_pemesan", "tgl_pemesanan", 
      "tgl_checkin", "tgl_checkout", "nama_tamu", "jumlah_kamar", "id_tipe_kamar", 
      "status_pemesanan", "id_user", "createdAt", "updatedAt"
    ]
  });

  if (!getIdPemesanan) {
    return response.status(404).json({
      success: false,
      message: `Pemesanan dengan id '${id_pemesanan}' tidak ada`
    });
  }

  const currentStatus = getIdPemesanan.status_pemesanan;
  const statusIndex = validStatuses.indexOf(currentStatus);
  const newStatusIndex = validStatuses.indexOf(status_pemesanan);

  if (newStatusIndex <= statusIndex) {
    return response.status(400).json({
      success: false,
      message: `Perubahan status gagal! Status saat ini adalah '${currentStatus}'.`
    });
  }

  let newPemesanan = {
    status_pemesanan: status_pemesanan,
  };

  try {
    await pemesananModel.update(newPemesanan, { where: { id_pemesanan: id_pemesanan } });
    return response.json({
      success: true,
      message: `Status Pemesanan dengan nomor ${getIdPemesanan.nomor_pemesanan} telah diperbarui menjadi '${status_pemesanan}'`
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getPemesananByName = async (request, response) => {
  try {
    let nama_tamu = request.body.nama_tamu;

    let getId = await pemesananModel.findAll({
      where: {
        nama_tamu: nama_tamu,
      },
      attributes: [
        "id_pemesanan", "nomor_pemesanan", "nama_pemesan", "email_pemesan", 
        "tgl_pemesanan", "tgl_checkin", "tgl_checkout", 
        "nama_tamu", "jumlah_kamar", "id_tipe_kamar", 
        "status_pemesanan", "id_user", "createdAt", "updatedAt"
      ],
      include: [
        {
          model: userModel,
          as: 'user',
          attributes: ["nama_user"]
        },
        {
          model: tipe_kamarModel,
          as: 'tipe_kamar',
          attributes: ["nama_tipe_kamar","harga"]
        },
        {
          model: detail_pemesananModel,
          as: 'detail_pemesanan',
          attributes: ["harga"], 
          include: [
            {
              model: kamarModel, 
              as: 'kamar', 
              attributes: ["nomor_kamar"] 
            }
          ]
        }
      ]
    });

    if (getId.length === 0) {
      return response.status(400).json({
        success: false,
        message: "Pemesanan dengan nama tamu tersebut tidak ada",
      });
    }

    // Mengubah format data
    const data = getId.map(item => {
      const total_harga = item.detail_pemesanan.reduce((total, detail) => total + detail.harga, 0);
      const nomor_kamar_set = new Set(item.detail_pemesanan.map(detail => detail.kamar.nomor_kamar));
      const nomor_kamar = Array.from(nomor_kamar_set).join(", ");

      return {
        id: item.id_pemesanan,
        id_user: item.id_user,
        nomor_pemesanan: item.nomor_pemesanan,
        nama_user: item.user.nama_user,
        nama_pemesan: item.nama_pemesan,
        nama_tamu: item.nama_tamu,
        email_pemesan: item.email_pemesan,
        tgl_checkin: moment(item.tgl_checkin).format("YYYY-MM-DD"), 
        tgl_checkout: moment(item.tgl_checkout).format("YYYY-MM-DD"), 
        nama_tipe_kamar: item.tipe_kamar.nama_tipe_kamar,
        nomor_kamar: nomor_kamar,
        jumlah_kamar: item.jumlah_kamar,
        status_pemesanan: item.status_pemesanan,
        harga: item.tipe_kamar.harga, 
        total_harga: total_harga,
        tgl_pemesanan: moment(item.tgl_pemesanan).format("YYYY-MM-DD"), 
      };
    });

    return response.json({
      success: true,
      data: data,
      message: "All pemesanan have been loaded"
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPemesananByTglCheckIn = async (request, response) => {
  try {
    const tgl_checkin = moment(request.body.tgl_checkin).startOf('day').toDate(); 

    let getId = await pemesananModel.findAll({
      where: {
        tgl_checkin: {
          [Op.gte]: tgl_checkin, 
          [Op.lt]: moment(tgl_checkin).add(1, 'days').toDate() 
        },
      },
      attributes: [
        "id_pemesanan", "nomor_pemesanan", "nama_pemesan", "email_pemesan", 
        "tgl_pemesanan", "tgl_checkin", "tgl_checkout", 
        "nama_tamu", "jumlah_kamar", "id_tipe_kamar", 
        "status_pemesanan", "id_user", "createdAt", "updatedAt"
      ],
      include: [
        {
          model: userModel,
          as: 'user',
          attributes: ["nama_user"]
        },
        {
          model: tipe_kamarModel,
          as: 'tipe_kamar',
          attributes: ["nama_tipe_kamar"]
        },
        {
          model: detail_pemesananModel,
          as: 'detail_pemesanan',
          attributes: ["harga"], 
          include: [
            {
              model: kamarModel, 
              as: 'kamar', 
              attributes: ["nomor_kamar"] 
            }
          ]
        }
      ]
    });

    if (getId.length === 0) {
      return response.status(400).json({
        success: false,
        message: "Pemesanan dengan tanggal check-in tersebut tidak ada",
      });
    }

    const data = getId.map(item => {
      const total_harga = item.detail_pemesanan.reduce((total, detail) => total + detail.harga, 0);
      const nomor_kamar_set = new Set(item.detail_pemesanan.map(detail => detail.kamar.nomor_kamar));
      const nomor_kamar = Array.from(nomor_kamar_set).join(", ");

      return {
        id: item.id_pemesanan,
        id_user: item.id_user,
        nomor_pemesanan: item.nomor_pemesanan,
        nama_user: item.user.nama_user,
        nama_pemesan: item.nama_pemesan,
        nama_tamu: item.nama_tamu,
        email_pemesan: item.email_pemesan,
        tgl_checkin: moment(item.tgl_checkin).format("YYYY-MM-DD"), 
        tgl_checkout: moment(item.tgl_checkout).format("YYYY-MM-DD"), 
        nama_tipe_kamar: item.tipe_kamar.nama_tipe_kamar,
        nomor_kamar: nomor_kamar,
        jumlah_kamar: item.jumlah_kamar,
        status_pemesanan: item.status_pemesanan,
        harga: item.detail_pemesanan[0].harga, 
        total_harga: total_harga,
        tgl_pemesanan: moment(item.tgl_pemesanan).format("YYYY-MM-DD"),
      };
    });

    return response.json({
      success: true,
      data: data,
      message: "All pemesanan have been loaded"
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.getPemesananById = async (request, response) => {
  try {
    let id_user = request.params.id_user;

    let getId = await pemesananModel.findAll({
      where: {
        id_user: id_user,
      },
      attributes: [
        "id_pemesanan", "nomor_pemesanan", "nama_pemesan", "email_pemesan", 
        "tgl_pemesanan", "tgl_checkin", "tgl_checkout", 
        "nama_tamu", "jumlah_kamar", "id_tipe_kamar", 
        "status_pemesanan", "id_user", "createdAt", "updatedAt"
      ],
      include: [
        {
          model: userModel,
          as: 'user',
          attributes: ["nama_user"]
        },
        {
          model: tipe_kamarModel,
          as: 'tipe_kamar',
          attributes: ["nama_tipe_kamar"]
        },
        {
          model: detail_pemesananModel,
          as: 'detail_pemesanan',
          attributes: ["harga"], 
          include: [
            {
              model: kamarModel, 
              as: 'kamar', 
              attributes: ["nomor_kamar"] 
            }
          ]
        }
      ]
    });

    if (getId.length === 0) {
      return response.status(400).json({
        success: false,
        message: "Pemesanan dengan ID user tersebut tidak ada",
      });
    }

    const data = getId.map(item => {
      const total_harga = item.detail_pemesanan.reduce((total, detail) => total + detail.harga, 0);
      const nomor_kamar_set = new Set(item.detail_pemesanan.map(detail => detail.kamar.nomor_kamar));
      const nomor_kamar = Array.from(nomor_kamar_set).join(", ");

      return {
        id: item.id_pemesanan,
        id_user: item.id_user,
        nomor_pemesanan: item.nomor_pemesanan,
        nama_user: item.user.nama_user,
        nama_pemesan: item.nama_pemesan,
        nama_tamu: item.nama_tamu,
        email_pemesan: item.email_pemesan,
        tgl_checkin: moment(item.tgl_checkin).format("YYYY-MM-DD"), 
        tgl_checkout: moment(item.tgl_checkout).format("YYYY-MM-DD"), 
        nama_tipe_kamar: item.tipe_kamar.nama_tipe_kamar,
        nomor_kamar: nomor_kamar,
        jumlah_kamar: item.jumlah_kamar,
        status_pemesanan: item.status_pemesanan,
        harga: item.detail_pemesanan[0].harga, 
        total_harga: total_harga,
        tgl_pemesanan: moment(item.tgl_pemesanan).format("YYYY-MM-DD"),
      };
    });

    return response.json({
      success: true,
      data: data,
      message: "All pemesanan have been loaded"
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


  exports.getPemesananByNomor = async (request, response) => {
    try {
      let nomor_pemesanan = request.body.nomor_pemesanan;
  
      let getId = await pemesananModel.findAll({
        where: {
          nomor_pemesanan: nomor_pemesanan,
        },
        attributes: [
          "id_pemesanan", "nomor_pemesanan", "nama_pemesan", "email_pemesan", 
          "tgl_pemesanan", "tgl_checkin", "tgl_checkout", 
          "nama_tamu", "jumlah_kamar", "id_tipe_kamar", 
          "status_pemesanan", "id_user", "createdAt", "updatedAt"
        ],
        include: [
          {
            model: userModel,
            as: 'user',
            attributes: ["nama_user"]
          },
          {
            model: tipe_kamarModel,
            as: 'tipe_kamar',
            attributes: ["nama_tipe_kamar"]
          },
          {
            model: detail_pemesananModel,
            as: 'detail_pemesanan',
            attributes: ["harga"], 
            include: [
              {
                model: kamarModel, 
                as: 'kamar', 
                attributes: ["nomor_kamar"] 
              }
            ]
          }
        ]
      });
  
      if (getId.length === 0) {
        return response.status(400).json({
          success: false,
          message: "Pemesanan dengan nomor pemesanan tersebut tidak ada",
        });
      }
  
      const data = getId.map(item => {const total_harga = item.detail_pemesanan.reduce((total, detail) => total + detail.harga, 0);
        const nomor_kamar_set = new Set(item.detail_pemesanan.map(detail => detail.kamar.nomor_kamar));
        const nomor_kamar = Array.from(nomor_kamar_set).join(", ");

        return {
        id: item.id_pemesanan,
        id_user: item.id_user,
        nomor_pemesanan: item.nomor_pemesanan,
        nama_user: item.user.nama_user,
        nama_pemesan: item.nama_pemesan,
        nama_tamu: item.nama_tamu,
        email_pemesan: item.email_pemesan,
        tgl_checkin: moment(item.tgl_checkin).format("YYYY-MM-DD"), 
        tgl_checkout: moment(item.tgl_checkout).format("YYYY-MM-DD"), 
        nama_tipe_kamar: item.tipe_kamar.nama_tipe_kamar,
        nomor_kamar: nomor_kamar,
        jumlah_kamar: item.jumlah_kamar,
        status_pemesanan: item.status_pemesanan,
        harga: item.detail_pemesanan[0].harga, 
        total_harga: total_harga,
        tgl_pemesanan: moment(item.tgl_pemesanan).format("YYYY-MM-DD"),
        };
      });
  
      return response.json({
        success: true,
        data: data,
        message: "All pemesanan have been loaded"
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  