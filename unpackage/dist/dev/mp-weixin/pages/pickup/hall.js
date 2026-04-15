"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const utils_storage = require("../../utils/storage.js");
const _sfc_main = {
  __name: "hall",
  setup(__props) {
    const searchKeyword = common_vendor.ref("");
    const filterUrgent = common_vendor.ref(false);
    const filterWeight = common_vendor.ref("");
    const sortBy = common_vendor.ref("default");
    const weightOptions = [
      { label: "全部重量", value: "" },
      { label: "轻件 (<1kg)", value: "light" },
      { label: "中件 (1-3kg)", value: "medium" },
      { label: "重件 (>3kg)", value: "heavy" }
    ];
    const availableOrders = common_vendor.ref([]);
    const isLoading = common_vendor.ref(false);
    const currentWeightLabel = common_vendor.computed(() => {
      const option = weightOptions.find((o) => o.value === filterWeight.value);
      return option ? option.value === "" ? "包裹重量" : option.label.split(" ")[0] : "包裹重量";
    });
    const sortedOrders = common_vendor.computed(() => {
      const result = [...availableOrders.value];
      if (sortBy.value === "reward_desc") {
        result.sort((a, b) => {
          const aReward = parseFloat(a.totalReward) || 0;
          const bReward = parseFloat(b.totalReward) || 0;
          return bReward - aReward;
        });
      }
      return result;
    });
    const buildQuery = () => {
      const query = {};
      if (searchKeyword.value)
        query.keyword = searchKeyword.value;
      if (filterUrgent.value)
        query.urgent = true;
      if (filterWeight.value)
        query.weightType = filterWeight.value;
      return query;
    };
    const loadOrders = async () => {
      isLoading.value = true;
      try {
        const res = await utils_api.getPickupHall(buildQuery());
        if (res.code === 200) {
          availableOrders.value = res.data || [];
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/pickup/hall.vue:134", "加载订单列表失败", e);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        isLoading.value = false;
      }
    };
    common_vendor.watch(
      [searchKeyword, filterUrgent, filterWeight, sortBy],
      () => {
        loadOrders();
      },
      { debounce: 300 }
      // 防抖，避免频繁请求
    );
    common_vendor.onShow(() => {
      loadOrders();
    });
    const toggleUrgent = () => {
      filterUrgent.value = !filterUrgent.value;
    };
    const onWeightChange = (e) => {
      const index = e.detail.value;
      filterWeight.value = weightOptions[index].value;
    };
    const toggleSort = () => {
      sortBy.value = sortBy.value === "default" ? "reward_desc" : "default";
    };
    const takeOrder = (order) => {
      const userInfo = utils_storage.getUserInfo();
      if (!userInfo) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      if (userInfo.verifyStatus !== 2) {
        common_vendor.index.showModal({
          title: "提示",
          content: "您还未通过身份认证，无法接单。请先完成身份认证。",
          confirmText: "去认证",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({ url: "/pages/user/verify" });
            }
          }
        });
        return;
      }
      common_vendor.index.showModal({
        title: "确认接单",
        content: `确认承接送往 ${order.address} 的订单吗？`,
        confirmColor: "#667eea",
        success: async (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "接单中..." });
            try {
              const result = await utils_api.acceptOrder(order.id);
              if (result.code === 200) {
                common_vendor.index.showToast({ title: "接单成功", icon: "success" });
                const index = availableOrders.value.findIndex((o) => o.id === order.id);
                if (index > -1) {
                  availableOrders.value.splice(index, 1);
                }
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/pickup/hall.vue:203", "接单失败", e);
              common_vendor.index.showToast({ title: e.message || "接单失败", icon: "none" });
            } finally {
              common_vendor.index.hideLoading();
            }
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: searchKeyword.value,
        b: common_vendor.o(($event) => searchKeyword.value = $event.detail.value),
        c: searchKeyword.value
      }, searchKeyword.value ? {
        d: common_vendor.o(($event) => searchKeyword.value = "")
      } : {}, {
        e: filterUrgent.value ? 1 : "",
        f: common_vendor.o(toggleUrgent),
        g: common_vendor.t(currentWeightLabel.value),
        h: filterWeight.value !== "all" ? 1 : "",
        i: weightOptions,
        j: common_vendor.o(onWeightChange),
        k: sortBy.value === "reward_desc" ? 1 : "",
        l: common_vendor.o(toggleSort),
        m: availableOrders.value.length > 0
      }, availableOrders.value.length > 0 ? {
        n: common_vendor.f(sortedOrders.value, (order, k0, i0) => {
          return common_vendor.e({
            a: order.isUrgent
          }, order.isUrgent ? {} : {}, {
            b: common_vendor.t(order.weightLabel),
            c: common_vendor.t(order.totalReward),
            d: common_vendor.t(order.quantity),
            e: common_vendor.t(order.address),
            f: common_vendor.t(order.expectedTime),
            g: order.notes
          }, order.notes ? {
            h: common_vendor.t(order.notes)
          } : {}, {
            i: common_vendor.o(($event) => takeOrder(order), order.id),
            j: order.id
          });
        })
      } : {}, {
        o: isLoading.value
      }, isLoading.value ? {} : {}, {
        p: availableOrders.value.length === 0 && !isLoading.value
      }, availableOrders.value.length === 0 && !isLoading.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-68642499"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pickup/hall.js.map
