class Card {
  constructor(type, value, color) {
    this.type = type; // Changed from suit to type to match UI
    this.value = value; // Changed from number to value to match UI
    this.color = color;
  }

  toString() {
    return `${this.value} of ${this.type} (${this.color})`;
  }
}

function createDeck() {
  const types = [
    { name: "Hearts", color: "red" },
    { name: "Tiles", color: "red" },
    { name: "Clovers", color: "black" },
    { name: "Pikes", color: "black" },
  ];
  const values = [
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

  return types.flatMap((type) =>
    values.map((value) => new Card(type.name, value, type.color))
  );
}

function shuffleDeck(deck) {
  return [...deck].sort(() => Math.random() - 0.5);
}

function distributeCards(players, deck, numCards) {
  const remainingDeck = [...deck];
  return players.map((player) => ({
    ...player,
    cards: Array.from({ length: numCards }, () =>
      remainingDeck.length > 0 ? remainingDeck.pop() : null
    ).filter(Boolean),
  }));
}

export default function get_init_game_state(
  players,
  no_of_players = 4,
  numCards = 7
) {
  const initialDeck = createDeck();
  const shuffledDeck = shuffleDeck(initialDeck);
  const playersWithCards = distributeCards(players, shuffledDeck, numCards);

  return {
    noOfPlayers: no_of_players,
    players: playersWithCards,
    deck: shuffledDeck.slice(players.length * numCards),
    tableCards: [],
    currentTurn: 0,
    gameStatus: "waiting",
    winner: null,
  };
}
