import { useState } from 'react';
import { type ImageSource } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
  chipSource: ImageSource;
};

export default function Chip({ chipSource }: Props) {
  const [chosenChip, setChosedChip] = useState(false);
  const [chipSize, setChipSize] = useState(100);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(400);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onStart(() => {
      if (chosenChip) {
        setChipSize(chipSize / 1.2);
      } else {
        setChipSize(chipSize * 1.2);
      }
      setChosedChip(!chosenChip);
    });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(chipSize),
      height: withSpring(chipSize),
    };
  });

  const drag = Gesture.Pan().onChange(event => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        }
      ]
    }
  })

  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle, { top: -350 }]}>
        <GestureDetector gesture={doubleTap}>
          <Animated.Image
            source={chipSource}
            resizeMode="contain"
            style={[imageStyle, { width: chipSize, height: chipSize }]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}