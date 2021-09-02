const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const userSchema = new mongoose.Schema({
    email: { type: mongoose.Schema.Types.String, required: true, unique: true },
    passwordHash: { type: mongoose.Schema.Types.String, required: true },
    carsHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cars', default: [] }],
    salt: { type: mongoose.Schema.Types.String, required: true },
	firstName: { type: mongoose.Schema.Types.String, required: true },
	lastName: { type: mongoose.Schema.Types.String, required: true },
	age: { type: mongoose.Schema.Types.Number, required: true },
	phoneNumber: { type: mongoose.Schema.Types.String, required: true },
	city: { type: mongoose.Schema.Types.String, required: true },
    profileName: { type: mongoose.Schema.Types.String, default: 'raiders' },
    profileKey: { type: mongoose.Schema.Types.String, default: '' },
    profileImageUrl: { type: mongoose.Schema.Types.String },
    roles: [{ type: mongoose.Schema.Types.String }],
    ipBanList: [{ type: mongoose.Schema.Types.Array , default: [] }],
    permanentBan: { type: mongoose.Schema.Types.Boolean, default: false }
});

//express validation before mongoose!
userSchema.path('email').validate(function() {
    return RegExp('^[A-Za-z0-9._-]+@[a-z0-9.-]+.[a-z]{2,4}$').test(this.email);
}, 'Email is incorrect format!');

userSchema.method({
    matchPassword: function(password) {
        return bcrypt.compare(password, this.passwordHash);
    }
});

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) { next(err); return; }
        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) { next(err); return; }
          this.password = hash;
          next();
        });
      });
      return;
    }
    next();
  });

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async() => {
    try {
        let users = await User.find();
        if (users.length > 0) return;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) { next(err); return; }
            bcrypt.hash('Hanzo7902', salt, (err, hash) => {
                if(err) { next(err); return; }
                return User.create({
                    email: 'abobo@abv.bg',
                    salt,
                    passwordHash: hash,
					firstName: 'Bobi',
					lastName: 'Bachvarov',
                    age: 40,
					phoneNumber: '0879162916',
					city: 'Sofia',
                    ptofileName: 'raiders',
                    profileKey: '',
                    profileImageUrl: 'https://png.pngtree.com/png-vector/20190704/ourmid/pngtree-administration-icon-in-trendy-style-isolated-background-png-image_1538647.jpg',
                    roles: ['User', 'Admin', 'Owner'],
                    ipBanList: [],
                    permanentBan: false
                });
            });
        });
    } catch (next) {
        next();
    }
};

module.exports = User;