export enum Color {
  SPADE = 'spade',
  HEART = 'heart',
  DIAMOND = 'diamond',
  CLUB = 'club',
}

export enum Rank {
  ACE = 1,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  JACK,
  QUEEN,
  KING,
}

export type Card = {
  color: Color;
  rank: Rank;
};
