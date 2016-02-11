'use strict'
// npm modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const storage = require('multer').diskStorage({destination: 'tmp/uploads', filename: function (req, file, cb) {
  //var ext = file.mimetype === 'image/jpeg' || 'image/jpg' ? 'jpeg' : 'jpg'
  //cb(null, 'yep' + '.' + ext);
  cb(null, file.originalname)
  }
});
const upload = require('multer')({storage: storage});
const imgur = require('imgur');
const path = require('path');
const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
// local modules
const PORT = process.env.PORT || 3000;
const MONGODB_URL = 'mongodb://localhost:27017/node-webserver';

let db;


// app.set creates a variable that is availble in all express modules
app.set('view engine', 'jade');
// app.locals is an object that can be passed to all res.render
app.locals.title = 'Make Calendars Great Again!!'

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  db.collection('news').findOne({}, {sort: {_id: -1}}, (err, result) => {
    if (err) throw (err);
    res.render('index', {
      topStory: result.top[0]
    });
  });
});

app.get('/calhome', (req, res) => {
  res.render('calhome', {
    date: new Date()
  });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/api', (req, res) => {
  res.header('Access-Controll-Allow-Origin', '*');
  res.send({hello: 'world'});
});

app.post('/api', (req, res) => {
  console.log(req.body);
  const obj =  _.mapValues(req.body, val => val.toUpperCase());

  db.collection('allcaps').insertOne(obj, (err, result) => {
    if (err) throw (err);
    console.log("res", result);
    res.send(obj);
  });
});

app.get('/api/weather', (req, res) => {
  const url = 'https://api.forecast.io/forecast/e49fa87af2ea266974efda95426a3070/37.8267,-122.423';

  request.get(url, (err, respnse, body) => {
    if (err) throw err;
    res.header('Access-Controll-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});

app.get('/api/news', (req, res) => {
  db.collection('news').findOne({}, {sort: {_id: -1}}, (err, doc) => {
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

      db.collection('news').insertOne({ top: news }, (err, result) => {
        if (err) throw err;

        res.send(news);
      });
    });
  });
});

//Posts use form data
app.post('/contact',(req,res) => {
  console.log(req.body);

  let contact = {
    name: req.body.name,
    email:  req.body.email,
    msg: req.body.message
  }

  db.collection('contact').insertOne(contact, (err, result) => {
    if (err) throw (err);
    res.send(`<h1>Thanks for contacting us ${contact.name}</h1>`);
  });
});

app.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});

app.post('/sendphoto', upload.single('image'), (req, res) => {
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

app.get('/hello', (req, res) => {
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

app.get('/random/:min/:max', (req, res) => {
  const min = req.params.min;
  const max = req.params.max;
  res.send(getRandomInt(+min, +max).toString());

  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
    }
  });

app.get('/cal/:month/:year', (req, res) => {
  const cal = require('node-cal/lib/month');
  const month = req.params.month;
  const year = req.params.year;
  res.end(`${cal.month2Args(month, year)}`);
  console.log(cal);
  });

app.all('/secret',(req,res)=>{
  res.status(403).send('Access Denied!');
});

MongoClient.connect(MONGODB_URL, (err, database) => {
  if (err) throw err;

  db = database;

  app.listen(PORT, () => {
  console.log(`Node.js server has started. Listening on port ${PORT}`);
  });
})


