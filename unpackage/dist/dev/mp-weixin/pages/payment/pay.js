"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const _sfc_main = {
  __name: "pay",
  setup(__props) {
    const orderId = common_vendor.ref("");
    const orderInfo = common_vendor.ref({});
    const amount = common_vendor.ref("0.00");
    const userBalance = common_vendor.ref("128.50");
    const paymentMethod = common_vendor.ref("wechat");
    const countdown = common_vendor.ref("15:00");
    const isPaying = common_vendor.ref(false);
    let timer = null;
    common_vendor.onLoad(async (options) => {
      common_vendor.index.__f__("log", "at pages/payment/pay.vue:92", options);
      if (options.id) {
        orderId.value = options.id;
        await loadOrderInfo();
      }
      startCountdown();
    });
    const loadOrderInfo = async () => {
      common_vendor.index.showLoading({ title: "加载中..." });
      try {
        const res = await utils_api.getOrderDetail(orderId.value);
        if (res.code === 200) {
          orderInfo.value = res.data;
          amount.value = res.data.totalReward || "0.00";
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/payment/pay.vue:110", "加载订单信息失败", e);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const selectMethod = (method) => {
      if (isPaying.value)
        return;
      paymentMethod.value = method;
    };
    const startCountdown = () => {
      let seconds = 15 * 60;
      timer = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
          clearInterval(timer);
          countdown.value = "00:00";
          common_vendor.index.showToast({ title: "支付超时", icon: "none" });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
          return;
        }
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        countdown.value = `${m}:${s}`;
      }, 1e3);
    };
    const handlePay = async () => {
      if (isPaying.value)
        return;
      if (paymentMethod.value === "balance" && parseFloat(amount.value) > parseFloat(userBalance.value)) {
        common_vendor.index.showToast({ title: "余额不足", icon: "none" });
        return;
      }
      isPaying.value = true;
      common_vendor.index.showLoading({ title: "支付中..." });
      try {
        const result = await utils_api.confirmReceiptApi(orderId.value);
        if (result.code === 200) {
          clearInterval(timer);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "支付成功", icon: "success" });
          setTimeout(() => {
            common_vendor.index.redirectTo({
              url: "/pages/user/evaluate?id=" + orderId.value
            });
          }, 1500);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/payment/pay.vue:167", "支付失败", e);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "支付失败，请重试", icon: "none" });
        isPaying.value = false;
      }
    };
    const cancelPay = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消支付吗？取消后订单将保持送达状态",
        success: (res) => {
          if (res.confirm) {
            clearInterval(timer);
            common_vendor.index.navigateBack();
          }
        }
      });
    };
    common_vendor.onBeforeUnmount(() => {
      if (timer)
        clearInterval(timer);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(amount.value),
        b: common_vendor.t(countdown.value),
        c: common_vendor.t(orderInfo.value.orderNo || ""),
        d: common_vendor.t(orderInfo.value.runnerName || "待分配"),
        e: paymentMethod.value === "wechat"
      }, paymentMethod.value === "wechat" ? {} : {}, {
        f: paymentMethod.value === "wechat" ? 1 : "",
        g: common_vendor.o(($event) => selectMethod("wechat")),
        h: paymentMethod.value === "alipay"
      }, paymentMethod.value === "alipay" ? {} : {}, {
        i: paymentMethod.value === "alipay" ? 1 : "",
        j: common_vendor.o(($event) => selectMethod("alipay")),
        k: common_vendor.t(userBalance.value),
        l: paymentMethod.value === "balance"
      }, paymentMethod.value === "balance" ? {} : {}, {
        m: paymentMethod.value === "balance" ? 1 : "",
        n: common_vendor.o(($event) => selectMethod("balance")),
        o: paymentMethod.value === "balance" && parseFloat(amount.value) > userBalance.value
      }, paymentMethod.value === "balance" && parseFloat(amount.value) > userBalance.value ? {} : {}, {
        p: !isPaying.value
      }, !isPaying.value ? {
        q: common_vendor.t(amount.value)
      } : {}, {
        r: common_vendor.o(handlePay),
        s: isPaying.value,
        t: common_vendor.o(cancelPay)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7250164a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/payment/pay.js.map
