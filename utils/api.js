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
// 身份认证接口
export function authenticate(data) {
  return request("/auth/submit", "POST", data);
}

// 获取认证信息
export function getVerificationStatus() {
  return request("/auth/status", "GET", );
}
// 头像上传
export function uploadAvatar(data) {
  return request( '/user/avatar', "POST",data)
}
// 上传文件到服务器
export function uploadFile(tempFilePath, userId, type) {
  return new Promise((resolve, reject) => {
    let url = BASE_URL + '/file/upload';
    if (userId && type) {
      url = BASE_URL + '/file/upload/' + userId + '/' + type;
    }
    uni.uploadFile({
      url: url,
      filePath: tempFilePath,
      name: 'file',
      header: {
        Authorization: uni.getStorageSync("token")
          ? `Bearer ${uni.getStorageSync("token")}`
          : "",
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data);
          if (data.code === 200) {
            resolve(data);
          } else {
            reject(data);
          }
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

// ========== 订单相关接口 ==========

// 获取接单大厅订单列表
export function getPickupHall(query) {
  return request("/orders/hall", "GET", query);
}

// 代取员接单
export function acceptOrder(orderId) {
  return request("/orders/" + orderId + "/accept", "POST");
}

// 获取我的订单列表
export function getMyOrders(role, status) {
  const params = { role };
  if (status !== undefined && status !== null && status !== '') {
    params.status = status;
  }
  return request("/orders/my", "GET", params);
}

// 获取订单详情
export function getOrderDetail(orderId) {
  return request("/orders/" + orderId, "GET");
}

// 取消订单
export function cancelOrderApi(orderId) {
  return request("/orders/" + orderId + "/cancel", "POST");
}

// 确认收货
export function confirmReceiptApi(orderId) {
  return request("/order/confirm?orderId=" + orderId, "PUT");
}

// 代取员上报订单进度
export function reportProgress(orderId, progressStatus, proofImagePath) {
  return request("/orders/progress", "PUT", { orderId, progressStatus, proofImagePath });
}

// 提交订单评价
export function submitEvaluation(data) {
  return request("/eval/submit", "POST", data);
}

// ========== 消息相关接口 ==========

// 获取未读消息数量
export function getUnreadMessageCount() {
  return request("/messages/unread/count", "GET");
}

// 获取消息列表
export function getMessageList(page = 1, pageSize = 20) {
  return request("/messages/list", "GET", { page, pageSize });
}

// 获取消息详情
export function getMessageDetail(messageId) {
  return request("/messages/" + messageId, "GET");
}

// 标记消息为已读
export function markMessageRead(messageId) {
  return request("/messages/" + messageId + "/read", "PUT");
}

// 标记所有消息为已读
export function markAllMessagesRead() {
  return request("/messages/read/all", "PUT");
}

// 提交纠纷
export function submitDispute(data) {
  return request("/dispute/submit", "POST", data);
}

// 查询当前纠纷记录
export function getMyDisputes(data) {
  return request("/dispute/my", "GET",data);
}

// 获取纠纷详情
export function getDisputeDetail(disputeId) {
  return request("/dispute/" + disputeId, "GET");
}