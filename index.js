const https = require('http'); //! HTTPS en production
const app = require('./app');
// const port = process.env.PORT || 3003;
const port = 3003;
const fs = require('fs');


// const server = https.createServer({
//   key: fs.readFileSync('ssl_cert/key.pem'),
//   cert: fs.readFileSync('ssl_cert/cert.pem'),
//   passphrase: 'yhqniw'
// },app);

const server = https.createServer(app);

const io = require('socket.io')(server);
// socket io
io.on('connection', function (socket) {
    console.log('User connected');

    socket.on('save-film', function (data) {
      console.log(data);
      io.emit('new-film', { film: data });
    });

    socket.on('save-post', function (data) {
      console.log(data);
      io.emit('new-post', { post: data });
    });
    
  });

server.listen(port);