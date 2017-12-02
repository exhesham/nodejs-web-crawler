var http = require('http');
var assert = require('assert');
var httpRequest = {
	get: function (url) {

		return (new Promise(function (resolve, reject) {
			http.get(url, function (res) {
				assert.equal(200, res.statusCode);
				resolve(res);
			});
		}));
	}
};

module.exports = httpRequest;