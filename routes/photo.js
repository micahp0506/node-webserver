'use strict'


const express = require('express');
const router = express.Router();
const upload = require('multer')({dest: 'tmp/uploads'});

const

router.get('/sendphoto', );

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


  });



module.exports = router;
