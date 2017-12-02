/**
 * Created by exhesham on 30/11/2017.
 */
var http = require('http');
var htmlparser = require("htmlparser");
var htmlparser2 = require("htmlparser2");
var jsonfile = require('jsonfile');


var categories = {
	'guitars': {
		'path': '/?Section=2&displaystyle=2',
		'pages': 1,
		'categories': [
			{'name': 'classical guitars', 'path': '/?Category=59&displaystyle=2'},
			{'name': 'accoustic guitars', 'path': '/?Category=60&displaystyle=2'},
			{'name': 'electric guitars', 'path': '/?Category=51&displaystyle=2'},
			{'name': 'bass guitars', 'path': '/?Category=53&displaystyle=2'},
			{'name': 'mandoline and banjos', 'path': '/?Category=168&displaystyle=2'},
			{'name': 'ukulili', 'path': '/?Category=169&displaystyle=2'},
			{'name': 'amplifiers', 'path': '/?Category=105&displaystyle=2'},
			{'name': 'effects', 'path': '/?Category=63&displaystyle=2'},
			{'name': 'strings', 'path': '/?Category=65&displaystyle=2'},
			{'name': 'cases', 'path': '/?Category=170&displaystyle=2'},
			{'name': 'others', 'path': '/?Category=64&displaystyle=2'},
			{'name': 'pickups', 'path': '/?Category=66&displaystyle=2'},
		]
	},
}

var all_products = []   // this array will hold all the products mentioned in the categories
var parent_url = 'kley-zemer.co.il';
var desired_dom_attrs = {
	/*These are the attrs that represent a single product */
	'class': 'ProductDisplayStyle2'
}

function get_number(str){
	var price_regex = new RegExp('([0-9]+)', 'g');
	var found_number = str.replace(',', ''); // if the number has commas...
	try {
		found_number = price_regex.exec(found_number)[0];
	} catch (e) {
		found_number = null;
	}
	return found_number
}

function get_product_json(product_span, section, category) {
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
	} catch (e) {}

	return {
		'product-url': product_url,
		'img-url': product_img_url,
		'category': category.name,
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

function convert_relevant_product_doms_to_json(dom, section, category) {
	/*
	* This function will receive the whole page dom and start scanning it for relevant doms.
	* the relevant doms will be parsed and converted to json
	* */
	var children = dom.children
	for (var i in children) {

		if (children[i].name == 'span' && children[i].type == 'tag') {
			if (is_desired_dom(children[i])) {
				if(!all_products[section]){
					all_products[section] = {};
				}
				if(!all_products[section][category.name]){
					all_products[section][category.name] = [];
				}
				all_products[section][category.name].push(get_product_json(children[i], section, category));
			}
		} else {
			convert_relevant_product_doms_to_json(children[i], section, category);
		}

	}
}

function start_category_scan(section, category, page, callback) {
	/*
	* This function opens the category link and scan the page
	* if the callback is not null, it calls the callback in order to get the maximum page number.
	* the callback will call this method on the coming after pages.
	* */
	return new Promise(function (resolve, reject) {
		var options = {
			host: this.parent_url,
		}
		options.path = category.path + '&Page=' + page;
		var request = http.request(options, function (res) {
			var data = '';
			res.on('data', function (chunk) {
				data += chunk;
				//console.log('data:', data);
			});
			res.on('end', function () {
				var rawHtml = data;
				var handler = new htmlparser.DefaultHandler(function (error, dom) {
					if (!error) {
						for (var i in dom) {
							convert_relevant_product_doms_to_json(dom[i], section, category);
						}

					}
				});
				var parser = new htmlparser.Parser(handler);
				parser.parseComplete(rawHtml, category);
				if (callback != null) {
					callback(rawHtml, section, category).then(resolve).catch(reject)
				}else{
					resolve();
				}
			});
		});
		request.on('error', function (e) {
			// retry on failure
			start_category_scan(section, category, page, callback)
		});
		request.end();
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
		async_promises.push(start_category_scan(section, category, i, null));
	}
	return Promise.all(async_promises)
}

function get_pages_number_from_first_page(data, section, category) {
	var capture_num = false;
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
					var curr_pages = category.pages || 1
					category.pages = text && text > curr_pages ? text : curr_pages;
					capture_num = false
				}

			},
			onclosetag: function (tagname) {
				if (tagname === "body") {
					scan_category_pages(section, category, 2).then(resolve).catch(reject)
				}
			}
		}, {decodeEntities: true});
		parser.write(data);
		parser.end();
	});
}

/**
 * Crawl data for specific category. if category is null, then will scan all the categories
 * @param section_name the section name that referenece the category
 * @param category_name the category name to scan. if the category name is null then will scan all the categories under the section name
 * @param page the page number to scan. if the page number is undefined, then will start scanning from page = 1
 * @param get_all_data boolean parameter. if true, then will scan all the pages after page too. otherwise, will scan only the referenced page.
 * @returns {promise}
 */
function crawl_data(section_name, category_name, page, get_all_data){
	if(!section_name || ! section_name in categories){
		return null;
	}
	if (! page ){
		page = 1;
	}

	var async_promises = [];
	if(!category_name){
		// in this case we will scan all the categories of the section and return the represented data.
		for(var category_name in categories[section_name]){
			for (var i in categories[category_name].categories) {
				var category = categories[category_name].categories[i];
				async_promises.push(start_category_scan(section_name, category, page, get_all_data? get_pages_number_from_first_page: null));
			}
		}
	}
	return Promise.all(async_promises);
}

/***
 * this function will scan all the sections and save it to file named [section_name]_data.json.
 */
function scan_and_save(){
	var async_promises = []
	for(var section_name in categories){
		for (var i in categories[section_name].categories) {
			var category = categories[section_name].categories[i];
			async_promises.push(start_category_scan(section_name, category, 1, get_pages_number_from_first_page));
		}
	}
	Promise.all(async_promises).then(function() {
		// print stats
		for(var section_name in categories) {
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
	}, function(e) {
		console.log('error ', e)
	});
}

exports.parent_url = parent_url;
exports.categories = categories;
exports.scan_and_save = scan_and_save;
exports.crawl_data = crawl_data;
exports.desired_dom_attrs = desired_dom_attrs;