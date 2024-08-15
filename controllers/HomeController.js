const { User } = require('../models');

class HomeController {
  static async home(req, res){
    const { role } = req.session;
    try {
      const user = await User.findByPk(req.session.userId);
      res.render('Home', { user, role });
    } catch (err) {
      res.send(err);
    }
  }

  static async unauthorized(req, res){
    try {
      res.render('Unauthorized');
    } catch (err) {
      res.send(err);
    }
  }
}

module.exports = HomeController;