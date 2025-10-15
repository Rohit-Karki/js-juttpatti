import { Dimensions, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export default function Card({ imageSrc, onCardThrown, cardData }) {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Threshold for considering a card "thrown" (upward movement)
  const THROW_THRESHOLD = -100; // pixels moved upward

  const handleCardThrown = () => {
    if (onCardThrown) {
      onCardThrown(cardData);
    }
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
      scale.value = withSpring(1.1); // Slightly enlarge when picked up
    })
    .onUpdate((event) => {
      const maxTranslateX = width / 2 - 50;
      const maxTranslateY = height / 2 - 50;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .onEnd((event) => {
      // Check if card was thrown upward past threshold
      if (translationY.value < THROW_THRESHOLD) {
        // Animate card flying to center/table
        translationY.value = withTiming(-height / 2, { duration: 300 });
        translationX.value = withTiming(0, { duration: 300 });
        scale.value = withTiming(1.2, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, () => {
          // Call the callback when animation completes
          runOnJS(handleCardThrown)();
        });
      } else {
        // Return card to original position
        translationX.value = withSpring(0);
        translationY.value = withSpring(0);
        scale.value = withSpring(1);
      }
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[animatedStyles]}>
        <Animated.Image style={[styles.cardImage]} source={imageSrc} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  cardImage: {
    resizeMode: "contain",
    width: 100,
    height: 100,
  },
});
