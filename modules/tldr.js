/**
 *  Name: TLDR
 *  Description: Looks up wikipedia blurb about a subject
 *  Usage: /tldr <anything>
 */

var request = require('request');

function trigger(message, api, messageObj) {
	threadID = messageObj.threadID;
	getWikipediaData(message, function(msg){
		api.sendMessage(msg,threadID);
	});
}

function getWikipediaData(query, callback) {
	var str = query.replace(/\s+/g, '%20');
	var search = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&redirects&titles=' + str;
	request(search, function (error, response, body) {
		var msg = '';
		if (!error && response.statusCode == 200) {
			var obj = JSON.parse(body).query['pages'];
			var summary;
			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					if (i == '-1') {
						return callback('Couldn\'t find anything about ' + query);
					}
					summary = obj[i].extract;
					summary = summary.replace(/\n/g, '\n\n');
				}
			}
			msg += summary;
			return callback(msg);
		}
	})

}

module.exports = {
	trigger: trigger
}


