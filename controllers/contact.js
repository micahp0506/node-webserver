'use strict'


module.exports.index = (req, res) => {
    res.render('contact');
};


module.exports.new = (req,res) => {

  console.log(req.body);

  let obj = new Contact({
    name: req.body.name,
    email:  req.body.email,
    msg: req.body.message
  });

  obj.save((err, newObj) => {
    if (err) throw (err);

    console.log(newObj);
    res.send(`<h1>Thanks for contacting us ${newObj.name}</h1>`);
  });
  // db.collection('contact').insertOne(obj, (err, result) => {
  //   if (err) throw (err);
  //   res.send(`<h1>Thanks for contacting us ${obj.name}</h1>`);
  // });
};
