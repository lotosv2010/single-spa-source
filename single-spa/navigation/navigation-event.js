import { reroute } from './reroute.js';

// 监听路由变化
function urlRoute () {
  reroute(arguments);
}

// 监听路由变化
window.addEventListener('hashchange', urlRoute);
// 监听返回
window.addEventListener('popstate', urlRoute);

// 需要劫持原生的路由系统，保证加载完成后再切换路由
const captureAddEventListeners = {
  hashchange: [],
  popstate: []
}

const originalAddEventListener = window.addEventListener;
const originalReomveEventListener = window.removeEventListener;

const types = ['hashchange', 'popstate'];
window.addEventListener = function (type, listener, options) {
  if (types.includes(type) && !captureAddEventListeners[type].includes(listener)) {
    return captureAddEventListeners[type].push(listener);
  }
  return originalAddEventListener.call(this, type, listener, options);
}

window.removeEventListener = function (type, listener, options) {
  if (types.includes(type)) {
    const index = captureAddEventListeners[type].indexOf(listener);
    if (index !== -1) {
      return captureAddEventListeners[type].splice(index, 1);
    }
  }
  return originalReomveEventListener.call(this, type, listener, options);
}

export function callCaptureEventListeners (event) {
  if(event) {
    const eventType = event[0].type;
    if(types.includes(eventType)) {
      captureAddEventListeners[eventType].forEach(listener => {
        listener.apply(this, event);
      });
    }
  }
}


function patchHistoryMethod (state, method) {
  return function () {
    const urlBefore = window.location.href;
    const result = state.apply(this, arguments);
    const urlAfter = window.location.href;
    // url 变化了，手动触发popstate事件
    if (urlBefore !== urlAfter) {
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    return result;
  }
}

window.history.pushState =patchHistoryMethod(window.history.pushState, 'pushState')

window.history.replaceState = patchHistoryMethod(window.history.replaceState, 'replaceState')