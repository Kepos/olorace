let isAdmin = true;

let currentGame = 'games-panel';
let currentGameState = 0;
const games = [
  'game-quiz-question-1', // case 1
  'game-quiz-question-2', // case 1
  'game-quiz-question-3', // case 1
  'game-quiz-question-4', // case 1
  'game-umfragewerte', // case 5
  'game-einsortieren', // case 6
  'game-pantomime', // case 7
  'game-kategorie', // case 8
  'game-mapfinder', // case 9
  'game-whoisthis', // case 10
  'game-songs', // case 11
  'game-teamguessing', // case 12
  'game-multiple-choice', // case 13
  'game-creative-writing', // case 14
  'game-blamieren-kassieren', // case 15
  'game-mitspieler', // case 16
];

let game_payload;

let quizData;

async function loadQuizData() {
  const response = await fetch('questions/questions.json');
  const data = await response.json();

  quizData = data.gameQuestions;
}

loadQuizData();

// unused
const onChatSubmitted = (sock) => (e) => {
  e.preventDefault();
};

const onPlayButtonClicked = (sock) => () => {
  // sock.emit('message', 'lets play!');
  sock.emit('signup', { name: enteredPlayerName, car: selectedCarIndex });
};

(() => {
  const sock = io();

  sock.on('message', (text) => {});

  sock.on('admin', () => {
    console.log('You are the admin!');
    isAdmin = true;
    document.getElementById('select-racetrack').style.display = 'inline';
  });

  sock.on('Buzzer', (name) => {
    document.getElementById('namelabel').innerHTML = name + ' buzzered!';
  });

  sock.on('new-game', (number) => {
    currentGame = games[number - 1];
    gameSelectionAnimation(number);
  });

  sock.on('new-score', (teamNo, score) => {
    animateCounter('score-' + teamNo, score, 2000); // id, Zielwert, Dauer in ms
  });

  sock.on('back-to-panel', () => {
    currentGame = 'games-panel';
    currentGameState = 0;
    changeView(0); // id, Zielwert, Dauer in ms
  });

  sock.on('restart', () => {
    location.reload();
  });

  console.log('welcome');

  //   document
  //     .getElementsByClassName('play-button')[0]
  //     .addEventListener('click', onPlayButtonClicked(sock));

  restartGame = () => {
    let rp = document.getElementById('restart-panel');
    rp.style.display = 'flex';
    sock.emit('restart');
  };

  sock.on('next', (payload) => {
    game_payload = payload;
    changeView();
  });
})();

function onNameChanged() {
  let playerName = document.getElementsByClassName('name-input')[0];
  enteredPlayerName = playerName.value;

  checkForCompleteData();
}

function setCurrentGameView() {
  console.log('setCurrentGameView!');
  switch (currentGame) {
    // Game No. 1
    case 'game-quiz-question-1':
    case 'game-quiz-question-2':
    case 'game-quiz-question-3':
    case 'game-quiz-question-4':
      switch (currentGameState) {
        case 0:
          // Show Quiz Card Options
          document
            .getElementById('game-quiz-question-options')
            .classList.remove('hidden');
          document
            .getElementById('game-quiz-question-question')
            .classList.add('hidden');
          currentGameState++;
          break;
        case 1:
          // Show Quiz Question
          document
            .getElementById('game-quiz-question-options')
            .classList.add('hidden');
          let question = document.getElementById('game-quiz-question-question');
          question.textContent =
            quizData[`game-quiz-question-1`].questions[
              game_payload - 1
            ].question;
          question.classList.remove('hidden');

          currentGameState--;
          break;
      }
      break;

    // Game No 5
    case 'game-umfragewerte':
      switch (currentGameState) {
        case 0:
          let elem = document.getElementById('game-multiple-choice-question');
          elem.textContent = quizData[currentGame].questions[0].question;
          elem.classList.remove('hidden');
          currentGameState++;
          break;
        case 1:
          document
            .getElementById('game-multiple-choice-answers')
            .classList.remove('hidden');
          currentGameState++;
          break;
        case 2:
          document.getElementById(
            'game-multiple-choice-question'
          ).textContent += 'Show Votes!';
          currentGameState = 0;
          break;
      }
      break;

    // Game No 6
    case 'game-einsortieren':
      switch (currentGameState) {
        case 0:
          document
            .getElementById('game-einsortieren-game')
            .classList.remove('hidden');
          currentGameState++;
          break;
        case 1:
          document
            .getElementById('game-einsortieren-game')
            .classList.remove('hidden');
          // Next List !!
          break;
      }
      break;

    // Game no 7
    case 'game-pantomime':
      switch (currentGameState) {
        case 0:
          startTimer(60);
          break;
      }
      break;

    // Game no 8
    case 'game-kategorie':
      switch (currentGameState) {
        case 0:
          startTimer(60);
          break;
      }
      break;

    // Game no 9
    case 'game-mapfinder':
      switch (currentGameState) {
        case 0:
          // Show Question / Map
          document.getElementById('map').classList.remove('hidden');
          currentGameState++;
          break;
        case 1:
          // Show Markers
          currentGameState++;
          break;
        case 2:
          // Show Correct Marker
          currentGameState++;
          break;
        case 3:
          // Show Leaderboard
          currentGameState++;
          break;
        case 4:
          // Show Team Average
          currentGameState = 0;
          break;
      }
      break;

    // Game no 10
    case 'game-whoisthis':
      switch (currentGameState) {
        case 0:
          document
            .getElementById('game-whoisthis-game')
            .classList.remove('hidden');
          // Show next picture
          break;
      }
      break;

    // Game no 11
    case 'game-songs':
      switch (currentGameState) {
        case 0:
          break;
      }
      break;

    // Game no 12
    case 'game-teamguessing':
      switch (currentGameState) {
        case 0:
          document
            .getElementById('game-teamguessing-question')
            .classList.remove('opacity-0');
          currentGameState++;
          break;
        case 1:
          document
            .querySelectorAll('.game-teamguessing-answers-table')
            .forEach((elem) => elem.classList.remove('opacity-0'));
          currentGameState++;
          break;
      }
      break;

    // Game no 13
    case 'game-multiple-choice':
      switch (currentGameState) {
        case 0:
          document
            .getElementById('game-multiple-choice-question')
            .classList.remove('hidden');
          currentGameState++;
          break;
        case 1:
          document
            .getElementById('game-multiple-choice-answers')
            .classList.remove('hidden');
          currentGameState++;
          break;
        case 2:
          document.getElementById(
            'game-multiple-choice-question'
          ).textContent += 'Show Votes!';
          currentGameState = 0;
          break;
      }
      break;

    // Game no 14
    case 'game-creative-writing':
      switch (currentGameState) {
        case 0:
          document
            .getElementById('game-creative-writing-prompt')
            .classList.remove('hidden');
          document
            .getElementById('game-creative-writing-game')
            .classList.add('hidden');
          currentGameState++;
          break;
        case 1:
          document
            .getElementById('game-creative-writing-prompt')
            .classList.add('hidden');
          document
            .getElementById('game-creative-writing-game')
            .classList.remove('hidden');
          currentGameState++;
          break;
        case 2:
          // Show Votes
          currentGameState = 0;
          break;
      }
      break;

    // Game no 15
    case 'game-blamieren-kassieren':
      switch (currentGameState) {
        case 0:
          break;
      }
      break;

    // Game no 16
    case 'game-mitspieler':
      switch (currentGameState) {
        case 0:
          document
            .getElementById('game-teamguessing-question')
            .classList.remove('opacity-0');
          currentGameState++;
          break;
        case 1:
          document
            .querySelectorAll('.game-teamguessing-answers-table')
            .forEach((elem) => elem.classList.remove('opacity-0'));
          currentGameState++;
          break;
      }
      break;

    // BIG DEFAULT
    default:
      break;
  }
}
