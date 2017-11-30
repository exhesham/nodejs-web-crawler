/**
 * Created by hishamy on 30/11/2017.
 */

var http = require('http');
var htmlparser = require("htmlparser");
// var iconv = require('iconv');



var desired_dom_attrs = {
	'class': 'ProductDisplayStyle2'
}

var dom_to_json_attrs = [
	{
		'json-key': 'product-name',
		'dom-identifiers': {
			'class': ''
		}

	}
]

function get_product_json(product_span) {
	// receives a span that include the product details and return a json
	if(!product_span || !product_span.children){
		return;
	}
	var product_url = product_span.children[1].attribs['onclick']
	var product_id = product_url.replace('location.href=\'product.asp?product=','').replace("';",'')
	var subdoms = product_span.children[1].children
	var product_name = subdoms[1].raw

	var price_regex = new RegExp('([0-9]+)', 'g');

	var product_price1;
	var product_price2;
	var product_img_url;
	try{product_price1 = subdoms[7].children[1].children[0].data.replace(',','');}catch(e) {}
	try{product_price2= subdoms[9].children[1].children[0].data.replace(',','');}catch(e) {}
	try{product_img_url = subdoms[3].children[1].children[1].children[1].children[0].attribs['src']}catch(e) {}
	try{product_price1 = price_regex.exec(product_price1)[0];}catch(e) {}
	try{product_price2 = price_regex.exec(product_price2)[0];}catch(e) {}


	return {
		'product-url': product_url,
		'img-url': product_img_url,
		'id': product_id,
		'name': product_name,
		'price-1': product_price1,
		'price-2': product_price2,
	};


}

function is_desired_dom(dom) {
	if(!dom || !dom.attribs){
		return false;
	}
	for(var key in desired_dom_attrs){
		if(dom.attribs[key] != desired_dom_attrs[key]){
			return false;
		}
	}
	return true;
}

function scan_data(dom) {
    var children = dom.children
    for(var i in children){

        if(children[i].name == 'span' && children[i].type == 'tag'){
            if(is_desired_dom(children[i]) ){
				console.log(get_product_json(children[i]));
            }
        }else{
	        scan_data(children[i]);
        }

    }
}

function start_scanning(path,category, callback) {
	var options = {
		host: 'kley-zemer.co.il',
	}
	options.path = path;
	var request = http.request(options, function (res) {
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
			//console.log('data:', data);
		});
		res.on('end', function () {
			var rawHtml = data;
			var handler = new htmlparser.DefaultHandler(function (error, dom) {
				if (error){

				}else {

					for (var i in dom) {
						scan_data(dom[i]);
					}

				}
			});
			var parser = new htmlparser.Parser(handler);
			parser.parseComplete(rawHtml,category);
			if(callback != null){
				callback(rawHtml, category)
			}
		});
	});
	request.on('error', function (e) {

		start_scanning(path,category, callback)
	});
	request.end();
}

function scan_categories(){
	var options = {
		host: 'kley-zemer.co.il',
		headers: {'Content-Type':'text/html; Charset=Windows-1255'}
	}
	var request = http.request(options, function (res) {
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
			//console.log('data:', data);
		});
		res.on('end', function () {
			var rawHtml = data;//iconv.decode(data, "ISO-8859-6");;
			var capture_num = false;
			var pages = []
			var htmlparser = require("htmlparser2");
			var parser = new htmlparser.Parser({
				onopentag: function(name, attribs, a){
					if(name === "a" && attribs.class=='sidebarItem'){
						categories_ids[attribs.title] = {'path':attribs.href}
					}
				},onclosetag: function(tagname){
						if(tagname === "body"){
							console.log(categories_ids)
						}
					}
			},
				{decodeEntities: true});
			parser.write(data);
			parser.end(function () {
				console.log('pages', pages)
			});

		});
	});
	request.on('error', function (e) {

		start_scanning(path,category, callback)
	});
	request.end();
}
categories_ids = {

}
categories = {
	'guitars':{'path': '/?Section=2',
				'pages': 1,
				'categories':[
					{'name': 'classical guitars', 'path':'Category=59'},
					{'name': 'accoustic guitars', 'path':'Category=60'},
					{'name': 'electric guitars', 'path':'Category=51'},
					{'name': 'bass guitars', 'path':'Category=53'},
					{'name': 'mandoline and banjos', 'path':'Category=168'},
					{'name': 'ukulili', 'path':'Category=169'},
					{'name': 'amplifiers', 'path':'Category=105'},
					{'name': 'effects', 'path':'Category=63'},
					{'name': 'strings', 'path':'Category=65'},
					{'name': 'cases', 'path':'Category=170'},
					{'name': 'others', 'path':'Category=64'},
					{'name': 'pickups', 'path':'Category=66'},
				]
	},

}



function scan_category_pages(category, number) {
	if (!number){
		number = 1
	}
	for(var i = number;i< categories[category].pages+1;i++){
		start_scanning(categories[category].path+'&Page='+i,category,null);
	}
}

function get_pages_number_from_first_page(data, category){
	var capture_num = false;
	var pages = []
	var htmlparser = require("htmlparser2");
	var parser = new htmlparser.Parser({
		onopentag: function(name, attribs, a){
			if(name === "span" && attribs.class.indexOf("paging OtherPage")>0){
				capture_num = true;
			}
		},
		ontext: function(text){
			if(capture_num){
				pages.push(text)
				categories[category].pages = text > categories[category].pages? text: categories[category].pages
				capture_num = false
			}

		},
		onclosetag: function(tagname){
			if(tagname === "body"){
				scan_category_pages(category, 2)
			}
		}
	}, {decodeEntities: true});
	parser.write(data);
	parser.end();
}

//scan_categories()
//console.log(categories_ids)
start_scanning(categories['guitars'].path,'guitars',get_pages_number_from_first_page)