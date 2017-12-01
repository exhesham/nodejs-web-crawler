/**
 * Created by hishamy on 30/11/2017.
 */
var http = require('http');
var htmlparser = require("htmlparser");
var jsonfile = require('jsonfile')

var all_products = []   // this array will hold all the products mentioned in the categories

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


var desired_dom_attrs = {
	/*These are the attrs that represent a single product */
	'class': 'ProductDisplayStyle2'
}


function get_product_json(product_span, section, category) {
	/* receives a span that include the product details and return a json
	* */
	if (!product_span || !product_span.children) {
		return;
	}
	var product_url = product_span.children[1].attribs['onclick']
	var product_id = product_url.replace('location.href=\'product.asp?product=', '').replace("';", '')
	var subdoms = product_span.children[1].children
	var product_name = subdoms[1].raw

	var price_regex = new RegExp('([0-9]+)', 'g');

	var product_price1;
	var product_price2;
	var product_img_url;
	try {
		product_price1 = subdoms[7].children[1].children[0].data.replace(',', '');
	} catch (e) {}
	try {
		product_price2 = subdoms[9].children[1].children[0].data.replace(',', '');
	} catch (e) {}
	try {
		product_img_url = subdoms[3].children[1].children[1].children[1].children[0].attribs['src']
	} catch (e) {

	}
	try {
		product_price1 = price_regex.exec(product_price1)[0];
	} catch (e) {
		product_price1 = null
	}
	try {
		product_price2 = price_regex.exec(product_price2)[0];
	} catch (e) {
		product_price2 = null
	}
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
			host: 'kley-zemer.co.il',
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


function scan_category_pages(section, category, number) {
	if (!number) {
		number = 1
	}
	var async_promises = []

	for (var i = number; i < category.pages + 1; i++) {
		async_promises.push(start_category_scan(section, category, i, null));
	}
	return Promise.all(async_promises)
}

function get_pages_number_from_first_page(data, section, category) {
	var capture_num = false;

	var htmlparser = require("htmlparser2");
	return new Promise(function (resolve, reject) {
		var parser = new htmlparser.Parser({
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

var async_promises = []
for (var i in categories['guitars'].categories) {
	var category = categories['guitars'].categories[i];
	async_promises.push(start_category_scan('guitars', category, 1, get_pages_number_from_first_page));
}
Promise.all(async_promises).then(function() {

	for(var key in all_products['guitars']){
		console.log(key,':', all_products['guitars'][key].length)
	}
	var file = 'guitars_data.json'
	var obj = all_products['guitars']
	console.log('saving file', file)
	jsonfile.writeFile(file, obj, function (err) {
		console.error(err)
		console.log('finished saving file: ', file)
	})

}, function(e) {
	console.log('error ', e)
});