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

const imgur = require('imgur');
const path = require('path');

const fs = require('fs');
const mongoose = require('mongoose');

const index = require('./routes/');



// local modules
const PORT = process.env.PORT || 3000;
const MONGODB_URL = 'mongodb://localhost:27017/node-webserver';

let db;


// app.set creates a variable that is availble in all express modules
app.set('view engine', 'jade');
// app.locals is an object that can be passed to all res.render
app.locals.title = 'Make Calendars Great Again!!'

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(index);

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));



app.all('/secret',(req,res)=>{
  res.status(403).send('Access Denied!');
});

mongoose.connect(MONGODB_URL);

mongoose.connection.on('open', () => {
  console.log('MONGO OPEN');
  // if (err) throw err;

  // db = database;

  app.listen(PORT, () => {
  console.log(`Node.js server has started. Listening on port ${PORT}`);
  });
})

module.exports = app;


