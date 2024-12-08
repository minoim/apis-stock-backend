const express = require('express');
const cors = require('cors');
const newsRouter = require('./routes/news');  // 기존 라우터
const app = express();

// CORS 미들웨어를 가장 먼저 적용
app.use(cors({
  origin: true, // 모든 origin 허용
  credentials: true
}));

app.use(express.json());

// 모든 라우트에 대해 CORS 헤더 추가
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// 기존 라우트 설정 유지
app.use('/api/news', newsRouter);

// 에러 핸들링 미들웨어 (기존 코드 유지)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 포트 설정 및 서버 시작 (기존 코드 유지)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = app; 