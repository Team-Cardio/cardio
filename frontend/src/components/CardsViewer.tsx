import { StyleSheet } from 'react-native';
import { Image, type ImageSource } from 'expo-image';

type Props = {
  imgSource: ImageSource;
};

export default function CardViewer({ imgSource }: Props) {
  const imageSource = imgSource;

  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 180,
    height: 250,
    margin: 3,
    resizeMode: 'contain',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
  },
});