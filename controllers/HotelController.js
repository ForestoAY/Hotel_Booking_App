const { Op } = require('sequelize');
const { Hotel, User, Room, Reservation } = require('../models');

class HotelController {
  static async readHotel(req, res){
    const { filter } = req.query;
    try {
      const hotel = await Hotel.filterByStars(filter);
      const user = await User.findByPk(req.session.userId);
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

  static async bookingRoom(req, res){
    const { idRoom } = req.params
    try {
      const room = await Room.findByPk(idRoom);
      const user = await User.findByPk(req.session.userId);
      res.render('Booking', { room, user });
    } catch (err) {
      res.send(err);
    }
  }

  static async postBookingRoom(req, res){
    const { UserId, RoomId, checkIn, checkOut, totalPrice, status } = req.body
    try {
      await Reservation.create({ UserId, RoomId, checkIn, checkOut, totalPrice, status });
      const room = await Room.findByPk(RoomId);
      await room.update({status: 'Occupied'});
      res.redirect(`/hotel/reservation/${UserId}`);
    } catch (err) {
      res.send(err);
    }
  }

  static async readReservation(req, res){
    const { id } = req.params
    try {
      const user = await User.findByPk(req.session.userId);
      const data = await Reservation.findAll({
        order: [['id','asc']],
        where: {
          UserId:{
            [Op.eq]: id
          }
        },
        attributes: {
          include: ['id']
        } 

      })
      
      // res.send(data);
      res.render('Reservation', { data, user });
    } catch (err) {
      res.send(err.name)
    }
  }

  static async getCheckout(req, res){
    const { id } = req.params // id reservation
    try {
      // const room = await Room.findByPk({
      //   where: {
          
      //   }
      // });
      // await room.update({status: 'Available'});
      const data = await Reservation.findByPk(id);
      res.send(data);
      
      // data.update({status: 'Completed'});
    } catch (err) {
      res.send(err)
    }
  }

  
}

module.exports = HotelController;