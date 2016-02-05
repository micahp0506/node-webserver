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

// local modules
const PORT = process.env.PORT || 3000;


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
  res.render('index', {
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
  res.send(obj);
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
  const url = 'http://cnn.com';

  request.get(url, (err, response, html) => {
    if (err) throw err;

    const news = [];
    // Cheerio is like jquery for node
    const $ = cheerio.load(html);

    news.push({
      title: $('.banner-text').text(),
      url: url + $('.banner-text').closest('a').attr('href'),
    });
      // loops through 1 -11
    _.range(1,12).forEach(i => {
      news.push({
        title: $('.cd__headline').eq(i).text(),
        url: url + $('.cd__headline').eq(i).find('a').attr('href')
      })
    });

    res.send(news);
  });
});

//Posts use form data
app.post('/contact',(req,res) => {
  console.log(req.body);
  const name = req.body.name;
  res.send(`<h1>Thanks for contacting us ${name}!!</h1>`)
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


app.listen(PORT, () => {
  console.log(`Node.js server has started. Listening on port ${PORT}`);
});
