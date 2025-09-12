# Juttpatti/Callbreak Multiplayer Card Game

A React Native multiplayer card game with a Node.js backend, implementing a **deterministic game engine pattern** for client-server synchronization.

## 🏗️ Architecture Overview

This project implements a sophisticated multiplayer game architecture inspired by professional gaming companies like Bhoos Games:

### **Client-Server Synchronization Pattern**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   Socket.IO     │    │   Server Game   │
│                 │    │   Middleware    │    │    Engine       │
│  Redux Store   │◄──►│                 │◄──►│                 │
│  (Game State)  │    │  Action Router  │    │  (Game Logic)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Key Features:**
- **Deterministic Game Engine**: Same game logic runs on both client and server
- **Action Forwarding**: Client actions automatically forwarded to server via middleware
- **Optimistic Updates**: Immediate UI feedback while ensuring server consistency
- **Real-time Synchronization**: Socket.IO for real-time multiplayer communication

### **How It Works**

1. **Client Action**: User performs an action (e.g., picks a card)
2. **Local Update**: Redux store updates immediately (optimistic update)
3. **Server Forward**: Socket middleware automatically forwards action to server
4. **Server Processing**: Server game engine processes action and validates
5. **Broadcast**: Server broadcasts validated action to all clients
6. **State Sync**: All clients receive the authoritative game state

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- React Native development environment
- Expo CLI
- Redis server (for production) or use in-memory storage (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd js-juttpatti
   ```

2. **Install server dependencies**
   ```bash
   cd game_server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../app
   npm install
   ```

4. **Setup Redis (Optional for development)**
   ```bash
   # Install Redis on Ubuntu/Debian
   sudo apt-get install redis-server
   
   # Or use Docker
   docker run -d -p 6379:6379 redis:alpine
   
   # Or skip Redis for development (will use in-memory storage)
   ```

5. **Start the server**
   ```bash
   cd ../game_server
   npm start
   ```

6. **Start the client**
   ```bash
   cd ../app
   npm start
   ```

## 📁 Project Structure

```
js-juttpatti/
├── app/                          # React Native client
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── screens/             # App screens
│   │   ├── gamelogic/          # Game logic and Redux store
│   │   │   ├── redux/          # Redux configuration
│   │   │   │   ├── slices/     # Redux slices
│   │   │   │   └── middleware/ # Custom middleware
│   │   │   └── models/         # Game data models
│   │   └── socket.js           # Socket.IO client
│   └── package.json
├── game_server/                  # Node.js server
│   ├── core/                    # Core game logic
│   ├── game_state/              # Game state management
│   ├── socket/                  # Socket.IO handlers
│   ├── middlewares/             # Express middlewares
│   ├── database/                # Database models
│   ├── GameEngine.js            # Server game engine
│   └── index.js                 # Server entry point
└── README.md
```

## 🎮 Game Features

- **Multiplayer Support**: Up to 4 players per room
- **Real-time Gameplay**: Live updates via WebSocket
- **Room Management**: Create and join game rooms
- **Card Distribution**: Automatic card shuffling and dealing
- **Turn-based Play**: Sequential player turns
- **Game State Persistence**: Maintains game state across sessions

## 🔧 Development

### **Adding New Game Actions**

1. **Define the action in Redux slice**
   ```javascript
   // In cardSlice.js
   export const newGameAction = createAsyncThunk(
     'card/newGameAction',
     async (payload, { dispatch }) => {
       dispatch(newGameActionLocal(payload));
       return payload;
     }
   );
   ```

2. **Add server-side handler**
   ```javascript
   // In GameEngine.js
   this.on("NEW_GAME_ACTION", this.handleNewGameAction.bind(this));
   ```

3. **Update socket middleware** (if needed)
   ```javascript
   // In socketMiddleware.js
   const SERVER_ACTIONS = [
     // ... existing actions
     'NEW_GAME_ACTION'
   ];
   ```

### **Testing**

```bash
# Run server tests
cd game_server
npm test

# Run client tests
cd app
npm test
```

## 🌐 Deployment

### **Environment Variables**

Create `.env` files in both `app/` and `game_server/` directories:

```bash
# Server (.env)
PORT=3000
NODE_ENV=production
DATABASE_URL=your_database_url

# Client (.env)
REACT_APP_SERVER_URL=your_server_url
```

### **Production Build**

```bash
# Build React Native app
cd app
expo build:android  # or expo build:ios

# Deploy server
cd ../game_server
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Bhoos Games' client-server synchronization architecture
- Built with React Native, Node.js, Socket.IO, and Redux Toolkit
- Special thanks to the open-source community

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the [Wiki](../../wiki) for detailed documentation
- Join our [Discord](link-to-discord) community
