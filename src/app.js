const express = require('express');
const cors = require('cors');
const app = express();

// 가장 기본적인 CORS 설정
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.apis-stock.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // preflight request 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// express.json() 미들웨어는 CORS 설정 이후에 위치
app.use(express.json());

// 나머지 라우트 설정... 