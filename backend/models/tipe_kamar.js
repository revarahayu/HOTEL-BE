'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tipe_kamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.kamar, {  // Menggunakan hasMany karena satu tipe kamar bisa memiliki banyak kamar
        foreignKey: 'id_tipe_kamar',
        as: 'kamar'
      });
    }
  }
  tipe_kamar.init({
    id_tipe_kamar: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    nama_tipe_kamar: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    deskripsi: DataTypes.STRING,
    foto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tipe_kamar',
  });
  return tipe_kamar;
};