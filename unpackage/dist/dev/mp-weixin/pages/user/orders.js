"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentTab: 0,
      tabs: ["全部", "待接单", "待取件", "配送中", "已完成", "已取消"],
      statusMap: {
        0: "all",
        1: "pending",
        2: "accepted",
        3: "shipping",
        4: "completed",
        5: "cancelled"
      },
      orders: [
        {
          id: 1,
          orderNo: "ORD20260114001",
          status: "pending",
          statusLabel: "待接单",
          quantity: 1,
          weightLabel: "轻件",
          address: "学生宿舍 A 栋 302",
          totalReward: 8,
          createTime: "2026-01-14 10:00"
        },
        {
          id: 2,
          orderNo: "ORD20260114002",
          status: "shipping",
          statusLabel: "配送中",
          quantity: 2,
          weightLabel: "中件",
          address: "图书馆 4 楼阅览室",
          totalReward: 15,
          createTime: "2026-01-14 09:30"
        }
      ]
    };
  },
  computed: {
    filteredOrders() {
      const status = this.statusMap[this.currentTab];
      if (status === "all")
        return this.orders;
      return this.orders.filter((o) => o.status === status);
    }
  },
  methods: {
    goToDetail(order) {
      common_vendor.index.navigateTo({
        url: `/pages/user/order-detail?id=${order.id}`
      });
    },
    cancelOrder(order) {
      common_vendor.index.showModal({
        title: "取消订单",
        content: "确定要取消该订单吗？",
        success: (res) => {
          if (res.confirm) {
            order.status = "cancelled";
            order.statusLabel = "已取消";
            common_vendor.index.showToast({ title: "已取消", icon: "success" });
          }
        }
      });
    },
    confirmReceipt(order) {
      common_vendor.index.navigateTo({
        url: `/pages/user/order-detail?id=${order.id}&action=pay`
      });
    },
    evaluateOrder(order) {
      common_vendor.index.navigateTo({
        url: `/pages/user/evaluate?id=${order.id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab),
        b: index,
        c: $data.currentTab === index ? 1 : "",
        d: common_vendor.o(($event) => $data.currentTab = index, index)
      };
    }),
    b: common_vendor.f($options.filteredOrders, (order, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.orderNo),
        b: common_vendor.t(order.statusLabel),
        c: common_vendor.n(order.status),
        d: common_vendor.t(order.quantity),
        e: common_vendor.t(order.weightLabel),
        f: common_vendor.t(order.address),
        g: common_vendor.t(order.totalReward),
        h: order.status === "pending" || order.status === "accepted"
      }, order.status === "pending" || order.status === "accepted" ? {
        i: common_vendor.o(($event) => $options.cancelOrder(order), order.id)
      } : {}, {
        j: order.status === "delivered"
      }, order.status === "delivered" ? {
        k: common_vendor.o(($event) => $options.confirmReceipt(order), order.id)
      } : {}, {
        l: order.status === "completed"
      }, order.status === "completed" ? {
        m: common_vendor.o(($event) => $options.evaluateOrder(order), order.id)
      } : {}, {
        n: common_vendor.o(() => {
        }, order.id),
        o: order.id,
        p: common_vendor.o(($event) => $options.goToDetail(order), order.id)
      });
    }),
    c: $options.filteredOrders.length === 0
  }, $options.filteredOrders.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-efd435e4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/orders.js.map
