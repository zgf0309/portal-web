
import { startTransition, type ComponentType, useEffect, useRef, useState } from 'react';
import WujieReact from 'wujie-react';
import { defaultChildSettings, useWujieMicroApp } from '@/hooks/useWujieMicroApp';
import { useModel } from '@umijs/max';
import { Button } from 'antd';
const { bus } = WujieReact;

const WujieContainer = WujieReact as unknown as ComponentType<Record<string, unknown>>;
const SUB_APP_NAME = 'training-app';
const SUB_APP_URL = '/training-app/';
const SUB_APP_STORAGE_PREFIX = 'training-app';
const TrainingSystem = () => {
  const { initialState } = useModel('@@initialState');
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
    bus.$emit('force-sub-update', settings);
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
        }}
      />
    </div>
  );
};

export default TrainingSystem;
