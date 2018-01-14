const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars')
			.create({defaultLayout: 'main'});
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authMiddleware = require('connect-ensure-login');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const Message = require('./models/message');
const credentials = require('./credentials');

const port = process.env.PORT || 5000;
const app = express();
const routes = require('./routes/web');
const User = require('./models/user');

// Set img storage
const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'public/img/');
	},
	filename(req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	}
});
const upload = multer({storage});

// Set static files
app.use(express.static(path.join(__dirname, '/public')));

// Set request body parser
app.use(bodyParser.urlencoded({extended: true}));

// Set view engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
// Connect to db
const opts = {
	server: {
		socketOptions: {keepAlive: 1}
	}
};

mongoose.connect(credentials.mongo.development.connectionString, opts, err => {
	if (err) {
		console.log(err);
	}
});

// Set seesion and cookies
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({
	resave: false,
	saveUninitialized: false,
	secret: credentials.cookieSecret
}));

// Passport auth
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, cb) => {
	User.find({username}, (err, user) => {
		user = user[0];
		if (err) {
			console.log(err);
			return cb(err);
		}
		if (!user) {
			return cb(null, false);
		}
		if (user.password != password) {
			console.log(user);
			console.log(user.password + ' != ' + password);
			return cb(null, false);
		}
		return cb(null, user);
	});
}));
passport.serializeUser((user, cb) => {
	cb(null, user._id);
});
passport.deserializeUser((id, cb) => {
	User.find({_id: id}, (err, user) => {
		if (err) {
			console.log(err);
			return cb(err);
		}
		cb(null, user);
	});
});

// Set routes
app.use('/', upload.single('image'), routes);
// Start server listen
app.listen(port, () => {
	console.log('server start on port 3000');
});
