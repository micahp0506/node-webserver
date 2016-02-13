'use strict'


module.exports.index = (req, res) => {
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

};
