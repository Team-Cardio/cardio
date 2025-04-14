import { View, Button } from 'react-native';

export default function AddChipButton() {
  return (
    <View style={{ padding: 10 }}>
      <Button
        title={"Add chip"}
        onPress={() =>
          undefined
        }
        color="#555"
      />
    </View>
  );
}
