'use strict'


module.export.index = (req, res) => {
    res.render('sendphoto');
};


module.export.new = (req, res) => {
    res.send('<h1>Thanks for sharing your photo!!<h1>');
};
