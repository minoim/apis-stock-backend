const express = require('express');
const cors = require('cors');
const app = express();

// 모든 요청에 대해 CORS 허용
app.use(cors());

// 추가 CORS 헤더 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// 나머지 미들웨어와 라우트 설정 