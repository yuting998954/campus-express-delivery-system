"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const _sfc_main = {
  data() {
    return {
      formData: {
        pickupCode: "",
        quantity: 1,
        weightType: "light",
        address: "",
        expectedTime: "",
        reward: "",
        urgent: false,
        notes: ""
      },
      weightOptions: [
        { label: "轻件 (<1kg)", value: "light" },
        { label: "中件 (1-3kg)", value: "medium" },
        { label: "重件 (>3kg)", value: "heavy" }
      ],
      timeRange: [[], []],
      selectedTimeIndices: [0, 0]
    };
  },
  computed: {
    calculateTotal() {
      let total = parseFloat(this.formData.reward) || 0;
      if (this.formData.urgent) {
        total += 5;
      }
      return total.toFixed(2);
    }
  },
  onLoad() {
    this.initTimeRange();
  },
  methods: {
    initTimeRange() {
      const dates = ["今天", "明天", "后天"];
      const hours = [];
      for (let i = 8; i <= 22; i++) {
        hours.push(i + ":00");
      }
      this.timeRange = [dates, hours];
    },
    timeChange(e) {
      const indices = e.detail.value;
      this.formData.expectedTime = `${this.timeRange[0][indices[0]]} ${this.timeRange[1][indices[1]]}`;
    },
    timeColumnChange(e) {
    },
    urgentChange(e) {
      common_vendor.index.__f__("log", "at pages/publish/index.vue:163", e.detail.value);
      this.formData.urgent = e.detail.value;
    },
    async submitOrder() {
      if (!this.formData.pickupCode || !this.formData.address || !this.formData.reward) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "提交中..." });
      common_vendor.index.__f__("log", "at pages/publish/index.vue:172", this.formData, "1111");
      const res = await utils_api.publishTask(this.formData);
      common_vendor.index.__f__("log", "at pages/publish/index.vue:175", res);
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
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.formData.pickupCode,
    b: common_vendor.o(($event) => $data.formData.pickupCode = $event.detail.value),
    c: $data.formData.quantity,
    d: common_vendor.o(($event) => $data.formData.quantity = $event.detail.value),
    e: common_vendor.f($data.weightOptions, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: item.value,
        c: $data.formData.weightType === item.value ? 1 : "",
        d: common_vendor.o(($event) => $data.formData.weightType = item.value, item.value)
      };
    }),
    f: $data.formData.address,
    g: common_vendor.o(($event) => $data.formData.address = $event.detail.value),
    h: common_vendor.t($data.formData.expectedTime || "请选择送达时间"),
    i: $data.formData.expectedTime ? 1 : "",
    j: $data.timeRange,
    k: common_vendor.o((...args) => $options.timeChange && $options.timeChange(...args)),
    l: common_vendor.o((...args) => $options.timeColumnChange && $options.timeColumnChange(...args)),
    m: $data.formData.reward,
    n: common_vendor.o(($event) => $data.formData.reward = $event.detail.value),
    o: $data.formData.isUrgent,
    p: common_vendor.o((...args) => $options.urgentChange && $options.urgentChange(...args)),
    q: $data.formData.urgent
  }, $data.formData.urgent ? {} : {}, {
    r: $data.formData.notes,
    s: common_vendor.o(($event) => $data.formData.notes = $event.detail.value),
    t: common_vendor.t($options.calculateTotal),
    v: common_vendor.o((...args) => $options.submitOrder && $options.submitOrder(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bb643666"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/index.js.map
