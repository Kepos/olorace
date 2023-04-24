let enteredPlayerName = '';
let selectedCarIndex;
let selectedTrack = '';
let cars = ['green', 'blue', 'yellow', 'red'];
let tracks = ['NBG', 'Raincastle', 'Monaco', 'Custom'];

const log = (text) => {};

const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();
};

const onPlayButtonClicked = (sock) => () => {
  let gameSettings = document.getElementsByClassName(
    'game-settings-container'
  )[0];
  gameSettings.style.display = 'none';

  // sock.emit('message', 'lets play!');
  sock.emit('signup', { name: enteredPlayerName, color: selectedCarIndex });

  initGame();
};

(() => {
  const sock = io();

  sock.on('message', (text) => {
    console.log(text);
    let response = 'Hello from client!';
    // sock.emit('message', response);
  });

  sock.on('admin', () => {
    console.log('You are the admin!');
    document.getElementById('select-racetrack').style.display = 'inline';
  });

  console.log('welcome');

  document
    .getElementsByClassName('play-button')[0]
    .addEventListener('click', onPlayButtonClicked(sock));
})();

function onNameChanged() {
  let playerName = document.getElementsByClassName('name-input')[0];
  enteredPlayerName = playerName.value;

  checkForCompleteData();
}

function onSelectRacecar(index) {
  console.log('racecar selected!');

  let cards = document.getElementsByClassName('racecar-card');

  for (let i = 0; i < cards.length; i++) {
    cards[i].style.border = '3px solid transparent';
    // cards[i].style.transform = 'translateY(0px)';
  }
  cards[index].style.border = '3px solid green';
  // cards[index].style.transform = 'translateY(-10px)';

  selectedCarIndex = index;

  checkForCompleteData();
}

function onSelectTrack(index) {
  console.log('track selected!');

  let cards = document.getElementsByClassName('track-card');

  for (let i = 0; i < cards.length; i++) {
    cards[i].style.border = '3px solid transparent';
    // cards[i].style.transform = 'translateY(0px)';
  }
  cards[index].style.border = '3px solid green';
  // cards[index].style.transform = 'translateY(-10px)';

  selectedTrack = tracks[index];
  checkForCompleteData();
}

function checkForCompleteData() {
  let playButton = document.getElementsByClassName('play-button')[0];

  if (
    selectedCarIndex &&
    selectedTrack &&
    enteredPlayerName &&
    enteredPlayerName.length > 1
  ) {
    playButton.disabled = false;
  } else {
    playButton.disabled = true;
  }
}

function onPlayyyyButtonClicked() {
  let gameSettings = document.getElementsByClassName(
    'game-settings-container'
  )[0];
  io.gameSettings.style.display = 'none';
}
