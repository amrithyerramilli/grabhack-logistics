/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var cool = require('cool-ascii-faces');
var Uber = require('node-uber');
var uber = new Uber({
    client_id: 'CLIENT_ID',
    client_secret: 'CLIENT_SECRET',
    server_token: 'SERVER_TOKEN',
    redirect_uri: 'REDIRECT URL',
    name: 'APP_NAME'
});

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});

app.get('/cool', function(request, response) {
    response.send(cool());
});

app.get('/products', function(request, response) {
    console.log(JSON.stringify(request.query));
    var latitude = request.query.latitude;
    var longitude = request.query.longitude;
    uber.products.list({
        latitude: latitude,
        longitude: longitude
    }, function(err, res) {
        if (err) {
            response.send(err);
            // console.error(err);
        } else {
            response.send(res);
            // console.log(res)
        };
    });
});
