"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_api = require("../../utils/api.js");
const utils_storage = require("../../utils/storage.js");
const _sfc_main = {
  __name: "order-detail",
  setup(__props) {
    const order = common_vendor.ref(null);
    const userInfo = common_vendor.ref(null);
    const showModal = common_vendor.ref(false);
    const modalTitle = common_vendor.ref("");
    const currentProgress = common_vendor.ref("");
    const proofImage = common_vendor.ref("");
    common_vendor.onLoad(async (options) => {
      userInfo.value = utils_storage.getUserInfo();
      if (options.id) {
        common_vendor.index.showLoading({ title: "加载中..." });
        try {
          const res = await utils_api.getOrderDetail(options.id);
          if (res.code === 200) {
            order.value = res.data;
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/user/order-detail.vue:197", "加载订单详情失败", e);
          common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        } finally {
          common_vendor.index.hideLoading();
        }
      }
    });
    const isRunner = common_vendor.computed(() => {
      var _a;
      return ((_a = userInfo.value) == null ? void 0 : _a.role) === 1;
    });
    const canReportProgress = common_vendor.computed(() => {
      if (!order.value)
        return false;
      return order.value.status === 1 || order.value.status === 2 || order.value.status === 3;
    });
    const statusDesc = common_vendor.computed(() => {
      if (!order.value)
        return "";
      const descMap = {
        0: "等待代取人承接...",
        1: "代取人已接单，正前往取件点",
        2: "快递已取到，正在配送中",
        3: "快递已送达，等待确认",
        4: "用户已确认，等待评价",
        5: "订单已完成，感谢使用",
        6: "订单已取消",
        7: "订单纠纷中"
      };
      return descMap[order.value.status] || "";
    });
    const previewImg = (url) => {
      common_vendor.index.previewImage({ urls: [url] });
    };
    const goToChatWithPublisher = () => {
      if (order.value && order.value.publisherId) {
        common_vendor.index.navigateTo({ url: "/pages/chat/chat?id=" + order.value.publisherId + "&orderId=" + order.value.id });
      }
    };
    const goToChat = () => {
      if (order.value && order.value.runnerId) {
        common_vendor.index.navigateTo({ url: "/pages/chat/chat?id=" + order.value.runnerId + "&orderId=" + order.value.id });
      }
    };
    const showProgressModal = (progress) => {
      currentProgress.value = progress;
      modalTitle.value = progress === "picked" ? "取件完成上报" : "送达完成上报";
      proofImage.value = "";
      showModal.value = true;
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          var _a;
          const tempFilePath = res.tempFilePaths[0];
          common_vendor.index.showLoading({ title: "上传中..." });
          try {
            const result = await utils_api.uploadFile(tempFilePath, (_a = userInfo.value) == null ? void 0 : _a.id, "progress");
            if (result.code === 200) {
              proofImage.value = result.data.url;
              common_vendor.index.showToast({ title: "上传成功", icon: "success" });
            }
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/user/order-detail.vue:273", "上传失败", e);
            common_vendor.index.showToast({ title: "上传失败", icon: "none" });
          } finally {
            common_vendor.index.hideLoading();
          }
        }
      });
    };
    const submitProgress = async () => {
      if (!order.value)
        return;
      common_vendor.index.showLoading({ title: "提交中..." });
      try {
        const result = await utils_api.reportProgress(order.value.id, currentProgress.value, proofImage.value);
        if (result.code === 200) {
          common_vendor.index.showToast({ title: "上报成功", icon: "success" });
          showModal.value = false;
          const res = await utils_api.getOrderDetail(order.value.id);
          if (res.code === 200) {
            order.value = res.data;
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user/order-detail.vue:298", "上报失败", e);
        common_vendor.index.showToast({ title: e.message || "上报失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const cancelOrder = async () => {
      if (!order.value)
        return;
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消订单吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_api.cancelOrderApi(order.value.id);
              if (result.code === 200) {
                common_vendor.index.showToast({ title: "已取消", icon: "success" });
                setTimeout(() => {
                  common_vendor.index.navigateBack();
                }, 1500);
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/user/order-detail.vue:321", "取消订单失败", e);
            }
          }
        }
      });
    };
    const confirmReceipt = () => {
      if (!order.value)
        return;
      common_vendor.index.navigateTo({ url: "/pages/payment/pay?id=" + order.value.id });
    };
    const goToEvaluate = () => {
      if (order.value) {
        common_vendor.index.navigateTo({ url: "/pages/user/evaluate?id=" + order.value.id });
      }
    };
    const goToAppeal = () => {
      if (order.value) {
        common_vendor.index.navigateTo({ url: "/pages/user/appeal?id=" + order.value.id });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(order.value.statusLabel),
        b: common_vendor.t(statusDesc.value),
        c: common_vendor.t(order.value.orderNo),
        d: common_vendor.t(order.value.pickupCode),
        e: common_vendor.t(order.value.quantity),
        f: common_vendor.t(order.value.weightLabel),
        g: common_vendor.t(order.value.address),
        h: common_vendor.t(order.value.expectedTime),
        i: common_vendor.t(order.value.notes || "无"),
        j: common_vendor.t(order.value.reward),
        k: order.value.isUrgent
      }, order.value.isUrgent ? {
        l: common_vendor.t(order.value.urgentFee)
      } : {}, {
        m: common_vendor.t(order.value.totalReward),
        n: isRunner.value && order.value.publisherId
      }, isRunner.value && order.value.publisherId ? {
        o: common_assets._imports_0,
        p: common_vendor.t(order.value.publisherName || "用户" + order.value.publisherId),
        q: common_vendor.t(order.value.publisherPhone || "暂无电话"),
        r: common_vendor.o(goToChatWithPublisher)
      } : {}, {
        s: !isRunner.value && order.value.runnerId
      }, !isRunner.value && order.value.runnerId ? {
        t: common_assets._imports_0,
        v: common_vendor.t(order.value.runnerName || "代取员" + order.value.runnerId),
        w: common_vendor.t(order.value.runnerRating || "暂无"),
        x: common_vendor.o(goToChat)
      } : {}, {
        y: order.value.pickupPhoto || order.value.deliveryPhoto
      }, order.value.pickupPhoto || order.value.deliveryPhoto ? common_vendor.e({
        z: order.value.pickupPhoto
      }, order.value.pickupPhoto ? {
        A: order.value.pickupPhoto,
        B: common_vendor.o(($event) => previewImg(order.value.pickupPhoto))
      } : {}, {
        C: order.value.deliveryPhoto
      }, order.value.deliveryPhoto ? {
        D: order.value.deliveryPhoto,
        E: common_vendor.o(($event) => previewImg(order.value.deliveryPhoto))
      } : {}) : {}, {
        F: isRunner.value && canReportProgress.value
      }, isRunner.value && canReportProgress.value ? common_vendor.e({
        G: order.value.status >= 1 ? 1 : "",
        H: order.value.status > 1 ? 1 : "",
        I: order.value.status > 1 ? 1 : "",
        J: order.value.status >= 1 ? 1 : "",
        K: order.value.status > 1 ? 1 : "",
        L: order.value.status > 2 ? 1 : "",
        M: order.value.status >= 2 ? 1 : "",
        N: order.value.status > 2 ? 1 : "",
        O: order.value.status > 3 ? 1 : "",
        P: order.value.status >= 3 ? 1 : "",
        Q: order.value.status >= 3 ? 1 : "",
        R: order.value.status === 1
      }, order.value.status === 1 ? {
        S: common_vendor.o(($event) => showProgressModal("picked"))
      } : {}, {
        T: order.value.status === 2
      }, order.value.status === 2 ? {
        U: common_vendor.o(($event) => showProgressModal("delivered"))
      } : {}, {
        V: order.value.status === 3
      }, order.value.status === 3 ? {} : {}) : {}, {
        W: order.value.status === 0 || order.value.status === 1
      }, order.value.status === 0 || order.value.status === 1 ? {
        X: common_vendor.o(cancelOrder)
      } : {}, {
        Y: order.value.status === 3 && !isRunner.value
      }, order.value.status === 3 && !isRunner.value ? {
        Z: common_vendor.o(confirmReceipt)
      } : {}, {
        aa: order.value.status === 4 || order.value.status === 5
      }, order.value.status === 4 || order.value.status === 5 ? {
        ab: common_vendor.o(goToAppeal)
      } : {}, {
        ac: order.value.status === 4 && !order.value.isEvaluated && !isRunner.value
      }, order.value.status === 4 && !order.value.isEvaluated && !isRunner.value ? {
        ad: common_vendor.o(goToEvaluate)
      } : {}, {
        ae: showModal.value
      }, showModal.value ? common_vendor.e({
        af: common_vendor.t(modalTitle.value),
        ag: proofImage.value
      }, proofImage.value ? {
        ah: proofImage.value
      } : {}, {
        ai: common_vendor.o(chooseImage),
        aj: common_vendor.o(($event) => showModal.value = false),
        ak: common_vendor.o(submitProgress),
        al: common_vendor.o(() => {
        }),
        am: common_vendor.o(($event) => showModal.value = false)
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-29badeee"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/order-detail.js.map
