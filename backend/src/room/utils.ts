const getRandomLetter = () => {
  const chr = Math.floor(Math.random() * 26) + 65;
  return String.fromCharCode(chr);
};

export const generateCode = () => {
  return Array.from({ length: 6 }, getRandomLetter).join('');
};
