class UserController {
  static async getRegister(req, res){
    try {
      res.render('Register');
    } catch (err) {
      res.send(err);
    }
  }

  static async postRegister(req, res){
    try {

    } catch (err) {
      res.send(err);
    }
  }

  static async getLogin(req, res){
    try {
      res.render('Login');
    } catch (err) {
      res.send(err);
    }
  }

  static async postLogin(req, res){
    try {

    } catch (err) {
      res.send(err);
    }
  }
}

module.exports = UserController;