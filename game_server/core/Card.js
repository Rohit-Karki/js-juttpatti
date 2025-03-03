class Card {
  constructor(number, suit, color) {
    this.number = number;
    this.suit = suit;
    this.color = color;
  }

  toString() {
    return `${this.number} of ${this.suit} (${this.color})`;
  }
}

function createDeck() {
  const suits = [
    { name: "hearts", color: "red" },
    { name: "tiles", color: "red" },
    { name: "clovers", color: "red" },
    { name: "pikes", color: "red" },
  ];
  const numbers = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King",
  ];

  let deck = [];
  for (let suit of suits) {
    for (let number of numbers) {
      deck.push(new Card(number, suit.name, suit.color));
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function distributeCards(players, deck, numCards) {
  for (let i = 0; i < numCards; i++) {
    for (let player of players) {
      if (deck.length > 0) {
        player.cards.push(deck.pop());
      }
    }
  }
}

export default function get_init_game_state(
  players,
  no_of_players = 4,
  numCards = 7
) {
  console.log(players, no_of_players);
  let deck = createDeck();
  shuffleDeck(deck);

  distributeCards(players, deck, numCards);

  return {
    noOfPlayers: no_of_players,
    players: players,
    deck: deck, // Remaining deck after distribution
    tableCards: [],
    currentTurn: 0,
    gameStatus: "waiting",
    winner: null,
  };
}
