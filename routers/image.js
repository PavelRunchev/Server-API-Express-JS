const router = require('express').Router();
const controllers = require('../controllers');
const auth = require('../config/auth');

router.get('/allImages/:id', auth, controllers.image.allImages);
router.post('/uploadImage', auth, controllers.image.uploadImage);
router.post('/removeImage/:id', auth, controllers.image.removeImage);

module.exports = router;