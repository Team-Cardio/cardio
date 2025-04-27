export type Suit = 'club' | 'diamond' | 'heart' | 'spade';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type Back = 'normal' | 'tcsLight' | 'tcsDark';

export type CardMap = {
  [key in Suit]: {
    [key in Rank]: any;
  };
};

export type CardBackMap = {
  [key in Back]: any;
};