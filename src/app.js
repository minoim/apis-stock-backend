const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// 방문자 수를 저장할 변수 (실제 운영에서는 데이터베이스 사용 권장)
let visitorCount = 0;
let lastResetDate = new Date().toDateString();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// 방문자 수 카운팅 API 추가
app.post('/api/visitors/count', (req, res) => {
  // 날짜가 변경되었는지 확인
  const currentDate = new Date().toDateString();
  if (currentDate !== lastResetDate) {
    visitorCount = 0;
    lastResetDate = currentDate;
  }
  
  visitorCount++;
  res.json({ count: visitorCount });
});

// 검색어 가공 함수 추가
const processSearchKeyword = (keyword) => {
  const stockTerms = ['주가', '특징주', '주식'];
  const hasStockTerm = stockTerms.some(term => keyword.includes(term));
  
  if (!hasStockTerm) {
    return `${keyword} 특징주`;
  }
  return keyword;
};

// 뉴스 검색 API 엔드포인트
app.get('/api/news/search', async (req, res) => {
  try {
    const keyword = processSearchKeyword(req.query.keyword);
    const response = await axios.get('https://openapi.naver.com/v1/search/news.json', {
      params: {
        query: keyword,
        display: 10,
        sort: 'date'  // 최신순으로 정렬
      },
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = app;