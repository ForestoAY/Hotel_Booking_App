const { User, Profile } = require('../models');
const bcrypt = require('bcryptjs');

class UserController {
  static async getRegister(req, res){
    let { errors } = req.query;
    try {
      if (errors) {
        errors = errors.split(',');
      }
      res.render('Register', { errors });
    } catch (err) {
      res.send(err);
    }
  }

  static async postRegister(req, res){
    const { username, email, password } = req.body;
    try {
      await User.create({username, email, password});
      res.redirect('/login');
    } catch (err) {
      if (err.name == 'SequelizeValidationError' || 'SequelizeUniqueConstraintError'){
        let errors = err.errors.map((e) => e.message);
        return res.redirect(`/register?errors=${errors}`)
      }
      res.send(err);
    }
  }

  static async getLogin(req, res){
    const { errors } = req.query;
    try {
      res.render('Login', { errors });
    } catch (err) {
      res.send(err);
    }
  }

  static async postLogin(req, res){
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (user){
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (isValidPassword){
          req.session.userId = user.id;
          req.session.role = user.role;

          return res.redirect('/hotel');
        } else {
          const error = "Invalid email or password";
          return res.redirect(`/login?errors=${error}`);
        }
      } else {
        const error = "Invalid email or password";
        return res.redirect(`/login?errors=${error}`);
      }
    } catch (err) {
      res.send(err);
    }
  }

  static async getLogout(req, res){
    try {
      req.session.destroy((err) => {
        if(err) res.send(err);
        else {
          res.redirect('/login');
        }
      })
    } catch (err) {
      res.send(err);
    }
  }

  static async readProfile(req, res){
    const { id } = req.params
    try {
      const user = await User.findByPk(req.session.userId);
      const data = await User.findByPk(id, {
        include: {
          model: Profile,
          required: false
        }
      });
      res.render('Profile', { data, user })
    } catch (err) {
      res.send(err);
    }
  }

  static async getEditProfile(req, res){
    try {
      
    } catch (err) {
      res.send(err);
    }
  }

  static async postEditProfile(req, res){
    try {
      
    } catch (err) {
      res.send(err);
    }
  }
}

module.exports = UserController;