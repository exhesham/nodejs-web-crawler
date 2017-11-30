/**
 * Created by hishamy on 30/11/2017.
 */

var http = require('http');
var htmlparser = require("htmlparser");

var options = {
    host: 'www.kley-zemer.co.il',
    path: '/?Section=2'
}
function scan_data(dom) {
    var children = dom.children
    for(var i in children){

        if(children[i].name == 'div' && children[i].type == 'tag'){
            if(children[i].attribs['id'] && children[i].attribs['id'] == ){

            }
            console.log(children[i].attribs)
        }


        scan_data(children[i])
    }
}
var request = http.request(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
        data += chunk;
        //console.log('data:', data);
    });
    res.on('end', function () {
        var rawHtml = data;
        var handler = new htmlparser.DefaultHandler(function (error, dom) {
            if (error)
                console.log('error:', error);
            else{
                for(var i in dom){
                    scan_data(dom[i]);
                }

            }
        });
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(rawHtml);

    });
});
request.on('error', function (e) {
    console.log('error', e.message);
});
request.end();