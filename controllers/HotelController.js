const { Hotel, User, Room } = require('../models');

class HotelController {
  static async readHotel(req, res){
    try {
      const hotel = await Hotel.findAll();
      const user = await User.findByPk(req.session.userId);
      // res.send(user);
      res.render('Hotel', { hotel, user });
    } catch (err) {
      res.send(err);
    }
  }

  static async readDetailHotel(req, res){
    const { id } = req.params
    try {
      const user = await User.findByPk(req.session.userId);
      const data = await Hotel.findByPk(id, {
        include: {
          model: Room,
          required: false
        }
      })
      res.render('Room', { data, user });      
    } catch (err) {
      res.send(err)
    }
  }

  static async getReserveRoom(req, res){
    try {
      
    } catch (err) {
      res.send(err);
    }
  }

  static async postReserveRoom(req, res){
    try {
      
    } catch (err) {
      res.send(err);
    }
  }
}

module.exports = HotelController;