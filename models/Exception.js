var mongoose = require('mongoose');

var instanceSchema = new mongoose.Schema({
	instance_id: mongoose.Schema.Types.ObjectId,
	occurred_at: Date
});

var exceptionSchema = new mongoose.Schema({
	last_message: {type: String},
	class: {type: String},
	file: {type: String},
	line: {type: Number},
	hash: {type: String, required: true},
	project: mongoose.Schema.Types.ObjectId,
	created_at: Date,
	updated_at: Date,
	last_occurred: Date,
	instances: [instanceSchema]
});

exceptionSchema.pre('save', function(next){
	
	var now = new Date();

	this.updated_at = now

	if(!this.created_at){
		this.created_at = now;
	}

	next();

});

module.exports = mongoose.model('exceptions', exceptionSchema);