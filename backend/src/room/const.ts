export const REDIS = {
  getRoomKey: (code: string) => `room:${code}`,
  getRoomSetKey: () => `rooms`,
  getPlayerCounterKey: () => `player:counter`,
  getPlayerRoomKey: (playerId: number) => `player:${playerId}:room`,
};

