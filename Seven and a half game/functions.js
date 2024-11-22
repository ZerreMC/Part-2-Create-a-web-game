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
  for (let card of hand) {
    score += card.value;
  }
  return score;
}

function addPlayer(name,bot) {
  return {
    name: name?name:"User",
    hand: [],
    currency: 1000,
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
  console.log("Adding player");
  players.push(addPlayer(document.getElementById("userNameInput").value.trim(),false));
  return players;
  
}

function displayCards(player) {
  const playerDiv = document.getElementById(player.isBot ? 'dealerCards' : 'playerCards');
  
  // Esborrar les cartes actuals
  playerDiv.innerHTML = '';

  // Crear i afegir el nom del jugador
  const nameDiv = document.createElement('div');
  nameDiv.classList.add('playerName');
  nameDiv.textContent = player.name;  // Mostra el nom del jugador
  playerDiv.appendChild(nameDiv);

  // Mostrar les cartes del jugador
  for (let card of player.hand) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.textContent = `${card.rank} of ${card.suit}`;
    playerDiv.appendChild(cardDiv);
  }
}


function runGame() {
  let end  = 0;
  const players = setUpGame();
  const deck = shuffleDeck(makeDeck());
  for (let i = 0; i<players.length; i++) {
    players[i].hand.push(drawCard(deck)); // give one card to all players
    displayCards(players[i]);
  }
  while(end !== players.length) {
    for (let i=0; i<players.length; i++) {
      if (!players[i].hasLost && !players[i].isStanding) {
        if(!players[i].isBot) {
          // give the player the option to stand or to draw a card
          if(randy()) {
            players[i].isStanding = true;
            end += 1;
          } else {
            players[i].hand.push(drawCard(deck));
          }
        } else {
          if(randy()) {
            players[i].isStanding = true;
            end += 1;
          } else {
            players[i].hand.push(drawCard(deck));
          }
        }
      }
      if (calculateScore(players[i].hand)> 7.5) {
        players[i].hasLost = true;
        end += 1;
      }
      displayCards(players[i]);
    }
  }
  for (let i = 0; i<players.length; i++) {
    console.log("Game terminated", players[i].name, players[i].hand, players[i].hasLost, players[i].isStanding);
  }
}



document.addEventListener('DOMContentLoaded',function() {
  document.getElementById("setUpButton").addEventListener('click',function() {
    console.log("Button clicked");
    runGame();
  });
});
