import { reroute } from "./navigation/reroute.js";

export let started = false; // 是否启动

export const start = () => {
  started = true; // 设置启动为true
  reroute();
}
