

// import sub module router!!!
const router = require('../routers');

module.exports = app => {
    app.use('/', router.home);
    app.use('/home', router.home);
    app.use('/card', router.card);
    app.use('/user', router.user);
    app.use('/image', router.image);
    app.use('/post', router.post);
};