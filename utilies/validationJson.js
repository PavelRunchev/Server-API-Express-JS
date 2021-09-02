function isValidJson(data) {
		if(typeof data !== 'string')
			return false;
	try {
		JSON.parse(data);
		return true;
	} catch(e) {
		return false;
	}
}

module.exports = { isValidJson }