'use strict'


const express = require('express');
const router = express.Router();

const api = require('../controllers/api')

router.get('/', api.index);
router.get('/api', api.apiindex);
router.post('/api', api.uppercase);
router.get('/api/weather', api.weather);
router.get('/api/news', api.news);

module.exports = router;
