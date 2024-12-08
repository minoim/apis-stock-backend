const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/search', newsController.searchNews);

module.exports = router; 