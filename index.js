'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
    console.log(req.body.metadata.intentName);
    if(req.body.metadata.intentName == "AddFolder")
    {
        var speech = "Inside";
    }
    else
    {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.PolicyNumber ? req.body.result.parameters.PolicyNumber+" is available but SC is not connected." : "Seems like some problem. Speak again."
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
