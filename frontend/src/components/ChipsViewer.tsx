import { StyleSheet } from 'react-native';
import { Image, type ImageSource } from 'expo-image';

type Props = {
  imgSource: ImageSource;
};

export default function ChipsViewer({ imgSource }: Props) {
  const imageSource = imgSource;

  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: 260,
    height: 260,
    margin: 3,
    resizeMode: 'contain',
  },
});