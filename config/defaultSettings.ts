import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  "title": "AI",
  "navTheme": "light",
  "colorPrimary": "#1890ff",
  "layout": "mix",
  "contentWidth": "Fluid",
  "fixedHeader": true,
  "fixSiderbar": false,
  "pwa": true,
  "logo": "/logo.svg",
  "token": {},
  "splitMenus": true,
  "footerRender": false,
};

export default Settings;