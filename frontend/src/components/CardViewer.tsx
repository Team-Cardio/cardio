import React, { useState, useRef } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { type ImageSource } from 'expo-image';

type Props = {
  frontImg: ImageSource;
  backImg: ImageSource;
};

export default function CardViewer({ frontImg, backImg }: Props) {
  const [showCardFront, setShowCardFront] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleCardSwitch = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start(() => {
      setShowCardFront(!showCardFront);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <TouchableOpacity
      onPress={handleCardSwitch}
      style={styles.cardContainer}
    >
      <Animated.Image
        source={showCardFront ? frontImg : backImg}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode={"contain"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: Math.min(
      (Dimensions.get('window').width - 32) / 2,
      (Dimensions.get('window').height * 0.5 * 0.5)
    ),
    aspectRatio: 0.73,
    margin: 3,
    borderColor: 'black',
    borderRadius: 18,
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
});