const router = require('express').Router();
const controllers = require('../controllers');
const auth = require('../config/auth');
const authAdmin = require('../config/authAdmin');

router.post('/createPost', controllers.post.createPost);
router.get('/allPosts', controllers.post.getAllPost);
router.delete('/removePost/:id', authAdmin, controllers.post.removePost);

module.exports = router;