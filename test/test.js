var crawl = require('../crawl');
var assert = require('assert');
var http = require('http');

var reqp = require('../request-promise');

describe('tests categories:', function() {
	it('section correct', function() {
		var url = {
			'host': crawl.parent_url,
			'path': crawl.categories['guitars'].path,
			'port': 80
		}
		return reqp.get(url).then(function(res) {
			console.log(res.content)
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

function arrayContainsArray (superset, subset) {
	return subset.every(function (value) {
		return (superset.indexOf(value) >= 0);
	});
}
describe('tests returned category data format:', function() {
	this.timeout(24000);
	it('single section category', function() {
		var category = 'classical-guitars';
		return crawl.crawl_data('guitars','classical-guitars',1,false).then(function(res) {

			console.log(res)
			assert.equal(Array.isArray(res[category]), true);
			assert.equal(res[category].length>1, true);
		})
	});
	it('get one page and then all pages and compare test', function() {
		var category = 'classical-guitars';
		return new Promise(function (resolve, reject) {
			crawl.crawl_data('guitars',category,1,false).then(function(res_second_page) {
				crawl.crawl_data('guitars',category,1,true).then(function(all_category_pages) {


					console.log('res_second_page', res_second_page[category].length)
					console.log('all_category_pages', all_category_pages[category].length)
					assert.equal(all_category_pages[category].length > res_second_page[category].length, true);
					arrayContainsArray(all_category_pages[category], res_second_page[category])
					resolve()
				}).catch(reject)
			}).catch(reject)
		}).then(function (value) {});

	});
	it('get all pages and then one page and compare test', function() {
		var category = 'classical-guitars';
		return new Promise(function (resolve, reject) {
			crawl.crawl_data('guitars',category,1,true).then(function(all_category_pages) {
				crawl.crawl_data('guitars',category,1,false).then(function(res_second_page) {
					console.log('res_second_page', res_second_page[category].length)
					console.log('all_category_pages', all_category_pages[category].length)
					assert.equal(all_category_pages[category].length > res_second_page[category].length, true);
					arrayContainsArray(all_category_pages[category], res_second_page[category])
					resolve()
				}).catch(reject)
			}).catch(reject)
		}).then(function (value) {});
	});

	it('get first and second page test', function() {
		var category = 'classical-guitars';
		return new Promise(function (resolve, reject) {
			crawl.crawl_data('guitars',category,1,false).then(function(res_first_page) {
				crawl.crawl_data('guitars',category,2,false).then(function(res_second_page) {
					console.log(res_first_page)
					assert.equal(Array.isArray(res_first_page[category]), true);
					assert.equal(Array.isArray(res_second_page[category]), true);
					assert.equal(res_second_page[category].length, res_first_page[category].length);
					resolve()
				}).catch(reject)
			}).catch(reject)
		}).then(function (value) {});
	});
});