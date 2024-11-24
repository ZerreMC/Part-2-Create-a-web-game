// Deck actions

function makeDeck() {
  const suits = ['copas', 'oros', 'espadas', 'bastos'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '10', '11', '12'];
  const deck = [];

  for (let suit of suits) {
    for (let rank of ranks) {
      let value;
      

      if (rank === '10' || rank === '11' || rank === '12') {
        value = 0.5;
      } else {
        value = parseInt(rank);
      }

      deck.push({ rank, suit, value });
    }
  }
  
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function drawCard(deck) {
  return deck.pop();
}


// Player actions

function calculateScore(hand) {
  let score = 0;
  if (hand.length===0) return 0;
  else {
    for (let card of hand) {
      score += card.value;
    }
  }
  return score;
}

function addPlayer(bot) {
  return {
    name: "User",
    hand: [],
    currency: parseInt(localStorage.getItem("initialMoney")) || 1000,
    isStanding: false,
    hasLost: false,
    isBot: bot
  }
}

// Bot actions

function randy() {
  return Math.random() < 0.5;
}

// Game Actions

function setUpGame() {
  const players = [];
  players.push(addPlayer("Dealer",true))
  players.push(addPlayer(false));
  return players;
  
}

function showVictoryModal(winningAmount) {
  const modal = document.getElementById("victory-modal");
  const winningAmountSpan = document.getElementById("winning-amount");
  winningAmountSpan.innerText = `${winningAmount}$`;
  modal.classList.remove('hidden');  // Mostra el modal
}

function showLoseModal() {
  const modal = document.getElementById("lose-modal");
  modal.classList.remove('hidden');  // Mostra el modal
}

document.getElementById("victory-continue").addEventListener('click', () => {
  const modal = document.getElementById("victory-modal");
  modal.classList.add('hidden');  // Mostra el modal
});

document.getElementById("lose-continue").addEventListener('click', () => {
  const modal = document.getElementById("lose-modal");
  modal.classList.add('hidden');  // Mostra el modal
});


async function displayCards(players) {
  const dealerDiv = document.getElementById("dealerCards");
  const playerDiv = document.getElementById("playerCards");

  // Mostrar les cartes del dealer, amb la primera carta oculta
  let dealerCardsHtml = ``;

  for (let card of players[0].hand) {
    dealerCardsHtml +=  `<img class="card" src="../Images/Cards/${card.suit.toLowerCase()}_${card.rank}.jpg" alt="${card.rank} of ${card.suit}" />`;
  }

  dealerDiv.innerHTML = dealerCardsHtml;

  // Mostrar les cartes del jugador
  let playerCardsHtml = ``;
  for (let card of players[1].hand) {
    playerCardsHtml +=  `<img class="card" src="../Images/Cards/${card.suit.toLowerCase()}_${card.rank}.jpg" alt="${card.rank} of ${card.suit}" />`;
  }

  playerDiv.innerHTML = playerCardsHtml;

  const userScore = calculateScore(players[1].hand);
  const dealerScore = calculateScore(players[0].hand);
  const userCurrency = players[1].currency;
  // Update the score spans dynamically
  document.getElementById("your-score").textContent = userCurrency; 
  document.getElementById("userActualScore").textContent = userScore.toFixed(1);  // Ensuring 1 decimal place
  document.getElementById("dealerActualScore").textContent = dealerScore.toFixed(1);  // Ensuring 1 decimal place
}


function giveOneCardToAll(players, deck) {
  for(let i = 1; i<players.length; i++) {
    players[i].hand.push(drawCard(deck));
  }
}

function initialize(players) {
  for (let i = 0; i<players.length; i++) {
    players[i].hand = [];
    players[i].hasLost = false;
    players[i].isStanding = false;
  }
}

async function playTurn(players, deck) {
  let end = 1;  // Variable to track when all players have finished their turns

  // Function to add a delay before moving on
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Setup event listeners for the action buttons
  const standButton = document.getElementById("stand");
  const draw = document.getElementById("draw-card");
  const restartGame = document.getElementById("restart-game");
  // Disabling buttons initially until it's the player's turn
  standButton.disabled = true;
  draw.disabled = true;
  restartGame.disabled = true;

  // Helper function to enable buttons
  function enableButtons() {
    standButton.disabled = false;
    draw.disabled = false;
    restartGame.disabled = false;
  }

  // While any player is still playing (not lost or standing)
  while (end !== players.length) {
    for (let i = 1; i < players.length; i++) {  // Loop through all players, skip dealer (index 0)
      await displayCards(players);  // Display current state of the game
      await delay(500); // Wait .5 second to show the cards

      // Only allow player actions if they haven't lost and aren't standing
      if (!players[i].hasLost && !players[i].isStanding) {
        // Enable action buttons for player
        enableButtons();

        // Wait for the player to click one of the action buttons
        await new Promise(resolve => {
          standButton.onclick = () => {
            players[i].isStanding = true;
            end++;  // Increment the end count, indicating this player is done
            resolve();
          };

          draw.onclick = () => {
            players[i].hand.push(drawCard(deck));  // Draw face-up card
            resolve();
          };

          restartGame.onclick = () => {
            runGame();
            resolve();
          };
        });

        // Disable buttons after action
        standButton.disabled = true;
        draw.disabled = true;
        restartGame.disabled = true;

        // Display updated cards after action
        await displayCards(players);
        await delay(500); // Wait another .5 before continuing
      }

      // Calculate the player's score and check if they have lost (score > 7.5)
      const score = calculateScore(players[i].hand);
      if (score > 7.5) {
        players[i].hasLost = true;  // Mark the player as lost
        end++;  // Increment the end count, this player is done
      }
    }
  }
}

function getStatistics(players) {
  let max = 0;
  for (let i = 0; i<players.length; i++) {
    playerScore = calculateScore(players[i].hand)
    if (players[i].isStanding && playerScore > max) max = playerScore;
  }
  return max;
}


async function playDealer(players,max,deck) {

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  while(calculateScore(players[0].hand)< max) {
    players[0].hand.push(drawCard(deck));
    await displayCards(players);
    await delay(500);
  }
  if (calculateScore(players[0].hand) > 7.5) players[0].hasLost = true;
  else players[0].isStanding = true;
  await delay(500);
}

function payPlayers(players,max,betAmount) {
  nWinners = 0;
  winnersPos = [];
  for(let i = 1; i<players.length; i++) {
    if (calculateScore(players[i].hand) === max) {
      nWinners++;
      winnersPos.push(i);
    }
  }
  toPay = betAmount*players.length/nWinners;
  for (let i = 0; i<winnersPos.length; i++) {
    players[winnersPos[i]].currency+=toPay;
  }
  console.log(players[1].currency);
}

function playersBet(betAmount,players) {
  for (let i = 1; i<players.length; i++) {
    players[i].currency-=betAmount;
  }
}

async function betMoney(players) {
  let betAmount;
  
  // Esperem fins que l'usuari faci una aposta vàlida
  while (true) {
    betAmount = parseInt(document.getElementById("bet").value);
    
    // Comprovem si l'aposta és vàlida (ha de ser un número i menor que la moneda del jugador)
    if (betAmount > 0 && betAmount <= players[1].currency) {
      break;  // Sortim del bucle quan l'aposta és vàlida
    } else {
      // Opcional: pots mostrar un missatge d'error si l'aposta no és vàlida
      await new Promise(resolve => setTimeout(resolve, 500));  // Esperem una mica per evitar loops incontrolats
    }
  }
  return betAmount;
}

async function runGame() {
  console.assert("Starting the game");
  const players = setUpGame();
  while(players[1].currency!==0) {
    const betAmount = await betMoney(players);
    initialize(players);
    const deck = shuffleDeck(makeDeck());
    playersBet(betAmount,players);
    await displayCards(players);
    giveOneCardToAll(players,deck);
    await displayCards(players);
    await playTurn(players,deck);
    max = getStatistics(players);
    if (max !== 0) {
      await playDealer(players,max,deck);
    }
    if (players[0].hasLost) {
      payPlayers(players,max,betAmount);
      showVictoryModal(betAmount);
    } else {
      players[0].currency+=betAmount;
      showLoseModal();
    }
    await displayCards(players);
    localStorage.setItem("initialMoney", players[1].currency);
  }
  
}



document.addEventListener('DOMContentLoaded',function() {
    runGame();
});


