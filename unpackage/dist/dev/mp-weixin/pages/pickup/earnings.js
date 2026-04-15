"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "earnings",
  setup(__props) {
    const totalEarnings = common_vendor.ref("128.50");
    const earningsList = common_vendor.ref([
      {
        id: 1,
        orderId: 101,
        orderNo: "ORD20260114001",
        time: "2026-01-14 11:20",
        amount: "8.00"
      },
      {
        id: 2,
        orderId: 102,
        orderNo: "ORD20260114002",
        time: "2026-01-13 18:45",
        amount: "15.00"
      },
      {
        id: 3,
        orderId: 103,
        orderNo: "ORD20260113005",
        time: "2026-01-13 14:10",
        amount: "12.00"
      }
    ]);
    const goToDetail = (orderId) => {
      common_vendor.index.navigateTo({ url: `/pages/user/order-detail?id=${orderId}` });
    };
    const goToAppeal = (orderId) => {
      common_vendor.index.navigateTo({ url: `/pages/user/appeal?id=${orderId}&role=runner` });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(totalEarnings.value),
        b: common_vendor.f(earningsList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.orderNo),
            b: common_vendor.t(item.time),
            c: common_vendor.t(item.amount),
            d: common_vendor.o(($event) => goToAppeal(item.orderId), item.id),
            e: item.id,
            f: common_vendor.o(($event) => goToDetail(item.orderId), item.id)
          };
        }),
        c: earningsList.value.length === 0
      }, earningsList.value.length === 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5e2c96c8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pickup/earnings.js.map
