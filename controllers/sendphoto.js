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
    // Uploading image to imgur
    imgur.uploadFile(imgurPath)
        // it will resolve a promise with a link to the stored image
        .then(function (json) {
            // Promise returns link to image at imgur
            console.log(json.data.link);
            let imageLink = {
                link: json.data.link
            }
            // Storing image at mongodb
            db.collection('image').insertOne(imageLink, (err, result) => {
                console.log(imageLink);
            });
            // Removing image from local storage
            fs.unlink(imgurPath, (err) => {
                if (err) throw err;
            });
        })
        .catch(function (err) {
            console.error(err.message);
        });
    // Sending confirmation to DOM
    res.send('<h1>Thanks for sharing your photo!!<h1>');
};
