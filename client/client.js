const log = (text) => {};

const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();
};

(() => {
  const sock = io();

  sock.on('message', (text) => {
    console.log(text);
    let response = 'Hello from client!';
    // sock.emit('message', response);
  });

  console.log('welcome');
})();

function onSelectRacecar(index) {
  console.log('function called!');

  let cards = document.getElementsByClassName('racecar-card');

  for (let i = 0; i < cards.length; i++) {
    cards[i].style.border = '3px solid transparent';
    // cards[i].style.transform = 'translateY(0px)';
  }
  cards[index].style.border = '3px solid green';
  // cards[index].style.transform = 'translateY(-10px)';
}

function onPlayButtonClicked() {
  let gameSettings = document.getElementsByClassName(
    'game-settings-container'
  )[0];
  gameSettings.style.display = 'none';
}
