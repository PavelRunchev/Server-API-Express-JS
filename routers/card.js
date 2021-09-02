const router = require('express').Router();
const controllers = require('../controllers');

const { body, check } = require('express-validator');
const auth = require('../config/auth');
const authAdmin = require('../config/authAdmin');

router.get('/all', controllers.card.getAllCards);
router.post('/createCard', authAdmin, validateCreateCard('/createCard'), controllers.card.createCard);
router.delete('/delete/:id', auth, controllers.card.removeCard);
router.put('/updateLike/:id', auth, controllers.card.isLiked);
router.put('/updateDislike/:id', auth, controllers.card.isDisliked);

module.exports = router;

function validateCreateCard(path) {
	if(path === '/createCard') {
		return [
			check('make')
				.trim()
				.isLength({ min: 2 })
				.withMessage('Make must be contain at least 2 letters!')
				.matches(/^[A-Z]{1}[A-Za-z0-9 -]+/)
				.withMessage('Make must be start with uppercase letter!'),
			check('model')
				.trim()
				.isLength({ min: 2, max: 64 })
				.withMessage('Model must be contain at least 2 letters!')
				.matches(/^(?=.{2,}$)(?=[A-Za-z])(?=.*[A-Za-z0-9- ]).*/)
				.withMessage('invalid format model!'),
			check('imageUrl')
				.trim()
				.matches(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/i)
				.withMessage('Invalid Url'),
			check('color')
				.trim()
				.matches(/^(?=.{3,})(?=[a-z]{1,})[a-z -]*/)
				.withMessage('Color must be greater than 2 letters and contain only lowercase letter!'),
			check('price')
				.trim()
				.isDecimal()
				.withMessage('Invalid price!')
				.bail()
				.custom((value, {req}) => value > 0)
				.withMessage('Price cannot be zero or negative!')
		];
	} else
		return [];
}


