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
	
	var speechText="No response, please contact your administrator.";
	
	if(req.body.result.parameters.requestType && req.body.result.parameters.requestType=="wakeup")
	{
		speechText="Boty is awake and at your service. How can I help you?";
		return res.json({
        speech: speechText,
        displayText: speechText,
        source: 'webhook-echo-sample'
	
		});
	}
	
});
restService.listen(restService.get('port'), function() {
  console.log('Node app is running on port', restService.get('port'));
});
