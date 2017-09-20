'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
console.log("start: " + new Date());
const express = require('express');
const bodyParser = require('body-parser');
const restService = express();

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
	
	//Declaring local variables
	var req_url="NotSet";
	var req_method="POST";
	var data="NotSet";
	var speech="NotSet";
	var apiMethod="NotSet";
	
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
	
	console.log("oauth start: " + new Date());

	//Parameters for Create Folder
	if(req.body.result.parameters.NewFolderName && req.body.result.parameters.ParentID)
	{
		console.log("Inside Create Folder");
		apiMethod="CreateFolder";
		speech="Folder created. Please check the CMS.";
		req_url="https://na4.smartcommunications.cloud/one/oauth1/cms/v4/folders";	
		data= {
					"name": req.body.result.parameters.NewFolderName,
					"parentId": req.body.result.parameters.ParentID
					};
	}
	//Parameters for Generate Document
	else if(req.body.result.parameters.DocNumber)
	{
		console.log("Inside Generate Document");
		var transactionType = "";
		var transactionDataPart1="<?xml version=\"1.0\" encoding=\"utf-8\"?><SCBOTRequest>";
		var transactionDataPart2,transactionDataPart4="";
		var transactionDataPart3="<CustomerName>John Doe</CustomerName><AgencyName>RTG Consultants</AgencyName><AgencyPhoneNo>123-564-232</AgencyPhoneNo><Transactiontype>";
		var transactionDataPart5="</Transactiontype></SCBOTRequest>";
		console.log("Truncated "+req.body.result.parameters.DocNumber.toString().substr(0,3).toUpperCase());
		if(req.body.result.parameters.DocNumber.toString().substr(0,3).toUpperCase()=="POL")
		{
			console.log("Inside Generate Document POL URL"+req_url);
			transactionType="Policy";
			transactionDataPart2="<PolicyNumber>"+req.body.result.parameters.DocNumber+"</PolicyNumber><PolicyPremium>123.45</PolicyPremium>";
			transactionDataPart4=transactionType;
		}
		else if(req.body.result.parameters.DocNumber.toString().substr(0,3).toUpperCase()=="QUO")
		{
			console.log("Inside Generate Document QUO URL"+req_url);
			transactionType="Quote";
			transactionDataPart2="<QuoteNumber>"+req.body.result.parameters.DocNumber+"</QuoteNumber><QuotePremium>5643.34</QuotePremium>";
			transactionDataPart4=transactionType;
		}
		else
		{
			console.log("Inside Generate Document NotSupported URL"+req_url);
			transactionType="NotSupported";
		}
		//If transaction is not Policy/Quote
		if(transactionType=="NotSupported")
		{
			console.log("Not Supported"+req_url);
			speech="The format of the quote/policy number is invalid. Please share the correct details.";
		}
		//If transaction is Policy/Quote
		else
		{	
			apiMethod="GenerateDocument";
			req_url="https://192.168.0.102/smartcomms/oauth1/api/v4/job/generateDocument?includeDocumentData=true";
			console.log("Inside Generate Document URL"+req_url);
			var transactionData=transactionDataPart1+transactionDataPart2+transactionDataPart3+transactionDataPart4+transactionDataPart5;
			var bytes = utf8.encode(transactionData);
			var encodedTransactionData= base64.encode(bytes);
			data= {
					"projectId": "157653990",
					"batchConfigResId": "157756077",
					"transactionData": encodedTransactionData,
					"transactionRange": "1"
				};
			
		}
		
	}
	else
	{
		data= {
      		"resId": "158100159",
	  "rootElementName": "SCBOTRequest",
	  "sampleData": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48U0NCT1RSZXF1ZXN0PjxQb2xpY3lOdW1iZXI+cG9sMTIzPC9Qb2xpY3lOdW1iZXI+PFBvbGljeVByZW1pdW0+MTIzLjQ1PC9Qb2xpY3lQcmVtaXVtPjxRdW90ZU51bWJlcj5xdW90ZTEyMzwvUXVvdGVOdW1iZXI+PFF1b3RlUHJlbWl1bT4zNDUuNDU8L1F1b3RlUHJlbWl1bT48Q3VzdG9tZXJOYW1lPkpvaG4gRG9lPC9DdXN0b21lck5hbWU+PEFnZW5jeU5hbWU+UlRHIENvbnN1bHRhbnRzPC9BZ2VuY3lOYW1lPjxBZ2VuY3lQaG9uZU5vPjEyMy01NjQtMjMyPC9BZ2VuY3lQaG9uZU5vPjwvU0NCT1RSZXF1ZXN0Pg=="
	};
	req_url="https://192.168.0.102/smartcomms/oauth1/api/v4/listMissingFields";
	}
console.log("Outside Generate Document POL URL"+req_url);
var request_vars =  {	
	url: req_url,
	method: req_method,	
};
console.log("Before request: " + new Date());
request({
    url: req_url,
    method: req_method,
    json: data,
    headers: oauth.toHeader(oauth.authorize(request_vars))
}, function(error, response, body) {
    if (error) console.error(error);
		speech = body;
		console.log(body);
	return res.json({
        speech: speech,
        displayText: speech,
        source: 'webhook-echo-sample'
	
	});		
    });
});
console.log("after request: " + new Date());
restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
