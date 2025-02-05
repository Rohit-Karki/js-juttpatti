const gameState = {
  noOfPlayers: 4,
  players: [
    {
      id: 1,
      name: "Player 1",
      cards: [], // Cards in the player's hand
      score: 0, // Current score of the player
      isTurn: false, // Indicates if it's the player's turn
    },
    {
      id: 2,
      name: "Player 2",
      cards: [],
      score: 0,
      isTurn: false,
    },
    {
      id: 3,
      name: "Player 3",
      cards: [],
      score: 0,
      isTurn: false,
    },
    {
      id: 4,
      name: "Player 4",
      cards: [],
      score: 0,
      isTurn: false,
    },
    // Add more players as needed
  ],
  deck: [], // Cards remaining in the deck
  tableCards: [], // Cards currently on the table
  currentTurn: 0, // Index of the player whose turn it is
  gameStatus: "waiting", // Game status: 'waiting', 'in-progress', 'finished'
  winner: null, // ID or name of the winner
};

export default function get_init_game_state(no_of_players = 4) {
  const initial_state = {
    noOfPlayers: no_of_players,
    players: [
      // Add more players as needed
    ],
    deck: [], // Cards remaining in the deck
    tableCards: [], // Cards currently on the table
    currentTurn: 0, // Index of the player whose turn it is
    gameStatus: "waiting", // Game status: 'waiting', 'in-progress', 'finished'
    winner: null, // ID or name of the winner
  };

  // Array(no_of_players).map((player, index) => {
  //     initial_state.players.push(
  //         {
  //             id: index,
  //             name: "player",
  //             cards: [],
  //             score: 0,
  //             isTurn: false,
  //         },
  //     )
  // })
  return initial_state;
}

// module.exports = { get_init_game_state: get_init_game_state }
