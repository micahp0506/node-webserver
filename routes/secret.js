'use strict'


const express = require('express');
const router = express.Router();

const secret = require('../controllers/secret');

router.get('/secret', secret.index);

module.exports = router;
