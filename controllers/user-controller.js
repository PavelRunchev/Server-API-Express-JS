//encrypted hash pasword for sign up!
const bcrypt = require('bcryptjs');
const saltRounds = 10;
//decrypt password for sign in!!!
const Cryptr = require('cryptr');
const cryptr = new Cryptr('Raider');
const requestIp = require('request-ip');



const User = require('mongoose').model('User');
const { createToken, verifyToken } = require('../utilies/jwt');
const { isValidJson } = require('../utilies/validationJson');

const validationResult = require('express-validator').validationResult;


function validateSignIn(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return { message: `${errors.errors[0]['msg']}` };

    return false;
}

function validatetionSignUp(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return { message: `${errors.errors[0]['msg']}` };

    return false;
}

module.exports = {
    signIn: async (req, res, next) => {
        try {
            //validation fields
            const validationBody = await validateSignIn(req, res);
            if(validationBody)
                return res.status(422).json(validationBody);

            const { email, password} = req.body;

              //if input format cannot JSON!
             if(isValidJson(req.body === false)) {
                const user = await User.findOne({ email: email });
                if(!user.forbidden) {
                    const clientIp = requestIp.getClientIp(req);
                    user.ipBanList.add(clientIp);
                    if(user.ipBanList.length === 5) user.forbidden = true;
                }

                await user.save();
                return res.status(403).json({ message: 'Invalid request!' });
            }

            const user = await (await User.findOne({ email: email }));
            if(!user) 
                return res.status(404).json({ message: `User don't exist!` });

            if(user.permanentBan)
                return res.status(403).json({ message: 'Account forbidden!' });

            const decodePassword = cryptr.decrypt(password);
            const correctPassword = await user.matchPassword(decodePassword);
            if(!correctPassword)
                return res.status(422).json({ message: 'Invalid password!'});

            const token = createToken({ email: user.email, userId: user._id.toString() });
            res.cookie('token', token,  { maxAge: 3600000 * 24, secure: true, httpOnly: false });
            if(user.roles[1] === 'Admin') {
                const encryptedPayload = cryptr.encrypt(user._id.toString() + ' ' + token);
                const adminToken = createToken({ role: encryptedPayload });
                res.cookie('a-%l@z_98q1&', adminToken,  { maxAge: 3600000, secure: true, httpOnly: false });
            }

            const sendUser = { _id: user._id.toString() };
            res.status(200).json({ token, user: sendUser, message: 'Login successful' });
        } catch (err) {
            next(err);
        }
    },

	signUp: async (req, res, next) => {
        try {
            const validationBody = await validatetionSignUp(req, res);
            if(validationBody)
                return res.status(422).json(validationBody);

            //const { firstName, lastName, age, phone, email, city, password, repeatPassword, checkbox } = JSON.parse(req.body.body);
            const { firstName, lastName, age, phone, email, city, password, repeatPassword, checkbox } = req.body;

            if(password !== repeatPassword)
                return res.status(422).json({ message: 'Passwords must be matches!' });

            if(checkbox === false)
                return res.status(422).json({ message: `You don't agree to our terms!`});

            const existUser = await User.findOne({ email: email});
            if(existUser)
                return res.status(400).json({ message: 'Email is already taken!' });

            bcrypt.genSalt(saltRounds)
                .then((salt) => {
                    return Promise.all([salt, bcrypt.hash(password, salt)]);
                }).then(([salt, hashedPass]) => {
                    // register user!
                    return Promise.resolve(User.create({  firstName, lastName, age: Number(age), 
                        phoneNumber: phone, email, city,
                        profileImageUrl: 'https://clipartart.com/images/default-profile-picture-clipart.jpg',
                        passwordHash: hashedPass, salt, 
                        carsHistory: [], roles: ['User'],
                        ipBanList: [], permanentBan: false
                    }));
                }).then((user) => {
                    const token = createToken({ email: user.email, userId: user._id.toString() });
                    res.cookie('token', token,  { maxAge: 3600000 * 24, secure: true, httpOnly: false });
                    if(user.roles[1] === 'Admin') {
                        const encryptedPayload = cryptr.encrypt(user._id.toString() + ' ' + token);
                        const adminToken = createToken({ role: encryptedPayload });
                        res.cookie('a-%l@z_98q1&', adminToken,  { maxAge: 3600000, secure: true, httpOnly: false });
                    }

                    const sendUser = { _id: user._id.toString() };
                    res.status(201).json({ token, user: sendUser, message: 'Registration successful!' });
                }).catch(err => next(err));
        } catch (err) {
            next(err);
        }   
	},

    logOut: async (req, res, next) => {
        res.clearCookie('token');
        res.clearCookie('a-%l@z_98q1&');
        res.status(200).json({ message: 'Logout successful' });
    },

    updateProfileImage: (req, res, next) => {
        //todo!!!
        const {public_key, userId, profileImageUrl} = req.body;
        User.findByIdAndUpdate({ _id: userId}, { profileKey: public_key, profileImageUrl: profileImageUrl })
            .then(user => {
                res.status(200).json({ message: 'Profile image saved!' });
            }).catch(err => next(err));
    },

    restoreUserData: (req, res, next) => {
        const userId = req.params.id;
        if(userId !== undefined) {
            User.findById(userId)
                .select('email firstName lastName profileName profileKey carsHistory age phoneNumber city profileImageUrl')
                .then(user => {
                    res.status(200).json(user);
                }).catch(err => next(err));
        }
    }

   
}