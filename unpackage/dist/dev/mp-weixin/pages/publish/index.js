"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const utils_storage = require("../../utils/storage.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const formData = common_vendor.reactive({
      pickupCode: "",
      quantity: 1,
      weightType: "light",
      address: "",
      expectedTime: "",
      reward: "",
      urgent: 0,
      //是否加急：0-不加急，1-加急
      notes: ""
    });
    const weightOptions = [
      { label: "轻件 (<1kg)", value: "light" },
      { label: "中件 (1-3kg)", value: "medium" },
      { label: "重件 (>3kg)", value: "heavy" }
    ];
    const timeRange = common_vendor.ref([[], []]);
    const calculateTotal = common_vendor.computed(() => {
      let total = parseFloat(formData.reward) || 0;
      if (formData.urgent) {
        total += 5;
      }
      return total.toFixed(2);
    });
    common_vendor.onMounted(() => {
      initTimeRange();
    });
    const initTimeRange = () => {
      const dates = ["今天", "明天", "后天"];
      const hours = [];
      for (let i = 8; i <= 22; i++) {
        hours.push(i + ":00");
      }
      timeRange.value = [dates, hours];
    };
    const timeChange = (e) => {
      const indices = e.detail.value;
      formData.expectedTime = `${timeRange.value[0][indices[0]]} ${timeRange.value[1][indices[1]]}`;
    };
    const timeColumnChange = (e) => {
    };
    const urgentChange = (e) => {
      formData.urgent = Number(e.detail.value);
    };
    const submitOrder = async () => {
      const userInfo = utils_storage.getUserInfo();
      if (userInfo && userInfo.role === 1 && userInfo.verifyStatus !== 2) {
        common_vendor.index.showModal({
          title: "提示",
          content: "您还未通过身份认证，无法发布任务。请先完成身份认证。",
          confirmText: "去认证",
          success: (res2) => {
            if (res2.confirm) {
              common_vendor.index.navigateTo({ url: "/pages/user/verify" });
            }
          }
        });
        return;
      }
      if (!formData.pickupCode || !formData.address || !formData.reward) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "提交中..." });
      const res = await utils_api.publishTask(formData);
      if (res.code == 200) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "发布成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.switchTab({ url: "/pages/user/orders" });
        }, 1500);
      } else {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: res.message, icon: "none" });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: formData.pickupCode,
        b: common_vendor.o(($event) => formData.pickupCode = $event.detail.value),
        c: formData.quantity,
        d: common_vendor.o(($event) => formData.quantity = $event.detail.value),
        e: common_vendor.f(weightOptions, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.value,
            c: formData.weightType === item.value ? 1 : "",
            d: common_vendor.o(($event) => formData.weightType = item.value, item.value)
          };
        }),
        f: formData.address,
        g: common_vendor.o(($event) => formData.address = $event.detail.value),
        h: common_vendor.t(formData.expectedTime || "请选择送达时间"),
        i: formData.expectedTime ? 1 : "",
        j: timeRange.value,
        k: common_vendor.o(timeChange),
        l: common_vendor.o(timeColumnChange),
        m: formData.reward,
        n: common_vendor.o(($event) => formData.reward = $event.detail.value),
        o: formData.urgent,
        p: common_vendor.o(urgentChange),
        q: formData.urgent
      }, formData.urgent ? {} : {}, {
        r: formData.notes,
        s: common_vendor.o(($event) => formData.notes = $event.detail.value),
        t: common_vendor.t(calculateTotal.value),
        v: common_vendor.o(submitOrder)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bb643666"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/index.js.map
