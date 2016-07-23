/**
 *  Name: Figlet
 *  Description: Replies with a figlet of a message.
 *  Usage: /figlet String in
 *  Author: j <jay@jayhankins.me>
 */

var figlet = require('figlet');

function trigger(message, api, messageObj) {
  threadID = messageObj.threadID;
  var figged = '```\n' + makeFig(message) + '```';
  api.sendMessage(figged, threadID);
}

function makeFig(message) {
	return figlet.textSync(message, {
	    font: 'small'
	}, function(err, data) {
	    if (err) {
	        console.log('Something went wrong...');
	        console.dir(err);
	        return;
	    }
	    console.log(data);
	});
}

module.exports = {
  trigger: trigger
}
