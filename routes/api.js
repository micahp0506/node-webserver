'use strict'


const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');

const Allcaps = require('../models/allcaps');
const News = require('../models/news');

router.get('/api', (req, res) => {
  res.header('Access-Controll-Allow-Origin', '*');
  res.send({hello: 'world'});
});

router.post('/api', (req, res) => {
  console.log(req.body);
  const obj = _.mapValues(req.body, val => val.toUpperCase());
  const caps =  new Allcaps(obj);

  caps.save((err, result) => {
    if (err) throw (err);
    console.log("res", result);
    res.send(result);
  });
});

router.get('/api/weather', (req, res) => {
  const url = 'https://api.forecast.io/forecast/e49fa87af2ea266974efda95426a3070/37.8267,-122.423';

  request.get(url, (err, respnse, body) => {
    if (err) throw err;
    res.header('Access-Controll-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});

router.get('/api/news', (req, res) => {
  News.findOne().sort('-_id').exec((err, doc) => {
    console.log(doc._id.getTimestamp())

    if (doc) {
      const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
      const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINUTES_IN_MS;
      const lessThan15MinutesAgo = diff < 0;

      if (lessThan15MinutesAgo) {
        res.send(doc);
        return;
      }
    }

    const url = 'http://cnn.com';

    request.get(url, (err, response, html) => {
      if (err) throw err;

      const news = [];
      const $ = cheerio.load(html);

      const $bannerText = $('.banner-text');

      news.push({
        title: $bannerText.text(),
        url: url + $bannerText.closest('a').attr('href')
      });

      const $cdHeadline = $('.cd__headline');

      _.range(1, 12).forEach(i => {
        const $headline = $cdHeadline.eq(i);

        news.push({
          title: $headline.text(),
          url: url + $headline.find('a').attr('href')
        });
      });

      const obj = new News({top: news})
      obj.save((err, newNews) => {
        if (err) throw err;

        res.send(newNews);
      });
    });
  });
});

module.exports = router;
