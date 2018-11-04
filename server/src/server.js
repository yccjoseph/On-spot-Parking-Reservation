const net = require('net');
const ip = '172.29.95.130';
const port = 9999;

const server = net.createServer(onClientConnected);

server.listen(port, ip, function() {
  console.log('server listening on %j', server.address());
});

function onClientConnected(socket) {
  const remoteAddr = socket.remoteAddress + ':' + socket.remotePort;
  console.log('client connected: %s', remoteAddr);

  socket.on('data', (data) => {
    console.log('data sent from %s : %s', remoteAddr, data);
    socket.write(data);
  });

  socket.on('close', () => {
    console.log('connection from %s closed', remoteAddr);
  });

  socket.on('error', (err) => {
    console.log('connection error from %s : %s', remoteAddr, err.message)
  })
}