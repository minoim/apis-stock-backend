const express = require('express');
const cors = require('cors');
const newsRoutes = require('./routes/newsRoutes');

const app = express();

// CORS 설정 수정
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // 두 포트 모두 허용
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use('/api/news', newsRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = app; 