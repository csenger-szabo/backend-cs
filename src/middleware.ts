import jwt = require('jsonwebtoken');

const config = require('../config.js');


const checkToken = (req: { headers: { [x: string]: any; }; decoded: any; }, res: { json: { (arg0: { success: boolean; message: string; }): void; (arg0: { success: boolean; message: string; }): void; }; }, next: () => void) => {
  let token = req.headers['authorization'];
  if (token.startsWith('Bearer')) {
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, config.secret, (err: any, decoded: any) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Invalid Token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = {
  checkToken: checkToken
}
