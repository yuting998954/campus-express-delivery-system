"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
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
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:6", "App Launch");
    this.checkLoginStatus();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:11", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:14", "App Hide");
  },
  methods: {
    checkLoginStatus() {
    }
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
