import { AvatarDropdown, AvatarName, Footer, Question } from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import '@ant-design/v5-patch-for-react-19';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { ssoCallback } from '@/services/ant-design-pro/api';
import { redirectToLogin, clearRedirectFlag } from '@/utils/redirectUrl';
import {StorageKeys, getLocalStorage, setLocalStorage } from '@/utils/storage';

const isDev = process.env.NODE_ENV === 'development';
// const loginPath = '/user/login';

const fallbackPrimaryColor = '#1677ff';

type RuntimeLayoutSettings = Partial<LayoutSettings> & {
  colorPrimary?: string;
  token?: {
    header?: Record<string, string>;
    sider?: Record<string, string>;
  };
};

const toSelectedBackground = (color: string) => {
  const normalized = color.replace('#', '');
  const hex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return 'rgba(22, 119, 255, 0.12)';
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, 0.12)`;
};

const createLayoutToken = (colorPrimary: string) => {
  const selectedBackground = toSelectedBackground(colorPrimary);

  return {
    header: {
      colorTextMenuActive: colorPrimary,
      colorTextMenuSelected: colorPrimary,
      colorBgMenuItemHover: 'none',
      // colorBgMenuItemSelected: selectedBackground,
    },
    sider: {
      colorTextMenuActive: colorPrimary,
      colorTextMenuSelected: colorPrimary,
      colorTextSubMenuSelected: colorPrimary,
      // colorBgMenuItemHover: selectedBackground,
      // colorBgMenuItemSelected: selectedBackground,
    },
  };
};

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser | undefined;
  loading?: boolean;
  fetchUserInfo?: (code: string, state: string) => Promise<API.CurrentUser | undefined>;
}> {

  const fetchUserInfo = async (code: string, state: string) => {
    try {
      const res: any = await ssoCallback({ code, state });
      console.log('res=====>', res);
      if (res?.code === 200) {
        window.history.replaceState({}, '', window.location.pathname);
        return res?.data;
      } else {
        return undefined;
      }
    } catch (_error) {
      return undefined;
    }
   
  };

  const urlParams = new URLSearchParams(window.location.search);
  const state = urlParams.get('state');
  const code = urlParams.get('code');
  console.log('code, state1111===>', code, state);
  if (code && state) {
    // 登录成功回调，清除跳转锁
    const userInfo: any = await fetchUserInfo(code, state);
    if (userInfo) {
      const currentUser = userInfo?.user_info;
      setLocalStorage(StorageKeys.CURRENT_USER, userInfo?.user_info || '');
      setLocalStorage(StorageKeys.ACCESS_TOKEN, userInfo?.access_token || '');
      // 登录失败，清除跳转锁
      clearRedirectFlag();
      return {
        fetchUserInfo,
        currentUser,
        settings: defaultSettings as Partial<LayoutSettings>,
      };
    } else {
      // 登录失败，清除跳转锁
      clearRedirectFlag();
      return {
        fetchUserInfo,
        settings: defaultSettings as Partial<LayoutSettings>,
      };
    }
  } else {
    // 登录失败，清除跳转锁
    clearRedirectFlag();
    console.log('code, state=12345==>', code, state);
    const user = getLocalStorage(StorageKeys.CURRENT_USER) || null;
    console.log('user===9999==>', user);
    if (user) {
      return {
        fetchUserInfo,
        currentUser: user,
        settings: defaultSettings as Partial<LayoutSettings>,
      };
    } else {
      return {
        fetchUserInfo,
        settings: defaultSettings as Partial<LayoutSettings>,
      };
    }
  }
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const settings = (initialState?.settings ?? defaultSettings) as RuntimeLayoutSettings;
  const colorPrimary = String(settings.colorPrimary ?? fallbackPrimaryColor);
  const layoutToken = createLayoutToken(colorPrimary);
  const settingsToken = settings.token ?? {};
  return {
    actionsRender: () => [<Question key="doc" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && !getLocalStorage(StorageKeys.ACCESS_TOKEN)) {
        redirectToLogin();
      }
    },
    bgLayoutImgList: [],
    links: [],
    menuHeaderRender: undefined,
    contentStyle: {
      paddingBlock: '0px',
      paddingInline: '0px',
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...settings,
    token: {
      ...settingsToken,
      header: {
        ...(settingsToken.header ?? {}),
        ...layoutToken.header,
      },
      sider: {
        ...(settingsToken.sider ?? {}),
        ...layoutToken.sider,
      },
    },
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: '', // 'https://proapi.azurewebsites.net',
  ...errorConfig,
};
