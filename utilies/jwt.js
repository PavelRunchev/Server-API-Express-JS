var jwt = require('jsonwebtoken');
const secret = 'ResidentEvil2REMAKEfromCAPCOM';

function createToken(data) {
    return jwt.sign(data, secret, { expiresIn: '1d' });
}

function verifyToken(token) {
        return jwt.verify(token, secret, (err, data) => {
            if (err) { 
                return err;
            }

            return data;
        });
}

module.exports = {
    createToken,
    verifyToken
};