import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import HomeScreen from "./HomeScreen";
import GameLobby from "./GameLobby";
import JSGame from "./JSGame";
import JoinRoom from "./JoinRoom";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const [loggedIn, useLoggedIn] = useState(true);
  // check for login
  if (!loggedIn) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    );
  } else {
    // return null;
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="JoinRoom" component={JoinRoom} />
        <Stack.Screen name="GameLobby" component={GameLobby} />
        <Stack.Screen name="JSGame" component={JSGame} />
      </Stack.Navigator>
    );
  }
}
