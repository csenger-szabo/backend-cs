import express = require('express');
import jwt = require('jsonwebtoken');
import bodyparser = require('body-parser');
import morgan = require('morgan');
import fs = require('fs');
import path = require('path');
const config = require('../config.js');
const fetch = require('node-fetch').default;
const app: express.Application = express();

var logStream = fs.createWriteStream(path.join(__dirname, 'requests.log'), { flags: 'a' });

app.use(morgan('combined', { stream: logStream }))
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


export const startApp = async () => {
  // create application
  app.get('/breweries', verifyToken, (req: any, res) => {
    // Verify token
    jwt.verify(req.token, config.secret, (_err: Error) => {
      if (req.query.query) {
        var fetchURL = 'https://api.openbrewerydb.org/breweries/search?query=' + req.query.query;
        console.log(fetchURL);
        // Fetch API with query
        fetch(fetchURL)
          .then((result: { json: () => void; }) => result.json())
          .then((json: any) => {
            console.log(json);
            res.json(json);
          })
      } else {
        // Fetch base API
        fetch('https://api.openbrewerydb.org/breweries')
          .then((result: { json: () => void; }) => result.json())
          .then((json: any) => {
            res.json(json);
          })
      }
    });
  });

  // Login 
  app.post('/login', (req, res) => {
    // User
    let username = req.body.username;
    let password = req.body.password;

    // Check username & password
    if (username == config.username && password == config.password) {
      jwt.sign({ username: username }, config.secret, { expiresIn: '1h' }, (_err: any, token: any) => {
        console.log(token);
        res.json({
          token: token
        })
      });
    }
    else{
      console.log('oof');
    }
  })

  // Not Found Response
  app.get('*', function (_req, res) {
    res.sendStatus(404);
  });

  // Verify Token
  function verifyToken(req: any, res: any, next: any) {
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      // Set token
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(401);
    }
  }

  // start application
  app.listen(3000, () => {
    console.log('App is listening on localhost:3000');
  })

};
