var Forecast = require('forecast');
var NodeGeocoder = require('node-geocoder');
var moment = require('moment');
var options = { provider: 'google' };
var geocoder = NodeGeocoder(options);
var config = require('config');
var forecast = new Forecast({
    service: 'forecast.io',
    key: config.get('forecastIoKey'),
    units: 'f',
    cache: true,
    ttl: {
        minutes: 30
    }
});
var weatherEmojis = {
    'clear-day': '☀️',
    'clear-night': '🌚',
    'rain': '🌧',
    'snow': '❄️',
    'sleet': '🌨',
    'wind': '💨',
    'fog': '🌫',
    'cloudy': '☁️',
    'partly-cloudy-day': '🌤',
    'partly-cloudy-night': '☁️'
};

function getEmoji(weather) {
    return weatherEmojis[weather] ? weatherEmojis[weather] : '';
}

function trigger(city, api, message) {
    var sendCity = city;
    var args = message.body.split(" ");
    threadID = message.threadID;
    if (city === "") {
        sendCity = "West Lafayette";
    }
    geocoder.geocode(sendCity, function(err, res) {
        if (res === undefined || res.length == 0) { return console.error("could not geocode"); }
        forecast.get([res[0]['latitude'], res[0]['longitude']], function(err, weather) {
            var response = "";
            if (err) return console.dir(err);

            if (args[3] === 'daily') {
                weather['daily']['data'].forEach(function(day) {
                    response += moment.unix(day['time']).format("dddd") + ": " + day['summary'] + "\n";
                });
            } else {
                var weatherEmoji = getEmoji(weather['currently']['icon']);
                response = weatherEmoji + " Currently " + Math.floor(weather['currently']['temperature']) + "°F, and " + weather['currently']['summary'].toLowerCase() + ". " + weather['daily']['data'][0]['summary'];
                console.log(weather['currently']['temperature'] > 70);
                if(weather['currently']['temperature'] > 70) {
                    var num = (weather['currently']['humidity']*100) + "%";
                    response += " Humidity: " + num;
                }
            }
            console.log(response);
            api.sendMessage(response, threadID);
        });
    });
}

module.exports = {
    trigger: trigger
}
