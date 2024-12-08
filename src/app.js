const express = require('express');
const cors = require('cors');
const app = express();

// CORS 미들웨어를 가장 앞에 배치
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://www.apis-stock.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// 기존의 cors() 미들웨어는 제거
// app.use(cors({ ... }));

// 나머지 미들웨어와 라우트 설정 