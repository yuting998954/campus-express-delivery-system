"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const utils_storage = require("../../utils/storage.js");
const _sfc_main = {
  __name: "orders",
  setup(__props) {
    const currentTab = common_vendor.ref(0);
    const userInfo = common_vendor.ref(null);
    const tabs = common_vendor.computed(() => {
      var _a;
      if (((_a = userInfo.value) == null ? void 0 : _a.role) === 1) {
        return ["全部", "待取件", "配送中", "已送达", "已完成", "已取消"];
      }
      return ["全部", "待接单", "待取件", "配送中", "已完成", "已取消"];
    });
    const statusMap = common_vendor.computed(() => {
      var _a;
      if (((_a = userInfo.value) == null ? void 0 : _a.role) === 1) {
        return {
          0: "",
          // 全部
          1: "1",
          // 待取件
          2: "2",
          // 配送中
          3: "3",
          // 已送达
          4: "4,5",
          // 已完成
          5: "6"
          // 已取消
        };
      }
      return {
        0: "",
        // 全部
        1: "0",
        // 待接单
        2: "1",
        // 待取件
        3: "2",
        // 配送中
        4: "4,5",
        // 已完成
        5: "6"
        // 已取消
      };
    });
    const orders = common_vendor.ref([]);
    const isLoading = common_vendor.ref(false);
    const isRefreshing = common_vendor.ref(false);
    const filteredOrders = common_vendor.computed(() => orders.value);
    common_vendor.onLoad(() => {
      var _a;
      userInfo.value = utils_storage.getUserInfo();
      common_vendor.index.__f__("log", "at pages/user/orders.vue:109", userInfo.value, "sss");
      common_vendor.index.setNavigationBarTitle({
        title: ((_a = userInfo.value) == null ? void 0 : _a.role) === 1 ? "我的承接" : "我的订单"
      });
    });
    const loadOrders = async () => {
      if (!userInfo.value) {
        userInfo.value = utils_storage.getUserInfo();
      }
      isLoading.value = true;
      try {
        const statusValue = statusMap.value[currentTab.value];
        const status = statusValue === "" ? void 0 : statusValue;
        const res = await utils_api.getMyOrders(userInfo.value.role, status);
        if (res.code === 200) {
          orders.value = res.data.records || [];
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user/orders.vue:135", "加载订单失败", e);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        isLoading.value = false;
        isRefreshing.value = false;
      }
    };
    const switchTab = (index) => {
      if (currentTab.value !== index) {
        currentTab.value = index;
        loadOrders();
      }
    };
    const onRefresh = () => {
      isRefreshing.value = true;
      loadOrders();
    };
    common_vendor.onShow(() => {
      loadOrders();
    });
    const goToDetail = (order) => {
      common_vendor.index.navigateTo({
        url: `/pages/user/order-detail?id=${order.id}`
      });
    };
    const handleCancelOrder = (order) => {
      common_vendor.index.showModal({
        title: "取消订单",
        content: "确定要取消该订单吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_api.cancelOrderApi(order.id);
              if (result.code === 200) {
                common_vendor.index.showToast({ title: "已取消", icon: "success" });
                loadOrders();
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/user/orders.vue:180", "取消订单失败", e);
              common_vendor.index.showToast({ title: "取消失败", icon: "none" });
            }
          }
        }
      });
    };
    const handleConfirmReceipt = async (order) => {
      common_vendor.index.showModal({
        title: "确认送达",
        content: "确认快递已送达并支付报酬吗？",
        success: async (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "处理中..." });
            try {
              const result = await utils_api.confirmReceiptApi(order.id);
              if (result.code === 200) {
                common_vendor.index.showToast({ title: "确认成功", icon: "success" });
                loadOrders();
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/user/orders.vue:202", "确认收货失败", e);
              common_vendor.index.showToast({ title: "确认失败", icon: "none" });
            } finally {
              common_vendor.index.hideLoading();
            }
          }
        }
      });
    };
    const reportPicked = (order) => {
      common_vendor.index.showModal({
        title: "取件完成上报",
        content: "确认已取到快递并准备配送吗？",
        success: async (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "提交中..." });
            try {
              const result = await utils_api.reportProgress(order.id, "picked", null);
              if (result.code === 200) {
                common_vendor.index.showToast({ title: "上报成功", icon: "success" });
                loadOrders();
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/user/orders.vue:227", "上报失败", e);
              common_vendor.index.showToast({ title: e.message || "上报失败", icon: "none" });
            } finally {
              common_vendor.index.hideLoading();
            }
          }
        }
      });
    };
    const reportDelivered = (order) => {
      common_vendor.index.showModal({
        title: "送达完成上报",
        content: "确认已将快递送达收件人手中吗？",
        success: async (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "提交中..." });
            try {
              const result = await utils_api.reportProgress(order.id, "delivered", null);
              if (result.code === 200) {
                common_vendor.index.showToast({ title: "上报成功", icon: "success" });
                loadOrders();
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/user/orders.vue:252", "上报失败", e);
              common_vendor.index.showToast({ title: e.message || "上报失败", icon: "none" });
            } finally {
              common_vendor.index.hideLoading();
            }
          }
        }
      });
    };
    const evaluateOrder = (order) => {
      common_vendor.index.navigateTo({
        url: `/pages/user/evaluate?id=${order.id}`
      });
    };
    const getStatusClass = (status) => {
      const classMap = {
        0: "pending",
        1: "accepted",
        2: "shipping",
        3: "delivered",
        4: "completed",
        5: "completed",
        6: "cancelled",
        7: "disputed"
      };
      return classMap[status] || "pending";
    };
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_vendor.f(tabs.value, (tab, index, i0) => {
          return {
            a: common_vendor.t(tab),
            b: index,
            c: currentTab.value === index ? 1 : "",
            d: common_vendor.o(($event) => switchTab(index), index)
          };
        }),
        b: common_vendor.f(filteredOrders.value, (order, k0, i0) => {
          var _a2;
          return common_vendor.e({
            a: common_vendor.t(order.orderNo),
            b: common_vendor.t(order.statusLabel),
            c: common_vendor.n(getStatusClass(order.status)),
            d: common_vendor.t(order.quantity),
            e: common_vendor.t(order.weightLabel),
            f: common_vendor.t(order.address),
            g: common_vendor.t(order.totalReward)
          }, ((_a2 = userInfo.value) == null ? void 0 : _a2.role) !== 1 ? common_vendor.e({
            h: order.status === 0 || order.status === 1
          }, order.status === 0 || order.status === 1 ? {
            i: common_vendor.o(($event) => handleCancelOrder(order), order.id)
          } : {}, {
            j: order.status === 3
          }, order.status === 3 ? {
            k: common_vendor.o(($event) => handleConfirmReceipt(order), order.id)
          } : {}, {
            l: order.status === 4
          }, order.status === 4 ? {
            m: common_vendor.o(($event) => evaluateOrder(order), order.id)
          } : {}) : common_vendor.e({
            n: order.status === 1
          }, order.status === 1 ? {
            o: common_vendor.o(($event) => reportPicked(order), order.id)
          } : {}, {
            p: order.status === 2
          }, order.status === 2 ? {
            q: common_vendor.o(($event) => reportDelivered(order), order.id)
          } : {}, {
            r: order.status === 3
          }, order.status === 3 ? {} : {}, {
            s: order.status === 0
          }, order.status === 0 ? {
            t: common_vendor.o(($event) => handleCancelOrder(order), order.id)
          } : {}), {
            v: common_vendor.o(() => {
            }, order.id),
            w: order.id,
            x: common_vendor.o(($event) => goToDetail(order), order.id)
          });
        }),
        c: ((_a = userInfo.value) == null ? void 0 : _a.role) !== 1,
        d: filteredOrders.value.length === 0 && !isLoading.value
      }, filteredOrders.value.length === 0 && !isLoading.value ? {} : {}, {
        e: isLoading.value
      }, isLoading.value ? {} : {}, {
        f: isRefreshing.value,
        g: common_vendor.o(onRefresh)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-efd435e4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/orders.js.map
