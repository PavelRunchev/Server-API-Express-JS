const Card = require('../models/card');
const User = require('mongoose').model('User');
const randomstring = require("randomstring");

const { validationResult } = require('express-validator');

function validatetionCreateCard(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return { message: `${errors.errors[0]['msg']}` };

    return false;
}

module.exports = {
    createCard: async (req, res, next) => {
		try {
			//validation only auth user can register card!
			const validationError = await validatetionCreateCard(req, res);

			if(validationError)
				return res.status(422).json(validationError);

			const { make, model, imageUrl, color, price } = req.body;
			const randomId = randomstring.generate(12);

			const data = await Card.create({ id: randomId,
				make: make,
				model: model,
				imageUrl: imageUrl,
				color: color,
				price: Number(price),
				like: 0,
				isRent: false
			});
			
			if(!data) 
				return res.status(400).json({ message: data });
				
			res.status(201).json({ message: 'Card was created successful'});
		} catch(err) { next(err); }
    },

	getAllCards: (req, res, next) => {
		Card.find({})
			.sort({ like: 'descending'})
			.then((data) => {
			res.status(200).type('json').json({message: 'all cards fetching', data});
		}).catch(err => next(err));
	},

	removeCard: (req, res, next) => {
		const cardId = req.params.id;
		//todo only admin that remove card
		if(cardId !== undefined) {
			Card.findByIdAndRemove({ _id: cardId})
			.then(() => {
				res.status(200).json({ message: 'Car deleted successfully!'});
			}).catch(err => next(err));
		}
	},

	isLiked: (req, res, next) => {
		const cardId = req.params.id;
		if(cardId !== undefined) {
			Card.findOne({ _id: cardId })
			.select('like')
			.then((card) => {
				card.like = Number(++card.like);
				card.save();
				return Promise.resolve(card);
			}).then(data => {
				res.status(200).json(data);
			}).catch(err => next(err));
		}
	},

	isDisliked: (req, res, next) => {
		const cardId = req.params.id;
		if(cardId !== undefined) {
			Card.findOne({ _id: cardId })
			.select('like')
			.then((card) => {
				card.like = Number(--card.like);
				card.save();
				return Promise.resolve(card);
			}).then(data => {
				res.status(200).json(data);
			}).catch(err => next(err));
		}
	}
}