'use strict';


const express = require('express');
const router = express.Router();

const News = require('../models/news');


// const routes = require('./routes/routes');
const api = require('./api');
const contacts = require('./contacts');
const photos = require('./photo');
const calhome = require('./calhome');
const hello = require('./hello');

// middleware
// router.use(routes);
router.use(api);
router.use(contacts);
router.use(photos);
router.use(calhome);
router.use(hello);














router.get('/', (req, res) => {

  News.findOne().sort('-_id').exec((err, doc) => {
    if (err) throw (err);
    res.render('index', {
      topStory: doc.top[0]
    });
  });
});

















router.get('/random/:min/:max', (req, res) => {
  const min = req.params.min;
  const max = req.params.max;
  res.send(getRandomInt(+min, +max).toString());

  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
    }
  });

router.get('/cal/:month/:year', (req, res) => {
  const cal = require('node-cal/lib/month');
  const month = req.params.month;
  const year = req.params.year;
  res.end(`${cal.month2Args(month, year)}`);
  console.log(cal);
  });

module.exports = router;
