import { EventEmitter } from "node:events";
import get_init_game_state from "./core/Card.js";

export class GameEngine extends EventEmitter {
  constructor(playersInRoomId, len) {
    super();
    console.log("rohit");
    this.state = get_init_game_state(playersInRoomId, len);

    // Register "reducers" (event handlers)
    this.on("START_GAME", this.startGame.bind(this));
    this.on("PICK_CARD", this.pickCard.bind(this));
    this.on("NEXT_TURN", this.nextTurn.bind(this));
  }

  dispatch(action) {
    this.emit(action.type, action.payload);
  }
  startGame() {
    this.state.status = "playing";
    this.state.turnIndex = 0;
    this.state.players[0].isTurn = true;
    this.logState("Game Started");
  }

  pickCard({ userId, card }) {
    const player = this.state.players.find((p) => p.userId === userId);
    if (player && player.isTurn) {
      player.cards.push(card);
      this.logState(`${player.userName} picked a card`);
      this.dispatch({ type: "NEXT_TURN" });
    }
  }

  nextTurn() {
    this.state.players.forEach((p) => (p.isTurn = false)); // Clear all turns
    this.state.turnIndex =
      (this.state.turnIndex + 1) % this.state.players.length;
    this.state.players[this.state.turnIndex].isTurn = true;
    this.logState(
      `Next turn: ${this.state.players[this.state.turnIndex].userName}`
    );
  }

  logState(message) {
    console.log(`[GameEngine] ${message}`);
    console.log(this.state);
  }
  getState() {
    return this.state;
  }
}
