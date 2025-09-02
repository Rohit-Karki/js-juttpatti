import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { pickCardAsync, dropCardAsync, startGameAsync } from '../../gamelogic/redux/slices/cardSlice';

export default function GameActions() {
  const dispatch = useDispatch();
  const gameState = useSelector(state => state.game);
  const userState = useSelector(state => state.user);

  const handlePickCard = () => {
    // Example: Pick a card from the deck
    const card = gameState.deck[0]; // Get first card from deck
    if (card) {
      dispatch(pickCardAsync({
        playerId: userState.userId,
        card: card,
        roomId: gameState.roomId
      }));
    }
  };

  const handleDropCard = () => {
    // Example: Drop a card from player's hand
    const player = gameState.players.find(p => p.id === userState.userId);
    if (player && player.cards.length > 0) {
      const card = player.cards[0]; // Get first card from hand
      dispatch(dropCardAsync({
        playerId: userState.userId,
        card: card,
        roomId: gameState.roomId
      }));
    }
  };

  const handleStartGame = () => {
    dispatch(startGameAsync(gameState.roomId));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handlePickCard}
        disabled={!gameState.deck.length}
      >
        <Text style={styles.buttonText}>Pick Card</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleDropCard}
        disabled={!gameState.players.find(p => p.id === userState.userId)?.cards.length}
      >
        <Text style={styles.buttonText}>Drop Card</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleStartGame}
        disabled={gameState.status === 'playing'}
      >
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Game Status: {gameState.status}
        </Text>
        <Text style={styles.statusText}>
          Cards in Deck: {gameState.deck.length}
        </Text>
        <Text style={styles.statusText}>
          Your Cards: {gameState.players.find(p => p.id === userState.userId)?.cards.length || 0}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },
});
