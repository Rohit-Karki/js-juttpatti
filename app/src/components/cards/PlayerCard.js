import { View, Text, Image, StyleSheet } from "react-native";
import { Trophy } from "lucide-react-native";
import { ImagesAssets } from "../../../assets";

export default function PlayerCard({ name, score, avatar, isSearching }) {
  return (
    <View style={styles.container}>
      <Image source={ImagesAssets.Person_Icon} style={styles.avatar} />
      <Text style={styles.name}>{isSearching ? "Matching..." : name}</Text>
      {/* {score !== undefined && (
        <View style={styles.scoreContainer}>
          <Trophy size={16} color="#FFD700" />
          <Text style={styles.score}>{score}</Text>
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
  },
  avatar: {
    width: 300,
    height: 300,
    borderRadius: 20,
    marginRight: 8,
  },
  name: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  score: {
    color: "#FFD700",
    marginLeft: 4,
    fontWeight: "bold",
  },
});
