/**
 * Created by exhesham on 30/11/2017.
 */
var http = require('http');
var htmlparser = require("htmlparser");
var htmlparser2 = require("htmlparser2");
var jsonfile = require('jsonfile');
var reqp = require('./request-promise');

var categories = {
    "guitars": {
        "title": "Guitars",
        "path": "/?Section=2&displaystyle=2",
        "pages": 1,
        "categories": {
            "classical-guitars": {
                "name": "classical guitars",
                "path": "/?Category=59&displaystyle=2"
            },
            "accoustic-guitars": {
                "name": "accoustic guitars",
                "path": "/?Category=60&displaystyle=2"
            },
            "electric-guitars": {
                "name": "electric guitars",
                "path": "/?Category=51&displaystyle=2"
            },
            "bass-guitars": {
                "name": "bass guitars",
                "path": "/?Category=53&displaystyle=2"
            },
            "mandoline-guitars": {
                "name": "mandoline and banjos",
                "path": "/?Category=168&displaystyle=2"
            },
            "ukulili": {
                "name": "ukulili",
                "path": "/?Category=169&displaystyle=2"
            },
            "amplifiers": {
                "name": "amplifiers",
                "path": "/?Category=105&displaystyle=2"
            },
            "effects": {
                "name": "effects",
                "path": "/?Category=63&displaystyle=2"
            },
            "strings": {
                "name": "strings",
                "path": "/?Category=65&displaystyle=2"
            },
            "cases": {
                "name": "cases",
                "path": "/?Category=170&displaystyle=2"
            },
            "others": {
                "name": "others",
                "path": "/?Category=64&displaystyle=2"
            },
            "pickups": {
                "name": "pickups",
                "path": "/?Category=66&displaystyle=2"
            }
        },
        "manufactures": {
            "Yamaha": {
                "name": "Yamaha",
                "link": ".?manufacturer=92&Section=2&displaystyle=2"
            },
            "Fender": {
                "name": "Fender",
                "link": ".?manufacturer=94&Section=2&displaystyle=2"
            },
            "Gibson": {
                "name": "Gibson",
                "link": ".?manufacturer=95&Section=2&displaystyle=2"
            },
            "Ibanez": {
                "name": "Ibanez",
                "link": ".?manufacturer=96&Section=2&displaystyle=2"
            },
            "Admira": {
                "name": "Admira",
                "link": ".?manufacturer=124&Section=2&displaystyle=2"
            },
            "Breedlove": {
                "name": "Breedlove",
                "link": ".?manufacturer=129&Section=2&displaystyle=2"
            },
            "Epiphone": {
                "name": "Epiphone",
                "link": ".?manufacturer=99&Section=2&displaystyle=2"
            },
            "Blackstar": {
                "name": "Blackstar",
                "link": ".?manufacturer=221&Section=2&displaystyle=2"
            },
            "CNB": {
                "name": "CNB",
                "link": ".?manufacturer=200&Section=2&displaystyle=2"
            },
            "D'Addario": {
                "name": "D'Addario",
                "link": ".?manufacturer=177&Section=2&displaystyle=2"
            },
            "DigiTech": {
                "name": "DigiTech",
                "link": ".?manufacturer=137&Section=2&displaystyle=2"
            },
            "DV Mark": {
                "name": "DV Mark",
                "link": ".?manufacturer=236&Section=2&displaystyle=2"
            },
            "DOD": {
                "name": "DOD",
                "link": ".?manufacturer=138&Section=2&displaystyle=2"
            },
            "Dunlop": {
                "name": "Dunlop",
                "link": ".?manufacturer=119&Section=2&displaystyle=2"
            },
            "Elixir": {
                "name": "Elixir",
                "link": ".?manufacturer=179&Section=2&displaystyle=2"
            },
            "Alhambra": {
                "name": "Alhambra",
                "link": ".?manufacturer=126&Section=2&displaystyle=2"
            },
            "GHS Strings": {
                "name": "GHS Strings",
                "link": ".?manufacturer=180&Section=2&displaystyle=2"
            },
            "Gretsch": {
                "name": "Gretsch",
                "link": ".?manufacturer=98&Section=2&displaystyle=2"
            },
            "Hartke": {
                "name": "Hartke",
                "link": ".?manufacturer=132&Section=2&displaystyle=2"
            },
            "Hercules Stands": {
                "name": "Hercules Stands",
                "link": ".?manufacturer=115&Section=2&displaystyle=2"
            },
            "Hannabach": {
                "name": "Hannabach",
                "link": ".?manufacturer=199&Section=2&displaystyle=2"
            },
            "Hohner": {
                "name": "Hohner",
                "link": ".?manufacturer=120&Section=2&displaystyle=2"
            },
            "Jackson": {
                "name": "Jackson",
                "link": ".?manufacturer=97&Section=2&displaystyle=2"
            },
            "Kapok": {
                "name": "Kapok",
                "link": ".?manufacturer=228&Section=2&displaystyle=2"
            },
            "Labella": {
                "name": "Labella",
                "link": ".?manufacturer=214&Section=2&displaystyle=2"
            },
            "LR Baggs": {
                "name": "LR Baggs",
                "link": ".?manufacturer=203&Section=2&displaystyle=2"
            },
            "Markbass": {
                "name": "Markbass",
                "link": ".?manufacturer=209&Section=2&displaystyle=2"
            },
            "ModTone": {
                "name": "ModTone",
                "link": ".?manufacturer=136&Section=2&displaystyle=2"
            },
            "Platinum": {
                "name": "Platinum",
                "link": ".?manufacturer=114&Section=2&displaystyle=2"
            },
            "Kyser": {
                "name": "Kyser",
                "link": ".?manufacturer=205&Section=2&displaystyle=2"
            },
            "QuikLok": {
                "name": "QuikLok",
                "link": ".?manufacturer=116&Section=2&displaystyle=2"
            },
            "Rockson": {
                "name": "Rockson",
                "link": ".?manufacturer=246&Section=2&displaystyle=2"
            },
            "Samson": {
                "name": "Samson",
                "link": ".?manufacturer=150&Section=2&displaystyle=2"
            },
            "Squier by Fender": {
                "name": "Squier by Fender",
                "link": ".?manufacturer=100&Section=2&displaystyle=2"
            },
            "Steinbach": {
                "name": "Steinbach",
                "link": ".?manufacturer=101&Section=2&displaystyle=2"
            },
            "Takamine": {
                "name": "Takamine",
                "link": ".?manufacturer=125&Section=2&displaystyle=2"
            },
            "Taylor": {
                "name": "Taylor",
                "link": ".?manufacturer=130&Section=2&displaystyle=2"
            },
            "Wittner": {
                "name": "Wittner",
                "link": ".?manufacturer=113&Section=2&displaystyle=2"
            },
            "Zoom": {
                "name": "Zoom",
                "link": ".?manufacturer=135&Section=2&displaystyle=2"
            },
            "Gator": {
                "name": "Gator",
                "link": ".?manufacturer=144&Section=2&displaystyle=2"
            },
            "Gibraltar": {
                "name": "Gibraltar",
                "link": ".?manufacturer=193&Section=2&displaystyle=2"
            },
            "Kirlin Cable": {
                "name": "Kirlin Cable",
                "link": ".?manufacturer=223&Section=2&displaystyle=2"
            },
            "��� ����� ��� ���": {
                "name": "��� ����� ��� ���",
                "link": ".?manufacturer=192&Section=2&displaystyle=2"
            },
            "Augustine": {
                "name": "Augustine",
                "link": ".?manufacturer=207&Section=2&displaystyle=2"
            },
            "EVH": {
                "name": "EVH",
                "link": ".?manufacturer=232&Section=2&displaystyle=2"
            }
        }
    },
    "sound": {
        "title": "DJ Equipment",
        "path": "/?Section=5&displaystyle=2",
        "pages": 1,
        "categories": {
            "speakers": {
                "name": "Speakers",
                "path": "/?Category=147&displaystyle=2"
            },
            "monitors": {
                "name": "Monitors",
                "path": "/?Category=140&displaystyle=2"
            },
            "mobile-amp-systems": {
                "name": "Mobile Amps",
                "path": "/?Category=146&displaystyle=2"
            },
            "install-systems": {
                "name": "Fixed Install",
                "path": "/?Category=173&displaystyle=2"
            },
            "dj-accessories": {
                "name": "DJ Accessories",
                "path": "/?Category=118&displaystyle=2"
            },
            "amplifiers": {
                "name": "Amplifiers",
                "path": "/?Category=145&displaystyle=2"
            },
            "mixers": {
                "name": "Mixers",
                "path": "/?Category=144&displaystyle=2"
            },
            "performance-processors": {
                "name": "Performance Processor",
                "path": "/?Category=143&displaystyle=2"
            },
            "tube-preamp": {
                "name": "Tube Preamplifier",
                "path": "/?Category=142&displaystyle=2"
            },
            "audio": {
                "name": " ������ ��� ������ �����",
                "path": "/?Category=139&displaystyle=2"
            },
            "headphones": {
                "name": "�������",
                "path": "/?Category=149&displaystyle=2"
            },
            "mobile-sp": {
                "name": "������ ������",
                "path": "/?Category=176&displaystyle=2"
            },
            "mics": {
                "name": "  ����������",
                "path": "/?Category=121&displaystyle=2"
            },
            "mobile-rec": {
                "name": " ������ ����� ������",
                "path": "/?Category=141&displaystyle=2"
            },
            "cat172": {
                "name": "  ���� ���� ���� �������",
                "path": "/?Category=172&displaystyle=2"
            },
            "accessories": {
                "name": " ������� ����� ����� �����",
                "path": "/?Category=148&displaystyle=2"
            },
            "stands": {
                "name": " ������ ������� ��� ����� �����",
                "path": "/?Category=123&displaystyle=2"
            },
            "books": {
                "name": "  ���� ����� ������� ��",
                "path": "/?Category=158&displaystyle=2"
            },
            "accoustics": {
                "name": "  ��������",
                "path": "/?Category=152&displaystyle=2"
            }
        },
        "manufactures": {
            "Yamaha": {
                "name": "Yamaha",
                "link": ".?manufacturer=92&Section=5&displaystyle=2"
            },
            "Apogee": {
                "name": "Apogee",
                "link": ".?manufacturer=234&Section=5&displaystyle=2"
            },
            "Fender": {
                "name": "Fender",
                "link": ".?manufacturer=94&Section=5&displaystyle=2"
            },
            "JBL Professional": {
                "name": "JBL Professional",
                "link": ".?manufacturer=102&Section=5&displaystyle=2"
            },
            "dbx": {
                "name": "dbx",
                "link": ".?manufacturer=157&Section=5&displaystyle=2"
            },
            "BSS": {
                "name": "BSS",
                "link": ".?manufacturer=158&Section=5&displaystyle=2"
            },
            "Alesis": {
                "name": "Alesis",
                "link": ".?manufacturer=152&Section=5&displaystyle=2"
            },
            "AKG": {
                "name": "AKG",
                "link": ".?manufacturer=153&Section=5&displaystyle=2"
            },
            "Soundcraft": {
                "name": "Soundcraft",
                "link": ".?manufacturer=149&Section=5&displaystyle=2"
            },
            "Numark": {
                "name": "Numark",
                "link": ".?manufacturer=148&Section=5&displaystyle=2"
            },
            "JBL": {
                "name": "JBL",
                "link": ".?manufacturer=231&Section=5&displaystyle=2"
            },
            "Gemini": {
                "name": "Gemini",
                "link": ".?manufacturer=147&Section=5&displaystyle=2"
            },
            "Hercules Stands": {
                "name": "Hercules Stands",
                "link": ".?manufacturer=115&Section=5&displaystyle=2"
            },
            "Lexicon Pro": {
                "name": "Lexicon Pro",
                "link": ".?manufacturer=154&Section=5&displaystyle=2"
            },
            "Maxtone": {
                "name": "Maxtone",
                "link": ".?manufacturer=104&Section=5&displaystyle=2"
            },
            "Platinum": {
                "name": "Platinum",
                "link": ".?manufacturer=114&Section=5&displaystyle=2"
            },
            "Presonus": {
                "name": "Presonus",
                "link": ".?manufacturer=155&Section=5&displaystyle=2"
            },
            "KZPRO": {
                "name": "KZPRO",
                "link": ".?manufacturer=249&Section=5&displaystyle=2"
            },
            "QuikLok": {
                "name": "QuikLok",
                "link": ".?manufacturer=116&Section=5&displaystyle=2"
            },
            "Samson": {
                "name": "Samson",
                "link": ".?manufacturer=150&Section=5&displaystyle=2"
            },
            "Zoom": {
                "name": "Zoom",
                "link": ".?manufacturer=135&Section=5&displaystyle=2"
            },
            "Gator": {
                "name": "Gator",
                "link": ".?manufacturer=144&Section=5&displaystyle=2"
            },
            "��� ����� ��� ���": {
                "name": "��� ����� ��� ���",
                "link": ".?manufacturer=192&Section=5&displaystyle=2"
            },
            "��� �����": {
                "name": "��� �����",
                "link": ".?manufacturer=191&Section=5&displaystyle=2"
            },
            "Soundking": {
                "name": "Soundking",
                "link": ".?manufacturer=233&Section=5&displaystyle=2"
            },
            "Tascam": {
                "name": "Tascam",
                "link": ".?manufacturer=235&Section=5&displaystyle=2"
            }
        }
    },
    "lightings": {
        "title": "Lightings",
        "path": "/?Section=30&displaystyle=2",
        "pages": 1,
        "categories": {
            "stage-dj": {
                "name": "Stage & DJ",
                "path": "/?Category=162&displaystyle=2"
            },
            "smoke-haze": {
                "name": "Haze & Smoke machines",
                "path": "/?Category=164&displaystyle=2"
            },
            "dmx": {
                "name": "DMX controller",
                "path": "/?Category=165&displaystyle=2"
            }
        },
        "manufactures": {
            "Chauvet": {
                "name": "Chauvet",
                "link": ".?manufacturer=230&Section=30&displaystyle=2"
            }
        }
    },
    "pianos": {
        "title": "Keyboards",
        "path": "/?Section=16&displaystyle=2",
        "pages": 1,
        "categories": {
            "stand pianos": {
                "name": "Stand Pianos",
                "path": "/?Category=70&displaystyle=2"
            },
            "synth": {
                "name": "Synthesizers",
                "path": "/?Category=124&displaystyle=2"
            },
            "elec-piano": {
                "name": "Electric Pianos",
                "path": "/?Category=74&displaystyle=2"
            },
            "master-keyboard": {
                "name": "Master Keyboard",
                "path": "/?Category=73&displaystyle=2"
            },
            "drum-machine": {
                "name": "Drum Machine",
                "path": "/?Category=125&displaystyle=2"
            },
            "accessories": {
                "name": "Accessories",
                "path": "/?Category=76&displaystyle=2"
            }
        },
        "manufactures": {
            "Yamaha": {
                "name": "Yamaha",
                "link": ".?manufacturer=92&Section=16&displaystyle=2"
            },
            "Alesis": {
                "name": "Alesis",
                "link": ".?manufacturer=152&Section=16&displaystyle=2"
            },
            "Casio": {
                "name": "Casio",
                "link": ".?manufacturer=227&Section=16&displaystyle=2"
            },
            "Discacciati": {
                "name": "Discacciati",
                "link": ".?manufacturer=178&Section=16&displaystyle=2"
            },
            "Hercules Stands": {
                "name": "Hercules Stands",
                "link": ".?manufacturer=115&Section=16&displaystyle=2"
            },
            "Miditech": {
                "name": "Miditech",
                "link": ".?manufacturer=212&Section=16&displaystyle=2"
            },
            "QuikLok": {
                "name": "QuikLok",
                "link": ".?manufacturer=116&Section=16&displaystyle=2"
            },
            "Samson": {
                "name": "Samson",
                "link": ".?manufacturer=150&Section=16&displaystyle=2"
            },
            "Gator": {
                "name": "Gator",
                "link": ".?manufacturer=144&Section=16&displaystyle=2"
            },
            "Kirlin Cable": {
                "name": "Kirlin Cable",
                "link": ".?manufacturer=223&Section=16&displaystyle=2"
            }
        }
    },
    "drums": {
        "title": "Drums",
        "path": "/?Section=17&displaystyle=2",
        "pages": 1,
        "categories": {},
        "manufactures": {
            "Yamaha": {
                "name": "Yamaha",
                "link": ".?manufacturer=92&Section=17&displaystyle=2"
            },
            "Tama": {
                "name": "Tama",
                "link": ".?manufacturer=169&Section=17&displaystyle=2"
            },
            "LP - Latin Percussion": {
                "name": "LP - Latin Percussion",
                "link": ".?manufacturer=106&Section=17&displaystyle=2"
            },
            "Alesis": {
                "name": "Alesis",
                "link": ".?manufacturer=152&Section=17&displaystyle=2"
            },
            "Mapex": {
                "name": "Mapex",
                "link": ".?manufacturer=170&Section=17&displaystyle=2"
            },
            "CNB": {
                "name": "CNB",
                "link": ".?manufacturer=200&Section=17&displaystyle=2"
            },
            "Gitre": {
                "name": "Gitre",
                "link": ".?manufacturer=167&Section=17&displaystyle=2"
            },
            "HQ percussion": {
                "name": "HQ percussion",
                "link": ".?manufacturer=213&Section=17&displaystyle=2"
            },
            "Linko": {
                "name": "Linko",
                "link": ".?manufacturer=105&Section=17&displaystyle=2"
            },
            "Masterwork": {
                "name": "Masterwork",
                "link": ".?manufacturer=168&Section=17&displaystyle=2"
            },
            "Maxtone": {
                "name": "Maxtone",
                "link": ".?manufacturer=104&Section=17&displaystyle=2"
            },
            "Parrot": {
                "name": "Parrot",
                "link": ".?manufacturer=103&Section=17&displaystyle=2"
            },
            "Samson": {
                "name": "Samson",
                "link": ".?manufacturer=150&Section=17&displaystyle=2"
            },
            "Toca Percussion": {
                "name": "Toca Percussion",
                "link": ".?manufacturer=222&Section=17&displaystyle=2"
            },
            "Vic Firth": {
                "name": "Vic Firth",
                "link": ".?manufacturer=189&Section=17&displaystyle=2"
            },
            "Zildjian": {
                "name": "Zildjian",
                "link": ".?manufacturer=171&Section=17&displaystyle=2"
            },
            "Gibraltar": {
                "name": "Gibraltar",
                "link": ".?manufacturer=193&Section=17&displaystyle=2"
            },
            "Remo": {
                "name": "Remo",
                "link": ".?manufacturer=208&Section=17&displaystyle=2"
            }
        }
    },
    "accordions-violens": {
        "title": "Bands & Orchestras",
        "path": "/?Section=18&displaystyle=2",
        "pages": 1,
        "categories": {},
        "manufactures": {
            "Cremona": {
                "name": "Cremona",
                "link": ".?manufacturer=146&Section=18&displaystyle=2"
            },
            "D'Addario": {
                "name": "D'Addario",
                "link": ".?manufacturer=177&Section=18&displaystyle=2"
            },
            "Hercules Stands": {
                "name": "Hercules Stands",
                "link": ".?manufacturer=115&Section=18&displaystyle=2"
            },
            "Hofner": {
                "name": "Hofner",
                "link": ".?manufacturer=131&Section=18&displaystyle=2"
            },
            "Hohner": {
                "name": "Hohner",
                "link": ".?manufacturer=120&Section=18&displaystyle=2"
            },
            "Steinbach": {
                "name": "Steinbach",
                "link": ".?manufacturer=101&Section=18&displaystyle=2"
            },
            "Valencia": {
                "name": "Valencia",
                "link": ".?manufacturer=122&Section=18&displaystyle=2"
            },
            "Franco Marcelli": {
                "name": "Franco Marcelli",
                "link": ".?manufacturer=216&Section=18&displaystyle=2"
            }
        }
    },
    "wind-inst": {
        "title": "Wind Instruments",
        "path": "/?Section=7&displaystyle=2",
        "pages": 1,
        "categories": {},
        "manufactures": {
            "Yamaha": {
                "name": "Yamaha",
                "link": ".?manufacturer=92&Section=7&displaystyle=2"
            },
            "Hercules Stands": {
                "name": "Hercules Stands",
                "link": ".?manufacturer=115&Section=7&displaystyle=2"
            },
            "Hohner": {
                "name": "Hohner",
                "link": ".?manufacturer=120&Section=7&displaystyle=2"
            },
            "Jupiter": {
                "name": "Jupiter",
                "link": ".?manufacturer=140&Section=7&displaystyle=2"
            },
            "BG France": {
                "name": "BG France",
                "link": ".?manufacturer=175&Section=7&displaystyle=2"
            },
            "Rico": {
                "name": "Rico",
                "link": ".?manufacturer=183&Section=7&displaystyle=2"
            },
            "Swan": {
                "name": "Swan",
                "link": ".?manufacturer=107&Section=7&displaystyle=2"
            },
            "��� ����� ��� ���": {
                "name": "��� ����� ��� ���",
                "link": ".?manufacturer=192&Section=7&displaystyle=2"
            },
            "Aulos": {
                "name": "Aulos",
                "link": ".?manufacturer=143&Section=7&displaystyle=2"
            },
            "Al Cass": {
                "name": "Al Cass",
                "link": ".?manufacturer=219&Section=7&displaystyle=2"
            }
        }
    },
    "accessories": {
        "title": "Accessories",
        "path": "/?Section=22&displaystyle=2",
        "pages": 1,
        "categories": {},
        "manufactures": {
            "Fender": {
                "name": "Fender",
                "link": ".?manufacturer=94&Section=22&displaystyle=2"
            },
            "Ibanez": {
                "name": "Ibanez",
                "link": ".?manufacturer=96&Section=22&displaystyle=2"
            },
            "Dunlop": {
                "name": "Dunlop",
                "link": ".?manufacturer=119&Section=22&displaystyle=2"
            },
            "Hercules Stands": {
                "name": "Hercules Stands",
                "link": ".?manufacturer=115&Section=22&displaystyle=2"
            },
            "Platinum": {
                "name": "Platinum",
                "link": ".?manufacturer=114&Section=22&displaystyle=2"
            },
            "QuikLok": {
                "name": "QuikLok",
                "link": ".?manufacturer=116&Section=22&displaystyle=2"
            },
            "Samson": {
                "name": "Samson",
                "link": ".?manufacturer=150&Section=22&displaystyle=2"
            },
            "Wittner": {
                "name": "Wittner",
                "link": ".?manufacturer=113&Section=22&displaystyle=2"
            },
            "Mahalo": {
                "name": "Mahalo",
                "link": ".?manufacturer=206&Section=22&displaystyle=2"
            }
        }
    }
}

var all_products = {}   // this dict will hold all the products mentioned in the categories
var parent_url = 'kley-zemer.co.il';
var desired_dom_attrs = {
	/*These are the attrs that represent a single product */
	'class': 'ProductDisplayStyle2'
}

function get_number(str,default_val) {
	var price_regex = new RegExp('([0-9]+)', 'g');
	var found_number = str.replace(',', ''); // if the number has commas...
	try {
		found_number = price_regex.exec(found_number)[0];
	} catch (e) {
		found_number = default_val;
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
	var product_price1 = get_number(subdoms[7].children[1].children[0].data, ' - ')
	var product_price2 = get_number(subdoms[9].children[1].children[0].data, ' - ')
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
			console.log(category_key)
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
		for (var category in categories[section_name].categories) {

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

function generate_categories_for_sections(){
    function get_section_manufacturers(section_name){
        return new Promise(function (resolve, reject) {
            var options = {
                host: parent_url,
                port: 80,
            }
            var section_categories= {};
            options.path = categories[section_name].path;

            reqp.get(options).then(function(res) {
                var data = ''
                var capture_num = false;
                var href = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    var parser = new htmlparser2.Parser({
                        onopentag: function (name, attribs, a) {
                            if (name === "a" && attribs.xclass && attribs.xclass.indexOf("sidebarItem") >= 0) {
                                href = attribs.href + '&displaystyle=2'
                                capture_num = true;
                            }
                        },
                        ontext: function (text) {
                            if (capture_num) {
                                section_categories[text] = {'name':text,'link':href}
                                capture_num = false
                            }

                        },
                        onclosetag: function (tagname) {
                            if (tagname === "body") {
                                categories[section_name].manufactures = section_categories;
                                resolve(section_categories);
                                // store category


                            }
                        }
                    }, {decodeEntities: true});
                    parser.write(data);
                    parser.end();

                });
            });
        });
    }
    var async_promises = []
    for (var section_name in categories) {
            async_promises.push(get_section_manufacturers(section_name));

    }
    return Promise.all(async_promises);
}
// scan_and_save()
generate_categories_for_sections().then(function () {
	console.dir(categories)
})
exports.parent_url = parent_url;        // tested
exports.categories = categories;        // tested
exports.scan_and_save = scan_and_save;
exports.crawl_data = crawl_data;        // partially tested - testing for single category
exports.desired_dom_attrs = desired_dom_attrs;        // tested - covered by crawl_data
exports.get_pages_number_of_category = get_pages_number_of_category;
