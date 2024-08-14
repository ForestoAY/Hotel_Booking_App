const HomeController = require('../controllers/HomeController');
const UserController = require('../controllers/UserController');

const router = require('express').Router();

// Landing Page
router.get('/', HomeController.home);

// Register
router.get('/register', UserController.getRegister);
router.post('/register', UserController.postRegister);

// Login
router.get('/login', UserController.getLogin);
router.get('/login', UserController.postLogin);

module.exports = router;