import { apps } from './app.js';

// app status
// 加载
export const NOT_LOADED = 'NOT_LOADED'; // 未加载
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'; // 加载源码
export const LOAD_ERROR = 'LOAD_ERROR'; // 加载错误

// 启动
export const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'; // 未启动
export const BOOTSTRAPPING = 'BOOTSTRAPPING'; // 启动中

// 挂载
export const NOT_MOUNTED = 'NOT_MOUNTED'; // 未挂载
export const MOUNTING = 'MOUNTING'; // 挂载中 
export const MOUNTED = 'MOUNTED'; // 已挂载

// 更新
export const UPDATING = 'UPDATING'; // 更新中

// 卸载
export const UNMOUNTING = 'UNMOUNTING'; // 卸载中
export const UNLOADING = 'UNLOADING'; // 卸载中

// 应用是否正在激活
export const isActive = (app) => {
  return app.status === MOUNTED;
}

// 应用是否应该被激活
export const shouldBeActive = (app) => {
  return app.activeWhen(window.location);
}


/**
 * 获取应用的变更
 * @returns 
 */
export const getAppChanges = () => {
  const appsToLoad = []; // 需要加载的应用
  const appsToMount = []; // 需要挂载的应用
  const appsToUnmount = []; // 需要卸载的应用

  apps.forEach(app => {
    const appShouldBeActive = shouldBeActive(app); // 应用是否应该被激活
    // 根据应用的状态，决定是否需要加载、挂载、卸载
    switch (app.status) {
      // 未加载、加载中
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        // 如果应用应该被激活，则需要加载
        if (appShouldBeActive) {
          appsToLoad.push(app);
        }
        break;
      // 未启动、启动中、未挂载
      case NOT_BOOTSTRAPPED:
      case BOOTSTRAPPING:
      case NOT_MOUNTED:
        // 如果应用应该被激活，则需要挂载
        if (appShouldBeActive) {
          appsToMount.push(app);
        }
        break;
      // 已挂载
      case MOUNTED:
        // 如果应用不应该被激活，则需要卸载
        if (!appShouldBeActive) {
          appsToUnmount.push(app);
        }
        break;
      default:
        const error = new Error(`app ${app.name} is in unknown status ${app.status}`);
        throw error;
    }
  });

  return { appsToLoad, appsToMount, appsToUnmount };
}
