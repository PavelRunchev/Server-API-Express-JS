const Image = require('../models/image');
const cloudinary = require('cloudinary');
cloudinary.config({
      cloud_name: 'raiders',
      api_key: '769116832599196',
      api_secret: 'IZr3aiB7b_6JQ4nAMrRxBcuT9Bw'
});

module.exports = {
	uploadImage: (req, res, next) => {
		const img = req.body;
		if(typeof img === 'object') {
			Image.create(img).then((data) => {
				res.status(200).json({ message: 'Upload successful!', data });
			}).catch(err => next(err));
		} else {
			res.status(400).json({ message: 'Invalid type Image!' });
		}
	},

	allImages: (req, res, next) => {
		const userId = req.params.id;

		if(userId !== undefined) {
			Image.find({ creator: userId })
			.sort({ created_at: 'descending'})
			.then((data) => {
				res.status(200).json({ data });
			}).catch(err => next(err));
		} else {
			res.status(401).json({ message: 'Invalid credentials! Unauthorized!'})
		}
	},

	removeImage: (req, res, next) => {
		const public_id  = req.body;
		const { id } = req.params;
		cloudinary.v2.uploader.destroy(public_id, 
			{ resource_type: "image" }, 
			function(error, result) {
				if(result.result === 'ok')
					Image.findByIdAndRemove({ _id: id}).then(() => {
						res.status(200).json({ message: 'Delete image Successful' });
					}).catch(err => next(err));
				else {
					res.status(404).json({ message: 'Not Found '});
				}
        }).catch(err => next(err));
	}
}