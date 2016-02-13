'use strict'


const express = require('express');
const router = express.Router();

const sendphoto = require('../controllers/sendphoto');


router.get('/sendphoto', sendphoto.index);
router.post('/sendphoto', upload.single('image'), sendphoto.new);

module.exports = router;
