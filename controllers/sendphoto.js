'use strict'

const upload = require('multer')({dest: 'tmp/uploads'});
const imgur = require('imgur');
const path = require('path');
const fs = require('fs');

module.exports.index = (req, res) => {
    res.render('sendphoto');
};


module.exports.new = (req, res) => {
    let db;
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
};
