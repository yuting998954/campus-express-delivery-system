"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const _sfc_main = {
  __name: "evaluate",
  setup(__props) {
    const orderInfo = common_vendor.ref({
      orderNo: "",
      baseFee: "0.00",
      urgentFee: "0.00",
      tipFee: "0.00",
      totalAmount: "0.00"
    });
    const runnerInfo = common_vendor.ref({
      name: "",
      avatar: "/static/logo.png",
      phone: ""
    });
    const rating = common_vendor.ref(5);
    const comment = common_vendor.ref("");
    const selectedTags = common_vendor.ref([]);
    const isAnonymous = common_vendor.ref(false);
    const orderId = common_vendor.ref(null);
    const evaluatorId = common_vendor.ref(null);
    const targetUserId = common_vendor.ref(null);
    const availableTags = ["按时送达", "提前送达", "服务态度好", "穿着整洁", "风雨无阻", "餐品完好"];
    const ratingText = common_vendor.computed(() => {
      const texts = ["非常不满意", "不满意", "一般", "满意", "非常满意"];
      return texts[rating.value - 1] || "";
    });
    common_vendor.onLoad(async (options) => {
      if (options.id) {
        orderId.value = Number(options.id);
        common_vendor.index.showLoading({ title: "加载中..." });
        try {
          const res = await utils_api.getOrderDetail(orderId.value);
          if (res.code === 200 && res.data) {
            const order = res.data;
            orderInfo.value = {
              orderNo: order.orderNo,
              baseFee: order.reward || "0.00",
              urgentFee: order.urgentFee || "0.00",
              totalAmount: order.totalReward || "0.00"
            };
            if (order.runnerId) {
              targetUserId.value = order.runnerId;
              runnerInfo.value = {
                name: order.runnerName || "代取员",
                avatar: order.runnerAvatar || "/static/logo.png",
                phone: order.runnerPhone || ""
              };
            }
            const userRes = await utils_api.getUserInfo();
            if (userRes.code === 200 && userRes.data) {
              evaluatorId.value = userRes.data.id;
            }
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/user/evaluate.vue:169", "加载订单信息失败", e);
        } finally {
          common_vendor.index.hideLoading();
        }
      }
    });
    const setRating = (score) => {
      rating.value = score;
    };
    const toggleTag = (tag) => {
      const index = selectedTags.value.indexOf(tag);
      if (index > -1) {
        selectedTags.value.splice(index, 1);
      } else {
        selectedTags.value.push(tag);
      }
    };
    const contactRunner = () => {
      if (runnerInfo.value.phone) {
        common_vendor.index.makePhoneCall({
          phoneNumber: runnerInfo.value.phone
        });
      }
    };
    const submitEval = async () => {
      if (rating.value === 0) {
        common_vendor.index.showToast({ title: "请先打分哦", icon: "none" });
        return;
      }
      if (!evaluatorId.value || !targetUserId.value) {
        common_vendor.index.showToast({ title: "数据加载中，请稍后", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "提交中..." });
      try {
        const res = await utils_api.submitEvaluation({
          orderId: orderId.value,
          evaluatorId: evaluatorId.value,
          targetUserId: targetUserId.value,
          star: rating.value,
          content: comment.value,
          tags: selectedTags.value
        });
        if (res.code === 200) {
          common_vendor.index.showToast({ title: "评价成功", icon: "success" });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user/evaluate.vue:224", "提交评价失败", e);
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(orderInfo.value.totalAmount),
        b: common_vendor.t(orderInfo.value.baseFee),
        c: orderInfo.value.urgentFee > 0
      }, orderInfo.value.urgentFee > 0 ? {
        d: common_vendor.t(orderInfo.value.urgentFee)
      } : {}, {
        e: orderInfo.value.tipFee > 0
      }, orderInfo.value.tipFee > 0 ? {
        f: common_vendor.t(orderInfo.value.tipFee)
      } : {}, {
        g: common_vendor.t(orderInfo.value.totalAmount),
        h: runnerInfo.value.avatar,
        i: common_vendor.t(runnerInfo.value.name),
        j: common_vendor.o(contactRunner),
        k: common_vendor.f(5, (i, k0, i0) => {
          return {
            a: i,
            b: i <= rating.value ? 1 : "",
            c: common_vendor.o(($event) => setRating(i), i)
          };
        }),
        l: common_vendor.t(ratingText.value),
        m: common_vendor.f(availableTags, (tag, index, i0) => {
          return {
            a: common_vendor.t(tag),
            b: index,
            c: selectedTags.value.includes(tag) ? 1 : "",
            d: common_vendor.o(($event) => toggleTag(tag), index)
          };
        }),
        n: comment.value,
        o: common_vendor.o(($event) => comment.value = $event.detail.value),
        p: isAnonymous.value
      }, isAnonymous.value ? {} : {}, {
        q: isAnonymous.value ? 1 : "",
        r: common_vendor.o(($event) => isAnonymous.value = !isAnonymous.value),
        s: common_vendor.o(submitEval)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3fdceec0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/evaluate.js.map
