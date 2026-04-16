"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_storage = require("./utils/storage.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/publish/index.js";
  "./pages/pickup/hall.js";
  "./pages/user/orders.js";
  "./pages/my/index.js";
  "./pages/user/order-detail.js";
  "./pages/chat/chat.js";
  "./pages/pickup/earnings.js";
  "./pages/user/evaluate.js";
  "./pages/user/appeal.js";
  "./pages/user/verify.js";
  "./pages/payment/pay.js";
  "./pages/login/login.js";
  "./pages/login/register.js";
  "./pages/my/dispute/index.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    let socketTask = null;
    let isConnecting = false;
    common_vendor.onLaunch(() => {
      common_vendor.index.__f__("log", "at App.vue:10", "App Launch");
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at App.vue:14", "App Show");
      refreshUserInfo();
      connectWebSocket();
    });
    common_vendor.onHide(() => {
      closeWebSocket();
    });
    const refreshUserInfo = async () => {
      const token = utils_storage.getToken();
      if (!token)
        return;
      try {
        const res = await common_vendor.index.request({
          url: "http://localhost:8081/api/user/info",
          method: "GET",
          header: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data && res.data.code === 200 && res.data.data) {
          utils_storage.setUserInfo(res.data.data);
          common_vendor.index.__f__("log", "at App.vue:37", "用户信息已刷新:", res.data.data);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at App.vue:40", "刷新用户信息失败", e);
      }
    };
    const connectWebSocket = () => {
      const token = utils_storage.getToken();
      const user = utils_storage.getUserInfo();
      if (!token || !user || !user.id)
        return;
      if (isConnecting || socketTask && socketTask.readyState === 0)
        return;
      isConnecting = true;
      const wsUrl = `ws://localhost:8081/ws/chat?token=${token}&orderId=0&userId=${user.id}`;
      socketTask = common_vendor.index.connectSocket({
        url: wsUrl,
        success: () => {
          common_vendor.index.__f__("log", "at App.vue:57", "WebSocket 连接中...");
        }
      });
      socketTask.onOpen(() => {
        common_vendor.index.__f__("log", "at App.vue:62", "WebSocket 连接成功");
        isConnecting = false;
      });
      socketTask.onMessage((res) => {
        try {
          const data = JSON.parse(res.data);
          handleSocketMessage(data);
        } catch (e) {
          common_vendor.index.__f__("error", "at App.vue:71", "解析 WebSocket 消息失败", e);
        }
      });
      socketTask.onError(() => {
        common_vendor.index.__f__("log", "at App.vue:76", "WebSocket 连接错误");
        isConnecting = false;
      });
      socketTask.onClose(() => {
        common_vendor.index.__f__("log", "at App.vue:81", "WebSocket 连接关闭");
        socketTask = null;
        isConnecting = false;
      });
    };
    const closeWebSocket = () => {
      if (socketTask) {
        socketTask.close();
        socketTask = null;
      }
    };
    const handleSocketMessage = (data) => {
      if (data.type === "dispute_result") {
        common_vendor.index.showModal({
          title: data.title || "纠纷仲裁结果",
          content: data.message,
          showCancel: false,
          success: () => {
            common_vendor.index.$emit("refreshMessages");
            common_vendor.index.$emit("refreshOrderDetail");
          }
        });
      } else if (data.type === "order") {
        common_vendor.index.$emit("refreshOrderDetail");
      } else if (data.type === "auth_approve") {
        refreshUserInfo();
        common_vendor.index.showToast({ title: data.message, icon: "none" });
      } else if (data.type === "auth_reject") {
        refreshUserInfo();
        common_vendor.index.showToast({ title: data.message, icon: "none" });
      }
    };
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
