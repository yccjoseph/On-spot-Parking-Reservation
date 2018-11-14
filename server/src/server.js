const net = require('net');
const express = require('express');
const path = require ('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const ip = '10.230.12.127';
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

app.get('/api/check', (req, res) => {
  res.send(d);
  console.log(req.body);
})

function onClientConnected(socket) {
  const remoteAddr = socket.remoteAddress + ':' + socket.remotePort;
  console.log('client connected: %s', remoteAddr);

  socket.on('data', (data) => {
    d = data;
    console.log('data sent from %s : %s', remoteAddr, d);
    // socket.write(data);
  });

  socket.on('close', () => {
    console.log('connection from %s closed', remoteAddr);
  });

  socket.on('error', (err) => {
    console.log('connection error from %s : %s', remoteAddr, err.message)
  })
}