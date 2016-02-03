'use strict'

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'jade');

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Make Calendars Great Again!!',
    date: new Date() 
  });
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

app.all('*',(req,res)=>{
  res.status(403).send('Access Denied!');
});


app.listen(PORT, () => {
  console.log(`Node.js server has started. Listening on port ${PORT}`);
});
