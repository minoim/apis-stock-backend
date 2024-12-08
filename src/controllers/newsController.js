const axios = require('axios');
require('dotenv').config();

exports.searchNews = async (req, res) => {
  try {
    const { keyword, page = 1 } = req.query;
    const searchKeyword = `${keyword} 특징주`;
    const itemsPerPage = 10;
    
    console.log('검색 요청:', {
      originalKeyword: keyword,
      modifiedKeyword: searchKeyword,
      page
    });

    if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
      console.error('API 키 미설정');
      throw new Error('네이버 API 키가 설정되지 않았습니다.');
    }

    const response = await axios.get('https://openapi.naver.com/v1/search/news.json', {
      params: {
        query: searchKeyword,
        display: 100,
        sort: 'date'
      },
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
      }
    });

    // 제목 기준으로 필터링 및 데이터 가공
    const allFilteredNews = response.data.items
      .filter(item => {
        const cleanTitle = item.title.replace(/<\/?b>/g, '').toLowerCase();
        const searchTerms = [keyword.toLowerCase(), '특징주'];
        return searchTerms.every(term => cleanTitle.includes(term));
      })
      .map(item => ({
        ...item,
        title: item.title
          .replace(/&quot;/g, '"')
          .replace(/<\/?b>/g, '')
          .replace(/특징주/g, '')
          .replace(/\s+/g, ' ')
          .replace(/\[|\]/g, '')
          .replace(/\s*,\s*/g, ', ')
          .trim(),
        description: item.description
          .replace(/&quot;/g, '"')
          .replace(/<\/?b>/g, '')
          .trim(),
        pubDate: new Date(item.pubDate).toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        originalDate: new Date(item.pubDate)
      }))
      .sort((a, b) => b.originalDate - a.originalDate)
      .slice(0, 30); // 최대 30개까지만 유지

    // 페이지네이션 처리
    const totalItems = allFilteredNews.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = Math.min(Math.max(1, parseInt(page)), totalPages);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedNews = allFilteredNews
      .slice(startIndex, endIndex)
      .map(({ originalDate, ...item }) => item);

    console.log('검색 결과:', {
      keyword: searchKeyword,
      totalResults: totalItems,
      currentPage,
      totalPages
    });

    if (totalItems === 0) {
      return res.json({ 
        items: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0
        },
        message: '검색 결과가 없습니다. 다른 키워드로 시도해보세요.' 
      });
    }

    res.json({
      items: paginatedNews,
      pagination: {
        currentPage,
        totalPages,
        totalItems
      }
    });
    
  } catch (error) {
    console.error('검색 오류 발생:', error);
    res.status(500).json({ 
      error: '뉴스를 검색하는 중 오류가 발생했습니다.',
      details: error.response?.data || error.message
    });
  }
}; 