/**
 * Created by exhesham on 30/11/2017.
 */
var http = require('http');
var htmlparser = require("htmlparser");
var htmlparser2 = require("htmlparser2");
var jsonfile = require('jsonfile');
var reqp = require('./request-promise');

var categories = {
	'guitars': {
		'path': '/?Section=2&displaystyle=2',
		'pages': 1,
		'categories': {
			'classical-guitars': {'name': 'classical guitars', 'path': '/?Category=59&displaystyle=2'},
			'accoustic-guitars': {'name': 'accoustic guitars', 'path': '/?Category=60&displaystyle=2'},
			'electric-guitars': {'name': 'electric guitars', 'path': '/?Category=51&displaystyle=2'},
			'bass-guitars': {'name': 'bass guitars', 'path': '/?Category=53&displaystyle=2'},
			'mandoline-guitars': {'name': 'mandoline and banjos', 'path': '/?Category=168&displaystyle=2'},
			'ukulili': {'name': 'ukulili', 'path': '/?Category=169&displaystyle=2'},
			'amplifiers': {'name': 'amplifiers', 'path': '/?Category=105&displaystyle=2'},
			'effects': {'name': 'effects', 'path': '/?Category=63&displaystyle=2'},
			'strings': {'name': 'strings', 'path': '/?Category=65&displaystyle=2'},
			'cases': {'name': 'cases', 'path': '/?Category=170&displaystyle=2'},
			'others': {'name': 'others', 'path': '/?Category=64&displaystyle=2'},
			'pickups': {'name': 'pickups', 'path': '/?Category=66&displaystyle=2'},
		}

	},
}

var all_products = {}   // this dict will hold all the products mentioned in the categories
var parent_url = 'kley-zemer.co.il';
var desired_dom_attrs = {
	/*These are the attrs that represent a single product */
	'class': 'ProductDisplayStyle2'
}

function get_number(str) {
	var price_regex = new RegExp('([0-9]+)', 'g');
	var found_number = str.replace(',', ''); // if the number has commas...
	try {
		found_number = price_regex.exec(found_number)[0];
	} catch (e) {
		found_number = null;
	}
	return found_number
}

function get_product_json(product_span, section, category_key) {
	/* receives a span that include the product details and return a json
	* */

	if (!product_span || !product_span.children) {
		return;
	}
	var product_img_url;
	var product_url = product_span.children[1].attribs['onclick']
	var product_id = product_url.replace('location.href=\'product.asp?product=', '').replace("';", '')
	var subdoms = product_span.children[1].children
	var product_name = subdoms[1].raw
	var product_price1 = get_number(subdoms[7].children[1].children[0].data)
	var product_price2 = get_number(subdoms[9].children[1].children[0].data)
	try {
		product_img_url = subdoms[3].children[1].children[1].children[1].children[0].attribs['src']
	} catch (e) {
	}

	return {
		'product-url': product_url,
		'img-url': product_img_url,
		'category-key': category_key,
		'section': section,
		'id': product_id,
		'name': product_name,
		'price-1': product_price1,
		'price-2': product_price2,
	};
}

function is_desired_dom(dom) {
	/*
	* Check if the received dom does represent a single product
	* according to the variable desired_dom_attrs
	* */
	if (!dom || !dom.attribs) {
		return false;
	}
	for (var key in desired_dom_attrs) {
		if (dom.attribs[key] != desired_dom_attrs[key]) {
			return false;
		}
	}
	return true;
}

function convert_relevant_product_doms_to_json(dom, section, category_key) {
	/*
	* This function will receive the whole page dom and start scanning it for relevant doms.
	* the relevant doms will be parsed and converted to json
	* */
	var children = dom.children
	for (var i in children) {

		if (children[i].name == 'span' && children[i].type == 'tag') {
			if (is_desired_dom(children[i])) {
				if (!all_products[section]) {
					all_products[section] = {};
				}
				if (!all_products[section][category_key]) {
					all_products[section][category_key] = [];
				}
				var result = get_product_json(children[i], section, category_key)
				all_products[section][category_key].push(result);
			}
		} else {
			convert_relevant_product_doms_to_json(children[i], section, category_key);
		}

	}
}

function get_pages_number_from_first_page(data, section, category) {
	var capture_num = false;
	var pages_number = false;
	return new Promise(function (resolve, reject) {
		var parser = new htmlparser2.Parser({
			onopentag: function (name, attribs, a) {
				if (name === "span" && attribs.class.indexOf("paging OtherPage") >= 0) {
					capture_num = true;
				}
			},
			ontext: function (text) {
				if (capture_num) {
					text = parseInt(text)
					var curr_pages = pages_number || 1
					pages_number = text && text > curr_pages ? text : curr_pages;
					capture_num = false
				}

			},
			onclosetag: function (tagname) {
				if (tagname === "body") {
					//scan_category_pages(section, category, 2).then(resolve).catch(reject)
					resolve(pages_number)
				}
			}
		}, {decodeEntities: true});
		parser.write(data);
		parser.end();
	});
}

function get_pages_number_of_category(section, category_key) {
	return new Promise(function (resolve, reject) {
		var options = {
			host: parent_url,
			port: 80,
		}
		options.path = categories[section].categories[category_key].path;

		reqp.get(options).then(function(res) {
			var data = ''
			res.on('data', function (chunk) {
				data += chunk;
			});
			res.on('end', function () {
				get_pages_number_from_first_page(data, section, category_key).then(resolve).catch(reject);

			});
		});
	});
}
function start_category_scan(section, category_key, page, get_all_data) {
	/*
	* This function opens the category_key link and scan the page
	* if the callback is not null, it calls the callback in order to get the maximum page number.
	* */
	return new Promise(function (resolve, reject) {
		if (get_all_data) {
			get_pages_number_of_category(section, category_key).then(function (total_pages) {
				var all_promises = [];
				for (var i = page; i < total_pages + 1; i++) {
					all_promises.push(start_category_scan(section, category_key, i, false))
				}
				Promise.all(all_promises).then(function (res) {
					resolve(all_products[section][category_key]);
				}).catch(reject);
			});
		} else {
			var options = {
				host: parent_url,
				port: 80,
			}

			options.path = categories[section].categories[category_key].path + '&Page=' + page;

			var request = http.request(options, function (res) {
				var data = '';
				res.on('data', function (chunk) {
					data += chunk;
				});
				res.on('end', function () {
					var rawHtml = data;
					var handler = new htmlparser.DefaultHandler(function (error, dom) {
						if (!error) {
							for (var i in dom) {
								convert_relevant_product_doms_to_json(dom[i], section, category_key);
							}
						}
					});
					var parser = new htmlparser.Parser(handler);
					parser.parseComplete(rawHtml, category_key);
					resolve(all_products[section][category_key]);
				});
			});
			request.on('error', function (e) {
				// TODO: retry on failure
				reject(e);
				//start_category_scan(section, category_key, page, callback)
			});
			request.end();
		}

	});

}

/**
 * This function will receive the maximum start_page_number of pages per category and then will scan all these pages
 * @param section
 * @param category a category json that represents a category. the json contains name and pages and url at least
 * @param start_page_number
 * @returns a promise object for all the pages to be scanned
 */
function scan_category_pages(section, category, start_page_number) {
	if (!start_page_number) {
		start_page_number = 1;
	}
	var async_promises = []
	for (var i = start_page_number; i < category.pages + 1; i++) {
		async_promises.push(start_category_scan(section, category, i));
	}
	return Promise.all(async_promises)
}



/**
 * Crawl data for specific category. if category is null, then will scan all the categories
 * @param section_name the section name that referenece the category
 * @param category_key the category key to scan. if the category name is null then will scan all the categories under the section name
 * @param page the page number to scan. if the page number is undefined, then will start scanning from page = 1
 * @param get_all_data boolean parameter. if true, then will scan all the pages after page too. otherwise, will scan only the referenced page.
 * @returns {promise}
 */
function crawl_data(section_name, category_key, page, get_all_data) {
	if (!section_name || !section_name in categories) {
		throw 'input is not correct';
	}
	return new Promise(function (resolve, reject) {
		if (!page) {
			page = 1;
		}
		var async_promises = [];
		var keys_to_scan = category_key ? [category_key] : Object.keys(categories[section_name].categories);
		for (var i in keys_to_scan) {
			async_promises.push(start_category_scan(section_name, keys_to_scan[i], page, get_all_data));
		}
		Promise.all(async_promises).then(function (value) {
			if(!category_key){
				resolve(all_products[section_name]);
			}else{
				var res = {};
				res[category_key] = all_products[section_name][category_key]
				resolve(res);
			}
		}).catch(reject);
	});
}

/***
 * this function will scan all the sections and save it to file named [section_name]_data.json.
 */
function scan_and_save() {
	var async_promises = []
	for (var section_name in categories) {
		for (var i in categories[section_name].categories) {
			var category = categories[section_name].categories[i];
			async_promises.push(start_category_scan(section_name, category, 1));
		}
	}
	Promise.all(async_promises).then(function () {
		// print stats
		for (var section_name in categories) {
			for (var key in all_products[section_name]) {
				console.log(key, ':', all_products[section_name][key].length)
			}
			// save section to file
			var file = section_name + '_data.json'
			var obj = all_products[section_name]
			console.log('saving file', file)
			jsonfile.writeFile(file, obj, function (err) {
				console.error(err)
				console.log('finished saving file: ', file)
			})
		}
	}, function (e) {
		console.log('error ', e)
	});
}

exports.parent_url = parent_url;        // tested
exports.categories = categories;        // tested
exports.scan_and_save = scan_and_save;
exports.crawl_data = crawl_data;        // partially tested - testing for single category
exports.desired_dom_attrs = desired_dom_attrs;        // tested - covered by crawl_data
exports.get_pages_number_of_category = get_pages_number_of_category;