/*****************************
 **							**
 **		Sportsbeth  		**
 **		Twitter Bot			**
 **			DAO		   		**
 **							**
 *****************************/

var express = require('express');
var app = express();

var request = require('request');
var fs = require('fs')
var schedule = require('node-schedule');
var fs = require('fs');
var path = require('path');
var Twit = require('twit');
var config = require(path.join(__dirname, 'config.js'));
var t = new Twit(config);

// Start code

var amialive = app.get('/', function(req, res){
  res.send("Yes, I'm up and alive, thank you for asking..");
});

// Get sports odds from API 
var server = app.listen(8080, function() {
	console.log('Ready on port %d', server.address().port);
	
    var getOdds = function(callback) {
		request('https://api.the-odds-api.com/v2/odds/?sport=NFL&region=uk&apiKey=49d5d089fdc357ddc70392ef641c7dfd', function (error, response, body) {
			if (!error && response.statusCode == 200) {
		//fs.readFile('./odds.json', (err,body)=> { // replace me in production!
			//if (err) throw err; // replace me in production!
			var array = JSON.parse(body);
			var events = array.data.events;
			callback && callback(events) // optional argument
		//}) // delete me in production!
			};
		})
	}

	var tweetOdds = function() {
		getOdds(function(events) {

			// Check to make sure event data was pulled
			if (events == null) {
				return console.log("ERROR: Failed to retrieve coinmarketcap data.");
			}

			tweetNFL = "Upcoming NFL odds:\n"
			tweetNBA = "Upcoming NBA odds:\n"
			tweetSoccer = "Upcoming Soccer odds:\n"

			for (var event in events) {
				var sport = events[event].sport
				var participant_1 = events[event].participants[0].replace(/\s/g, "");
				var participant_2 = events[event].participants[1].replace(/\s/g, "");
				var sites = events[event].sites
				for (var site in sites) {
					var odd_1 = "(" + events[event].sites[site].odds.h2h[0] + ")"
					var odd_2 = "(" + events[event].sites[site].odds.h2h[1] + ")"
						if (sport == "NFL") {
							tweetNFL += "#" + participant_1 + odd_1 + " @ " + "#" + participant_2 + odd_2 + "\n"
							break
						}
						else if (sport == "NBA") {
							tweetNBA += "#" + participant_1 + odd_1 + " @ " + "#" + participant_2 + odd_2 + "\n"
							break
						}
				}
			}

			if (tweetNFL != "Upcoming NFL odds:\n") {
				console.log("Tweet succesful:" + tweetNFL + "%\n");
				t.post('statuses/update', { status: tweetNFL }, function(err, data, response) {
					if (err) return console.log("ERROR: " + err);
					console.log(data)
				});
			}
		})
	}

tweetOdds()

});
/*
	// Tweet every 9AM, 4PM and 9PM on this machines time
	var rule = new schedule.RecurrenceRule();
	rule.hour = [1,13,20];
	rule.minute = 1;
	var j = schedule.scheduleJob(rule, function(){
		tweetTopCoins(); 
	}); */
