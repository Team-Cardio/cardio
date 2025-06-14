import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

type Props = {
  source: any; // ImageSourcePropType is preferred, but 'any' for simplicity
  children: React.ReactNode;
};

export default function Background({ source, children }: Props) {
  return (
    <ImageBackground
      source={source}
      resizeMode="cover"
      style={styles.background}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});