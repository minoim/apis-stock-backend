const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// 방문자 수를 저장할 변수
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

const cleanText = (text) => {
    // 모든 HTML 태그와 특징주 관련 패턴을 제거하는 정규식
    const patterns = [
      // HTML 태그로 감싸진 특징주 패턴
      /\[<\/?[^>]+>특징주<\/?[^>]+>\]/g,
      /\[<[^>]*>특징주<\/[^>]*>\]/g,
      /\(<[^>]*>특징주<\/[^>]*>\)/g,
      /<[^>]*>특징주<\/[^>]*>/g,
      
      // 일반 특징주 패턴
      /\[특징주\]/g,
      /\(특징주\)/g,
      /특징주/g,
      
      // HTML 태그
      /<\/?b>/g,
      /<[^>]*>/g,
      
      // HTML 엔티티
      /&lt;/g,
      /&gt;/g,
      /&quot;/g,
      /&amp;/g
    ];

    // 모든 패턴 제거
    let cleanedText = text;
    patterns.forEach(pattern => {
      cleanedText = cleanedText.replace(pattern, '');
    });

    // 공백 정리
    return cleanedText
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '')
      .trim();
};

// 검색어 가공 함수 수정
const processSearchKeyword = (keyword) => {
    // 이미 '특징주' 키워드가 포함되어 있는지 확인
    if (!keyword.includes('특징주')) {
      return `${keyword} 특징주`;  // '주가' 대신 '특징주' 사용
    }
    return keyword;
  };

// 뉴스 검색 API 엔드포인트
app.get('/api/news/search', async (req, res) => {
    try {
      const keyword = processSearchKeyword(req.query.keyword);
      const page = req.query.page || 1;
      
      const response = await axios.get('https://openapi.naver.com/v1/search/news.json', {
        params: {
          query: keyword,
          display: 10,
          start: (page - 1) * 10 + 1,
          sort: 'date'
        },
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
        }
      });

      // 뉴스 검색 API 엔드포인트 내부의 processedItems 부분 수정
      const processedItems = response.data.items
      .map(item => ({
        ...item,
        title: cleanText(item.title),
        description: cleanText(item.description),
        link: item.link,
        pubDate: item.pubDate,
        keyword: keyword
      }))
      .filter(item => 
        item.title && 
        item.title.length > 0 && 
        !item.title.toLowerCase().includes('특징주') &&
        !item.title.includes('<b>') &&
        !item.title.includes('</b>')
      );

      // 정제된 결과 반환 (한 번만 응답)
      res.json({
        total: response.data.total,
        start: response.data.start,
        display: response.data.display,
        items: processedItems
      });
  
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 방문자 수 카운팅 API
app.post('/api/visitors/count', (req, res) => {
  const currentDate = new Date().toDateString();
  if (currentDate !== lastResetDate) {
    visitorCount = 0;
    lastResetDate = currentDate;
  }
  
  visitorCount++;
  res.json({ count: visitorCount });
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