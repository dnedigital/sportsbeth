'use strict';

const express = require('express');
const request = require('request');
const app = express();
const jwt = require('express-jwt');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



app.get('/api/bets/nfl', (req, res) => {

  var url = "https://api.the-odds-api.com/v2/odds/?sport=NFL&region=uk&apiKey=49d5d089fdc357ddc70392ef641c7dfd";
  
  request.get({ url: url }, function(error,response,body) {
    console.log('/api/bets/nfl')
    if (!error && response.statusCode == 200) { 
      
      var json = JSON.parse(body);
      //console.log(json);

      var events = json.data.events;
      console.log(events);

      var i = 0;
      var bets = [];
      for (var event in events) {
        console.log(event);
        var bet = { id: 0, description: "", odd1: 0, odd2: 0 }
        bet.id = i;
        i++;

        console.log(events[event]);
        bet.game_description = events[event].participants[0] + " vs. " + events[event].participants[1];
        bet.odd_1 = events[event].sites.unibet.odds.h2h[0];
        bet.odd_2 = events[event].sites.unibet.odds.h2h[1];
        bets.push(bet);
      }

      res.json(bets); 
      }
    });
  
  
  /*let bets = [
    {
      id: '0001',
      game_description: "Baltimore Ravens vs. Pittsburgh Steelers",
      odd_1: '3.1',
      odd_2: '1.37'
    },
    {
      id: '0002',
      game_description: "Miami Dolphins vs. New England Patriots",
      odd_1: '5.25',
      odd_2: '1.0'
    }
  ];
  res.json(bets);*/
})

app.listen(3333);
console.log('Listening on localhost:3333');