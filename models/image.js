const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
	created_at: { type: mongoose.Schema.Types.Date },
	format: { type: mongoose.Schema.Types.String },
	public_id: { type: mongoose.Schema.Types.String },
	type: { type: mongoose.Schema.Types.String },
	version: { type: mongoose.Schema.Types.String },
	url: { type: mongoose.Schema.Types.String },
	tags: [{ type: mongoose.Schema.Types.Array, default: [] }],
	delete_token: { type: mongoose.Schema.Types.String },
	path: { type: mongoose.Schema.Types.String },
	access_mode: { type: mongoose.Schema.Types.String, default: 'public' },
	width: { type: mongoose.Schema.Types.Number },
	height: { type: mongoose.Schema.Types.Number },
	creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;