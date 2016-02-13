'use strict'


const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/contact');


router.get('/contact', ctrl.index);
router.post('/contact', ctrl.new);

module.exports = router;
