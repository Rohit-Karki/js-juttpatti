import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

class GameStateManager {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    });

    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.redis.on('connect', () => {
      console.log('Connected to Redis');
    });
  }

  async saveGameState(roomId, gameState) {
    try {
      const key = `game:${roomId}`;
      const value = JSON.stringify(gameState);
      
      // Save with 2 hour TTL (games shouldn't last longer)
      await this.redis.setex(key, 7200, value);
      
      // Also save room metadata
      await this.redis.setex(`room:${roomId}`, 7200, JSON.stringify({
        roomId,
        status: gameState.gameStatus,
        playerCount: gameState.players.length,
        lastUpdated: new Date().toISOString()
      }));

      console.log(`Game state saved for room: ${roomId}`);
      return true;
    } catch (error) {
      console.error(`Failed to save game state for room ${roomId}:`, error);
      return false;
    }
  }

  async getGameState(roomId) {
    try {
      const key = `game:${roomId}`;
      const state = await this.redis.get(key);
      
      if (state) {
        console.log(`Game state loaded for room: ${roomId}`);
        return JSON.parse(state);
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to load game state for room ${roomId}:`, error);
      return null;
    }
  }

  async deleteGameState(roomId) {
    try {
      await this.redis.del(`game:${roomId}`);
      await this.redis.del(`room:${roomId}`);
      console.log(`Game state deleted for room: ${roomId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete game state for room ${roomId}:`, error);
      return false;
    }
  }

  async getAllActiveRooms() {
    try {
      const keys = await this.redis.keys('room:*');
      const rooms = [];
      
      for (const key of keys) {
        const roomData = await this.redis.get(key);
        if (roomData) {
          rooms.push(JSON.parse(roomData));
        }
      }
      
      return rooms;
    } catch (error) {
      console.error('Failed to get active rooms:', error);
      return [];
    }
  }

  async cleanupExpiredGames() {
    try {
      // Redis automatically handles TTL, but we can add custom cleanup logic here
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

  // Graceful shutdown
  async close() {
    try {
      await this.redis.quit();
      console.log('Redis connection closed');
    } catch (error) {
      console.error('Error closing Redis connection:', error);
    }
  }
}

export default GameStateManager;
