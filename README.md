# On-spot-Parking-Reservation

- `git pull` to pull request from git
- `ifconfig` to get local ip address
- `/server/src/server.js`: change `ip` to local ip address to run locally
- `npm install` to install all npm dependencies
- `npm start` to run the program


## IP configuration
- Set the server IP in `server.js`:
```
const ip = '172.29.95.130';
```
- Set the same IP in `receiver.ino`:
```
#define SERVER_IP "172.29.95.130"
```
Note: `port 9999` is for TCP/IP connection between receiver Arduino and Web server, `port 5000` is for Web server internal connection.