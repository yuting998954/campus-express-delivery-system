"use strict";
const common_vendor = require("../common/vendor.js");
function setToken(token) {
  common_vendor.index.setStorageSync("token", token);
}
function getToken() {
  return common_vendor.index.getStorageSync("token");
}
function removeToken() {
  common_vendor.index.removeStorageSync("token");
}
function setUserInfo(userInfo) {
  common_vendor.index.setStorageSync("userInfo", userInfo);
}
function getUserInfo() {
  return common_vendor.index.getStorageSync("userInfo");
}
function removeUserInfo() {
  common_vendor.index.removeStorageSync("userInfo");
}
function isLoggedIn() {
  return !!getToken();
}
function clearAuth() {
  removeToken();
  removeUserInfo();
}
exports.clearAuth = clearAuth;
exports.getToken = getToken;
exports.getUserInfo = getUserInfo;
exports.isLoggedIn = isLoggedIn;
exports.setToken = setToken;
exports.setUserInfo = setUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/storage.js.map
