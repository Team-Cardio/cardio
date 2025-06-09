import { Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const RankingsSource = require('@/assets/images/rankings.png')

export default function ChipsViewer() {

  return <Image source={RankingsSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    marginTop: 10,
    width: Math.min(
      (Dimensions.get('window').width - 20),
      (Dimensions.get('window').height * 0.5)
    ),
    aspectRatio: 0.57,
  },
});