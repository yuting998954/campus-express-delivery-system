"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_api = require("../../../utils/api.js");
const utils_storage = require("../../../utils/storage.js");
const pageSize = 20;
const _sfc_main = {
  __name: "messages",
  setup(__props) {
    const messageList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const noMore = common_vendor.ref(false);
    const page = common_vendor.ref(1);
    onShow(() => {
      if (utils_storage.isLoggedIn()) {
        refreshMessages();
      }
    });
    const refreshMessages = async () => {
      page.value = 1;
      noMore.value = false;
      loading.value = true;
      try {
        const res = await utils_api.getMessageList(1, pageSize);
        if (res.code === 200) {
          messageList.value = res.data.records || res.data || [];
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/my/messages/messages.vue:66", "获取消息列表失败", e);
      } finally {
        loading.value = false;
      }
    };
    const loadMore = async () => {
      if (loading.value || noMore.value)
        return;
      loading.value = true;
      page.value++;
      try {
        const res = await utils_api.getMessageList(page.value, pageSize);
        if (res.code === 200) {
          const newList = res.data.records || res.data || [];
          if (newList.length === 0) {
            noMore.value = true;
          } else {
            messageList.value = [...messageList.value, ...newList];
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/my/messages/messages.vue:87", "加载更多消息失败", e);
        page.value--;
      } finally {
        loading.value = false;
      }
    };
    const markAllRead = async () => {
      try {
        await utils_api.markAllMessagesRead();
        messageList.value.forEach((msg) => {
          msg.isRead = true;
        });
        common_vendor.index.showToast({ title: "已全部标为已读", icon: "success" });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/my/messages/messages.vue:102", "标记已读失败", e);
      }
    };
    const goToDetail = async (msg) => {
      if (!msg.isRead) {
        try {
          await utils_api.markMessageRead(msg.id);
          msg.isRead = true;
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/my/messages/messages.vue:113", "标记已读失败", e);
        }
      }
      if (msg.type === "verify_reject" || msg.type === "verify_pass") {
        common_vendor.index.navigateTo({ url: "/pages/user/verify" });
      } else if (msg.type === "order") {
        if (msg.orderId) {
          common_vendor.index.navigateTo({ url: `/pages/user/order-detail?id=${msg.orderId}` });
        }
      }
    };
    const getTypeIcon = (type) => {
      switch (type) {
        case "verify_reject":
          return "❌";
        case "verify_pass":
          return "✅";
        case "order":
          return "📦";
        case "system":
          return "📢";
        default:
          return "📋";
      }
    };
    const getTypeText = (type) => {
      switch (type) {
        case "verify_reject":
          return "认证驳回";
        case "verify_pass":
          return "认证通过";
        case "order":
          return "订单通知";
        case "system":
          return "系统消息";
        default:
          return "通知";
      }
    };
    const formatTime = (time) => {
      if (!time)
        return "";
      const date = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      if (days === 0) {
        return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
      } else if (days === 1) {
        return "昨天";
      } else if (days < 7) {
        return `${days}天前`;
      } else {
        return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: messageList.value.length > 0
      }, messageList.value.length > 0 ? {
        b: common_vendor.o(markAllRead)
      } : {}, {
        c: common_vendor.f(messageList.value, (msg, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getTypeIcon(msg.type)),
            b: common_vendor.t(getTypeText(msg.type)),
            c: common_vendor.t(formatTime(msg.createTime)),
            d: common_vendor.t(msg.title),
            e: common_vendor.t(msg.content),
            f: !msg.isRead
          }, !msg.isRead ? {} : {}, {
            g: msg.id,
            h: !msg.isRead ? 1 : "",
            i: common_vendor.o(($event) => goToDetail(msg), msg.id)
          });
        }),
        d: messageList.value.length > 0
      }, messageList.value.length > 0 ? common_vendor.e({
        e: loading.value
      }, loading.value ? {} : noMore.value ? {} : {}, {
        f: noMore.value
      }) : {}, {
        g: !loading.value && messageList.value.length === 0
      }, !loading.value && messageList.value.length === 0 ? {} : {}, {
        h: common_vendor.o(loadMore)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7562a05b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/my/messages/messages.js.map
