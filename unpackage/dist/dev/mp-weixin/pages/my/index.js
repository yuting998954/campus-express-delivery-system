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
      loadEarningStatistics();
    });
    common_vendor.watch(isLoggedIn, (newVal) => {
      if (!newVal) {
        userInfo.value = {};
        unreadCount.value = 0;
        orderCount.value = 0;
        earnings.value = "0.00";
      }
    });
    const checkLoginStatus = () => {
      isLoggedIn.value = utils_storage.isLoggedIn();
      if (isLoggedIn.value) {
        userInfo.value = utils_storage.getUserInfo() || {};
      } else {
        userInfo.value = {};
      }
    };
    const loadEarningStatistics = async () => {
      if (!isLoggedIn.value || userInfo.value.role !== 1)
        return;
      try {
        const res = await utils_api.getEarningStatistics();
        if (res.code === 200) {
          earnings.value = res.data.totalAmount || "0.00";
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/my/index.vue:123", "加载收益统计失败", e);
      }
    };
    const loadUserData = async () => {
      if (!isLoggedIn.value)
        return;
      try {
        const disputeRes = await utils_api.getMyDisputes(1, 100);
        if (disputeRes.code === 200) {
          const list = disputeRes.data.records || disputeRes.data || [];
          unreadCount.value = list.filter((i) => i.status === 0).length;
        }
        const orderRes = await utils_api.getMyOrders(userInfo.value.role, void 0);
        if (orderRes.code === 200) {
          orderCount.value = orderRes.data.total || 0;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/my/index.vue:141", "加载用户数据失败", e);
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
    const getCreditScoreClass = (score) => {
      if (!score && score !== 0)
        return "credit-default";
      if (score >= 90)
        return "credit-excellent";
      if (score >= 80)
        return "credit-good";
      if (score >= 60)
        return "credit-fair";
      return "credit-poor";
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
              common_vendor.index.__f__("error", "at pages/my/index.vue:184", "退出登录接口调用失败:", error);
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
      if (!isLoggedIn.value) {
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
      if (url.includes("orders")) {
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
            common_vendor.index.__f__("error", "at pages/my/index.vue:253", "上传头像失败:", error);
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
        c: common_vendor.t(!!userInfo.value.phone ? userInfo.value.phone : "普通用户 / 代取人"),
        d: userInfo.value.verifyStatus === 2
      }, userInfo.value.verifyStatus === 2 ? {} : {}, {
        e: unreadCount.value > 0
      }, unreadCount.value > 0 ? {
        f: common_vendor.t(unreadCount.value > 99 ? "99+" : unreadCount.value)
      } : {}, {
        g: common_vendor.o(($event) => navigateTo("/pages/my/messages")),
        h: common_vendor.t(orderCount.value || 0),
        i: common_vendor.o(($event) => navigateTo("/pages/user/orders")),
        j: userInfo.value.role === 1
      }, userInfo.value.role === 1 ? {
        k: common_vendor.t(earnings.value || "0.00"),
        l: common_vendor.o(($event) => navigateTo("/pages/pickup/earnings"))
      } : {}, {
        m: common_vendor.t(userInfo.value.creditScore || 100),
        n: common_vendor.n(getCreditScoreClass(userInfo.value.creditScore)),
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
        y: common_vendor.o(($event) => navigateTo("/pages/my/dispute/index")),
        z: isLoggedIn.value
      }, isLoggedIn.value ? {
        A: common_vendor.o(handleLogout)
      } : {
        B: common_vendor.o(goLogin)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f97bc692"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/index.js.map
