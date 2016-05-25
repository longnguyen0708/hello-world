
var fs = require('fs');
var express = require('express');
var Client = require('node-rest-client').Client;

var app = express();
app.use(express.bodyParser());
app.use("/images", express.static(__dirname + '/images'));

var page = function( req, res, url, result ) {
    body = fs.readFileSync('./page.html');
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);

    console.log("url: " + url);
    console.log("result: " + result);
        var html_body = "" + body ;
        var html_body = html_body.replace("{url}", url );
	var html_body = html_body.replace("{result}", result );  
	res.end( html_body );
           
}



var doGet = function(req, res, url) {
    var client = new Client();
            client.get( url,
                function(data, response_raw) {
                    console.log( "data = \n" + JSON.stringify(data) ) ;
		    page(req, res, url, JSON.stringify(data));
                }    
		);
}


var handle_post = function (req, res) {
    console.log( "Post: " + "Action: " +  req.body.event + "\n" ) ;

	var url = "" + req.body.url ;
    	var action = "" + req.body.event ;
 	console.log("url: " + url);

    if ( action == "Get Data" ) {
    	doGet(req, res, url);
    }
}

var handle_get = function (req, res) {
    console.log( "Get: ..." ) ;
    page( req, res, "", "", "" ) ;
}

app.post("*", handle_post );
app.get( "*", handle_get ) ;

//console.log( "Server running on Port 8080..." ) ;

//app.listen(8080);

app.set('port', (process.env.PORT || 5000));


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
