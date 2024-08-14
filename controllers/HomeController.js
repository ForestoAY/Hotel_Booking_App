class HomeController {
  static async home(req, res){
    try {
      res.render('Home');
    } catch (err) {
      res.send(err);
    }
  }
}

module.exports = HomeController;