const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
restService.set('port', (process.env.PORT || 8000));
var request = require('request');
var xmldom = require('xmldom').DOMParser;
var S = require('string');
var encodeUrl = require('encodeurl');
const jsxml = require("node-jsxml");

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
	
	var speechText="No response. Please retry and please your administrator if the issue persists.";
	
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
	
	if(req.body.result.parameters.requestType && req.body.result.parameters.requestType=="wakeup")
	{
		speechText="Boty is awake and at your service. How can I help you?";
		return res.json({
        speech: speechText,
        displayText: speechText,
        source: 'response for wakeup'
	
		});
	}
	else if(req.body.result.parameters.requestType && req.body.result.parameters.requestType=="queryForDeck")
	{
		var resourceId="157773560";
		var resourceVersionId="";
		var finalText="";
		
		//Code to retrieve latest resource version id -- starts
		console.log("retrieve latest resource version id");
		var request_vars =  {		
			url: "https://na4.smartcommunications.cloud/one/api/cms/v4/resources/"+resourceId+"/latestversion?scope=-1",
			method: 'GET',	
			};
		console.log("Url to retrieve: "+request_vars.url);
		request({
			url: request_vars.url,
			method: request_vars.method,
			headers: oauth.toHeader(oauth.authorize(request_vars))
		}, function(error, response, body) {
			if (error) console.log(error);
			if(body)
			{
				console.log(body);
				var doc = new xmldom().parseFromString(body);
				if(doc)
				{
				var resourceVersionIdFromXML = doc.getElementsByTagName('resVerId');
				console.log("resourceVersionId fetched: "+resourceVersionIdFromXML[0].textContent);
				resourceVersionId=resourceVersionIdFromXML[0].textContent;
				console.log("resourceVersionId fetched inside: "+resourceVersionId);
				}
				else
				{
					speechText="There is some issue in retrieving the content data. Please check with the admin."
				}
			}
		console.log("resourceVersionId fetched req: "+resourceVersionId);
		
		//Code to getContent for resourceVersionId -- starts
		console.log("getContent for resourceVersionId");
		var request_vars2 =  {
				
			url: "https://na4.smartcommunications.cloud/one/api/cms/v4/versions/"+resourceVersionId+"/content",
			method: 'GET',	
		};
		console.log(request_vars2.url);
		request({
			url: request_vars2.url,
			method: request_vars2.method,
			headers: oauth.toHeader(oauth.authorize(request_vars2))
		}, function(error, response, body) {
			if (error) console.log(error);
			if(body)
			{
				console.log(body);
				var doc = new xmldom().parseFromString(body);
				if(doc)
				{
				var fetchAllParaText = doc.getElementsByTagName('p');
				for(var i in fetchAllParaText)
			{
				if(fetchAllParaText[i].textContent || fetchAllParaText[i].textContent=="")
				{
					if(fetchAllParaText[i].textContent=="")
					{
						finalText=finalText+"\n\n";
					}
					else{
					finalText=finalText+fetchAllParaText[i].textContent;
					}
				//console.log(fetchAllParaText[i].textContent);
				}
			}
			
			speechText=finalText;
			console.log(speechText);
			
				return res.json({
				speech: speechText,
				displayText: speechText,
				source: 'response for queryForDeck'
			
			});
			
				}
				else
				{
					speechText="Faced some internal issue. Please check with your admin.";
					return res.json({
					speech: speechText,
					displayText: speechText,
					source: 'response for queryForDeck'
				});
			}
			}
			else
			{
					return res.json({
					speech: speechText,
					displayText: speechText,
					source: 'response for queryForDeck'
				});
			}
		});

		//Code to getContent for resourceVersionId -- ends
		});
		//Code to retrieve latest resource version id -- ends
	}
	else
	{
		return res.json({
        speech: speechText,
        displayText: speechText,
        source: 'default response from webhook'	
		});
	
	}
	
});
restService.listen(restService.get('port'), function() {
  console.log('Node app is running on port', restService.get('port'));
});
