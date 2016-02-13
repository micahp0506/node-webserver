'use strict'

module.exports.index = (req, res) => {
  res.render('calhome', {
    date: new Date()
  });
};

module.exports.new =  (req, res) => {
  const cal = require('node-cal/lib/month');
  const month = req.params.month;
  const year = req.params.year;
  res.end(`${cal.month2Args(month, year)}`);
  console.log(cal);
};
