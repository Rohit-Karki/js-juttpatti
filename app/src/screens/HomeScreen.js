import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Wifi, DoorClosed, Robot, Globe, Gamepad } from "lucide-react-native";
import { ImagesAssets } from "../../assets";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.17;
const CARD_SPACING = 8;

export default function HomeScreen() {
  const navigation = useNavigation();

  const menuItems = [
    {
      id: "hotspot",
      title: "HOT\nSPOT",
      //   icon: <Wifi size={24} color="white" />,
      color: "#FF6B6B",
      onPress: () => navigation.navigate("GameLobby"),
    },
    {
      id: "private",
      title: "PRIVATE\nTABLE",
      //   icon: <DoorClosed size={24} color="white" />,
      color: "#51CF66",
      onPress: () => navigation.navigate("JSGame"),
    },
    {
      id: "single",
      title: "SINGLE\nPLAYER",
      //   icon: <Robot size={24} color="white" />,
      color: "#339AF0",
      onPress: () => navigation.navigate("SinglePlayer"),
    },
    {
      id: "multi",
      title: "MULTI\nPLAYER",
      //   icon: <Globe size={24} color="white" />,
      color: "#FFA94D",
      onPress: () => navigation.navigate("MultiplayerLobby"),
    },
    {
      id: "more",
      title: "MORE\nGAMES",
      //   icon: <Gamepad size={24} color="white" />,
      color: "#845EF7",
      onPress: () => navigation.navigate("MoreGames"),
    },
  ];

  return (
    <ImageBackground source={ImagesAssets.CardGameBg} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>CALLBREAK</Text>
          <Text style={styles.subtitle}>LEGEND</Text>
        </View>

        <View style={styles.cardsContainer}>
          {menuItems.map((item) => {
            // const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: item.color }]}
                onPress={item.onPress}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    {/* { item.icon } */}
                    {/* <Icon size={24} color="white" /> */}
                  </View>
                  <Text style={styles.cardText}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomTextContainer}>
          <Text style={styles.playText}>PLAY</Text>
          <Text style={[styles.playText, styles.yellowText]}>LOCAL</Text>
          <Text style={styles.playText}>,</Text>
          <Text style={[styles.playText, styles.yellowText]}>GLOBAL</Text>
          <Text style={styles.playText}>OR</Text>
          <Text style={[styles.playText, styles.yellowText]}>SOLO</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
    flex: 1,
    backgroundColor: "#E9ECEF",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#495057",
    // textShadowColor: "rgba(0, 0, 0, 0.2)",
    // textShadowOffset: { width: 2, height: 2 },
    // textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B6B",
    // textShadowColor: "rgba(255, 107, 107, 0.4)",
    // textShadowOffset: { width: 2, height: 2 },
    // textShadowRadius: 4,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: CARD_SPACING,
    marginBottom: 40,
  },
  card: {
    width: CARD_WIDTH,
    aspectRatio: 0.7,
    borderRadius: 12,
    padding: 8,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#FFC9C9",
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    // textShadowColor: "rgba(0, 0, 0, 0.2)",
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 2,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  playText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    // textShadowColor: "rgba(0, 0, 0, 0.2)",
    // textShadowOffset: { width: 2, height: 2 },
    // textShadowRadius: 4,
  },
  yellowText: {
    color: "#FFD43B",
  },
});
