const HomeController = require('../controllers/HomeController');
const HotelController = require('../controllers/HotelController');
const UserController = require('../controllers/UserController');

const router = require('express').Router();

// Landing Page
router.get('/', HomeController.home);

// Tampilan error
router.get('/unauthorized', HomeController.unauthorized);

// Register
router.get('/register', UserController.getRegister);
router.post('/register', UserController.postRegister);

// Login
router.get('/login', UserController.getLogin);
router.post('/login', UserController.postLogin);

// Middleware Login
const isLoggedIn = function(req, res, next){
  console.log(req.session);
  if(!req.session.userId){
    const error = 'Mohon login dahulu';
    res.redirect(`/login?errors=${error}`);
  } else {
    next();
  }
}

// Middleware role admin
const isAdmin = function(req, res, next){
  console.log(req.session);
  if(req.session.userId && req.session.role != 'admin'){
    const error = 'Tidak punya akses';
    res.redirect(`/login?errors=${error}`);
  } else {
    next();
  }
}

// Route di bawah ini harus login terlebih dahulu
router.use(isLoggedIn);

// Profile
router.get('/profile/:id', UserController.readProfile);

router.get('/profile/:id/edit', UserController.getEditProfile);
router.post('/profile/:id/edit', UserController.postEditProfile);

// List Hotel
router.get('/hotel', HotelController.readHotel);

// Detail Hotel
router.get('/hotel/detail/:id', HotelController.readDetailHotel)

// Reserve Hotel
router.get('/hotel/detail/:id/reserve', HotelController.getReserveRoom)
router.post('/hotel/detail/:id/reserve', HotelController.postReserveRoom)

// Logout
router.get('/logout', UserController.getLogout)

module.exports = router;