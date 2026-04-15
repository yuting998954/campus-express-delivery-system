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
  "./pages/my/messages/messages.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      common_vendor.index.__f__("log", "at App.vue:6", "App Launch");
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at App.vue:10", "App Show");
      refreshUserInfo();
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at App.vue:16", "App Hide");
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
          common_vendor.index.__f__("log", "at App.vue:34", "用户信息已刷新:", res.data.data);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at App.vue:37", "刷新用户信息失败", e);
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
