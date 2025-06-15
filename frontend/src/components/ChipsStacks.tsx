import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DraggableStack from './DraggableStack';

const Chip1 = require("@/assets/images/chips/monte_carlo/chip_1.png");
const Chip5 = require("@/assets/images/chips/monte_carlo/chip_5.png");
const Chip25 = require("@/assets/images/chips/monte_carlo/chip_25.png");
const Chip50 = require("@/assets/images/chips/monte_carlo/chip_50.png");
const Chip100 = require("@/assets/images/chips/monte_carlo/chip_100.png");

type Props = {
    value: number;
};

const ChipsStacks = ({ value }: Props) => {
  const [count100, setCount100] = useState(0);
  const [count50, setCount50] = useState(0);
  const [count25, setCount25] = useState(0);
  const [count5, setCount5] = useState(0);
  const [count1, setCount1] = useState(0);

  useEffect(() => {
    let amount = value;
    const c100 = Math.max(Math.floor((amount - 200) / 100), 0);
    amount -= 100 * c100;
    const c50 = Math.max(Math.floor((amount - 100) / 50), 0);
    amount -= 50 * c50;
    const c25 = Math.max(Math.floor((amount - 10) / 25), 0);
    amount -= 25 * c25;
    const c5 = Math.max(Math.floor((amount - 3) / 5), 0);
    amount -= 5 * c5;
    const c1 = amount;

    setCount100(c100);
    setCount50(c50);
    setCount25(c25);
    setCount5(c5);
    setCount1(c1);
  }, [value]);

   return (
    <View style={styles.container}>
      <View style={styles.chipsContainer}>
        <DraggableStack image={Chip100} amount={count100} position={2} />
        <DraggableStack image={Chip50} amount={count50} position={1} />
        <DraggableStack image={Chip25} amount={count25} position={0} />
        <DraggableStack image={Chip5} amount={count5} position={-1} />
        <DraggableStack image={Chip1} amount={count1} position={-2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  chipsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
});

export default ChipsStacks;
