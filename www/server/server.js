'use strict';

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/api/bets/nfl', (req, res) => {
  let bets = [
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
  res.json(bets);
})

app.listen(3333);
console.log('Listening on localhost:3333');