'use strict'

const http = require('http');
const { PORT } = process.env;

http.createServer((req, res) => {
  console.log(req.method, req.url);

  res.writeHead(200, {
    'Content-type': 'text/html'
  })

  debugger;

  res.end('<<h1>Heyzzz</h1>');
}).listen(PORT, () => {
  console.log(`Node.js server has started. Listening on port ${PORT}`);
});
