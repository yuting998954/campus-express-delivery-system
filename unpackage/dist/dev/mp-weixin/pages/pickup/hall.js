"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchKeyword: "",
      filterUrgent: false,
      filterWeight: "all",
      // all, light, medium, heavy
      sortBy: "default",
      // default, reward_desc
      weightOptions: [
        { label: "全部重量", value: "all" },
        { label: "轻件 (<1kg)", value: "light" },
        { label: "中件 (1-3kg)", value: "medium" },
        { label: "重件 (>3kg)", value: "heavy" }
      ],
      // 模拟更多数据以便测试筛选
      availableOrders: [
        {
          id: 1,
          isUrgent: true,
          weightLabel: "轻件",
          weightValue: "light",
          totalReward: 15,
          quantity: 1,
          address: "学生宿舍 A 栋 302",
          expectedTime: "今天 18:00",
          notes: "请送到门口即可"
        },
        {
          id: 2,
          isUrgent: false,
          weightLabel: "重件",
          weightValue: "heavy",
          totalReward: 12,
          quantity: 2,
          address: "教职工公寓 3 号楼 101",
          expectedTime: "明天 10:00",
          notes: "电梯房"
        },
        {
          id: 3,
          isUrgent: true,
          weightLabel: "中件",
          weightValue: "medium",
          totalReward: 25,
          quantity: 3,
          address: "图书馆正门",
          expectedTime: "今天 14:30",
          notes: "到了打电话"
        },
        {
          id: 4,
          isUrgent: false,
          weightLabel: "轻件",
          weightValue: "light",
          totalReward: 5,
          quantity: 1,
          address: "第二食堂门口",
          expectedTime: "今天 12:00",
          notes: ""
        },
        {
          id: 5,
          isUrgent: false,
          weightLabel: "中件",
          weightValue: "medium",
          totalReward: 8,
          quantity: 1,
          address: "学生宿舍 B 栋 505",
          expectedTime: "明天 09:00",
          notes: "放门口鞋柜上"
        }
      ]
    };
  },
  computed: {
    currentWeightLabel() {
      const option = this.weightOptions.find((o) => o.value === this.filterWeight);
      return option ? option.value === "all" ? "包裹重量" : option.label.split(" ")[0] : "包裹重量";
    },
    filteredOrders() {
      let result = [...this.availableOrders];
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        result = result.filter(
          (order) => order.address.toLowerCase().includes(keyword) || order.notes && order.notes.toLowerCase().includes(keyword)
        );
      }
      if (this.filterUrgent) {
        result = result.filter((order) => order.isUrgent);
      }
      if (this.filterWeight !== "all") {
        result = result.filter((order) => order.weightValue === this.filterWeight);
      }
      if (this.sortBy === "reward_desc") {
        result.sort((a, b) => b.totalReward - a.totalReward);
      }
      return result;
    }
  },
  methods: {
    toggleUrgent() {
      this.filterUrgent = !this.filterUrgent;
    },
    onWeightChange(e) {
      const index = e.detail.value;
      this.filterWeight = this.weightOptions[index].value;
    },
    toggleSort() {
      this.sortBy = this.sortBy === "default" ? "reward_desc" : "default";
    },
    takeOrder(order) {
      common_vendor.index.showModal({
        title: "确认接单",
        content: `确认承接送往 ${order.address} 的订单吗？`,
        confirmColor: "#667eea",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "接单中..." });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "接单成功", icon: "success" });
              const index = this.availableOrders.findIndex((o) => o.id === order.id);
              if (index > -1) {
                this.availableOrders.splice(index, 1);
              }
            }, 1e3);
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.searchKeyword,
    b: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    c: $data.searchKeyword
  }, $data.searchKeyword ? {
    d: common_vendor.o(($event) => $data.searchKeyword = "")
  } : {}, {
    e: $data.filterUrgent ? 1 : "",
    f: common_vendor.o((...args) => $options.toggleUrgent && $options.toggleUrgent(...args)),
    g: common_vendor.t($options.currentWeightLabel),
    h: $data.filterWeight !== "all" ? 1 : "",
    i: $data.weightOptions,
    j: common_vendor.o((...args) => $options.onWeightChange && $options.onWeightChange(...args)),
    k: $data.sortBy === "reward_desc" ? 1 : "",
    l: common_vendor.o((...args) => $options.toggleSort && $options.toggleSort(...args)),
    m: common_vendor.f($options.filteredOrders, (order, k0, i0) => {
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
        i: common_vendor.o(($event) => $options.takeOrder(order), order.id),
        j: order.id
      });
    }),
    n: $options.filteredOrders.length === 0
  }, $options.filteredOrders.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-68642499"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/pickup/hall.js.map
