
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
const suits = ['club', 'diamond', 'heart', 'spade'] as const;

export type Back = 'normal' | 'tcsLight' | 'tcsDark';

type Rank = typeof ranks[number];
type Suit = typeof suits[number];

type Card = {
    rank: Rank;
    suit: Suit;
};

type PlayerRoomData = {
    playerID: string,
    isMyTurn: boolean,
    isActive: boolean,
    isAllIn: boolean,
    chips: number,
    currentBet: number,
    cards: Card[],
}

type Player = {
    playerID: string,
    name: string
    chips: number,
    currentBet: number,
    isAllIn: boolean,
    isFolded: boolean,
    isActive: boolean,
    cards?: Card[]
}

type HostRoomData = {
    players: Player[],
    currentPlayer: string, //player whoes decisoin we are wating for
    potSize: number,
    cards: Card[],
    gameStarted: boolean
    roundFinished: boolean
    winners?: {id:string, amount?:number}[], //playerIDs
}

type PlayerPayload = {
    payload: PlayerRoomData
}

type HostPayload = {
    payload: HostRoomData
}

type PlayerAction = {
    type: string
    amount?: number
}

export { PlayerRoomData, Player, HostRoomData, PlayerAction, HostPayload, PlayerPayload, Card, Rank, Suit }
