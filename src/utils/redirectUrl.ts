
import { ssoLogin } from '@/services/ant-design-pro/api';
import userInfo from '@/utils/userInfo';
import {StorageKeys, getLocalStorage, setLocalStorage, removeLocalStorage} from '@/utils/storage';

const getRedirectUrl = async () => {
  try {
    const url = window.location.href;
    const result: any = await ssoLogin(
      { url },
      {
        silentErrorLog: true,
        silentErrorMessage: true,
      },
    );
    console.log('result', result);
    const authorizationUrl = result?.data?.authorization_url || result?.authorization_url;
    return authorizationUrl || '';
  } catch (error) {
    console.warn('获取重定向 URL 失败，使用默认登录地址', error);
    return '';
  }
};

export const redirectToLogin = async () => {
  // 检查是否已经在跳转中
  if (getLocalStorage(StorageKeys?.REDIRECTING_TO_LOGIN) === 'true') {
    return;
  }
  // 设置跳转锁
  setLocalStorage(StorageKeys?.REDIRECTING_TO_LOGIN, 'true');
  
  try {
    const loginUrl = await getRedirectUrl();
    console.log('loginUrl', loginUrl);
    if (!loginUrl) {
      setLocalStorage(StorageKeys?.CURRENT_USER, '');
      // clearRedirectFlag();
      return;
    }
    setLocalStorage(StorageKeys?.CURRENT_USER, JSON.stringify(userInfo?.data || {}));
    window.location.href = loginUrl;
  } catch (_error) {
    // clearRedirectFlag();
  }
};

// 登录成功回调后清除锁
export const clearRedirectFlag = () => {
  removeLocalStorage(StorageKeys?.REDIRECTING_TO_LOGIN);
};