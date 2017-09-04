'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

//added for SC testing
var OAuth = require('oauth-1.0a');
var crypto = require('crypto');
var request = require('request');
var json = require('json');
var speech = "No response";
restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {

	if(req.body.result.parameters.NewFolderName)
	{
		
	var oauth = new OAuth({
    consumer: {
      key: '6e83adcc-09b3-4514-bb4f-442cfa21c019!TradeDocsThunderhead@sapient.com.trial',
      secret: 'ab97a83f-bc76-4784-a559-bac258fb7dde'
    },signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });
  
  var request_data = {
    url: 'https://na4.smartcommunications.cloud/one/oauth1/cms/v4/folders',
	//url: 'https://na4.smartcommunications.cloud/one/',
	//url: 'https://na4.smartcommunications.cloud/one/',
    method: 'POST',
    data: {
      name: req.body.result.parameters.NewFolderName,
	  parentId: req.body.result.parameters.ParentID
    },

};


request({
    url: request_data.url,
    method: request_data.method,
    form: request_data.data,
    headers: oauth.toHeader(oauth.authorize(request_data))
}, function(error, response, body) {
    if (error){	    
	    console.error(error);
	    speech=body;
    }
	else{
		speech="Folder created. Please check the CMS.";
	}
	
 console.log(body);
});

	}
	else{
	
   speech = req.body.result && req.body.result.parameters && req.body.result.parameters.PolicyNumber ? req.body.result.parameters.PolicyNumber+" is available but SC is not connected." : "Seems like some problem. Speak again."
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
