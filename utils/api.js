// API基础配置
const BASE_URL = "http://localhost:8081/api";

// 通用请求方法
function request(url, method = "GET", data = {}) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: {
        "Content-Type": "application/json",
        // 从本地存储获取token
        Authorization: uni.getStorageSync("token")
          ? `Bearer ${uni.getStorageSync("token")}`
          : "",
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // token过期，清除登录信息并跳转到登录页
          uni.removeStorageSync("token");
          uni.removeStorageSync("userInfo");
          uni.showToast({ title: "登录已过期，请重新登录", icon: "none" });
          setTimeout(() => {
            uni.navigateTo({ url: "/pages/auth/login" });
          }, 1500);
          reject(res);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

// 登录接口
export function login(data) {
  return request("/auth/login", "POST", data);
}

// 注册接口
export function register(data) {
  return request("/auth/register", "POST", data);
}

// 退出登录接口
export function logout() {
  return request("/auth/logout", "POST");
}

// 获取用户信息接口
export function getUserInfo() {
  return request("/user/info", "GET");
}
// 发布任务接口
export function publishTask(data) {
  return request("/orders/createOrder", "POST", data);
}