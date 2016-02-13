'use strict'


const express = require('express');
const router = express.Router();

const Contact = require('../models/contact');
const ctrl = require('../controllers/contact');


router.get('/contact', ctrl.index);
router.post('/contact', ctrl.new);

module.exports = router;
