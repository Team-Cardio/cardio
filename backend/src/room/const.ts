export const REDIS = {
  getRoomKey: (code: string) => `room:${code}`,
  getPlayerCounterKey: () => `player:counter`,
  getPlayerRoomKey: (playerId: number) => `player:${playerId}:room`,
};
