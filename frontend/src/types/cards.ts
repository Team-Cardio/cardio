import { type Rank, type Suit, type Back } from "./RoomData";

type CardMap = {
  [key in Suit]: {
    [key in Rank]: any;
  };
};

type CardBackMap = {
  [key in Back]: any;
};


export { CardMap, CardBackMap }
