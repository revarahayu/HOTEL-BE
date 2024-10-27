'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.tipe_kamar, {
        foreignKey: 'id_tipe_kamar',  
        as: 'tipe_kamar'  // Alias relasi
      });
      this.hasMany(models.detail_pemesanan, {
        foreignKey: 'id_kamar',
        as: 'detail_pemesanan'
      });
    }
  }
  kamar.init({
    id_kamar: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    nomor_kamar: DataTypes.INTEGER,
    id_tipe_kamar: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'kamar',
  });
  return kamar;
};

