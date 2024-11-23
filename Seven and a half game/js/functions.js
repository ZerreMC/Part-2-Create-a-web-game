// Deck actions

function makeDeck() {
  const suits = ['Cups', 'Coins', 'Swords', 'Clubs'];
  const ranks = ['Ace', '2', '3', '4', '5', '6', '7', 'Jack', 'Queen', 'King'];
  const deck = [];

  for (let suit of suits) {
    for (let rank of ranks) {
      let value;
      

      if (rank === 'Jack' || rank === 'Queen' || rank === 'King') {
        value = 0.5;
      } else if (rank === 'Ace') {
        value = 1;
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

function addPlayer(name,bot) {
  return {
    name: name?name:"User",
    hand: [],
    currency: parseInt(document.getElementById("currency").value),
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
  players.push(addPlayer(document.getElementById("userNameInput").value.trim(),false));
  return players;
  
}

function displayCards(players) {
  const dealerDiv = document.getElementById("dealerCards");
  const playerDiv = document.getElementById("playerCards");

  // Mostrar les cartes del dealer, amb la primera carta oculta
  let dealerCardsHtml = "<p>Dealer's Hand:</p>";
  dealerCardsHtml += `<div>Face down</div>`;  // Primer carta del dealer, oculta

  for (let i = 1; i < players[0].hand.length; i++) {
    const card = players[0].hand[i];
    dealerCardsHtml += `<div>${card.rank} of ${card.suit}</div>`;
  }

  dealerDiv.innerHTML = dealerCardsHtml;

  // Mostrar les cartes del jugador
  let playerCardsHtml = `<p>${players[1].name} score: ${calculateScore(players[1].hand)} currency: ${players[1].currency}</p>`;
  for (let card of players[1].hand) {
    playerCardsHtml += `<div>${card.rank} of ${card.suit}</div>`;
  }

  playerDiv.innerHTML = playerCardsHtml;
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
  const standButton = document.getElementById("standButton");
  const drawFaceUpButton = document.getElementById("drawFaceUpButton");
  const drawFaceDownButton = document.getElementById("drawFaceDownButton");

  // Disabling buttons initially until it's the player's turn
  standButton.hidden = true;
  drawFaceUpButton.hidden = true;
  drawFaceDownButton.hidden = true;

  // Helper function to enable buttons
  function enableButtons() {
    standButton.hidden = false;
    drawFaceUpButton.hidden = false;
    drawFaceDownButton.hidden = false;
  }

  // While any player is still playing (not lost or standing)
  while (end !== players.length) {
    for (let i = 1; i < players.length; i++) {  // Loop through all players, skip dealer (index 0)
      displayCards(players);  // Display current state of the game
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

          drawFaceUpButton.onclick = () => {
            players[i].hand.push(drawCard(deck));  // Draw face-up card
            resolve();
          };

          drawFaceDownButton.onclick = () => {
            players[i].hand.unshift(drawCard(deck));  // Draw face-down card
            resolve();
          };
        });

        // Disable buttons after action
        standButton.hidden = true;
        drawFaceUpButton.hidden = true;
        drawFaceDownButton.hidden = true;

        // Display updated cards after action
        displayCards(players);
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


function playDealer(players,max,deck) {
  players[0].hand.push(drawCard(deck));
  while(calculateScore(players[0].hand)< max) {
    players[0].hand.push(drawCard(deck));
  }
  if (calculateScore(players[0].hand) > 7.5) players[0].hasLost = true;
  else players[0].isStanding = true;
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
      alert("L'aposta ha de ser un valor positiu i no pot superar la teva moneda actual.");
      await new Promise(resolve => setTimeout(resolve, 500));  // Esperem una mica per evitar loops incontrolats
    }
  }
  return betAmount;
}


async function runGame() {
  const players = setUpGame();
  const betAmount = await betMoney(players);
  while(players[1].currency!==0) {
    initialize(players);
    const deck = shuffleDeck(makeDeck());
    playersBet(betAmount,players);
    displayCards(players);
    giveOneCardToAll(players,deck);
    displayCards(players);
    await playTurn(players,deck);
    max = getStatistics(players);
    if (max !== 0) {
      playDealer(players,max,deck);
    }
    if (players[0].hasLost) {
      payPlayers(players,max,betAmount);
    } else {
      players[0].currency+=betAmount;
    }
    displayCards(players);
  }
  
}



document.addEventListener('DOMContentLoaded',function() {
  document.getElementById("setUpButton").addEventListener('click',function() {
    runGame();
  });
});
