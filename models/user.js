// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
const User = new Schema({
	name: {
		type: String,
		required: true
	},

	cpf: {
		type: String,
		required: true
	},

	phone: {
		type: String,
		required: true
	},

	address: {
		type: String,
		required: true
	},

	thumb: {
		type: String
	}
});

module.exports = mongoose.model('User', User);
