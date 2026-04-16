// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/enhancedRequest';
export async function ssoLogin(
  params: {
    // query
    /** url */
    url?: string;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/auth/sso/login', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function ssoCallback(
  params: {
    // query
    /** code */
    code?: string;
    /** state */
    state?: string;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/auth/sso/callback', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function outLogin(params: {
  // query
  /** redirect_url */
  redirect_url?: string;
  /** id_token_hint */
  id_token_hint?: string;
}, options?: { [key: string]: any }) {
  return request<any>('/api/v1/auth/sso/logout', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}