import express = require('express');
import jwt = require('jsonwebtoken');
import bodyparser = require('body-parser');
import morgan = require('morgan');
import fs = require('fs');
import path = require('path');
const fetch = require('node-fetch').default;
const app: express.Application = express();

var logStream = fs.createWriteStream(path.join(__dirname, 'requests.log'), { flags: 'a' })

app.use(morgan('combined', { stream: logStream }))
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


export const startApp = async () => {
  // create application
  app.get('/breweries', verifyToken, (req: any, res) => {
    jwt.verify(req.token, 'secret-key', (_err: Error) => {
      if (req.query.query) {
        var fetchURL = 'https://api.openbrewerydb.org/breweries/search?query=' + req.query.query;
        console.log(fetchURL);
        fetch(fetchURL)
          .then((result: { json: () => void; }) => result.json())
          .then((json: any) => {
            console.log(json);
            res.json(json);
          })
      } else {
        fetch('https://api.openbrewerydb.org/breweries')
          .then((result: { json: () => void; }) => result.json())
          .then((json: any) => {
            res.json(json);
          })
      }
    });
  });

  app.post('/login', (_req, res) => {
    //User
    const user = {
      id: 1,
      username: 'csengerszabo',
      email: 'dummy@email.com'
    }

    jwt.sign({ user: user }, 'secret-key', {}, (_err: any, token: any) => {
      res.json({
        token: token
      })
    });
  })

  app.get('*', function (_req, res) {
    res.sendStatus(404);
  });

  // Format Token
  // Authorization: Bearer <access_token>

  // Verify Token
  function verifyToken(req: any, res: any, next: any) {
    // Get auth header value 
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      //Forbidden
      res.sendStatus(403);
    }

  }

  // start application
  app.listen(3000, () => {
    console.log('App is listening on localhost:3000');
  })

};
