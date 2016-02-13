'use strict'


const express = require('express');
const router = express.Router();

const hello = require('../controllers/hello');

router.get('/hello', hello.index);

module.exports = router;

