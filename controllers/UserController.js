const { User } = require('../models');
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
    const { errorLogin } = req.query;
    try {
      res.render('Login', { errorLogin });
    } catch (err) {
      res.send(err);
    }
  }

  static async postLogin(req, res){
    const { email, password } = req.body;
    try {
      const data = await User.findOne({ where: { email } });
      if (data){
        const isValidPassword = bcrypt.compareSync(password, data.password);

        if (isValidPassword){
          return res.redirect('/');
        } else {
          const error = "Invalid email or password";
          return res.redirect(`/login?errorLogin=${error}`);
        }
      } else {
        const error = "Invalid email or password";
        return res.redirect(`/login?errorLogin=${error}`);
      }
    } catch (err) {
      res.send(err);
    }
  }
}

module.exports = UserController;