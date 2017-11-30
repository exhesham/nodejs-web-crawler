/**
 * Created by hishamy on 30/11/2017.
 */
var http = require('http');
var htmlparser = require("htmlparser");


var all_products = []   // this array will hold all the products mentioned in the categories

var categories = {
	'guitars': {
		'path': '/?Section=2',
		'pages': 1,
		'categories': [
			{'name': 'classical guitars', 'path': '/?Category=59'},
			{'name': 'accoustic guitars', 'path': '/?Category=60'},
			{'name': 'electric guitars', 'path': '/?Category=51'},
			{'name': 'bass guitars', 'path': '/?Category=53'},
			{'name': 'mandoline and banjos', 'path': '/?Category=168'},
			{'name': 'ukulili', 'path': '/?Category=169'},
			{'name': 'amplifiers', 'path': '/?Category=105'},
			{'name': 'effects', 'path': '/?Category=63'},
			{'name': 'strings', 'path': '/?Category=65'},
			{'name': 'cases', 'path': '/?Category=170'},
			{'name': 'others', 'path': '/?Category=64'},
			{'name': 'pickups', 'path': '/?Category=66'},
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
	} catch (e) {
	}
	try {
		product_price2 = subdoms[9].children[1].children[0].data.replace(',', '');
	} catch (e) {
	}
	try {
		product_img_url = subdoms[3].children[1].children[1].children[1].children[0].attribs['src']
	} catch (e) {
	}
	try {
		product_price1 = price_regex.exec(product_price1)[0];
	} catch (e) {
	}
	try {
		product_price2 = price_regex.exec(product_price2)[0];
	} catch (e) {
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
				all_products.push(get_product_json(children[i], section, category));
			}
		} else {
			convert_relevant_product_doms_to_json(children[i], section, category);
		}

	}
}

function start_category(section, category, page, callback) {
	/*
	* This function opens the category link and scan the page
	* if the callback is not null, it calls the callback in order to get the maximum page number.
	* the callback will call this method on the coming after pages.
	* */
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
				callback(rawHtml, section, category)
			}
		});
	});
	request.on('error', function (e) {

		start_category(section, category, page, callback)
	});
	request.end();

}


function scan_category_pages(section, category, number) {
	if (!number) {
		number = 1
	}
	for (var i = number; i < category.pages + 1; i++) {
		start_category(section, category, i, null);
	}
}

function get_pages_number_from_first_page(data, section, category) {
	var capture_num = false;
	var pages = []
	var htmlparser = require("htmlparser2");
	var parser = new htmlparser.Parser({
		onopentag: function (name, attribs, a) {
			if (name === "span" && attribs.class.indexOf("paging OtherPage") > 0) {
				capture_num = true;
			}
		},
		ontext: function (text) {
			if (capture_num) {
				pages.push(text)
				var curr_pages = categories[section].categories[category].pages
				categories[section].categories[category].pages = text > curr_pages ? text : curr_pages;
				capture_num = false
			}

		},
		onclosetag: function (tagname) {
			if (tagname === "body") {
				scan_category_pages(section, category, 2)
			}
		}
	}, {decodeEntities: true});
	parser.write(data);
	parser.end();
}


for (var i in categories['guitars'].categories) {
	var category = categories['guitars'].categories[i];
	start_category('guitars', category, 1, get_pages_number_from_first_page)
}