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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  score: {
    color: "#FFD700",
    marginLeft: 4,
    fontWeight: "bold",
  },
});