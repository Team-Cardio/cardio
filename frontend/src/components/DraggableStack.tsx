import React from 'react';
import { ImageSource } from 'expo-image';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

const ITEM_COUNT = 6;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

type Props = {
  image: ImageSource;
  amount: number;
  position: number
}

const DraggableStack = ({ image , amount, position}: Props) => {
  const positions = [...Array(ITEM_COUNT)].map((_,i) => ({
    x: useSharedValue(position * 100 - 50),
    y: useSharedValue(SCREEN_HEIGHT/5 - i * 15),
  }));

  const zCounter = useSharedValue(ITEM_COUNT);

  const stackThem = (x: number, y: number) => {
    positions.forEach((pos, i) => {
      zCounter.value = (zCounter.value + 1) % 1000;
      pos.x.value = withSpring(x);
      pos.y.value = withSpring(y - i * 15);
    });
  };

  return (
    <View style={styles.container}>

      {positions.map((pos, i) => {
        const isVisible = i < amount;

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            { translateX: pos.x.value },
            { translateY: pos.y.value }
          ],
          opacity: isVisible ? 1 : 0,
          zIndex: isVisible ? 1 : -1,
        }));

        const pan = Gesture.Pan()
          .onChange((e) => {
            pos.x.value += e.changeX;
            pos.y.value += e.changeY;
          });

        const longPress = Gesture.LongPress()
          .minDuration(400)
          .onStart(() => {
            const x = pos.x.value;
            const y = pos.y.value;
            runOnJS(stackThem)(x, y);
          });

        const gesture = isVisible
          ? Gesture.Simultaneous(pan, longPress)
          : Gesture.Tap();

        return (
          <GestureDetector key={i} gesture={gesture}>
            <Animated.View style={[styles.imageContainer, animatedStyle]}>
              <Image source={image} style={styles.image} />
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