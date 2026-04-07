"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      orderInfo: {
        orderNo: "ORD20260305001",
        baseFee: "12.00",
        urgentFee: "5.00",
        tipFee: "2.00",
        totalAmount: "19.00"
      },
      runnerInfo: {
        name: "李同学",
        avatar: "/static/logo.png",
        // 实际项目中应替换为真实头像
        phone: "13800138000"
      },
      rating: 5,
      comment: "",
      selectedTags: [],
      availableTags: ["送达准时", "服务态度好", "穿着整洁", "餐品完好", "风雨无阻"],
      isAnonymous: false
    };
  },
  computed: {
    ratingText() {
      const texts = ["非常不满意", "不满意", "一般", "满意", "非常满意"];
      return texts[this.rating - 1] || "";
    }
  },
  methods: {
    setRating(score) {
      this.rating = score;
    },
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag);
      if (index > -1) {
        this.selectedTags.splice(index, 1);
      } else {
        this.selectedTags.push(tag);
      }
    },
    contactRunner() {
      common_vendor.index.makePhoneCall({
        phoneNumber: this.runnerInfo.phone
      });
    },
    submitEval() {
      if (this.rating === 0) {
        common_vendor.index.showToast({ title: "请先打分哦", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "提交中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "评价成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.switchTab({ url: "/pages/user/orders" });
        }, 1500);
      }, 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.orderInfo.totalAmount),
    b: common_vendor.t($data.orderInfo.baseFee),
    c: $data.orderInfo.urgentFee > 0
  }, $data.orderInfo.urgentFee > 0 ? {
    d: common_vendor.t($data.orderInfo.urgentFee)
  } : {}, {
    e: $data.orderInfo.tipFee > 0
  }, $data.orderInfo.tipFee > 0 ? {
    f: common_vendor.t($data.orderInfo.tipFee)
  } : {}, {
    g: common_vendor.t($data.orderInfo.totalAmount),
    h: $data.runnerInfo.avatar,
    i: common_vendor.t($data.runnerInfo.name),
    j: common_vendor.o((...args) => $options.contactRunner && $options.contactRunner(...args)),
    k: common_vendor.f(5, (i, k0, i0) => {
      return {
        a: i,
        b: i <= $data.rating ? 1 : "",
        c: common_vendor.o(($event) => $options.setRating(i), i)
      };
    }),
    l: common_vendor.t($options.ratingText),
    m: common_vendor.f($data.availableTags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index,
        c: $data.selectedTags.includes(tag) ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleTag(tag), index)
      };
    }),
    n: $data.comment,
    o: common_vendor.o(($event) => $data.comment = $event.detail.value),
    p: $data.isAnonymous
  }, $data.isAnonymous ? {} : {}, {
    q: $data.isAnonymous ? 1 : "",
    r: common_vendor.o(($event) => $data.isAnonymous = !$data.isAnonymous),
    s: common_vendor.o((...args) => $options.submitEval && $options.submitEval(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3fdceec0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/evaluate.js.map
