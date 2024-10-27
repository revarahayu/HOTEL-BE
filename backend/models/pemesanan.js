'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pemesanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.detail_pemesanan, {
        foreignKey: `id_pemesanan`, as: `detail_pemesanan`
    });
    this.belongsTo(models.user, {
        foreignKey: 'id_user', as: 'user' // Pastikan ini ada
    });
    this.belongsTo(models.tipe_kamar, {
        foreignKey: 'id_tipe_kamar', as: 'tipe_kamar' // Pastikan ini ada
    });
    }
  }
  pemesanan.init({
    id_pemesanan: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    nomor_pemesanan: DataTypes.INTEGER,
    nama_pemesan: DataTypes.STRING,
    email_pemesan: DataTypes.STRING,
    tgl_pemesanan: DataTypes.DATE,
    tgl_checkin: DataTypes.DATE,
    tgl_checkout: DataTypes.DATE,
    nama_tamu: DataTypes.STRING,
    jumlah_kamar: DataTypes.INTEGER,
    id_tipe_kamar: DataTypes.INTEGER,
    status_pemesanan: DataTypes.ENUM('baru', 'checkin', 'checkout'),
    id_user: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'pemesanan',
  });
  return pemesanan;
};