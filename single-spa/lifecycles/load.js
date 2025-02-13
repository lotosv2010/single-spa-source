import { NOT_LOADED, LOADING_SOURCE_CODE, NOT_BOOTSTRAPPED } from '../application/app.helpers.js';

// 将函数数组转换为Promise
const flattenArrayToPromise = (fns) => {
  const arr = Array.isArray(fns) ? fns : [fns];

  // 遍历函数数组，依次执行函数并返回一个Promise
  return function(props) {
    // 使用reduce方法依次执行函数并返回一个Promise
    return arr.reduce((promise, fn) => {
      return promise.then(() => fn(props))
    }, Promise.resolve([]));
  }
}

// 加载应用
export const toLoadPromise = (app) => {
  return Promise.resolve().then(() => {
    // 如果应用状态不是未加载，则直接返回
    if(app.status !== NOT_LOADED) {
      return app;
    }
    
    app.status = LOADING_SOURCE_CODE; // 设置应用状态为加载中

    // 调用应用加载函数，获取应用对象
    return app.loadApp(app.customProps).then(v => {
      const { bootstrap, mount, unmount } = v;
      app.status = NOT_BOOTSTRAPPED; // 设置应用状态为未启动
      app.bootstrap = flattenArrayToPromise(bootstrap);
      app.mount = flattenArrayToPromise(mount);
      app.unmount = flattenArrayToPromise(unmount);
      return app;
    })
  });
}