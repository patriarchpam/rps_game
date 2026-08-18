// Game configuration
const GAMES = {
  original: {
    choices: ['rock', 'paper', 'scissors'],
    rules: {
      rock: ['scissors'],
      paper: ['rock'],
      scissors: ['paper']
    }
  },
  bonus: {
    choices: ['rock', 'paper', 'scissors', 'lizard', 'spock'],
    rules: {
      rock: ['scissors', 'lizard'],
      paper: ['rock', 'spock'],
      scissors: ['paper', 'lizard'],
      lizard: ['spock', 'paper'],
      spock: ['scissors', 'rock']
    }
  }
};

// Game state
let gameState = {
  mode: 'original',
  score: localStorage.getItem('rpsScore') ? parseInt(localStorage.getItem('rpsScore')) : 0,
  playerChoice: null,
  houseChoice: null,
  result: null
};

// DOM Elements
const scoreValue = document.getElementById('score');
const modeToggle = document.getElementById('modeToggle');
const choicesContainer = document.getElementById('choicesContainer');
const step1 = document.getElementById('step1');
const stepResults = document.getElementById('stepResults');
const playerChoiceDisplay = document.getElementById('playerChoice');
const houseChoiceDisplay = document.getElementById('houseChoice');
const resultMiddle = document.getElementById('resultMiddle');
const playAgainBtn = document.getElementById('playAgainBtn');
const rulesBtn = document.getElementById('rulesBtn');
const rulesModal = document.getElementById('rulesModal');
const closeModal = document.getElementById('closeModal');
const rulesImage = document.getElementById('rulesImage');

// Initialize game
function init() {
  updateScore();
  renderChoices();
  setupEventListeners();
}

// Update score display
function updateScore() {
  scoreValue.textContent = gameState.score;
}

// Save score to localStorage
function saveScore() {
  localStorage.setItem('rpsScore', gameState.score);
}

// Render choice buttons
function renderChoices() {
  choicesContainer.innerHTML = '';
  const choices = GAMES[gameState.mode].choices;
  
  choices.forEach(choice => {
    const button = document.createElement('button');
    button.className = `choice-btn ${choice}`;
    button.dataset.choice = choice;
    button.innerHTML = `<img src="./images/icon-${choice}.svg" alt="${choice}">`;
    button.addEventListener('click', () => handlePlayerChoice(choice));
    choicesContainer.appendChild(button);
  });
}

// Handle player choice
async function handlePlayerChoice(choice) {
  gameState.playerChoice = choice;
  gameState.houseChoice = getRandomChoice();
  gameState.result = determineResult(choice, gameState.houseChoice);
  
  // Update score if player won
  if (gameState.result === 'win') {
    gameState.score++;
  } else if (gameState.result === 'lose') {
    gameState.score--;
  }
  
  updateScore();
  saveScore();
  
  // Show results after a brief delay
  showResults();
}

// Get random choice for house
function getRandomChoice() {
  const choices = GAMES[gameState.mode].choices;
  return choices[Math.floor(Math.random() * choices.length)];
}

// Determine game result
function determineResult(playerChoice, houseChoice) {
  if (playerChoice === houseChoice) {
    return 'draw';
  }
  
  const rules = GAMES[gameState.mode].rules[playerChoice];
  if (rules.includes(houseChoice)) {
    return 'win';
  }
  
  return 'lose';
}

// Show results screen
function showResults() {
  step1.classList.add('hidden');
  stepResults.classList.remove('hidden');
  
  // Display player choice
  playerChoiceDisplay.className = `choice-display ${gameState.playerChoice}`;
  playerChoiceDisplay.innerHTML = `<img src="./images/icon-${gameState.playerChoice}.svg" alt="${gameState.playerChoice}">`;
  
  // Display house choice with animation
  houseChoiceDisplay.className = `choice-display`;
  houseChoiceDisplay.innerHTML = `<div class="hidden"></div>`;
  
  // Show result text after a delay
  resultMiddle.innerHTML = '';
  
  setTimeout(() => {
    houseChoiceDisplay.className = `choice-display ${gameState.houseChoice}`;
    houseChoiceDisplay.innerHTML = `<img src="./images/icon-${gameState.houseChoice}.svg" alt="${gameState.houseChoice}">`;
    
    const resultText = document.createElement('div');
    resultText.className = 'result-text';
    
    if (gameState.result === 'win') {
      resultText.textContent = 'YOU WIN';
    } else if (gameState.result === 'lose') {
      resultText.textContent = 'YOU LOSE';
    } else {
      resultText.textContent = 'DRAW';
    }
    
    resultMiddle.appendChild(resultText);
    resultMiddle.appendChild(playAgainBtn);
  }, 1000);
}

// Play again
function playAgain() {
  gameState.playerChoice = null;
  gameState.houseChoice = null;
  gameState.result = null;
  
  step1.classList.remove('hidden');
  stepResults.classList.add('hidden');
  resultMiddle.innerHTML = '';
}

// Toggle game mode
function toggleMode() {
  gameState.mode = gameState.mode === 'original' ? 'bonus' : 'original';
  
  if (gameState.mode === 'bonus') {
    document.body.classList.add('bonus-mode');
    rulesImage.src = './images/image-rules-bonus.svg';
    modeToggle.textContent = 'ORIGINAL';
  } else {
    document.body.classList.remove('bonus-mode');
    rulesImage.src = './images/image-rules.svg';
    modeToggle.textContent = 'BONUS';
  }
  
  // Reset to choice selection
  playAgain();
  renderChoices();
}

// Show/hide rules modal
function toggleRulesModal() {
  rulesModal.classList.toggle('show');
}

// Setup event listeners
function setupEventListeners() {
  modeToggle.addEventListener('click', toggleMode);
  playAgainBtn.addEventListener('click', playAgain);
  rulesBtn.addEventListener('click', toggleRulesModal);
  closeModal.addEventListener('click', toggleRulesModal);
  rulesModal.addEventListener('click', (e) => {
    if (e.target === rulesModal) {
      toggleRulesModal();
    }
  });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);
