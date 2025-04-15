import { type ImageSource } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
  chipSource: ImageSource;
};

export default function SingleChip({ chipSource }: Props) {
  const chosenChip = useSharedValue(false);
  const chipSize = useSharedValue(100);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(400);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onStart(() => {
      if (chosenChip.value) {
        chipSize.value = chipSize.value / 1.2;
      } else {
        chipSize.value = chipSize.value * 1.2;
      }
      chosenChip.value = !chosenChip.value;
    });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(chipSize.value),
      height: withSpring(chipSize.value),
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