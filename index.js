const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
restService.set('port', (process.env.PORT || 8000));
var request = require('request');

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
	
	var speechText="No response. Please retry and please your administrator if the issue persists.";
	
	if(req.body.result.parameters.requestType && req.body.result.parameters.requestType=="wakeup")
	{
		speechText="Boty is awake and at your service. How can I help you?";
		return res.json({
        speech: speechText,
        displayText: speechText,
        source: 'response for wakeup'
	
		});
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
