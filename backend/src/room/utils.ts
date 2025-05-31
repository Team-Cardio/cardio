import { Rank } from 'src/types/card';

const getRandomLetter = () => {
  const chr = Math.floor(Math.random() * 26) + 65;
  return String.fromCharCode(chr);
};

export const generateCode = () => {
  return Array.from({ length: 6 }, getRandomLetter).join('');
};

export const getCardRankName = (rank: Rank) => {
  if (rank >= Rank.TWO && rank <= Rank.TEN)
    return rank.toString();
  if (rank >= Rank.JACK && rank <= Rank.KING)
    return ['J', 'Q', 'K'][rank - Rank.JACK];
  return 'A';
};
