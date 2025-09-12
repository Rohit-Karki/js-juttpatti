import { EventEmitter } from "node:events";
import get_init_game_state from "./core/Card.js";

export class GameEngine extends EventEmitter {
  constructor(playersInRoomId, len, io, roomId, stateManager) {
    super();
    this.io = io;
    this.roomId = roomId;
    this.stateManager = stateManager;
    this.state = get_init_game_state(playersInRoomId, len);

    // Register "reducers" (event handlers)
    this.on("START_GAME", this.startGame.bind(this));
    this.on("PICK_CARD", this.pickCard.bind(this));
    this.on("NEXT_TURN", this.nextTurn.bind(this));

    // Save initial state
    this.saveState();
  }

  async saveState() {
    if (this.stateManager) {
      await this.stateManager.saveGameState(this.roomId, this.state);
    }
  }

  async loadState() {
    if (this.stateManager) {
      const savedState = await this.stateManager.getGameState(this.roomId);
      if (savedState) {
        this.state = savedState;
        return true;
      }
    }
    return false;
  }

  dispatch(action) {
    this.emit(action.type, action.payload);
  }

  broadcast(action) {
    // Send the action to all clients in the room via Socket.IO
    this.io.to(this.roomId).emit("gameAction", action);
    // Also emit the updated state
    this.io.to(this.roomId).emit("gameStateUpdate", this.state);
    
    // Save state after broadcasting
    this.saveState();
  }

  startGame() {
    this.state.status = "playing";
    this.state.turnIndex = 0;
    this.state.players[0].isTurn = true;
    this.logState("Game Started");
    this.broadcast({ type: "START_GAME", payload: this.state });
  }

  pickCard({ userId, card }) {
    const player = this.state.players.find((p) => p.userId === userId);
    if (player && player.isTurn) {
      player.cards.push(card);
      this.logState(`${player.userName} picked a card`);
      // this.dispatch({ type: "NEXT_TURN" });
      this.broadcast({ type: "PICK_CARD", payload: { userId, card } });
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
    this.broadcast({ type: "NEXT_TURN", payload: { turnIndex: this.state.turnIndex } });
  }

  logState(message) {
    console.log(`[GameEngine] ${message}`);
    console.log(this.state);
  }
  
  getState() {
    return this.state;
  }

  // Cleanup when game ends
  async cleanup() {
    if (this.stateManager) {
      await this.stateManager.deleteGameState(this.roomId);
    }
  }
}
