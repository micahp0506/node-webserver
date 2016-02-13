'use strict'


const express = require('express');
const router = express.Router();

const random = require('../controllers/random');

router.get('/random/:min/:max', random.index);

module.exports = router;
