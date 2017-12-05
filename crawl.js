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
                "path": "/?manufacturer=92&Section=2&displaystyle=2"
            },
            "Fender": {
                "name": "Fender",
                "path": "/?manufacturer=94&Section=2&displaystyle=2"
            },
            "Gibson": {
                "name": "Gibson",
                "path": "/?manufacturer=95&Section=2&displaystyle=2"
            },
            "Ibanez": {
                "name": "Ibanez",
                "path": "/?manufacturer=96&Section=2&displaystyle=2"
            },
            "Admira": {
                "name": "Admira",
                "path": "/?manufacturer=124&Section=2&displaystyle=2"
            },
            "Breedlove": {
                "name": "Breedlove",
                "path": "/?manufacturer=129&Section=2&displaystyle=2"
            },
            "Epiphone": {
                "name": "Epiphone",
                "path": "/?manufacturer=99&Section=2&displaystyle=2"
            },
            "Blackstar": {
                "name": "Blackstar",
                "path": "/?manufacturer=221&Section=2&displaystyle=2"
            },
            "CNB": {
                "name": "CNB",
                "path": "/?manufacturer=200&Section=2&displaystyle=2"
            },
            "D'Addario": {
                "name": "D'Addario",
                "path": "/?manufacturer=177&Section=2&displaystyle=2"
            },
            "DigiTech": {
                "name": "DigiTech",
                "path": "/?manufacturer=137&Section=2&displaystyle=2"
            },
            "DV Mark": {
                "name": "DV Mark",
                "path": "/?manufacturer=236&Section=2&displaystyle=2"
            },
            "DOD": {
                "name": "DOD",
                "path": "/?manufacturer=138&Section=2&displaystyle=2"
            },
            "Dunlop": {
                "name": "Dunlop",
                "path": "/?manufacturer=119&Section=2&displaystyle=2"
            },
            "Elixir": {
                "name": "Elixir",
                "path": "/?manufacturer=179&Section=2&displaystyle=2"
            },
            "Alhambra": {
                "name": "Alhambra",
                "path": "/?manufacturer=126&Section=2&displaystyle=2"
            },
            "GHS Strings": {
                "name": "GHS Strings",
                "path": "/?manufacturer=180&Section=2&displaystyle=2"
            },
            "Gretsch": {
                "name": "Gretsch",
                "path": "/?manufacturer=98&Section=2&displaystyle=2"
            },
            "Hartke": {
                "name": "Hartke",
                "path": "/?manufacturer=132&Section=2&displaystyle=2"
            },
            "Hercules Stands": {
                "name": "Hercules Stands",
                "path": "/?manufacturer=115&Section=2&displaystyle=2"
            },
            "Hannabach": {
                "name": "Hannabach",
                "path": "/?manufacturer=199&Section=2&displaystyle=2"
            },
            "Hohner": {
                "name": "Hohner",
                "path": "/?manufacturer=120&Section=2&displaystyle=2"
            },
            "Jackson": {
                "name": "Jackson",
                "path": "/?manufacturer=97&Section=2&displaystyle=2"
            },
            "Kapok": {
                "name": "Kapok",
                "path": "/?manufacturer=228&Section=2&displaystyle=2"
            },
            "Labella": {
                "name": "Labella",
                "path": "/?manufacturer=214&Section=2&displaystyle=2"
            },
            "LR Baggs": {
                "name": "LR Baggs",
                "path": "/?manufacturer=203&Section=2&displaystyle=2"
            },
            "Markbass": {
                "name": "Markbass",
                "path": "/?manufacturer=209&Section=2&displaystyle=2"
            },
            "ModTone": {
                "name": "ModTone",
                "path": "/?manufacturer=136&Section=2&displaystyle=2"
            },
            "Platinum": {
                "name": "Platinum",
                "path": "/?manufacturer=114&Section=2&displaystyle=2"
            },
            "Kyser": {
                "name": "Kyser",
                "path": "/?manufacturer=205&Section=2&displaystyle=2"
            },
            "QuikLok": {
                "name": "QuikLok",
                "path": "/?manufacturer=116&Section=2&displaystyle=2"
            },
            "Rockson": {
                "name": "Rockson",
                "path": "/?manufacturer=246&Section=2&displaystyle=2"
            },
            "Samson": {
                "name": "Samson",
                "path": "/?manufacturer=150&Section=2&displaystyle=2"
            },
            "Squier by Fender": {
                "name": "Squier by Fender",
                "path": "/?manufacturer=100&Section=2&displaystyle=2"
            },
            "Steinbach": {
                "name": "Steinbach",
                "path": "/?manufacturer=101&Section=2&displaystyle=2"
            },
            "Takamine": {
                "name": "Takamine",
                "path": "/?manufacturer=125&Section=2&displaystyle=2"
            },
            "Taylor": {
                "name": "Taylor",
                "path": "/?manufacturer=130&Section=2&displaystyle=2"
            },
            "Wittner": {
                "name": "Wittner",
                "path": "/?manufacturer=113&Section=2&displaystyle=2"
            },
            "Zoom": {
                "name": "Zoom",
                "path": "/?manufacturer=135&Section=2&displaystyle=2"
            },
            "Gator": {
                "name": "Gator",
                "path": "/?manufacturer=144&Section=2&displaystyle=2"
            },
            "Gibraltar": {
                "name": "Gibraltar",
                "path": "/?manufacturer=193&Section=2&displaystyle=2"
            },
            "Kirlin Cable": {
                "name": "Kirlin Cable",
                "path": "/?manufacturer=223&Section=2&displaystyle=2"
            },
            "��� ����� ��� ���": {
                "name": "��� ����� ��� ���",
                "path": "/?manufacturer=192&Section=2&displaystyle=2"
            },
            "Augustine": {
                "name": "Augustine",
                "path": "/?manufacturer=207&Section=2&displaystyle=2"
            },
            "EVH": {
                "name": "EVH",
                "path": "/?manufacturer=232&Section=2&displaystyle=2"
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

            "accoustics": {
                "name": "  ��������",
                "path": "/?Category=152&displaystyle=2"
            }
        },
        "manufactures": {
            "Yamaha": {
                "name": "Yamaha",
                "path": "/?manufacturer=92&Section=5&displaystyle=2"
            },
            "Apogee": {
                "name": "Apogee",
                "path": "/?manufacturer=234&Section=5&displaystyle=2"
            },
            "Fender": {
                "name": "Fender",
                "path": "/?manufacturer=94&Section=5&displaystyle=2"
            },
            "JBL Professional": {
                "name": "JBL Professional",
                "path": "/?manufacturer=102&Section=5&displaystyle=2"
            },
            "dbx": {
                "name": "dbx",
                "path": "/?manufacturer=157&Section=5&displaystyle=2"
            },
            "BSS": {
                "name": "BSS",
                "path": "/?manufacturer=158&Section=5&displaystyle=2"
            },
            "Alesis": {
                "name": "Alesis",
                "path": "/?manufacturer=152&Section=5&displaystyle=2"
            },
            "AKG": {
                "name": "AKG",
                "path": "/?manufacturer=153&Section=5&displaystyle=2"
            },
            "Soundcraft": {
                "name": "Soundcraft",
                "path": "/?manufacturer=149&Section=5&displaystyle=2"
            },
            "Numark": {
                "name": "Numark",
                "path": "/?manufacturer=148&Section=5&displaystyle=2"
            },
            "JBL": {
                "name": "JBL",
                "path": "/?manufacturer=231&Section=5&displaystyle=2"
            },
            "Gemini": {
                "name": "Gemini",
                "path": "/?manufacturer=147&Section=5&displaystyle=2"
            },
            "Hercules Stands": {
                "name": "Hercules Stands",
                "path": "/?manufacturer=115&Section=5&displaystyle=2"
            },
            "Lexicon Pro": {
                "name": "Lexicon Pro",
                "path": "/?manufacturer=154&Section=5&displaystyle=2"
            },
            "Maxtone": {
                "name": "Maxtone",
                "path": "/?manufacturer=104&Section=5&displaystyle=2"
            },
            "Platinum": {
                "name": "Platinum",
                "path": "/?manufacturer=114&Section=5&displaystyle=2"
            },
            "Presonus": {
                "name": "Presonus",
                "path": "/?manufacturer=155&Section=5&displaystyle=2"
            },
            "KZPRO": {
                "name": "KZPRO",
                "path": "/?manufacturer=249&Section=5&displaystyle=2"
            },
            "QuikLok": {
                "name": "QuikLok",
                "path": "/?manufacturer=116&Section=5&displaystyle=2"
            },
            "Samson": {
                "name": "Samson",
                "path": "/?manufacturer=150&Section=5&displaystyle=2"
            },
            "Zoom": {
                "name": "Zoom",
                "path": "/?manufacturer=135&Section=5&displaystyle=2"
            },
            "Gator": {
                "name": "Gator",
                "path": "/?manufacturer=144&Section=5&displaystyle=2"
            },
            "��� ����� ��� ���": {
                "name": "��� ����� ��� ���",
                "path": "/?manufacturer=192&Section=5&displaystyle=2"
            },
            "��� �����": {
                "name": "��� �����",
                "path": "/?manufacturer=191&Section=5&displaystyle=2"
            },
            "Soundking": {
                "name": "Soundking",
                "path": "/?manufacturer=233&Section=5&displaystyle=2"
            },
            "Tascam": {
                "name": "Tascam",
                "path": "/?manufacturer=235&Section=5&displaystyle=2"
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
                "path": "/?manufacturer=230&Section=30&displaystyle=2"
            }
        }
    },
    "pianos": {
        "title": "Keyboards",
        "path": "/?Section=16&displaystyle=2",
        "pages": 1,
        // "categories": {
        //     "stand pianos": {
        //         "name": "Stand Pianos",
        //         "path": "/?Category=70&displaystyle=2"
        //     },
        //     "synth": {
        //         "name": "Synthesizers",
        //         "path": "/?Category=124&displaystyle=2"
        //     },
        //     "elec-piano": {
        //         "name": "Electric Pianos",
        //         "path": "/?Category=74&displaystyle=2"
        //     },
        //     "master-keyboard": {
        //         "name": "Master Keyboard",
        //         "path": "/?Category=73&displaystyle=2"
        //     },
        //     "drum-machine": {
        //         "name": "Drum Machine",
        //         "path": "/?Category=125&displaystyle=2"
        //     },
        //     "accessories": {
        //         "name": "Accessories",
        //         "path": "/?Category=76&displaystyle=2"
        //     }
        // },
        "categories": {
            "Yamaha": {
                "name": "Yamaha",
                "path": "/?manufacturer=92&Section=16&displaystyle=2"
            },
            "Alesis": {
                "name": "Alesis",
                "path": "/?manufacturer=152&Section=16&displaystyle=2"
            },
            "Casio": {
                "name": "Casio",
                "path": "/?manufacturer=227&Section=16&displaystyle=2"
            },
            "Discacciati": {
                "name": "Discacciati",
                "path": "/?manufacturer=178&Section=16&displaystyle=2"
            },
            "Hercules Stands": {
                "name": "Hercules Stands",
                "path": "/?manufacturer=115&Section=16&displaystyle=2"
            },
            "Miditech": {
                "name": "Miditech",
                "path": "/?manufacturer=212&Section=16&displaystyle=2"
            },
            "QuikLok": {
                "name": "QuikLok",
                "path": "/?manufacturer=116&Section=16&displaystyle=2"
            },
            "Samson": {
                "name": "Samson",
                "path": "/?manufacturer=150&Section=16&displaystyle=2"
            },
            "Gator": {
                "name": "Gator",
                "path": "/?manufacturer=144&Section=16&displaystyle=2"
            },
            "Kirlin Cable": {
                "name": "Kirlin Cable",
                "path": "/?manufacturer=223&Section=16&displaystyle=2"
            }
        }
    },
    "drums": {
        "title": "Drums",
        "path": "/?Section=17&displaystyle=2",
        "pages": 1,

        "categories": {
            "Yamaha": {
                "name": "Yamaha",
                "path": "/?manufacturer=92&Section=17&displaystyle=2"
            },
            "Tama": {
                "name": "Tama",
                "path": "/?manufacturer=169&Section=17&displaystyle=2"
            },
            "LP - Latin Percussion": {
                "name": "LP - Latin Percussion",
                "path": "/?manufacturer=106&Section=17&displaystyle=2"
            },
            "Alesis": {
                "name": "Alesis",
                "path": "/?manufacturer=152&Section=17&displaystyle=2"
            },
            "Mapex": {
                "name": "Mapex",
                "path": "/?manufacturer=170&Section=17&displaystyle=2"
            },
            "CNB": {
                "name": "CNB",
                "path": "/?manufacturer=200&Section=17&displaystyle=2"
            },
            "Gitre": {
                "name": "Gitre",
                "path": "/?manufacturer=167&Section=17&displaystyle=2"
            },
            "HQ percussion": {
                "name": "HQ percussion",
                "path": "/?manufacturer=213&Section=17&displaystyle=2"
            },
            "Linko": {
                "name": "Linko",
                "path": "/?manufacturer=105&Section=17&displaystyle=2"
            },
            "Masterwork": {
                "name": "Masterwork",
                "path": "/?manufacturer=168&Section=17&displaystyle=2"
            },
            "Maxtone": {
                "name": "Maxtone",
                "path": "/?manufacturer=104&Section=17&displaystyle=2"
            },
            "Parrot": {
                "name": "Parrot",
                "path": "/?manufacturer=103&Section=17&displaystyle=2"
            },
            "Samson": {
                "name": "Samson",
                "path": "/?manufacturer=150&Section=17&displaystyle=2"
            },
            "Toca Percussion": {
                "name": "Toca Percussion",
                "path": "/?manufacturer=222&Section=17&displaystyle=2"
            },
            "Vic Firth": {
                "name": "Vic Firth",
                "path": "/?manufacturer=189&Section=17&displaystyle=2"
            },
            "Zildjian": {
                "name": "Zildjian",
                "path": "/?manufacturer=171&Section=17&displaystyle=2"
            },
            "Gibraltar": {
                "name": "Gibraltar",
                "path": "/?manufacturer=193&Section=17&displaystyle=2"
            },
            "Remo": {
                "name": "Remo",
                "path": "/?manufacturer=208&Section=17&displaystyle=2"
            }
        }
    },
    "accordions-violens": {
        "title": "Bands & Orchestras",
        "path": "/?Section=18&displaystyle=2",
        "pages": 1,

        "categories": {
            "Cremona": {
                "name": "Cremona",
                "path": "/?manufacturer=146&Section=18&displaystyle=2"
            },
            "D'Addario": {
                "name": "D'Addario",
                "path": "/?manufacturer=177&Section=18&displaystyle=2"
            },
            "Hercules Stands": {
                "name": "Hercules Stands",
                "path": "/?manufacturer=115&Section=18&displaystyle=2"
            },
            "Hofner": {
                "name": "Hofner",
                "path": "/?manufacturer=131&Section=18&displaystyle=2"
            },
            "Hohner": {
                "name": "Hohner",
                "path": "/?manufacturer=120&Section=18&displaystyle=2"
            },
            "Steinbach": {
                "name": "Steinbach",
                "path": "/?manufacturer=101&Section=18&displaystyle=2"
            },
            "Valencia": {
                "name": "Valencia",
                "path": "/?manufacturer=122&Section=18&displaystyle=2"
            },
            "Franco Marcelli": {
                "name": "Franco Marcelli",
                "path": "/?manufacturer=216&Section=18&displaystyle=2"
            }
        }
    },
    "wind-inst": {
        "title": "Wind Instruments",
        "path": "/?Section=7&displaystyle=2",
        "pages": 1,

        "categories": {
            "Yamaha": {
                "name": "Yamaha",
                "path": "/?manufacturer=92&Section=7&displaystyle=2"
            },
            "Hercules Stands": {
                "name": "Hercules Stands",
                "path": "/?manufacturer=115&Section=7&displaystyle=2"
            },
            "Hohner": {
                "name": "Hohner",
                "path": "/?manufacturer=120&Section=7&displaystyle=2"
            },
            "Jupiter": {
                "name": "Jupiter",
                "path": "/?manufacturer=140&Section=7&displaystyle=2"
            },
            "BG France": {
                "name": "BG France",
                "path": "/?manufacturer=175&Section=7&displaystyle=2"
            },
            "Rico": {
                "name": "Rico",
                "path": "/?manufacturer=183&Section=7&displaystyle=2"
            },
            "Swan": {
                "name": "Swan",
                "path": "/?manufacturer=107&Section=7&displaystyle=2"
            },
            "��� ����� ��� ���": {
                "name": "��� ����� ��� ���",
                "path": "/?manufacturer=192&Section=7&displaystyle=2"
            },
            "Aulos": {
                "name": "Aulos",
                "path": "/?manufacturer=143&Section=7&displaystyle=2"
            },
            "Al Cass": {
                "name": "Al Cass",
                "path": "/?manufacturer=219&Section=7&displaystyle=2"
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
                "path": "/?manufacturer=94&Section=22&displaystyle=2"
            },
            "Ibanez": {
                "name": "Ibanez",
                "path": "/?manufacturer=96&Section=22&displaystyle=2"
            },
            "Dunlop": {
                "name": "Dunlop",
                "path": "/?manufacturer=119&Section=22&displaystyle=2"
            },
            "Hercules Stands": {
                "name": "Hercules Stands",
                "path": "/?manufacturer=115&Section=22&displaystyle=2"
            },
            "Platinum": {
                "name": "Platinum",
                "path": "/?manufacturer=114&Section=22&displaystyle=2"
            },
            "QuikLok": {
                "name": "QuikLok",
                "path": "/?manufacturer=116&Section=22&displaystyle=2"
            },
            "Samson": {
                "name": "Samson",
                "path": "/?manufacturer=150&Section=22&displaystyle=2"
            },
            "Wittner": {
                "name": "Wittner",
                "path": "/?manufacturer=113&Section=22&displaystyle=2"
            },
            "Mahalo": {
                "name": "Mahalo",
                "path": "/?manufacturer=206&Section=22&displaystyle=2"
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

function get_product_json(product_span, section, category_key) {
	/* receives a span that include the product details and return a json
	* */
	function extract_product_name(subdoms) {
		try {
			if (subdoms.length > 1) {
				return subdoms[1].raw
			}
			return subdoms[0].children[1].raw
		} catch (e) {
			return ' ?? '
		}
	}
	function extract_price_1(subdoms) {
		try {
			return get_number(subdoms[7].children[1].children[0].data, ' - ')
		} catch (e) {
			return ' - '
		}
	}
	function extract_price_2(subdoms) {
		try {
			return get_number(subdoms[9].children[1].children[0].data, ' - ')
		} catch (e) {
			return ' - '
		}
	}
	function recursive_extract(subdoms) {
		var res = null
		if(!subdoms){
			return
		}
		if(subdoms && subdoms.name == 'img'){
			return subdoms.attribs['src']
		}
		for(var i=0;i< subdoms.length;i++){
			if(subdoms[i].name == 'img'){
				return subdoms[i].attribs['src']
			}
			if(subdoms[i].children){
				res =  recursive_extract(subdoms[i].children)
				if(res){
					return res
				}
			}

		}
		return res;
	}
	function extract_image(subdoms) {
		try {
			return subdoms[3].children[1].children[1].children[1].children[0].attribs['src']

		} catch (e) {
			try{
				return subdoms[0].children[2].children[1].children[1].children[1].children[0].attribs['src']
			}catch (e){
				var res =  recursive_extract(subdoms)

				return res;
			}
		}
	}
	if (!product_span || !product_span.children) {
		return;
	}


	var product_url = product_span.children[1].attribs['onclick']
	var product_id = '';
	try{
		product_id = product_url? product_url.replace('location.href=\'product.asp?product=', ''):product_url
	}catch(e){

	}



	var subdoms = product_span.children[1].children
	var product_name = extract_product_name(subdoms);
	var product_img_url = extract_image(subdoms);
	var product_price1 = extract_price_1(subdoms)
	var product_price2 = extract_price_2(subdoms)


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

					if(!all_products[section] || !all_products[section][category_key]){
						resolve([])
					}else{
						resolve(all_products[section][category_key]);
					}

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

			}
			// save section to file
			var file = section_name + '_data.json'
			var obj = all_products[section_name]
			console.log('saving file', file)
			jsonfile.writeFile(file, obj, function (err) {
				console.error(err)
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
                                section_categories[text] = {'name':text,'path':href}
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
scan_and_save()
// generate_categories_for_sections().then(function () {
// 	console.dir(categories)
// })
exports.parent_url = parent_url;        // tested
exports.categories = categories;        // tested
exports.scan_and_save = scan_and_save;
exports.crawl_data = crawl_data;        // partially tested - testing for single category
exports.desired_dom_attrs = desired_dom_attrs;        // tested - covered by crawl_data
exports.get_pages_number_of_category = get_pages_number_of_category;
