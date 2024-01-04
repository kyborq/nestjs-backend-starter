export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export class TokenUtils {
  static generateToken<T>(data: T, secret: string): string {
    return '';
  }

  static generateTokens<T>(data: T): TokenResponse {
    const accessToken = this.generateToken<T>(data, 'secret');
    const refreshToken = this.generateToken<T>(data, 'secret');
    return { accessToken, refreshToken };
  }
}
