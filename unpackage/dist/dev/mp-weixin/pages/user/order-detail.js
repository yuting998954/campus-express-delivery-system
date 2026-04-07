"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      order: {
        id: 1,
        orderNo: "ORD20260114002",
        pickupCode: "SF123456789",
        status: "shipping",
        statusLabel: "配送中",
        quantity: 2,
        weightLabel: "中件",
        address: "图书馆 4 楼阅览室",
        reward: 10,
        urgentFee: 5,
        totalReward: 15,
        isUrgent: true,
        expectedTime: "今天 18:00",
        notes: "轻拿轻放",
        runner: {
          name: "张三",
          rating: "4.8"
        },
        pickupPhoto: "https://via.placeholder.com/150",
        isEvaluated: false
      }
    };
  },
  computed: {
    statusDesc() {
      const descMap = {
        "pending": "等待代取人承接...",
        "accepted": "代取人已接单，正前往取件点",
        "shipping": "快递已取到，正在为您配送中",
        "delivered": "快递已送达，请确认并支付",
        "completed": "订单已完成，感谢使用",
        "cancelled": "订单已取消"
      };
      return descMap[this.order.status] || "";
    }
  },
  onLoad(options) {
    if (options.id)
      ;
  },
  methods: {
    previewImg(url) {
      common_vendor.index.previewImage({ urls: [url] });
    },
    goToChat() {
      common_vendor.index.navigateTo({ url: "/pages/chat/chat?id=" + this.order.id });
    },
    cancelOrder() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消订单吗？",
        success: (res) => {
          if (res.confirm) {
            this.order.status = "cancelled";
            this.order.statusLabel = "已取消";
          }
        }
      });
    },
    confirmReceipt() {
      common_vendor.index.showLoading({ title: "拉起支付..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "支付成功",
          content: "支付完成，快去给代取人评价吧",
          showCancel: false,
          success: () => {
            this.order.status = "completed";
            this.order.statusLabel = "已完成";
          }
        });
      }, 1e3);
    },
    goToEvaluate() {
      common_vendor.index.navigateTo({ url: "/pages/user/evaluate?id=" + this.order.id });
    },
    goToAppeal() {
      common_vendor.index.navigateTo({ url: "/pages/user/appeal?id=" + this.order.id });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.order.statusLabel),
    b: common_vendor.t($options.statusDesc),
    c: common_vendor.t($data.order.orderNo),
    d: common_vendor.t($data.order.pickupCode),
    e: common_vendor.t($data.order.quantity),
    f: common_vendor.t($data.order.weightLabel),
    g: common_vendor.t($data.order.address),
    h: common_vendor.t($data.order.expectedTime),
    i: common_vendor.t($data.order.notes || "无"),
    j: common_vendor.t($data.order.reward),
    k: $data.order.isUrgent
  }, $data.order.isUrgent ? {
    l: common_vendor.t($data.order.urgentFee)
  } : {}, {
    m: common_vendor.t($data.order.totalReward),
    n: $data.order.runner
  }, $data.order.runner ? {
    o: common_assets._imports_0,
    p: common_vendor.t($data.order.runner.name),
    q: common_vendor.t($data.order.runner.rating),
    r: common_vendor.o((...args) => $options.goToChat && $options.goToChat(...args))
  } : {}, {
    s: $data.order.pickupPhoto || $data.order.deliveryPhoto
  }, $data.order.pickupPhoto || $data.order.deliveryPhoto ? common_vendor.e({
    t: $data.order.pickupPhoto
  }, $data.order.pickupPhoto ? {
    v: $data.order.pickupPhoto,
    w: common_vendor.o(($event) => $options.previewImg($data.order.pickupPhoto))
  } : {}, {
    x: $data.order.deliveryPhoto
  }, $data.order.deliveryPhoto ? {
    y: $data.order.deliveryPhoto,
    z: common_vendor.o(($event) => $options.previewImg($data.order.deliveryPhoto))
  } : {}) : {}, {
    A: $data.order.status === "pending" || $data.order.status === "accepted"
  }, $data.order.status === "pending" || $data.order.status === "accepted" ? {
    B: common_vendor.o((...args) => $options.cancelOrder && $options.cancelOrder(...args))
  } : {}, {
    C: $data.order.status === "delivered"
  }, $data.order.status === "delivered" ? {
    D: common_vendor.o((...args) => $options.confirmReceipt && $options.confirmReceipt(...args))
  } : {}, {
    E: $data.order.status === "completed"
  }, $data.order.status === "completed" ? {
    F: common_vendor.o((...args) => $options.goToAppeal && $options.goToAppeal(...args))
  } : {}, {
    G: $data.order.status === "completed" && !$data.order.isEvaluated
  }, $data.order.status === "completed" && !$data.order.isEvaluated ? {
    H: common_vendor.o((...args) => $options.goToEvaluate && $options.goToEvaluate(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-29badeee"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/order-detail.js.map
