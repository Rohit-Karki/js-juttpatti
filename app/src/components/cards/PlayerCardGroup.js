import React, { Fragment } from "react";
import { View } from "react-native";
import Player from "./Card";

// Suits and numbers definition
const suits = [
  { name: "hearts", color: "red" },
  { name: "diamonds", color: "red" },
  { name: "clovers", color: "black" },
  { name: "pikes", color: "black" },
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
  "J",
  "Q",
  "K",
];

// Function to get the correct card image
const getCardImage = (suit, number) => {
  const cardKey = `${suit}_${number}_white`;
  const images = {
    clovers_2_white: require("../../../assets/sprites/Clovers_2_white.png"),
    clovers_3_white: require("../../../assets/sprites/Clovers_3_white.png"),
    clovers_4_white: require("../../../assets/sprites/Clovers_4_white.png"),
    clovers_5_white: require("../../../assets/sprites/Clovers_5_white.png"),
    clovers_6_white: require("../../../assets/sprites/Clovers_6_white.png"),
    clovers_7_white: require("../../../assets/sprites/Clovers_7_white.png"),
    clovers_8_white: require("../../../assets/sprites/Clovers_8_white.png"),
    clovers_9_white: require("../../../assets/sprites/Clovers_9_white.png"),
    clovers_10_white: require("../../../assets/sprites/Clovers_10_white.png"),
    clovers_A_white: require("../../../assets/sprites/Clovers_A_white.png"),
    clovers_Jack_white: require("../../../assets/sprites/Clovers_Jack_white.png"),
    clovers_Queen_white: require("../../../assets/sprites/Clovers_Queen_white.png"),
    clovers_King_white: require("../../../assets/sprites/Clovers_King_white.png"),

    hearts_2_white: require("../../../assets/sprites/Hearts_2_white.png"),
    hearts_3_white: require("../../../assets/sprites/Hearts_3_white.png"),
    hearts_4_white: require("../../../assets/sprites/Hearts_4_white.png"),
    hearts_5_white: require("../../../assets/sprites/Hearts_5_white.png"),
    hearts_6_white: require("../../../assets/sprites/Hearts_6_white.png"),
    hearts_7_white: require("../../../assets/sprites/Hearts_7_white.png"),
    hearts_8_white: require("../../../assets/sprites/Hearts_8_white.png"),
    hearts_9_white: require("../../../assets/sprites/Hearts_9_white.png"),
    hearts_10_white: require("../../../assets/sprites/Hearts_10_white.png"),
    hearts_A_white: require("../../../assets/sprites/Hearts_A_white.png"),
    hearts_Jack_white: require("../../../assets/sprites/Hearts_Jack_white.png"),
    hearts_Queen_white: require("../../../assets/sprites/Hearts_Queen_white.png"),
    hearts_King_white: require("../../../assets/sprites/Hearts_King_white.png"),

    pikes_2_white: require("../../../assets/sprites/Pikes_2_white.png"),
    pikes_3_white: require("../../../assets/sprites/Pikes_3_white.png"),
    pikes_4_white: require("../../../assets/sprites/Pikes_4_white.png"),
    pikes_5_white: require("../../../assets/sprites/Pikes_5_white.png"),
    pikes_6_white: require("../../../assets/sprites/Pikes_6_white.png"),
    pikes_7_white: require("../../../assets/sprites/Pikes_7_white.png"),
    pikes_8_white: require("../../../assets/sprites/Pikes_8_white.png"),
    pikes_9_white: require("../../../assets/sprites/Pikes_9_white.png"),
    pikes_10_white: require("../../../assets/sprites/Pikes_10_white.png"),
    pikes_A_white: require("../../../assets/sprites/Pikes_A_white.png"),
    pikes_Jack_white: require("../../../assets/sprites/Pikes_Jack_white.png"),
    pikes_Queen_white: require("../../../assets/sprites/Pikes_Queen_white.png"),
    pikes_King_white: require("../../../assets/sprites/Pikes_King_white.png"),

    tiles_2_white: require("../../../assets/sprites/Tiles_2_white.png"),
    tiles_3_white: require("../../../assets/sprites/Tiles_3_white.png"),
    tiles_4_white: require("../../../assets/sprites/Tiles_4_white.png"),
    tiles_5_white: require("../../../assets/sprites/Tiles_5_white.png"),
    tiles_6_white: require("../../../assets/sprites/Tiles_6_white.png"),
    tiles_7_white: require("../../../assets/sprites/Tiles_7_white.png"),
    tiles_8_white: require("../../../assets/sprites/Tiles_8_white.png"),
    tiles_9_white: require("../../../assets/sprites/Tiles_9_white.png"),
    tiles_10_white: require("../../../assets/sprites/Tiles_10_white.png"),
    tiles_A_white: require("../../../assets/sprites/Tiles_A_white.png"),
    tiles_Jack_white: require("../../../assets/sprites/Tiles_Jack_white.png"),
    tiles_Queen_white: require("../../../assets/sprites/Tiles_Queen_white.png"),
    tiles_King_white: require("../../../assets/sprites/Tiles_King_white.png"),
  };

  return images[cardKey];
};

export default function PlayerCardGroup({ playerCards }) {
  return (
    <Fragment>
      {playerCards.map((playerCard) => (
        <Player imageSrc={getCardImage(playerCard.suit, playerCard.number)} />
      ))}
    </Fragment>
  );
}
