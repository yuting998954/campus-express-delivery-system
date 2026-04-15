"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_storage = require("../../utils/storage.js");
const utils_api = require("../../utils/api.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userInfo = common_vendor.ref({});
    const isLoggedIn = common_vendor.ref(false);
    const unreadCount = common_vendor.ref(0);
    const orderCount = common_vendor.ref(0);
    const earnings = common_vendor.ref("0.00");
    common_vendor.onShow(() => {
      checkLoginStatus();
      loadUserData();
    });
    const checkLoginStatus = () => {
      isLoggedIn.value = utils_storage.isLoggedIn();
      if (isLoggedIn.value) {
        userInfo.value = utils_storage.getUserInfo() || {};
      } else {
        userInfo.value = {};
      }
    };
    const loadUserData = async () => {
      if (!isLoggedIn.value)
        return;
      try {
        const msgRes = await utils_api.getUnreadMessageCount();
        if (msgRes.code === 200) {
          unreadCount.value = msgRes.data || 0;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/my/index.vue:118", "加载用户数据失败", e);
      }
    };
    const getVerifyStatusText = (status) => {
      switch (status) {
        case 0:
          return "未认证";
        case 1:
          return "审核中";
        case 2:
          return "已认证";
        case 3:
          return "已驳回";
        default:
          return "未认证";
      }
    };
    const getVerifyStatusClass = (status) => {
      switch (status) {
        case 2:
          return "status-pass";
        case 1:
          return "status-pending";
        case 3:
          return "status-reject";
        default:
          return "status-none";
      }
    };
    const handleLogout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_api.logout();
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/my/index.vue:152", "退出登录接口调用失败:", error);
            }
            utils_storage.clearAuth();
            checkLoginStatus();
            common_vendor.index.showToast({ title: "已退出登录", icon: "success" });
          }
        }
      });
    };
    const goLogin = () => {
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
    };
    const navigateTo = (url) => {
      const needLoginPages = ["/pages/user/orders", "/pages/pickup/earnings", "/pages/my/messages"];
      if (needLoginPages.includes(url) && !isLoggedIn.value) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录",
          success: (res) => {
            if (res.confirm) {
              goLogin();
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
    };
    const changeAvatar = () => {
      if (!isLoggedIn.value) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录后再修改头像",
          success: (res) => {
            if (res.confirm)
              goLogin();
          }
        });
        return;
      }
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          common_vendor.index.showLoading({ title: "上传中..." });
          try {
            const result = await utils_api.uploadAvatar(tempFilePath);
            common_vendor.index.hideLoading();
            if (result.code === 200) {
              userInfo.value.avatar = result.data.avatar || result.data.avatarUrl;
              const stored = utils_storage.getUserInfo() || {};
              stored.avatar = result.data.avatar || result.data.avatarUrl;
              utils_storage.setUserInfo(stored);
              common_vendor.index.showToast({ title: "头像已更新", icon: "success" });
            } else {
              common_vendor.index.showToast({ title: result.message || "上传失败", icon: "none" });
            }
          } catch (error) {
            common_vendor.index.hideLoading();
            common_vendor.index.__f__("error", "at pages/my/index.vue:224", "上传头像失败:", error);
            common_vendor.index.showToast({ title: "上传头像失败", icon: "none" });
          }
        },
        fail: () => {
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.value.avatar || "/static/logo.png",
        b: common_vendor.o(changeAvatar),
        c: common_vendor.t(userInfo.value.phone || "普通用户 / 代取人"),
        d: userInfo.value.verifyStatus === 2
      }, userInfo.value.verifyStatus === 2 ? {} : {}, {
        e: common_vendor.t(userInfo.value.id || "未登录"),
        f: unreadCount.value > 0
      }, unreadCount.value > 0 ? {
        g: common_vendor.t(unreadCount.value > 99 ? "99+" : unreadCount.value)
      } : {}, {
        h: common_vendor.o(($event) => navigateTo("/pages/my/messages")),
        i: common_vendor.t(orderCount.value || 0),
        j: common_vendor.o(($event) => navigateTo("/pages/user/orders")),
        k: userInfo.value.role === 1
      }, userInfo.value.role === 1 ? {
        l: common_vendor.t(earnings.value || "0.00"),
        m: common_vendor.o(($event) => navigateTo("/pages/pickup/earnings"))
      } : {}, {
        n: common_vendor.t(userInfo.value.rating || "5.0"),
        o: userInfo.value.role !== 1 ? 1 : "",
        p: common_vendor.o(($event) => navigateTo("/pages/user/orders")),
        q: userInfo.value.role === 1
      }, userInfo.value.role === 1 ? {
        r: common_vendor.o(($event) => navigateTo("/pages/pickup/hall"))
      } : {}, {
        s: userInfo.value.role === 1
      }, userInfo.value.role === 1 ? {
        t: common_vendor.o(($event) => navigateTo("/pages/pickup/earnings"))
      } : {}, {
        v: common_vendor.t(getVerifyStatusText(userInfo.value.verifyStatus)),
        w: common_vendor.n(getVerifyStatusClass(userInfo.value.verifyStatus)),
        x: common_vendor.o(($event) => navigateTo("/pages/user/verify")),
        y: unreadCount.value > 0
      }, unreadCount.value > 0 ? {} : {}, {
        z: common_vendor.o(($event) => navigateTo("/pages/my/messages")),
        A: isLoggedIn.value
      }, isLoggedIn.value ? {
        B: common_vendor.o(handleLogout)
      } : {
        C: common_vendor.o(goLogin)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f97bc692"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/index.js.map
