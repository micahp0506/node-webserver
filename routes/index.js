'use strict';


const express = require('express');
const router = express.Router();

// const routes = require('./routes/routes');
const api = require('./api');
const contact = require('./contact');
const photos = require('./sendphoto');
const calhome = require('./calhome');
const hello = require('./hello');
const secret = require('./secret');

// middleware
router.use(api);
router.use(contact);
router.use(photos);
router.use(calhome);
router.use(hello);
router.use(secret);



module.exports = router;
