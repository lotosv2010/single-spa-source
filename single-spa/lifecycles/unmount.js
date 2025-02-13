import { MOUNTED, UNMOUNTING, NOT_MOUNTED } from "../application/app.helpers.js";

// 卸载函数
export const toUnmountPromise = (app) => {
  return Promise.resolve().then(() => {
    // 如果应用状态不是已挂载，则直接返回
    if (app.status !== MOUNTED) {
      return app;
    }

    app.status = UNMOUNTING; // 设置应用状态为正在卸载

    // 调用应用卸载函数，卸载应用
    return app.unmount(app.customProps).then(() => {
      app.status = NOT_MOUNTED; // 设置应用状态为未挂
    });
  });
};
