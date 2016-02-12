'use strict'


const express = require('express');
const router = express.Router();


router.get('/calhome', (req, res) => {
  res.render('calhome', {
    date: new Date()
  });
});


module.exports = router;
