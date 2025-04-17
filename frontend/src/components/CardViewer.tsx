import React, { useState, useRef } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { type Suit, type Rank, type Back } from '@/src/types/cards';
import { cardBackMap, cardMap } from '@/src/components/CardMap';

type Props = {
  suit: Suit;
  rank: Rank;
  back: Back;
};

export default function CardViewer({ suit, rank, back }: Props) {
  const [showCardFront, setShowCardFront] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const cardImageFront = cardMap[suit]?.[rank];
  const cardImageBack = cardBackMap[back];

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
        source={showCardFront ? cardImageFront : cardImageBack}
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
    margin: 2,
    borderColor: 'black',
    borderRadius: "9%",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
});