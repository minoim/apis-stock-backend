const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://www.apis-stock.com',
  credentials: true
})); 