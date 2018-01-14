const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	userId: Number,
	userName: String,
	body: String,
	createdAt: Number
});

// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Message', MessageSchema);
