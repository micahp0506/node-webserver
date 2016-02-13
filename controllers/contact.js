'use strict'


module.exports.index = (req, res) => {
    res.render('contact');
};


module.exports.new = (req,res) => {

  let obj = new Contact({
    name: req.body.name,
    email:  req.body.email,
    msg: req.body.message
  });

  obj.save((err, newObj) => {
    if (err) throw (err);

    res.send(`<h1>Thanks for contacting us ${newObj.name}</h1>`);
  });
};
