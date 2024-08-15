class HomeController {
  static async home(req, res){
    try {
      res.render('Home');
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