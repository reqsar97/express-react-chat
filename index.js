const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars')
			.create({defaultLayout: 'main'});
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Message = require('./models/message');
const credentials = require('./credentials');

const port = process.env.PORT || 5000;
const app = express();

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

// Set routes
app.get('/', (req, res) => {
	Message.find({}, (err, messages) => {
		if (err) {
			console.log(err);
		}
		res.render('chat/home', {
			messages
		});
	});
});

app.post('/', (req, res) => {
	console.log(req.body);
	const message = new Message({
		userId: 1,
		userName: 'Karen',
		body: req.body.message,
		createdAt: Date.now()
	});
	message.save((err, res) => {
		console.log(err);
		console.log(res);
	});
	res.redirect('/');
});

// Start server listen
app.listen(port, () => {
	console.log('server start on port 3000');
});
