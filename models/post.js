const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	createdDate: { type: mongoose.Schema.Types.Date },
	content: { type: mongoose.Schema.Types.String },
	userFirstName: { type: mongoose.Schema.Types.String, default: 'anonymous' },
	imageUrl: { type: mongoose.Schema.Types.String, default: 'https://clipartart.com/images/default-profile-picture-clipart.jpg' }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;