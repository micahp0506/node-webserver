'use strict'


const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');

const Allcaps = require('../models/allcaps');
const News = require('../models/news');

module.exports.index = (req, res) => {
  News.findOne().sort('-_id').exec((err, doc) => {
    if (err) throw (err);
    doc = doc || {top: ['']};
    res.render('index', {
      topStory: doc.top[0]
    });
  });
};

module.exports.apiindex = (req, res) => {
  res.header('Access-Controll-Allow-Origin', '*');
  res.send({hello: 'world'});
};

module.exports.uppercase = (req, res) => {
  console.log(req.body);
  const obj = _.mapValues(req.body, val => val.toUpperCase());
  const caps =  new Allcaps(obj);

  caps.save((err, result) => {
    if (err) throw (err);
    console.log("res", result);
    res.send(result);
  });
};

module.exports.weather = (req, res) => {
  const url = 'https://api.forecast.io/forecast/e49fa87af2ea266974efda95426a3070/37.8267,-122.423';

  request.get(url, (err, respnse, body) => {
    if (err) throw err;
    res.header('Access-Controll-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
};

module.exports.news = (req, res) => {
  News.findOne().sort('-_id').exec((err, doc) => {

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
};


