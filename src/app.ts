import express = require('express');
const app: express.Application = express();

export const startApp = async () => {
  // create application
  app.get('/', (_req, res) => {
    res.send('hello my friend');
  });

  // start application
  app.listen(3000, () => {
    console.log('App is listening on localhost:3000');
  })

};
