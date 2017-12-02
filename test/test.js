var crawl = require('../crawl');
var assert = require('assert');
var http = require('http');

var reqp = require('./request-promise');

describe('tests categories:', function() {
	it('section correct', function() {
		var url = {
			'host': crawl.parent_url,
			'path': crawl.categories['guitars'].path,
			'port': 80
		}
		return reqp.get(url).then(function(res) {
			assert.equal(200, res.statusCode);
		})
	});
	it('section correct', function() {
		this.timeout(6000);
		var all_promises = []
		for(var section in crawl.categories){
			for(var i in crawl.categories[section].categories) {
				var url = {
					'host': crawl.parent_url,
					'path': crawl.categories['guitars'].path,
					'port': 80
				}
				all_promises.push(reqp.get(url));
			}
		}

		return Promise.all(all_promises).then(function(res) {
			// assert.equal(200, res.statusCode);
		})
	});
});


describe('tests returned category data format:', function() {
	this.timeout(4000);
	it('single section category', function() {
		var category = crawl.categories['guitars'].categories[0].name;
		return crawl.crawl_data('guitars',category,1,false).then(function(res) {
			assert.equal(Object.keys(res).length, 1);
			assert.equal(Object.keys(res['guitars']).length, 1);
			assert.equal(res['guitars'][category].length > 1, true);
		})
	});
	it('single category page test', function() {
		var category = crawl.categories['guitars'].categories[0].name;
		return new Promise(function (resolve, reject) {
			crawl.crawl_data('guitars',category,1,false).then(function(res_first_page) {
				crawl.crawl_data('guitars',category,2,false).then(function(res_second_page) {
					assert.equal(Object.keys(res_second_page).length, 1);
					assert.equal(Object.keys(res_second_page['guitars']).length, 1);
					assert.equal(res_second_page['guitars'][category].length,
						res_first_page['guitars'][category].length);
					resolve()
				}).catch(reject)
			}).catch(reject)
		}).then(function (value) {});

	});
});