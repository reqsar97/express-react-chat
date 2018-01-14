const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	author: {type: Schema.Types.ObjectId, ref: 'User'},
	body: String,
	createdAt: Number
});

// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Message', MessageSchema);
