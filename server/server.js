const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const createGame = require('./create-game');

const app = express();

app.use(express.static(`${__dirname}/../client`, { index: 'racegame.html' }));

const server = http.createServer(app);
const io = socketio(server);
const { addPlayer, addMove, getMoves, setTrack, getTrack, restart } =
  createGame();

let players = [];

function getNextFreeIndex() {
  for (let i = 0; i <= players.length; i++) {
    if (!players.includes(i)) return i;
  }

  return players.length;
}

io.on('connection', (sock) => {
  const playerID = sock.id;

  console.log('someone connected:', playerID);
  sock.emit('message', 'You are connected!!');

  if (players.length === 0) {
    players.push(playerID);
    sock.emit('admin', null);
  }

  sock.on('message', (text) => console.log(`got text: ${text}`));

  sock.on('signup', (player) =>
    console.log(`new player: ${player.name} ${player.color}`)
  );

  sock.on('disconnect', (reason) => {
    console.log('player disconnected: ', playerID);
    var index = players.indexOf(playerID);
    if (index !== -1) {
      players.splice(index, 1);
    }
  });
});

server.on('error', (err) => {
  console.error(err);
});

server.listen(8080, () => {
  console.log('server is ready');
});
