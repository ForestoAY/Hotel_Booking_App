const { Op } = require('sequelize');
const { Hotel, User, Room, Reservation } = require('../models');

class HotelController {
  static async readHotel(req, res){
    const { filter, errors } = req.query;
    const { role } = req.session;
    try {
      const hotel = await Hotel.filterByStars(filter);
      const user = await User.findByPk(req.session.userId);
      res.render('Hotel', { hotel, user, errors, role });
    } catch (err) {
      res.send(err);
    }
  }

  static async readDetailHotel(req, res){
    const { id } = req.params
    const { role } = req.session;
    try {
      const user = await User.findByPk(req.session.userId);
      const data = await Hotel.findByPk(id, {
        include: {
          model: Room,
          required: false
        }
      })
      res.render('Room', { data, user, role });      
    } catch (err) {
      res.send(err)
    }
  }

  static async bookingRoom(req, res){
    const { idRoom } = req.params
    const { role } = req.session;
    try {
      const room = await Room.findByPk(idRoom);
      const user = await User.findByPk(req.session.userId);
      if (room.status == "Occupied"){
        const error = "Kamar sudah di booking";
        return res.redirect(`/hotel?errors=${error}`);
      }
      res.render('Booking', { room, user, role });
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
    const { role } = req.session;
    let { errors } = req.query;
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
        },
        include: {
          model: Room,
          required: false,
          include: {
            model: Hotel,
            required: false,
          }
        }
      })
      // res.send(data)
      res.render('Reservation', { data, user, role, errors });
    } catch (err) {
      res.send(err.name)
    }
  }

  static async getCheckout(req, res){
    const { id } = req.params // id reservation
    try {
      const data = await Reservation.findAll({
        attributes: {
          include: ['id']
        },
        where:{
          id: {
            [Op.eq]: id
          }
        }
      });
      const room = await Room.findByPk(data[0].RoomId);
      if(data[0].status == 'Completed'){
        const error = "Sudah checkout";
        return res.redirect(`/hotel/reservation/${data[0].UserId}?errors=${error}`);
      }
      await data[0].update({ status: 'Completed' });
      await room.update({ status: 'Available' });
      res.redirect(`/hotel/reservation/${data[0].UserId}`);
    } catch (err) {
      res.send(err)
    }
  }

  
}

module.exports = HotelController;