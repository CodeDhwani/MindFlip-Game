// HTML Elements
const cardGrid = document.getElementById("card-grid");
const resetButton = document.getElementById("reset");
const movesCounter = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const difficultySelect = document.getElementById("difficulty");
const domainSelect = document.getElementById("domain");
const startGameButton = document.getElementById("start-game");
const gameContainer = document.getElementById("game-container");
const frontPage = document.getElementById("front-page");

// Game Variables
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let timer = 0;
let interval;
let difficulty = "easy";
let domain = "food";
let cards = [];

// Emoji Data
const emojiData = {
  food: {
    emojis: ["🍕", "🍔", "🍟", "🌭", "🍿", "🥗", "🍩", "🍪"],
    names: ["Pizza", "Burger", "Fries", "Hotdog", "Popcorn", "Salad", "Donut", "Cookie"],
  },
  animals: {
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
    names: ["Dog", "Cat", "Mouse", "Hamster", "Rabbit", "Fox", "Bear", "Panda"],
  },
  colors: {
    emojis: ["🔴", "🟢", "🔵", "🟡", "🟠", "🟣", "🟤", "⚪"],
    names: ["Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Brown", "White"],
  },
};

// Shuffle Array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Create Cards
function createCards() {
  const { emojis, names } = emojiData[domain];
  const selectedCount = difficulty === "easy" ? 8 : difficulty === "medium" ? 18 : 32;
  const selectedEmojis = emojis.slice(0, selectedCount / 2);
  const selectedNames = names.slice(0, selectedCount / 2);

  cards = selectedEmojis.flatMap((emoji, index) => [
    { id: index * 2, emoji, name: selectedNames[index], flipped: false },
    { id: index * 2 + 1, emoji, name: selectedNames[index], flipped: false },
  ]);

  shuffle(cards);
}

// Display Cards
function displayCards() {
  cardGrid.innerHTML = "";
  cardGrid.style.gridTemplateColumns = `repeat(${difficulty === "easy" ? 4 : difficulty === "medium" ? 6 : 8}, 1fr)`;
  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = card.id;

    cardElement.innerHTML = `
      <div class="card-content">
        <div class="emoji">${card.emoji}</div>
        <div class="name">${card.name}</div>
      </div>
    `;

    cardElement.addEventListener("click", () => flipCard(card, cardElement));
    cardGrid.appendChild(cardElement);
  });
}

// Flip Card
function flipCard(card, cardElement) {
  if (lockBoard || card.flipped || firstCard === card) return;

  card.flipped = true;
  cardElement.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    moves++;
    movesCounter.textContent = moves;
    checkForMatch();
  }
}

// Check for Match
function checkForMatch() {
  lockBoard = true;

  if (firstCard.name === secondCard.name) {
    resetTurn();
  } else {
    setTimeout(() => {
      document.querySelector(`[data-id="${firstCard.id}"]`).classList.remove("flipped");
      document.querySelector(`[data-id="${secondCard.id}"]`).classList.remove("flipped");
      firstCard.flipped = false;
      secondCard.flipped = false;
      resetTurn();
    }, 1000);
  }
}

// Reset Turn
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Start Game
function startGame() {
  moves = 0;
  timer = 0;
  movesCounter.textContent = moves;
  timerDisplay.textContent = `${timer}s`;
  createCards();
  displayCards();
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `${timer}s`;
  }, 1000);
}

// Event Listeners
difficultySelect.addEventListener("change", (e) => {
  difficulty = e.target.value;
  startGame();
});

domainSelect.addEventListener("change", (e) => {
  domain = e.target.value;
  startGame();
});

resetButton.addEventListener("click", startGame);

startGameButton.addEventListener("click", () => {
  frontPage.style.display = "none";
  gameContainer.style.display = "block";
  startGame();
});

// Initialize Game on First Load
frontPage.style.display = "block";
gameContainer.style.display = "none";

