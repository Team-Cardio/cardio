import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { type Back, Card } from '@/src/types/RoomData'
import { cardBackMap, cardMap } from '@/src/components/CardMap';

type CardViewerProps = {
  card?: Card
  back: Back;
  readyToShow: boolean
};

export default function CardViewer({ card, back, readyToShow }: CardViewerProps) {
  console.log(card);
  const [showCard, setShowCard] = useState(false);
  const cardImageBack = cardBackMap[back];
  const suit = card?.suit ?? "spade";
  const rank = card?.rank ?? "A"
  const cardImageFront = cardMap[suit]?.[rank];

  useEffect(() => {
    if (!readyToShow) {
      setShowCard(false);
    }
  }, [readyToShow]);

  return (
    <TouchableOpacity
      onPress={() => setShowCard(!showCard)}
      style={styles.cardContainer}
    >
      <Animated.Image
        source={readyToShow && showCard ? cardImageFront : cardImageBack}
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