const net = require('net');
const express = require('express');
const path = require ('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const ip = '192.168.1.159';
const port = 9999;
const nodePort = 5000;

const server = net.createServer(onClientConnected);
var app = express();
var d = null;
app.listen(nodePort, () => console.log(`express listening on port ${nodePort}`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

server.listen(port, ip, function() {
  console.log('server listening on %j', server.address());
});

app.get('/api/hello', (req, res) => {
  res.send(d);
  console.log(req.body);
})

function onClientConnected(socket) {
  const remoteAddr = socket.remoteAddress + ':' + socket.remotePort;
  console.log('client connected: %s', remoteAddr);

  socket.on('data', (data) => {
    d = data;
    console.log('data sent from %s : %s', remoteAddr, d);
    // axios({
    //   method: 'post',
    //   url: 'http://localhost:3000/',
    //   data: {
    //     occupied: 'yes'
    //   }
    // })
    // .then(function (response) {
    //   // console.log('data sent from %s : %s', remoteAddr, data);
    //   // console.log(response);
    // })
    // .catch(function (error) {
    //   /*
    //   if (error.response) {
    //     // The request was made and the server responded with a status code
    //     // that falls out of the range of 2xx
    //     console.log(error.response.data);
    //     console.log(error.response.status);
    //     console.log(error.response.headers);
    //   } else if (error.request) {
    //     // The request was made but no response was received
    //     // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //     // http.ClientRequest in node.js
    //     console.log("No response...");
    //     console.log(error.request);
    //   } else {
    //     // Something happened in setting up the request that triggered an Error
    //     console.log("Unknown error")
    //     console.log('Error', error.message);
    //   }
    //   console.log(error.config);
    //   */
    // });
    socket.write(data);
  });

  socket.on('close', () => {
    console.log('connection from %s closed', remoteAddr);
  });

  socket.on('error', (err) => {
    console.log('connection error from %s : %s', remoteAddr, err.message)
  })
}