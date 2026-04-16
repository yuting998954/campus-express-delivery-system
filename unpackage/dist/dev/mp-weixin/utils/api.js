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
function getUserInfo() {
  return request("/user/info", "GET");
}
function publishTask(data) {
  return request("/orders/createOrder", "POST", data);
}
function authenticate(data) {
  return request("/auth/submit", "POST", data);
}
function getVerificationStatus() {
  return request("/auth/status", "GET");
}
function uploadAvatar(data) {
  return request("/user/avatar", "POST", data);
}
function getPickupHall(query) {
  return request("/orders/hall", "GET", query);
}
function acceptOrder(orderId) {
  return request("/orders/" + orderId + "/accept", "POST");
}
function getMyOrders(role, status) {
  const params = { role };
  if (status !== void 0 && status !== null && status !== "") {
    params.status = status;
  }
  return request("/orders/my", "GET", params);
}
function getOrderDetail(orderId) {
  return request("/orders/" + orderId, "GET");
}
function cancelOrderApi(orderId) {
  return request("/orders/" + orderId + "/cancel", "POST");
}
function confirmReceiptApi(orderId) {
  return request("/order/confirm?orderId=" + orderId, "PUT");
}
function reportProgress(orderId, progressStatus, proofImagePath) {
  return request("/orders/progress", "PUT", { orderId, progressStatus, proofImagePath });
}
function submitEvaluation(data) {
  return request("/eval/submit", "POST", data);
}
function submitDispute(data) {
  return request("/dispute/submit", "POST", data);
}
function getMyDisputes(data) {
  return request("/dispute/my", "GET", data);
}
exports.acceptOrder = acceptOrder;
exports.authenticate = authenticate;
exports.cancelOrderApi = cancelOrderApi;
exports.confirmReceiptApi = confirmReceiptApi;
exports.getMyDisputes = getMyDisputes;
exports.getMyOrders = getMyOrders;
exports.getOrderDetail = getOrderDetail;
exports.getPickupHall = getPickupHall;
exports.getUserInfo = getUserInfo;
exports.getVerificationStatus = getVerificationStatus;
exports.login = login;
exports.logout = logout;
exports.publishTask = publishTask;
exports.register = register;
exports.reportProgress = reportProgress;
exports.submitDispute = submitDispute;
exports.submitEvaluation = submitEvaluation;
exports.uploadAvatar = uploadAvatar;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/api.js.map
