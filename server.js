'use strict'

const express = require('express');
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
const PORT = process.env.PORT || 3000;

const app = express();

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

app.use(express.static(path.join(__dirname, 'public')));

//app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.render('index', {
    date: new Date()
  });
});

app.get('/contact', (req, res) => {
  res.render('contact');
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
  console.log(req.body, req.file);
  console.log('/Users/Micah/workspace/node-webserver/' + `${req.file.path}`);
  let imgurPath = '/Users/Micah/workspace/node-webserver/';
  console.log(imgurPath + `${req.file.path}`)
  imgur.uploadFile(imgurPath + `${req.file.path}`)
    .then(function (json) {
        console.log(json.data.link);
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
