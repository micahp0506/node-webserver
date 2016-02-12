'use strict';


const express = require('express');
const router = express.Router();
const upload = require('multer')({dest: 'tmp/uploads'});
const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');

const News = require('../models/news');
const Allcaps = require('../models/allcaps');
const Contact = require('../models/contact');

router.get('/', (req, res) => {
  News.findOne().sort('-_id').exec((err, doc) => {
    if (err) throw (err);
    res.render('index', {
      topStory: doc.top[0]
    });
  });
});

router.get('/calhome', (req, res) => {
  res.render('calhome', {
    date: new Date()
  });
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

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







//Posts use form data
router.post('/contact',(req,res) => {

  console.log(req.body);

  let obj = new Contact({
    name: req.body.name,
    email:  req.body.email,
    msg: req.body.message
  });

  obj.save((err, newObj) => {
    if (err) throw (err);

    console.log(newObj);
    res.send(`<h1>Thanks for contacting us ${newObj.name}</h1>`);
  });
  // db.collection('contact').insertOne(obj, (err, result) => {
  //   if (err) throw (err);
  //   res.send(`<h1>Thanks for contacting us ${obj.name}</h1>`);
  // });
});









router.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});

router.post('/sendphoto', upload.single('image'), (req, res) => {
  //console.log(req.body, req.file);
  //console.log('/Users/Micah/workspace/node-webserver/' + `${req.file.path}`);
  let imgurPath = '/Users/Micah/workspace/node-webserver/' + `${req.file.path}`;
  console.log(imgurPath);
  imgur.uploadFile(imgurPath)
    .then(function (json) {
        console.log(json.data.link);
        let imageLink = {
          link: json.data.link
        }
        db.collection('image').insertOne(imageLink, (err, result) => {
          console.log(imageLink);
        });

        fs.unlink(imgurPath, (err) => {
          if (err) throw err;
        });
    })
    .catch(function (err) {
        console.error(err.message);
    });
  res.send('<h1>Thanks for sharing your photo!!<h1>');

  });






router.get('/hello', (req, res) => {
  const name = req.query.name;
  const msg = `<h1>Hello ${name}!!!!!</h1>`;
  console.log('Query PARAAMS', req.query);
  res.writeHead(200, {

    'Content-Type': 'text/html'

  });

  // Chunk repsonse by cahracter
  msg.split('').forEach((char, i) =>{
    setTimeout(() => {
      res.write(char);
    }, 500 * i);
  });

  // Wait for all characters to be sent
  setTimeout(() => {
    res.end();
   },10000);

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
