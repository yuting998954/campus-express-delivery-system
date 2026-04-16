"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_api = require("../../../utils/api.js");
const utils_storage = require("../../../utils/storage.js");
const pageSize = 10;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const allList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const noMore = common_vendor.ref(false);
    const filter = common_vendor.ref("all");
    const pageNum = common_vendor.ref(1);
    const displayList = common_vendor.computed(() => {
      if (filter.value === "pending")
        return allList.value.filter((i) => i.status === 0);
      if (filter.value === "done")
        return allList.value.filter((i) => i.status === 1);
      return allList.value;
    });
    const hasPending = common_vendor.computed(() => allList.value.some((i) => i.status === 0));
    common_vendor.onShow(() => {
      if (utils_storage.isLoggedIn()) {
        refresh();
      }
    });
    const setFilter = (f) => {
      filter.value = f;
    };
    const refresh = async () => {
      noMore.value = false;
      loading.value = true;
      allList.value = [];
      try {
        const res = await utils_api.getMyDisputes({ pageNum: pageNum.value, pageSize });
        if (res.code === 200) {
          allList.value = res.data.records || res.data || [];
          noMore.value = allList.value.length < pageSize;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/my/dispute/index.vue:134", "获取纠纷记录失败", e);
      } finally {
        loading.value = false;
      }
    };
    const loadMore = async () => {
      if (loading.value || noMore.value)
        return;
      loading.value = true;
      pageNum.value++;
      try {
        const res = await utils_api.getMyDisputes(page.value, pageSize);
        if (res.code === 200) {
          const newList = res.data.records || res.data || [];
          if (newList.length === 0) {
            noMore.value = true;
          } else {
            allList.value = [...allList.value, ...newList];
            noMore.value = newList.length < pageSize;
          }
        }
      } catch (e) {
        page.value--;
      } finally {
        loading.value = false;
      }
    };
    const goToDetail = (item) => {
      if (item.orderId) {
        common_vendor.index.navigateTo({ url: `/pages/user/order-detail?id=${item.orderId}` });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: filter.value === "all" ? 1 : "",
        b: common_vendor.o(($event) => setFilter("all")),
        c: hasPending.value
      }, hasPending.value ? {} : {}, {
        d: filter.value === "pending" ? 1 : "",
        e: common_vendor.o(($event) => setFilter("pending")),
        f: filter.value === "done" ? 1 : "",
        g: common_vendor.o(($event) => setFilter("done")),
        h: common_vendor.f(displayList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.n(item.status === 1 ? "bar-done" : "bar-pending"),
            b: common_vendor.t(item.orderNo || "ORD" + item.orderId),
            c: common_vendor.t(item.status === 1 ? "已处理" : "待处理"),
            d: common_vendor.n(item.status === 1 ? "badge-done" : "badge-pending"),
            e: item.disputeTypeLabel
          }, item.disputeTypeLabel ? {
            f: common_vendor.t(item.disputeTypeLabel)
          } : {}, {
            g: common_vendor.t(item.result || "等待仲裁"),
            h: common_vendor.n(item.status === 1 ? "has-result" : "no-result"),
            i: common_vendor.t(item.responsiblePartyLabel || ""),
            j: common_vendor.n(item.status === 1 ? "has-result" : "no-result"),
            k: common_vendor.t(item.status === 1 ? item.updateTime || item.handleTime : item.createTime),
            l: item.disputeId,
            m: common_vendor.n(item.status === 1 ? "card-done" : "card-pending"),
            n: common_vendor.o(($event) => goToDetail(item), item.disputeId)
          });
        }),
        i: loading.value
      }, loading.value ? {} : {}, {
        j: noMore.value && displayList.value.length > 0
      }, noMore.value && displayList.value.length > 0 ? {} : {}, {
        k: !loading.value && displayList.value.length === 0
      }, !loading.value && displayList.value.length === 0 ? {} : {}, {
        l: common_vendor.o(loadMore)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5501f474"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/my/dispute/index.js.map
