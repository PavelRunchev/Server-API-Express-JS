const Post = require('../models/post');
//const User = require('../models/user');

module.exports = {
	createPost: (req, res, next) => {
		const { description, firstName, imageUrl } = req.body;
		
		if(firstName === undefined)
			return res.status(401).json({ message: 'Invalid Data!' });

		if(description.length > 1) {
			let newPost = { createdDate: Date.now(), content: description };
			if(firstName !== null && imageUrl !== null) {
				newPost['userFirstName'] = firstName;
				newPost['imageUrl'] = imageUrl;
			}
		
			Post.create(newPost)
				.then((post) => {
					res.status(201).json({ message: 'Post created successfully', post });
				}).catch(err => next(err));
		} else {
			res.status(400).json({ message: 'Invalid Data!' });
		}
	},

	getAllPost: (req, res, next) => {
		Post.find({})
			.sort({ createdDate: 'descending' })
			.then((posts) => {
			res.status(200).json(posts);
		}).catch(err => next(err));
	},

	removePost: (req, res, next) => {
		const postId = req.params.id;
		if(postId === undefined)
			res.status(401).json({ message: "No exist post"});

		Post.findByIdAndRemove({ _id: postId })
			.then(() => {
				res.status(200).json({ message: "Post deleted successfully!"});
			}).catch(err => next(err));
	}
}