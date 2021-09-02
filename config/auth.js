const { verifyToken } = require('../utilies/jwt');

const auth = (req, res, next) => {
	const headers = req.headers['authorization'];

	if(headers) {
		const [bearer, token] = headers.split(' ');

		if(bearer === 'Bearer') {
			const verify = verifyToken(token);
			if(verify.userId || verify.email) 
				next();
			else	
				return res.status(403).json({ message: 'invalid token'});
		} else {
			return res.status(401).json({ message: 'Invalid credentials! Unauthorized!'});
		}
	} else {
		next();
	}
}

module.exports = auth;

