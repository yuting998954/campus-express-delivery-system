"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      amount: "0.00",
      orderId: "",
      paymentMethod: "wechat",
      countdown: "14:59",
      timer: null
    };
  },
  onLoad(options) {
    this.amount = options.amount || "15.00";
    this.orderId = options.orderId || "TEMP_ORDER_001";
    this.startCountdown();
  },
  onUnload() {
    if (this.timer)
      clearInterval(this.timer);
  },
  methods: {
    selectMethod(method) {
      this.paymentMethod = method;
    },
    startCountdown() {
      let seconds = 15 * 60;
      this.timer = setInterval(() => {
        seconds--;
        if (seconds < 0) {
          clearInterval(this.timer);
          this.countdown = "00:00";
          return;
        }
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        this.countdown = `${m}:${s}`;
      }, 1e3);
    },
    handlePay() {
      common_vendor.index.showLoading({ title: "支付中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "支付成功",
          icon: "success",
          duration: 1500
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/user/orders",
            success: () => {
            }
          });
        }, 1500);
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.amount),
    b: common_vendor.t($data.countdown),
    c: $data.paymentMethod === "wechat"
  }, $data.paymentMethod === "wechat" ? {} : {}, {
    d: $data.paymentMethod === "wechat" ? 1 : "",
    e: common_vendor.o(($event) => $options.selectMethod("wechat")),
    f: $data.paymentMethod === "alipay"
  }, $data.paymentMethod === "alipay" ? {} : {}, {
    g: $data.paymentMethod === "alipay" ? 1 : "",
    h: common_vendor.o(($event) => $options.selectMethod("alipay")),
    i: $data.paymentMethod === "balance"
  }, $data.paymentMethod === "balance" ? {} : {}, {
    j: $data.paymentMethod === "balance" ? 1 : "",
    k: common_vendor.o(($event) => $options.selectMethod("balance")),
    l: common_vendor.t($data.amount),
    m: common_vendor.o((...args) => $options.handlePay && $options.handlePay(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7250164a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/payment/pay.js.map
