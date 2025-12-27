let sock;

let currentGame = 'login-screen';
let currentGameState = 0;

let quizData;

let game_payload;

async function loadQuizData() {
  const response = await fetch('../questions/questions.json');
  const data = await response.json();

  quizData = data.gameQuestions;
}
loadQuizData();

// Get Name & Team from LocalStorage:
const playerName = localStorage.getItem('playerName');
const playerTeam = localStorage.getItem('playerTeam');

if (playerName && playerTeam) {
  document.getElementById('player-name-input').value = playerName;
  document.getElementById('team-selection').value = playerTeam;
}

// unused
const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();
};

function onBuzzerClicked() {
  // sock.emit('message', 'lets play!');
  // document.getElementById('nameinput').value;
  sock.emit('Buzzer', sock.id);
}

function onLoginButtonClicked() {
  // sock.emit('message', 'lets play!');
  let name = document.getElementById('player-name-input').value.trim();
  let team = document.getElementById('team-selection').value;
  if (name.length < 2) {
    alert('Bitte Namen eingeben');
    return;
  }
  console.log({ name: name, team: team });

  localStorage.setItem('playerName', name);
  localStorage.setItem('playerTeam', team);

  sock.emit('Login', { name: name, team: team }, (response) => {
    if (response.status == 'ok') {
      currentGame = response.game;
      currentGameState = response.gamestate;
      changeView();

      document.getElementById('player-info-name').textContent = name;
      document.getElementById('player-info-id').textContent = `${
        parseInt(team) + 1
      } #${sock.id.slice(0, 3)}`;
    }
  });
}

function onAnswerButtonClicked(payload = null) {
  switch (currentGame) {
    case 'game-creative-writing': {
      switch (currentGameState % 3) {
        case 1: {
          if (!payload || payload.length < 1 || payload === '') {
            alert('Please enter your answer');
            return;
          }
          break;
        }
        case 2: {
          const selected = document.querySelector('input[name="word"]:checked');
          if (!selected) {
            alert('Please select an answer');
            return;
          }
          payload = selected.nextElementSibling.dataset.playerId;
        }
      }
      break;
    }
    case 'game-mapfinder': {
      if (!markerLocation) {
        alert('Please select a location');
        return;
      }
      payload = markerLocation;
      break;
    }
    case 'game-teamguessing': {
      if (!isValidIntegerString(payload)) {
        alert('Please enter a valid answer');
        return;
      }
      break;
    }
    case 'game-mitspieler': {
      if (payload == '') {
        alert('Please enter a valid answer');
        return;
      }
      break;
    }
  }

  sock.emit(
    'player-answer',
    payload,
    currentGame,
    currentGameState,
    (response) => {
      // maybe disable, neue Antwort schicken können möglich?
      if (response.status == 'ok') {
        currentGame = 'waiting-screen';
        currentGameState = 0;
        changeView();
      }
    }
  );
}

function isValidIntegerString(value) {
  return (
    typeof value === 'string' && value.trim() !== '' && /^-?\d+$/.test(value)
  );
}

(() => {
  sock = io();

  // document
  //   .getElementsByClassName('play-button')[0]
  //   .addEventListener('click', onBuzzerClicked(sock));
  // document
  //   .getElementById('login-button')
  //   .addEventListener('click', onLoginButtonClicked(sock));

  sock.on('message', (text) => {});

  sock.on('admin', () => {
    // console.log('You are the admin!');
    // isAdmin = true;
    // document.getElementById('select-racetrack').style.display = 'inline';
  });

  sock.on('new-game', (newGame) => {
    if (currentGame == 'login-screen') return;
    currentGame = newGame;
    currentGameState = 0;
    changeView();
  });

  sock.on('back-to-panel', () => {
    if (currentGame == 'login-screen') return;
    currentGame = 'games-panel';
    currentGameState = 0;
    changeView();
  });

  sock.on('player-game-state', (game, gamestate, payload = null) => {
    if (currentGame == 'login-screen') return;
    currentGame = game;
    currentGameState = gamestate;
    game_payload = payload;
    changeView();
  });

  sock.on('restart', () => {
    location.reload();
  });

  sock.on('disconnect', () => {
    currentGame = 'login-screen';
    currentGameState = 0;
    changeView();
  });

  console.log('welcome');

  restartGame = () => {
    let rp = document.getElementById('restart-panel');
    rp.style.display = 'flex';
    sock.emit('restart');
  };
})();
