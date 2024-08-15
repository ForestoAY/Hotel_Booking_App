const { User, Profile } = require('../models');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

class UserController {
  static async getRegister(req, res){
    let { errors } = req.query;
    const { role } = req.session;
    try {
      if (errors) {
        errors = errors.split(',');
      }
      res.render('Register', { errors, role });
    } catch (err) {
      res.send(err);
    }
  }

  static async postRegister(req, res){
    const { username, email, password } = req.body;
    try {
      await User.create({username, email, password});

      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: "maddison53@ethereal.email",
          pass: "jn7jnAPss4f63QBp6D",
        }
      });

      const message = {
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
        to: email,
        subject: "Welcome to Our Service",
        text: "Thank you for registering!",
        html: "<b>Thank you for registering!</b>",
      };

      const info = await transporter.sendMail(message);
      console.log("Message sent: %s", info.messageId);

      res.redirect('/login');
    } catch (err) {
      console.error('Error during registration:', err);
      if (err.name == 'SequelizeValidationError' || 'SequelizeUniqueConstraintError'){
        let errors = err.errors.map((e) => e.message);
        return res.redirect(`/register?errors=${errors}`)
      }
      res.status(500).send('Internal Server Error');
    }
  }

  static async getLogin(req, res){
    const { errors } = req.query;
    const { role } = req.session;
    try {
      res.render('Login', { errors, role });
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
    const { role } = req.session;
    try {
      const user = await User.findByPk(req.session.userId);
      const data = await User.findByPk(id, {
        include: {
          model: Profile,
          required: false
        }
      });
      res.render('Profile', { data, user, role })
    } catch (err) {
      res.send(err);
    }
  }

  static async postProfile(req, res){
    const { id } = req.params;
    const { descriptionUser, age, gender } = req.body;
    try {
      await Profile.create({ descriptionUser, age, gender, UserId: id });
      res.redirect(`/profile/${id}`)
    } catch (err) {
      res.send(err);
    }
  }

  static async readUsers(req, res){
    const { errors } = req.query;
    const { role } = req.session;
    try {
      const data = await User.findAll();
      const user = await User.findByPk(req.session.userId);
      res.render('UsersList', { data, user, errors, role });
    } catch (err) {
      res.send(err);
    }
  }

  static async deleteUser(req, res){
    const { id } = req.params;
    try {
      const data = await User.findByPk(id);
      if(req.session.userId = id){
        const error = "Tidak bisa menghapus akun sendiri";
        return res.redirect(`/users?errors=${error}`);
      }
      await data.destroy();
      res.redirect('/users');
    } catch (err) {
      res.send(err);
    }
  }
}

module.exports = UserController;