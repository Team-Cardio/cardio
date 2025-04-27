import React, { useRef } from 'react';
import { ImageSource } from 'expo-image';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

const ITEM_COUNT = 5;
const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
  image: ImageSource;
}

const DraggableStack = ({ image }: Props) => {
  const positions = [...Array(ITEM_COUNT)].map(() => ({
    x: useSharedValue(Math.random() * SCREEN_WIDTH * 0.2),
    y: useSharedValue(Math.random() * 200),
    z: useSharedValue(0),
  }));

  const selectedStates = useRef(Array.from({ length: ITEM_COUNT }, () => useSharedValue(false))).current;

  const zCounter = useSharedValue(ITEM_COUNT);

  const stackThem = (x: number, y: number) => {
    positions.forEach((pos, i) => {
      zCounter.value = (zCounter.value + 1) % 1000;
      pos.z.value = Math.floor(zCounter.value);
      pos.x.value = withSpring(x);
      pos.y.value = withSpring(y - i * 10);
    });
  };

  const resetSelection = () => {
    selectedStates.forEach((state) => { state.value = false });
  };

  return (
    <View style={styles.container}>

      {positions.map((pos, i) => {
        const pan = Gesture.Pan()
          .onStart(() => {
            pos.z.value = zCounter.value++;
          })
          .onChange((e) => {
            pos.x.value += e.changeX;
            pos.y.value += e.changeY;
          });

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            { translateX: pos.x.value },
            { translateY: pos.y.value }
          ],
          zIndex: pos.z.value,
          borderColor: 'black',
          borderWidth: selectedStates[i].value ? 3 : 0,
          borderRadius: 50,
        }));

        const longPress = Gesture.LongPress()
          .minDuration(400)
          .onStart(() => {
            const x = pos.x.value;
            const y = pos.y.value;
            runOnJS(resetSelection)();
            runOnJS(stackThem)(x, y);
          });


        const tap = Gesture.Tap()
          .maxDuration(100)
          .onEnd(() => {
            selectedStates[i].value = !selectedStates[i].value;
          });

        const gesture = Gesture.Simultaneous(pan, longPress, tap);

        return (
          <GestureDetector key={i} gesture={gesture}>
            <Animated.View style={[styles.imageContainer, animatedStyle]}>
              <Image
                source={image}
                style={styles.image}
              />
            </Animated.View>
          </GestureDetector>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});

export default DraggableStack;