const router = require('express').Router();
const controllers = require('../controllers');

router.get('/', controllers.home.index);

module.exports = router;