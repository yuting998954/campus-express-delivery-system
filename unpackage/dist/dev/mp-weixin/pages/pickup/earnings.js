"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const _sfc_main = {
  __name: "earnings",
  setup(__props) {
    const stats = common_vendor.ref({});
    const earningsList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    common_vendor.onMounted(async () => {
      await loadStatistics();
      await loadEarnings();
    });
    const loadStatistics = async () => {
      try {
        const res = await utils_api.getEarningStatistics();
        if (res.code === 200) {
          stats.value = res.data || {};
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/pickup/earnings.vue:68", "加载收益统计失败", e);
      }
    };
    const loadEarnings = async () => {
      var _a;
      loading.value = true;
      try {
        const res = await utils_api.getEarningList({ pageNum: 1, pageSize: 100 });
        if (res.code === 200) {
          earningsList.value = ((_a = res.data) == null ? void 0 : _a.records) || [];
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/pickup/earnings.vue:80", "加载收益列表失败", e);
      } finally {
        loading.value = false;
      }
    };
    const goToDetail = (orderId) => {
      common_vendor.index.navigateTo({ url: `/pages/user/order-detail?id=${orderId}` });
    };
    const goToAppeal = (orderId) => {
      common_vendor.index.navigateTo({ url: `/pages/user/appeal?id=${orderId}&role=runner` });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(stats.value.totalAmount || "0.00"),
        b: common_vendor.t(stats.value.todayAmount || "0.00"),
        c: common_vendor.t(stats.value.totalCount || 0),
        d: common_vendor.t(stats.value.todayCount || 0),
        e: common_vendor.f(earningsList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.orderNo),
            b: common_vendor.t(item.createTime),
            c: common_vendor.t(item.amount),
            d: common_vendor.o(($event) => goToAppeal(item.orderId), item.earningId),
            e: item.earningId,
            f: common_vendor.o(($event) => goToDetail(item.orderId), item.earningId)
          };
        }),
        f: loading.value
      }, loading.value ? {} : earningsList.value.length === 0 ? {} : {}, {
        g: earningsList.value.length === 0
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5e2c96c8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pickup/earnings.js.map
