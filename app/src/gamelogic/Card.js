import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
export default function Card({ imageSrc }) {
  // const END_POSITION = 200;
  // const onLeft = useSharedValue(true);
  // const position = useSharedValue(0);

  // const panGesture = Gesture.Pan()
  //   .onStart((_event) => {
  //     console.log("onStart", _event);
  //   })
  //   .onUpdate((e) => {
  //     console.log(e);
  //     if (onLeft.value) {
  //       position.value = e.translationX;
  //     } else {
  //       position.value = END_POSITION + e.translationX;
  //     }
  //   })
  //   .onEnd((e) => {
  //     console.log("on ended", e);
  //     if (position.value > END_POSITION / 2) {
  //       position.value = withTiming(END_POSITION, { duration: 100 });
  //       onLeft.value = false;
  //     } else {
  //       position.value = withTiming(0, { duration: 100 });
  //       onLeft.value = true;
  //     }
  //   });

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "#b58df1",
    borderRadius: 20,
  },
});
