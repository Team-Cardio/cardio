import React, { useState } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { type Suit, type Rank, type Back } from '@/src/types/cards';
import { cardBackMap, cardMap } from '@/src/components/CardMap';

type CardViewerProps = {
  suit: Suit;
  rank: Rank;
  back: Back;
};

export default function CardViewer({ suit, rank, back }: CardViewerProps) {
  const [showCardFront, setShowCardFront] = useState(false);

  const cardImageFront = cardMap[suit]?.[rank];
  const cardImageBack = cardBackMap[back];

  return (
    <TouchableOpacity
      onPress={() => setShowCardFront(!showCardFront)}
      style={styles.cardContainer}
    >
      <Animated.Image
        source={showCardFront ? cardImageFront : cardImageBack}
        style={styles.image}
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
    aspectRatio: 0.728,
    margin: 2,
    borderColor: 'black',
    borderRadius: "9%",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});