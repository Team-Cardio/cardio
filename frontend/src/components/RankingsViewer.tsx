import { Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const RankingsSource = require('@/assets/images/rankings.png')

export default function ChipsViewer() {

  return <Image source={RankingsSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: Math.min(
      (Dimensions.get('window').width - 16),
      (Dimensions.get('window').height * 0.5)
    ),
    aspectRatio: 0.57,
  },
});