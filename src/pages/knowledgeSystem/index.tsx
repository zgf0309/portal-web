
import { startTransition, type ComponentType, useEffect, useRef, useState, use } from 'react';
import WujieReact from 'wujie-react';
import { defaultChildSettings, useWujieMicroApp } from '@/hooks/useWujieMicroApp';
import { useModel } from '@umijs/max';
import { getLocalStorage, StorageKeys } from '@/utils/storage';
const { bus } = WujieReact;

const WujieContainer = WujieReact as unknown as ComponentType<Record<string, unknown>>;
const SUB_APP_NAME = 'knowledge-app';
const SUB_APP_URL = '/knowledge-app/';
const SUB_APP_STORAGE_PREFIX = 'knowledge-app';
const KnowledgeSystem = () => {
	const { initialState } = useModel('@@initialState');
	console.log('initialState=====>', initialState);
	const [settings, setSettings] = useState<ReturnType<typeof defaultChildSettings>>(defaultChildSettings);
	useEffect(() => {
		startTransition(() => {
			setSettings({
				...settings,
				colorPrimary: initialState?.settings?.colorPrimary ?? defaultChildSettings()?.colorPrimary,
			});
		});
	}, [initialState?.settings]);
	useEffect(() => {
		localStorage.setItem('childLayoutSettings', JSON.stringify(settings));
		bus.$emit('force-sub-update', {settings, userInfo: initialState?.currentUser || getLocalStorage(StorageKeys.CURRENT_USER) || null});
	}, [settings]);
	const microApp = useWujieMicroApp({
		name: SUB_APP_NAME,
		url: SUB_APP_URL,
		storagePrefix: SUB_APP_STORAGE_PREFIX,
	});
	return (
		<div style={{ width: '100%', height: 'calc(100vh - 58px)', overflow: 'hidden' }}>
			<WujieContainer
				name={microApp.name}
				url={microApp.url}
				width="100%"
				height="100%"
				sync={false}
				alive={false}
				plugins={microApp.plugins}
				props={{
					...microApp.props,
					settings,
					token: getLocalStorage(StorageKeys.ACCESS_TOKEN) || '',
					userInfo: initialState?.currentUser || getLocalStorage(StorageKeys.CURRENT_USER) || null,
				}}
			/>
		</div>
	);
};

export default KnowledgeSystem;
