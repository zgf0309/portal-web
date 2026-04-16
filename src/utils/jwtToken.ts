import { getLocalStorage, StorageKeys } from '@/utils/storage';

/**
 * JWT 标准字段 + 业务扩展字段
 */
export interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

const JWT_PARTS_COUNT = 3;
const BASE64_SEGMENT_LENGTH = 4;

const normalizeBase64Url = (value: string): string => {
  const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/');
  const remainder = normalizedValue.length % BASE64_SEGMENT_LENGTH;

  if (remainder === 0) {
    return normalizedValue;
  }

  return normalizedValue.padEnd(
    normalizedValue.length + (BASE64_SEGMENT_LENGTH - remainder),
    '=',
  );
};

const decodeBase64Url = (value: string): string => {
  if (typeof globalThis.atob !== 'function') {
    throw new Error('Current environment does not support atob');
  }

  const binaryString = globalThis.atob(normalizeBase64Url(value));
  const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
};

/**
 * 判断 token 是否为 JWT 三段式结构
 */
export const isJwtToken = (token?: string | null): token is string => {
  if (!token) {
    return false;
  }

  return token.split('.').length === JWT_PARTS_COUNT;
};

/**
 * 解析 JWT payload
 * 仅做前端解码，不校验签名
 */
export const parseTokenPayload = <T extends JwtPayload = JwtPayload>(
  token?: string | null,
): T | null => {
  if (!isJwtToken(token)) {
    return null;
  }

  try {
    const [, payload] = token.split('.');
    return JSON.parse(decodeBase64Url(payload)) as T;
  } catch (error) {
    console.warn('Failed to parse JWT payload:', error);
    return null;
  }
};

/**
 * 获取 token 过期时间戳（毫秒）
 */
export const getTokenExpiresAt = (token?: string | null): number | null => {
  const payload = parseTokenPayload(token);

  if (typeof payload?.exp !== 'number') {
    return null;
  }

  return payload.exp * 1000;
};

/**
 * 判断 token 是否过期
 * 无效 token 或没有 exp 时，默认按已过期处理
 */
export const isTokenExpired = (token?: string | null, offsetMs = 0): boolean => {
  const expiresAt = getTokenExpiresAt(token);

  if (expiresAt === null) {
    return true;
  }

  return expiresAt <= Date.now() + offsetMs;
};

/**
 * 获取 token 剩余有效时间（毫秒）
 */
export const getTokenRemainingTime = (token?: string | null): number => {
  const expiresAt = getTokenExpiresAt(token);

  if (expiresAt === null) {
    return 0;
  }

  return Math.max(expiresAt - Date.now(), 0);
};

/**
 * 获取本地缓存中的 access_token
 */
export const getStoredAccessToken = (): string => {
  const accessToken = getLocalStorage<string>(StorageKeys.ACCESS_TOKEN);
  return typeof accessToken === 'string' ? accessToken : '';
};

/**
 * 解析本地缓存中的 access_token
 */
export const getStoredAccessTokenPayload = <T extends JwtPayload = JwtPayload>(): T | null => {
  return parseTokenPayload<T>(getStoredAccessToken());
};

/**
 * 判断本地缓存中的 access_token 是否过期
 * 默认预留 30 秒缓冲，便于前端提前刷新或重新登录
 */
export const isStoredAccessTokenExpired = (offsetMs = 30_000): boolean => {
  return isTokenExpired(getStoredAccessToken(), offsetMs);
};
