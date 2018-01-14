const express = require('express');
const authMiddleware = require('connect-ensure-login');
const Message = require('../models/message');
const User = require('../models/user');

const router = express.Router();
const loginController = require('../controllers/login-controller');

router.get('/', authMiddleware.ensureLoggedIn(), (req, res) => {
	console.log('User:', req.user);
	Message.find({})
    .populate('author')
    .exec((err, messages) => {
  		if (err) {
  			console.log(err);
  		}
  		res.render('chat/home', {
  			messages
  		});
  	});
});

router.post('/', authMiddleware.ensureLoggedIn(), (req, res) => {
	console.log(req.body);
	console.log(req.user);
	const message = new Message({
		author: req.user[0]._id,
		body: req.body.message,
		createdAt: Date.now()
	});
	message.save((err, res) => {
		console.log(err);
		console.log(res);
	});
	res.redirect('/');
});

router.get('/login', authMiddleware.ensureLoggedOut(), loginController.index);
router.post('/login', authMiddleware.ensureLoggedOut(), loginController.login);
router.get('/register', authMiddleware.ensureLoggedOut(), loginController.registerIndex);
router.post('/register', authMiddleware.ensureLoggedOut(), loginController.register);
router.post('/logout', authMiddleware.ensureLoggedIn(), loginController.logOut);

module.exports = router;
