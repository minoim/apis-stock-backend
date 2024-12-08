const cors = require('cors');

// CORS 설정을 더 유연하게 수정
app.use(cors({
  origin: [
    'https://www.apis-stock.com',
    'https://apis-stock.com',
    'http://localhost:3000'  // 개발 환경용
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 