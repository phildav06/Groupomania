const jwt = require('jsonwebtoken');
require('dotenv').config({path: './config/.env'});

// Exported functions to register and login user
module.exports = {
    generateTokenUser: (userData) => {
      return jwt.sign({
        userId: userData.id,
        is_admin: userData.is_admin
      },
      `${process.env.SIGN_SECRET}`,
      {
        expiresIn: '1d'
      })
    },
    parseAuthorization: (authorization) => {
      return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: (authorization) => {
      let userId = -1;
      const token = module.exports.parseAuthorization(authorization);
      if(token != null) {
        try {
          const jwtToken = jwt.verify(token, `${process.env.SIGN_SECRET}`);
          if(jwtToken != null)
            userId = jwtToken.userId;
        } catch(err) { }
      }
      return userId;
    }
  }