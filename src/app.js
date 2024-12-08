const express = require('express');
const cors = require('cors');
const app = express();

// 기본 미들웨어 설정
app.use(express.json());

// CORS 설정
const corsOptions = {
  origin: ['https://www.apis-stock.com', 'https://apis-stock.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// 프리플라이트 요청을 위한 OPTIONS 핸들러
app.options('*', cors(corsOptions));

// 나머지 라우트 설정... 