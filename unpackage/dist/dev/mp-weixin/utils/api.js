"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:8081/api";
function request(url, method = "GET", data = {}) {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        "Content-Type": "application/json",
        // 从本地存储获取token
        Authorization: common_vendor.index.getStorageSync("token") ? `Bearer ${common_vendor.index.getStorageSync("token")}` : ""
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.removeStorageSync("userInfo");
          common_vendor.index.showToast({ title: "登录已过期，请重新登录", icon: "none" });
          setTimeout(() => {
            common_vendor.index.navigateTo({ url: "/pages/auth/login" });
          }, 1500);
          reject(res);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
function login(data) {
  return request("/auth/login", "POST", data);
}
function register(data) {
  return request("/auth/register", "POST", data);
}
function logout() {
  return request("/auth/logout", "POST");
}
function publishTask(data) {
  return request("/orders/createOrder", "POST", data);
}
exports.login = login;
exports.logout = logout;
exports.publishTask = publishTask;
exports.register = register;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/api.js.map
