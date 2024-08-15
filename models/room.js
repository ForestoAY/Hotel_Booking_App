'use strict';
const {
  Model
} = require('sequelize');
const formatRupiah = require('../helper/formatRupiah');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.belongsTo(models.Hotel);
      Room.belongsToMany(models.User, { through: models.Reservation });
    }

    get priceToRupiah(){
      return formatRupiah(this.price);
    }
  }
  Room.init({
    HotelId: DataTypes.INTEGER,
    roomNumber: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    type: DataTypes.STRING,
    status: DataTypes.STRING,
    roomUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};