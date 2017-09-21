const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
restService.set('port', (process.env.PORT || 8000));
var request = require('request');

//Added for Oauth1 authorization
var OAuth = require('oauth-1.0a');
var crypto = require('crypto');


//For base64 utf-8 Encoding/Decoding
var base64 = require('base-64');
var utf8 = require('utf8'); 

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
	
	var speechText="Some response from Smart Comms, Please try again later.";

	if(req.body.result.parameters.NewFolderName && req.body.result.parameters.ParentID && req.body.result.parameters.ParentID!="" && req.body.result.parameters.NewFolderName!="" )
	{
	
	//Setting the Oauth1 authorization parameters
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
	url: 'https://na4.smartcommunications.cloud/one/api/cms/v4/folders',
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
	//var speechText="";
    if (error) console.log(error);
	if(response.statusCode=='201')
	{
		speechText="Folder created";
	}
	else
	{
		if(body){
		var parseString = require('xml2js').parseString;
		parseString(response.body, function (err, result) {
		console.dir(result.errorinfo.msg);
		speechText=result.errorinfo.msg.toString();
		});
	}
	}
	console.log(response.statusCode);
	//console.log(request.body);
	console.log(request_data.url.substr(0,4));
	return res.json({
        speech: speechText,
        displayText: speechText,
        source: 'webhook-echo-sample'
	
	});
	
});
}
else if (req.body.result.parameters.EmailId && req.body.result.parameters.FirstName && req.body.result.parameters.LastName && req.body.result.parameters.UserId && req.body.result.parameters.EmailId!="" && req.body.result.parameters.FirstName!="" && req.body.result.parameters.LastName!="" && req.body.result.parameters.UserId!="")
{
	var speechText ="Cannot perform operation";
	console.log("inside user creation");
	//Setting the Oauth1 authorization parameters
	var oauth = new OAuth({
    consumer: {
      key: '6e83adcc-09b3-4514-bb4f-442cfa21c019!TradeDocsThunderhead@sapient.com.trial',
      secret: 'ab97a83f-bc76-4784-a559-bac258fb7dde'
    },signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
	});
	

var request_vars =  {	
	url: 'https://na4.smartcommunications.cloud/one/oauth1/userManagement/v4/users',
	method: 'POST',	
};
var userId= req.body.result.parameters.UserId+"@sapient.com.trial";
console.log(userId);
var data= {      
		"userId": userId,
		"authType": "AD",
		"emailAddress": req.body.result.parameters.EmailId,
		"forename": req.body.result.parameters.FirstName,
		"surname": req.body.result.parameters.LastName,
		"groupNames": ["Default Group"],
		"roleIds": [1, 6]  	
	};

request({
    url: request_vars.url,
    method: request_vars.method,
    json: data,
    headers: oauth.toHeader(oauth.authorize(request_vars))
}, function(error, response, body) {
	//var speechText="";
    if (error) console.log(error);
	if(response.statusCode=='201')
	{
		speechText="User created: "+req.body.result.parameters.UserId +"@sapient.com.trial";
	}
	else
	{
		if(body){
		var parseString = require('xml2js').parseString;
		parseString(response.body, function (err, result) {
			if(result){
		console.dir(result.errorinfo.msg);
		speechText=result.errorinfo.msg.toString();
			}
		});
	}
	}
	
	console.log(response.body);
	
	return res.json({
        speech: speechText,
        displayText: speechText,
        source: 'webhook-echo-sample'
	
	});
	
});


}
});
restService.listen(restService.get('port'), function() {
  console.log('Node app is running on port', restService.get('port'));
});
