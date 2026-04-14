import { useMemo } from 'react';
import { LocationReloadPlugin } from 'wujie-polyfill';

type UseWujieMicroAppOptions = {
	name: string;
	url: string;
	storagePrefix?: string;
	assetBasePath?: string;
	props?: Record<string, unknown>;
};

const createAssetPrefix = (url: string, assetBasePath: string) => {
	const normalizedUrl = url.endsWith('/') ? url : `${url}/`;
	const normalizedAssetBasePath = assetBasePath.replace(/^\//, '');
	return `${normalizedUrl}${normalizedAssetBasePath}`;
};

const rewriteMicroAppHtml = (html: string, assetPrefix: string, assetBasePath: string) =>
	html.replace(
		new RegExp(`(href|src)=(["'])/${assetBasePath}`, 'g'),
		`$1=$2${assetPrefix}`,
	);

const rewriteMicroAppCss = (css: string, assetPrefix: string, assetBasePath: string) =>
	css.replace(new RegExp(`url\\(\\s*(["']?)/${assetBasePath}`, 'g'), `url($1${assetPrefix}`);

const rewriteMicroAppJs = (code: string | undefined, assetPrefix: string, assetBasePath: string) => {
	if (typeof code !== 'string') {
		return code ?? '';
	}

	return code
		.replace(
			new RegExp(`const publicPath = '/${assetBasePath}';`, 'g'),
			`const publicPath = '${assetPrefix}';`,
		)
		.replace(
			new RegExp(`const publicPath = "/${assetBasePath}";`, 'g'),
			`const publicPath = "${assetPrefix}";`,
		)
		.replace(
			new RegExp(`publicPath:\\s*'/${assetBasePath}'`, 'g'),
			`publicPath: '${assetPrefix}'`,
		)
		.replace(
			new RegExp(`publicPath:\\s*"/${assetBasePath}"`, 'g'),
			`publicPath: "${assetPrefix}"`,
		)
		.replace(
			new RegExp(`requireModule\\.publicPath\\s*=\\s*'/${assetBasePath}'`, 'g'),
			`requireModule.publicPath = '${assetPrefix}'`,
		)
		.replace(
			new RegExp(`requireModule\\.publicPath\\s*=\\s*"/${assetBasePath}"`, 'g'),
			`requireModule.publicPath = "${assetPrefix}"`,
		);
};

export const useWujieMicroApp = ({
	name,
	url,
	storagePrefix,
	assetBasePath = 'api/',
	props,
}: UseWujieMicroAppOptions) => {
	const assetPrefix = useMemo(() => createAssetPrefix(url, assetBasePath), [url, assetBasePath]);

	const plugins = useMemo(
		() => [
			{
				htmlLoader: (html: string) => rewriteMicroAppHtml(html, assetPrefix, assetBasePath),
				cssLoader: (css: string) => rewriteMicroAppCss(css, assetPrefix, assetBasePath),
				jsLoader: (code: string) => rewriteMicroAppJs(code, assetPrefix, assetBasePath),
			},
			LocationReloadPlugin(),
		],
		[assetBasePath, assetPrefix],
	);

	const injectedProps = useMemo(
		() => ({
			storagePrefix: storagePrefix ?? name,
			subAppName: name,
			...(props ?? {}),
		}),
		[name, props, storagePrefix],
	);

	return {
		name,
		url,
		plugins,
		props: injectedProps,
	};
};

export const defaultChildSettings = () => {
	return {
      "navTheme": "light",
      "colorPrimary": "#1890ff",
      "layout": "mix",
      "contentWidth": "Fluid",
      "fixedHeader": false,
      "fixSiderbar": false,
      "pwa": true,
      "logo": "logo.svg",
      "token": {},
      "splitMenus": false,
      "headerRender": false,
      "menuHeaderRender": false,
      "footerRender": false
    };
};