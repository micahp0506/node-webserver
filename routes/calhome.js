'use strict'


const express = require('express');
const router = express.Router();

const calhome = require('../controllers/calhome')

router.get('/calhome', calhome.index);
router.get('/cal/:month/:year', calhome.new);


module.exports = router;
