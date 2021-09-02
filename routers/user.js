const router = require('express').Router();
const controllers = require('../controllers');
const { body, check } = require('express-validator');
const auth = require('../config/auth');

router.post('/sign-in', validateSignIn('/sign-in'), controllers.user.signIn);
router.post('/sign-up', validateSignUp('/sign-up'), controllers.user.signUp);
router.post('/logout', auth, controllers.user.logOut);
router.put('/updateProfileImage', auth, controllers.user.updateProfileImage);
router.post('/restoreUserData/:id', auth, controllers.user.restoreUserData);



module.exports = router;

function validateSignIn(path) {
	if(path === '/sign-in') {
		return [
			check('email')
				.trim()
				.matches(/^[A-Za-z0-9._-]+@[a-z0-9.-]+.[a-z]{2,4}$/m)
				.withMessage('Invalid E-mail!')
		];
	} else 
		return [];
}

function validateSignUp(path) {
	if(path === '/sign-up') {
		return [
			check('firstName')
				.trim()
				.matches(/^[A-Z]{1}[a-z]+/)
				.withMessage('Invalid first name!'),
			check('lastName')
				.trim()
				.matches(/^[A-Z]{1}[a-z]+/)
				.withMessage('Invalid last name!'),
			check('age')
				.trim()
				.isInt({ min: 16 })
				.withMessage('Age must be number and least 16!'),
			check('phone')
				.trim()
				.isMobilePhone()
				.withMessage('Phone is incorect format!'),
			check('email')
				.trim()
				.normalizeEmail()
				.isEmail()
				.withMessage('Invalid E-mail'),
			check('city')
				.trim()
				.matches(/^[A-Z]{1}[a-z]+([\s]{1}[A-Z]{1}[a-z]+)?/)
				.withMessage('Invalid city'),
			check('password')
				.trim()
				.matches(/^(?=.{8,32}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*/)
				.withMessage('Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number!'),
			check('repeatPassword')
				.trim()
				.matches(/^(?=.{8,32}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*/)
				.withMessage('Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number!')
		];
	} else
		return [];
}
