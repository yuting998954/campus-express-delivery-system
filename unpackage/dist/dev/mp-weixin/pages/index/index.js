"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_storage = require("../../utils/storage.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userInfo = common_vendor.ref({});
    common_vendor.onShow(() => {
      loadUserInfo();
    });
    const loadUserInfo = () => {
      const info = utils_storage.getUserInfo();
      if (info) {
        userInfo.value = info;
      } else {
        userInfo.value = null;
      }
    };
    const goLogin = () => {
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
    };
    const goPublish = () => {
      if (!userInfo.value) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none", duration: 1500 });
        goLogin();
        return;
      }
      if (userInfo.value.role !== 0) {
        common_vendor.index.showToast({ title: "请使用普通用户账号登录", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({ url: "/pages/publish/index" });
    };
    const goPickup = () => {
      if (!userInfo.value) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        goLogin();
        return;
      }
      if (userInfo.value.role !== 1) {
        common_vendor.index.showToast({ title: "请使用代取员账号登录", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({ url: "/pages/pickup/hall" });
    };
    const goOrders = () => {
      if (!userInfo.value) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        goLogin();
        return;
      }
      common_vendor.index.switchTab({ url: "/pages/user/orders" });
    };
    const goEarnings = () => {
      if (!userInfo.value) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        goLogin();
        return;
      }
      common_vendor.index.navigateTo({ url: "/pages/pickup/earnings" });
    };
    const goAddress = () => {
      common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
    };
    const goHelp = () => {
      common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
    };
    return (_ctx, _cache) => {
      return {
        a: userInfo.value && userInfo.value.avatar ? userInfo.value.avatar : "/static/logo.png",
        b: common_vendor.t(userInfo.value && userInfo.value.nickname ? userInfo.value.nickname : "同学"),
        c: common_vendor.o(goPublish),
        d: common_vendor.o(goPickup),
        e: common_vendor.t(userInfo.value.role === 0 ? "我的订单" : "我的承接"),
        f: common_vendor.o(goOrders),
        g: common_vendor.o(goEarnings),
        h: common_vendor.o(goAddress),
        i: common_vendor.o(goHelp)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
