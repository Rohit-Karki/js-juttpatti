// In-memory state manager for development (fallback when Redis is not available)
class InMemoryStateManager {
  constructor() {
    this.storage = new Map();
    this.roomMetadata = new Map();
    console.log('Using in-memory state manager (development mode)');
  }

  async saveGameState(roomId, gameState) {
    try {
      this.storage.set(roomId, JSON.parse(JSON.stringify(gameState)));
      
      this.roomMetadata.set(roomId, {
        roomId,
        status: gameState.gameStatus,
        playerCount: gameState.players.length,
        lastUpdated: new Date().toISOString()
      });

      console.log(`Game state saved in memory for room: ${roomId}`);
      return true;
    } catch (error) {
      console.error(`Failed to save game state for room ${roomId}:`, error);
      return false;
    }
  }

  async getGameState(roomId) {
    try {
      const state = this.storage.get(roomId);
      
      if (state) {
        console.log(`Game state loaded from memory for room: ${roomId}`);
        return JSON.parse(JSON.stringify(state)); // Return a copy
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to load game state for room ${roomId}:`, error);
      return null;
    }
  }

  async deleteGameState(roomId) {
    try {
      this.storage.delete(roomId);
      this.roomMetadata.delete(roomId);
      console.log(`Game state deleted from memory for room: ${roomId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete game state for room ${roomId}:`, error);
      return false;
    }
  }

  async getAllActiveRooms() {
    try {
      const rooms = [];
      for (const [roomId, metadata] of this.roomMetadata) {
        rooms.push(metadata);
      }
      return rooms;
    } catch (error) {
      console.error('Failed to get active rooms:', error);
      return [];
    }
  }

  async cleanupExpiredGames() {
    try {
      const activeRooms = await this.getAllActiveRooms();
      const now = new Date();
      
      for (const room of activeRooms) {
        const lastUpdated = new Date(room.lastUpdated);
        const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60);
        
        // If no activity for 3 hours, clean up
        if (hoursSinceUpdate > 3) {
          await this.deleteGameState(room.roomId);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup expired games:', error);
    }
  }

  async close() {
    // Clear all data
    this.storage.clear();
    this.roomMetadata.clear();
    console.log('In-memory storage cleared');
  }
}

export default InMemoryStateManager;
