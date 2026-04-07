"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_storage = require("../../utils/storage.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {}
    };
  },
  onShow() {
    this.loadUserInfo();
  },
  methods: {
    loadUserInfo() {
      const info = utils_storage.getUserInfo();
      if (info) {
        this.userInfo = info;
      } else {
        this.userInfo = null;
      }
      common_vendor.index.__f__("log", "at pages/index/index.vue:91", info);
    },
    goLogin() {
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
    },
    // 普通用户发布代取
    goPublish() {
      if (!this.userInfo) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      if (this.userInfo.role !== 0) {
        common_vendor.index.showToast({ title: "请使用普通用户账号登录", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({ url: "/pages/publish/index" });
    },
    // 代取员接单大厅
    goPickup() {
      if (!this.userInfo) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      if (this.userInfo.role !== 1) {
        common_vendor.index.showToast({ title: "请使用代取员账号登录", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({ url: "/pages/pickup/hall" });
    },
    goOrders() {
      common_vendor.index.switchTab({ url: "/pages/user/orders" });
    },
    goEarnings() {
      common_vendor.index.navigateTo({ url: "/pages/pickup/earnings" });
    },
    goAddress() {
      common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
    },
    goHelp() {
      common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.userInfo && $data.userInfo.avatar ? $data.userInfo.avatar : "/static/logo.png",
    b: common_vendor.t($data.userInfo && $data.userInfo.nickname ? $data.userInfo.nickname : "同学"),
    c: common_vendor.o((...args) => $options.goPublish && $options.goPublish(...args)),
    d: common_vendor.o((...args) => $options.goPickup && $options.goPickup(...args)),
    e: common_vendor.o((...args) => $options.goOrders && $options.goOrders(...args)),
    f: common_vendor.o((...args) => $options.goEarnings && $options.goEarnings(...args)),
    g: common_vendor.o((...args) => $options.goAddress && $options.goAddress(...args)),
    h: common_vendor.o((...args) => $options.goHelp && $options.goHelp(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
