import { Rank } from 'src/types/card';

const getRandomLetter = () => {
  const chr = Math.floor(Math.random() * 26) + 65;
  return String.fromCharCode(chr);
};

export const generateCode = () => {
  return Array.from({ length: 6 }, getRandomLetter).join('');
};

export const getCardRankName = (rank: Rank) => {
  if (rank == 1) return 'A';
  if (rank >= 2 && rank <= 10) return rank.toString();
  return ['J', 'Q', 'K'][rank - 11];
};
