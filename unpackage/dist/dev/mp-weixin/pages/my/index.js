"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_storage = require("../../utils/storage.js");
const utils_api = require("../../utils/api.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {},
      isLoggedIn: false
    };
  },
  onLoad() {
    this.checkLoginStatus();
  },
  onShow() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = utils_storage.isLoggedIn();
      if (this.isLoggedIn) {
        this.userInfo = utils_storage.getUserInfo() || {};
      } else {
        this.userInfo = {};
      }
    },
    async handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_api.logout();
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/my/index.vue:96", "退出登录接口调用失败:", error);
            }
            utils_storage.clearAuth();
            this.checkLoginStatus();
            common_vendor.index.showToast({ title: "已退出登录", icon: "success" });
          }
        }
      });
    },
    goLogin() {
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
    },
    navigateTo(url) {
      const needLoginPages = ["/pages/user/orders", "/pages/pickup/earnings"];
      if (needLoginPages.includes(url) && !this.isLoggedIn) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录",
          success: (res) => {
            if (res.confirm) {
              this.goToLogin();
            }
          }
        });
        return;
      }
      if (url.includes("hall") || url.includes("orders") || url.includes("profile") || url.includes("index")) {
        common_vendor.index.switchTab({ url });
      } else {
        common_vendor.index.navigateTo({ url });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0,
    b: common_vendor.t($data.userInfo.phone || "普通用户 / 代取人"),
    c: common_vendor.t($data.userInfo.id || "未登录"),
    d: common_vendor.o(($event) => $options.navigateTo("/pages/user/orders")),
    e: common_vendor.o(($event) => $options.navigateTo("/pages/pickup/earnings")),
    f: common_vendor.o(($event) => $options.navigateTo("/pages/user/orders")),
    g: common_vendor.o(($event) => $options.navigateTo("/pages/pickup/hall")),
    h: common_vendor.o(($event) => $options.navigateTo("/pages/pickup/earnings")),
    i: common_vendor.o(($event) => $options.navigateTo("/pages/user/verify")),
    j: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    k: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  } : {
    l: common_vendor.o((...args) => $options.goLogin && $options.goLogin(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f97bc692"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/index.js.map
