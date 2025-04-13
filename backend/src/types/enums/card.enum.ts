export const Color = {
    CLUB: 'CLUB',
    DIAMOND: 'DIAMOND',
    HEART: 'HEART',
    SPADE: 'SPADE',
} as const;

export type Color = (typeof Color)[keyof typeof Color];

export const Rank = {
    Ace: 'ACE',
    Two: 'TWO',
    Three: 'THREE',
    Four: 'FOUR',
    Five: 'FIVE',
    Six: 'SIX',
    Seven: 'SEVEN',
    Eight: 'EIGHT',
    Nine: 'NINE',
    Ten: 'TEN',
    Jack: 'JACK',
    Queen: 'QUEEN',
    King: 'KING',
} as const;

export type Rank = (typeof Rank)[keyof typeof Rank];
