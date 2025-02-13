import { reroute } from '../navigation/reroute.js';
import { NOT_LOADED } from './app.helpers.js';

// 校验参数
const sanitizeArguments = (appNameOrConfig, appOrLoadApp, activeWhen, customProps) => {
  if (typeof appNameOrConfig === 'string') {
    return {
      name: appNameOrConfig,
      loadApp: appOrLoadApp,
      activeWhen: activeWhen,
      customProps: customProps,
      status: NOT_LOADED,
    }
  }
  return {
    loadApp: appNameOrConfig.app,
    ...appNameOrConfig,
    status: NOT_LOADED
  };
}

export const apps = []; // 应用列表

// 注册应用
export const registerApplication = (appNameOrConfig, appOrLoadApp, activeWhen, customProps) => {
  const appConfig = sanitizeArguments(appNameOrConfig, appOrLoadApp, activeWhen, customProps);
  apps.push(appConfig);

  // 未加载 --> 加载 --> 启动 --> 挂载 --> 更新 --> 卸载

  reroute(); // 重写路由
}
