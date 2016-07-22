//Start up scheduled tasks
require('./cronjobs.js');
require('dotenv').config();
var login = require('facebook-chat-api');
var commandDescriptions = require('./modules.json');
var prefixLen = 1;
var commands = commandDescriptions .map(function(cmd) {
  return require('./' + cmd['path']);
});

login({email: process.env.BOT_USERNAME, password: process.env.BOT_PASSWORD}, loginCallback);

function loginCallback(err, api) {
  if(err) return console.error(err);
  api.listen(function callback(err, message) {
    if(isCommand(message.body)) {
      var commandString = message.body.slice(prefixLen);
      var trigger = commandString.substring(0, commandString.indexOf(' '));
      commands.forEach(function(cmd, index) {
        if(trigger == commandDescriptions[index]['trigger']) {
          cmd.trigger(commandString.slice(trigger.length+1), message.threadID, api);
        }
      });
    }
  });
}

function isCommand(message) {
  if(!(message && message.body)) {
    return false; 
  } else if(process.env.USE_PREFIX == 'true') {
    prefixLen = process.env.BOT_PREFIX.length + 1;
    return message.startsWith(process.env.BOT_PREFIX);
  } else {
    return message.startsWith('/');
  }
}
