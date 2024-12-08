require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  naverApi: {
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET
  }
}; 