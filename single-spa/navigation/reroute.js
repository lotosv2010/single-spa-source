import { getAppChanges, shouldBeActive } from '../application/app.helpers.js';
import { toLoadPromise } from '../lifecycles/load.js';
import { toBootstrapPromise } from '../lifecycles/bootstrap.js';
import { toMountPromise } from '../lifecycles/mount.js';
import { toUnmountPromise } from '../lifecycles/unmount.js';
import { callCaptureEventListeners } from './navigation-event.js';
import { started } from '../start.js';
import './navigation-event.js';



// 重写路由
export const reroute = (event) => {
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges(); // 获取应用的变更

  const callEventListener = () => {
    // 触发原生事件
    callCaptureEventListeners(event);
  }

  // 执行变更
  const performAppChanges = () => {
    const unmountAllPromises = Promise.all(appsToUnmount.map(toUnmountPromise));

    const tryBootstrapAndMount = (app, unmountAllPromises) => {
      if(shouldBeActive(app)) {
        // 保证卸载完毕再加载
        return toBootstrapPromise(app)
        .then(() => unmountAllPromises
          .then(() => toMountPromise(app)))
      }
    };
    
    const loadMountPromises = Promise.all(
      appsToLoad.map(app => {
        return toLoadPromise(app).then(() => {
          // 尝试启动和挂载应用，保证挂载前，先卸掉旧应用
          return tryBootstrapAndMount(app, unmountAllPromises);
        });
      })
    );

    const mountPromises = Promise.all(
      appsToMount.map(app => {
        return tryBootstrapAndMount(app, unmountAllPromises);
      })
    )

    return Promise.all([loadMountPromises, mountPromises])
      .then(() => {
        callEventListener(); // 卸载完成后调用原生事件
      });
  }

  // 如果应用已经启动，则执行变更
  if(started) {
    return performAppChanges();
  }

  // 加载应用
  const loadApps = () => {
    return Promise.all(appsToLoad.map(toLoadPromise))
      .then(callEventListener); // 资源加载完调用原生事件
  }

  return loadApps();
}
