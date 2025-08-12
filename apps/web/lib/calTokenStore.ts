export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

const tokenMap = new Map<string, string>();

export function getRefreshToken(accessToken: string): string | undefined {
  return tokenMap.get(accessToken);
}

export function updateTokens(
  oldAccessToken: string,
  newAccessToken: string,
  newRefreshToken: string,
): void {
  tokenMap.delete(oldAccessToken);
  tokenMap.set(newAccessToken, newRefreshToken);
}

export function storeTokens(accessToken: string, refreshToken: string): void {
  tokenMap.set(accessToken, refreshToken);
}
