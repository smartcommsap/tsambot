'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();
var speech ="outside";

//added for SC testing
var OAuth = require('oauth-1.0a');
var crypto = require('crypto');
var request = require('request');
var json = require('json');

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {

	if(req.body.result.parameters.PolicyNumber)
	{
	
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.PolicyNumber ? req.body.result.parameters.PolicyNumber+" is available but SC is not connected." : "Seems like some problem. Speak again."
	}
	else
	{
	var speech = "In else loop";
	}
    return res.json({
        speech: speech,
        displayText: speech,
        source: 'webhook-echo-sample'
    });
});
restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
