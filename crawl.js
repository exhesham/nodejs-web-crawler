/**
 * Created by exhesham on 30/11/2017.
 */
var http = require('http');
var htmlparser = require("htmlparser");
var htmlparser2 = require("htmlparser2");
var jsonfile = require('jsonfile');
var reqp = require('./request-promise');
var fs = require('fs');
var path = require('path');
const cheerio = require('cheerio');
var iconv = require('iconv-lite');


var categories = {
	"guitars": {
		"title": "Guitars",
		"path": "/?Section=2&displaystyle=2",

	},
	"sound": {
		"title": "DJ Equipment",
		"path": "/?Section=5&displaystyle=2",

	},
	"lightings": {
		"title": "Lightings",
		"path": "/?Section=30&displaystyle=2",

	},
	"pianos": {
		"title": "Keyboards",
		"path": "/?Section=16&displaystyle=2",

	},
	"drums": {
		"title": "Drums",
		"path": "/?Section=17&displaystyle=2",


	},
	"accordions-violens": {
		"title": "Bands & Orchestras",
		"path": "/?Section=18&displaystyle=2",

	},
	"wind-inst": {
		"title": "Wind Instruments",
		"path": "/?Section=7&displaystyle=2",

	},
	"accessories": {
		"title": "Accessories",
		"path": "/?Section=22&displaystyle=2",

	}
}
var all_products = {}   // this dict will hold all the products mentioned in the categories
var parent_url = 'kley-zemer.co.il';
var desired_dom_attrs = {
	/*These are the attrs that represent a single product */
	'class': 'ProductDisplayStyle2'
}

/***
 * used to extract a number from a string. replaces , with '' so the namber will not be splitted
 * @param str
 * @param default_val the default value in case the number was not found
 * @returns {*}
 */
function get_number(str, default_val) {
	var found_number = default_val;
	try {
		var price_regex = new RegExp('([0-9]+)', 'g');
		found_number = str.replace(',', ''); // if the number has commas...
		found_number = price_regex.exec(found_number)[0];
	} catch (e) {
		found_number = default_val;
	}
	return found_number
}

/***
 * filters the dom that contain relevant data to be crawled
 * @param dom
 * @returns {boolean}
 */
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

/***
 * This function will receive the whole page dom and start scanning it for relevant doms.
 * the relevant doms will be parsed and converted to json
 *
 * @param dom the do
 * @param section
 * @param category_key
 * @returns {Array}
 */
function convert_relevant_product_doms_to_json(dom, section, category_key) {
	/*
	* This function will receive the whole page dom and start scanning it for relevant doms.
	* the relevant doms will be parsed and converted to json
	* */
	function children_tostring(children) {
		var res = '';
		if (!children) {
			return res;
		}

		for (var i = 0; i < children.length; i++) {
			res += children[i].data ? children[i].data : '';
			res = res.trim();
		}
		return res;
	}

	var products = [];
	const $ = cheerio.load(dom);
	$('.ProductDisplayStyle2').each(function (i, elem) {

		// console.log($('.productPriceMarketTitle').text());
		// console.log($('.productPriceTitle').text());
		var product_url = $(this).find($("a img"))[0].parent.attribs['href'];
		var product_img_url = $(this).find($("a img"))[0].attribs['src'];
		var product_price1 = ' - ', product_price2 = ' - ', product_name = '';

		if ($(this).find($(".productPriceMarketTitle")).length != 0) {
			product_price1 = get_number(children_tostring($(this).find($(".productPriceMarketTitle"))[0].children), ' - ');
		}
		if ($(this).find($(".productPriceTitle")).length != 0) {
			product_price2 = get_number(children_tostring($(this).find($(".productPriceTitle"))[0].children), ' - ');
		}
		try {
			product_name = children_tostring($(this).find($(".ProductDisplayStyle2Name"))[0].children);
		} catch (e) {
			console.log('failed to get product name')
		}


		products.push({
			'product-url': product_url,
			'img-url': product_img_url,
			'category-key': category_key,
			'section': section,
			'name': product_name,
			'price-1': product_price1,
			'price-2': product_price2,
		});
	});
	return products;

}

/***
 * find out how many pages the section and the category page has - paging...
 * @param section
 * @param category_key
 * @returns {Promise}
 */
function get_pages_number_of_category(section, category_key) {
	function get_pages_number_from_first_page(data) {
		var res_num = 0;
		const $ = cheerio.load(data);
		$('a .paging').each(function (i, elem) {
			var curr_int = parseInt($(this).text().trim())
			res_num = res_num > curr_int ? res_num : curr_int;
		});

		return res_num;
	}
	return new Promise(function (resolve, reject) {
		var options = {
			host: parent_url,
			timeout: 30000,
			port: 80,
		}
		options.path = categories[section].categories[category_key].path;

		reqp.get(options).then(function (res) {
			var data = ''
			res.on('data', function (chunk) {
				data += iconv.decode(new Buffer(chunk), "Windows-1255");

			});
			res.on('end', function () {
				var res_num =get_pages_number_from_first_page(data);
				console.log('get_pages_number_from_first_page: found  ' + res_num + 'pages for: ' + section + '/' + category_key)
				resolve(res_num);

			});
		});
	});
}

/***
 * init category under a given section to empty array
 * @param section
 * @param category_key
 */
function init_setion_category(section, category_key) {
	if (!all_products[section]) {
		all_products[section] = {};
	}
	if (!all_products[section][category_key]) {
		all_products[section][category_key] = [];
	}
}

/***
 * This function opens the category_key link and scan the page
 * if the callback is not null, it calls the callback in order to get the maximum page number.
 * each time a page is scanned, all_products json is updated and saved to a file.
 * @param section
 * @param category_key
 * @param page the page number to start the scanning from
 * @param get_all_data scan all the pages
 * @returns {Promise}
 */
function start_category_scan(section, category_key, page, get_all_data) {

	return new Promise(function (resolve, reject) {

		if (get_all_data) {
			get_pages_number_of_category(section, category_key).then(function (total_pages) {

				var all_promises = [];
				for (var i = page; i < total_pages + 1; i++) {
					all_promises.push(start_category_scan(section, category_key, i, false))
				}
				Promise.all(all_promises).then(function (res) {
					save_json_to_file(all_products,'all_products.json')
					resolve(all_products[section][category_key]);
				}).catch(reject);
			});
		} else {
			var options = {
				host: parent_url,
				port: 80,
				timeout: 30000,
				encoding: null
			}

			options.path = categories[section].categories[category_key].path + '&Page=' + page;
			console.log('start_category_scan: handling: ', section,'/', category_key,' page: ' ,page)
			reqp.get(options).then(function (res) {
				var data = ''
				res.on('data', function (chunk) {
					data += iconv.decode(new Buffer(chunk), "Windows-1255");
				});
				res.on('end', function () {
					var res = convert_relevant_product_doms_to_json(data, section, category_key);

					init_setion_category(section, category_key); // if the json is not initialized then init it

					all_products[section][category_key] = all_products[section][category_key].concat(res);
					res['section'] = section
					res['category'] = category_key
					console.log('start_category_scan: finished: ' + section+ '/' + category_key + '/page: ' +page)
					resolve(res);

				});
			});
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


function save_json_to_file(json_value, filename) {
	filename = path.join(__dirname , filename);
	console.log('save_json_to_file: ' + filename)
	try {
		fs.unlinkSync(filename);
	} catch (e) {
		console.log('FAILED   deleting file', filename)
	}
	try {
		jsonfile.writeFile(filename, json_value, function (res) {
			console.log(res)
		})
	} catch (e) {
		console.log('FAILED   saving file', file)
	}
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
			if (!category_key) {
				resolve(all_products[section_name]);
			} else {
				var res = {};
				res[category_key] = all_products[section_name][category_key]
				resolve(res);
			}
		}).catch(reject);
	});
}

/***
 * this function receive an array of sections and an index in the array which indicates after which section to scan. it will scan each section and save it to a file
 * @param sections_arr array of sections
 * @param index index in the array to start from - needed as this is a recursive functgion
 */
function scan_and_save(sections_arr, index) {
	if (index + 1 == sections_arr.length) {
		return;
	}

	var section_name = sections_arr[index].section;
	crawl_data(section_name,null,1, true).then(function (value) {
		// save the results into file
		var file = section_name + '_data.json'
		save_json_to_file(value,file);
		index++;
		if(index < sections_arr.length){
			scan_and_save(sections_arr,index)
		}
	}).catch(function (reason) {
		console.log('err:', reason)
		index++;
		if(index < sections_arr.length){
			scan_and_save(sections_arr,index)
		}
	});
}

/***
 * this function will scan the index and sub-index (Categories) and then will create a json with the following format {section:[cat1:{}]}
 * @param callback
 */
function generate_categories_for_sections(callback) {
	/***
	 * create the categories of a given section
	 * @param section_name
	 * @returns {Promise}
	 */
	function get_section_manufacturers(section_name) {
		return new Promise(function (resolve, reject) {
			var options = {
				host: parent_url,
				port: 80,
				timeout: 30000,
				encoding: null
			}
			var section_categories = {};
			section_categories['section'] = section_name
			section_categories['categories'] = {};
			options.path = categories[section_name].path;

			reqp.get(options).then(function (res) {
				var data = ''
				var capture_num = false;

				res.on('data', function (chunk) {
					data += iconv.decode(new Buffer(chunk), "Windows-1255");
				});
				res.on('end', function () {
					const $ = cheerio.load(data);
					$('a.sidebarItem').each(function (i, elem) {
						var text = $(this).text();
						// text = iconv.decode(new Buffer(text), "Windows-1255")
						var href = $(this).attr('href')
						if (href) {
							href = href.replace('.?', '/?')
							section_categories['categories'][text] = {'name': text, 'path': href + '&displaystyle=2'};
						}
					});
					resolve(section_categories)
				});
			});
		});
	}

	var async_promises = []
	// the section names are taken from the categories array
	for (var section_name in categories) {
		async_promises.push(get_section_manufacturers(section_name));

	}
	Promise.all(async_promises).then(function (res) {
		var consentrated_cats = {}
		for (var i = 0; i < res.length; i++) {
			categories[res[i].section].categories = res[i].categories;
		}
		return callback ? callback(res) : null;
	}).catch(function (reason) {
		console.log(reason)
	});
}

exports.parent_url = parent_url;        // tested
exports.categories = categories;        // tested
exports.scan_and_save = scan_and_save;
exports.crawl_data = crawl_data;        // partially tested - testing for single category
exports.desired_dom_attrs = desired_dom_attrs;        // tested - covered by crawl_data
exports.get_pages_number_of_category = get_pages_number_of_category;


// this code snippet is enough to generate all the relevant data and save it to file all_products.json
generate_categories_for_sections(function (res) {
	// update categories under each section:
	var formated_sections = categories;
	for(var i=0;i< res.length;i++){
		formated_sections[res[i].section].categories = res[i].categories
	}
	categories = formated_sections
	// now save the cats to files
	scan_and_save(res,0)
})