var crawl = require('../crawl');
var assert = require('assert');
var http = require('http');
var httpRequest = {
	get: url => {
	return (new Promise(function(resolve, reject) {
		http.get(url, res => {
			resolve(res);
	});
	}));
}
};


describe('categories', function() {
	describe('categories paths', function() {
		it('sections should return 200', function(done) {
			this.timeout(500);
			setTimeout(done, 300);
			for(var section in crawl.categories){
				var request = http.request({
					'host': crawl.parent_url,
					'path': crawl.categories[section].path,
					'port':80
				}, function (res) {
					res.on('end', function () {
						assert.equal(200, res.statusCode);
						done();
					});
				});

				request.on('error', function (e) {
					assert.fail(e)
				});
				request.end();
			}
		});


		it('categories should return 200', function(done) {
			this.timeout(500);
			setTimeout(done, 300);
			for(var section in crawl.categories){

				for(var i in crawl.categories[section].categories) {

					var category = crawl.categories[section].categories[i];
					var url = crawl.parent_url + category.path;

					var request = http.request({
						'host': crawl.parent_url,
						'path': category.path,
						'port':80
					}, function (res) {
						res.on('end', function () {
							assert.equal(200, res.statusCode);
							console.log(category)
							done();
						});
					});
					request.on('error', function (e) {
						assert.fail(e)
					});
					request.end();
				}
			}
		});
	});
});