const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: String,
	password: String,
	imgUrl: String
});

// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
