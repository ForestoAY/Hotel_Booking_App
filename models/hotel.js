'use strict';
const {
  Model,
  Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hotel.hasMany(models.Room);
    }

    static async filterByStars(filter){
      const opt = {
        order: [['id', 'asc']]
      }
      if (filter){
        opt.where = {
          rating: {
            [Op.eq]: filter
          }
        }
      }
      const data = await Hotel.findAll(opt);
      return data;
    }
  }
  Hotel.init({
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    hotelUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Hotel',
  });
  return Hotel;
};