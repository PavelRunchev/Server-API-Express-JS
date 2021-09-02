const { verifyToken } = require('../utilies/jwt');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('Raider');

const authAdmin = (req, res, next) => {
	const headers = req.headers['authorization'];
	if(!headers)
		return res.status(401).json({ message: 'Invalid credentials! Unauthorized!'});

	const [bearer, adminToken] = headers.split(' ');
	if(bearer !== 'Bearer')
		return res.status(401).json({ message: 'Invalid credentials! Unauthorized!'});

	const verifyAdmin = verifyToken(adminToken);
	if(!verifyAdmin.role)
		return res.status(403).json({ message: 'invalid token'});

	const decryptRole = cryptr.decrypt(verifyAdmin.role);
	const [id, token] = decryptRole.split(' ');
	if(!id || id === '')
		return res.status(403).json({ message: 'invalid token'});
	const verifySubToken = verifyToken(token);
	if(!verifySubToken.email || !verifySubToken.userId)
		return res.status(403).json({ message: 'invalid token'});

	next();
}

module.exports = authAdmin;
