"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const peerId = common_vendor.ref("");
    const orderId = common_vendor.ref("");
    const currentUserId = common_vendor.ref("");
    const inputText = common_vendor.ref("");
    const lastMsgId = common_vendor.ref("");
    const scrollTop = common_vendor.ref(0);
    const loadingMore = common_vendor.ref(false);
    const ws = common_vendor.ref(null);
    const isConnected = common_vendor.ref(false);
    const messages = common_vendor.ref([]);
    common_vendor.onLoad((options) => {
      if (options.id)
        peerId.value = options.id;
      if (options.orderId)
        orderId.value = options.orderId;
    });
    common_vendor.onMounted(async () => {
      const user = common_vendor.index.getStorageSync("userInfo");
      if (user && user.id) {
        currentUserId.value = user.id;
      }
      await loadHistory();
      connectWebSocket();
    });
    common_vendor.onUnmounted(() => {
      if (ws.value) {
        ws.value.close();
        ws.value = null;
      }
    });
    const isSelfMsg = (msg) => {
      return String(msg.senderId) === String(currentUserId.value);
    };
    const loadHistory = async () => {
      if (!orderId.value)
        return;
      common_vendor.index.showLoading({ title: "加载中..." });
      try {
        const res = await common_vendor.index.request({
          url: "http://localhost:8081/api/chat/history",
          method: "GET",
          data: { orderId: orderId.value, pageNum: 1, pageSize: 100 },
          header: {
            Authorization: common_vendor.index.getStorageSync("token") ? `Bearer ${common_vendor.index.getStorageSync("token")}` : ""
          }
        });
        const data = res.data;
        if (data.code === 200 && data.data) {
          messages.value = (data.data.records || []).map((msg) => ({
            ...msg,
            isSelf: isSelfMsg(msg)
          }));
          if (peerId.value) {
            common_vendor.index.request({
              url: "http://localhost:8081/api/chat/read",
              method: "PUT",
              data: { orderId: Number(orderId.value), userId: Number(peerId.value) },
              header: {
                Authorization: common_vendor.index.getStorageSync("token") ? `Bearer ${common_vendor.index.getStorageSync("token")}` : "",
                "Content-Type": "application/json"
              }
            });
          }
          scrollToBottom();
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/chat/chat.vue:111", "加载历史失败", e);
      } finally {
        common_vendor.index.hideLoading();
        loadingMore.value = false;
      }
    };
    const loadMore = () => {
    };
    const scrollToBottom = () => {
      common_vendor.nextTick$1(() => {
        lastMsgId.value = "msg-" + (messages.value.length - 1);
      });
    };
    const connectWebSocket = () => {
      const token = common_vendor.index.getStorageSync("token") || "";
      const wsUrl = `ws://localhost:8081/ws/chat?token=${encodeURIComponent(token)}&orderId=${orderId.value}&userId=${currentUserId.value}`;
      ws.value = common_vendor.index.connectSocket({
        url: wsUrl,
        success: () => {
          common_vendor.index.__f__("log", "at pages/chat/chat.vue:137", "WebSocket 连接中...");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/chat/chat.vue:140", "WebSocket 连接失败", err);
        }
      });
      common_vendor.index.onSocketOpen(() => {
        common_vendor.index.__f__("log", "at pages/chat/chat.vue:145", "WebSocket 已连接");
        isConnected.value = true;
      });
      common_vendor.index.onSocketMessage((res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.type === "chat") {
            const msg = {
              id: data.id,
              orderId: data.orderId,
              senderId: data.senderId,
              receiverId: data.receiverId,
              senderName: data.senderName || "",
              content: data.content,
              msgType: data.msgType || 0,
              sendTime: data.sendTime || "",
              isSelf: String(data.senderId) === String(currentUserId.value)
            };
            if (!messages.value.find((m) => m.id === msg.id)) {
              messages.value.push(msg);
              scrollToBottom();
            }
          } else if (data.type === "system") {
            common_vendor.index.__f__("log", "at pages/chat/chat.vue:170", "系统消息:", data.message);
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/chat/chat.vue:173", "解析消息失败", e);
        }
      });
      common_vendor.index.onSocketError((err) => {
        common_vendor.index.__f__("error", "at pages/chat/chat.vue:178", "WebSocket 错误", err);
        isConnected.value = false;
      });
      common_vendor.index.onSocketClose(() => {
        common_vendor.index.__f__("log", "at pages/chat/chat.vue:183", "WebSocket 已关闭");
        isConnected.value = false;
      });
    };
    const sendMsg = async () => {
      const text = inputText.value.trim();
      if (!text || !orderId.value || !currentUserId.value || !peerId.value)
        return;
      inputText.value = "";
      common_vendor.index.showLoading({ title: "发送中..." });
      try {
        const res = await common_vendor.index.request({
          url: "http://localhost:8081/api/chat/send",
          method: "POST",
          data: {
            orderId: Number(orderId.value),
            senderId: Number(currentUserId.value),
            receiverId: Number(peerId.value),
            content: text,
            msgType: 0
          },
          header: {
            Authorization: common_vendor.index.getStorageSync("token") ? `Bearer ${common_vendor.index.getStorageSync("token")}` : "",
            "Content-Type": "application/json"
          }
        });
        const data = res.data;
        if (data.code === 200) {
          const msg = {
            ...data.data,
            isSelf: true
          };
          if (!messages.value.find((m) => m.id === msg.id)) {
            messages.value.push(msg);
            scrollToBottom();
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/chat/chat.vue:224", "发送失败", e);
        common_vendor.index.showToast({ title: "发送失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const previewImage = (url) => {
      common_vendor.index.previewImage({ urls: [url] });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loadingMore.value
      }, loadingMore.value ? {} : {}, {
        b: common_vendor.f(messages.value, (msg, index, i0) => {
          return common_vendor.e({
            a: msg.msgType === 1
          }, msg.msgType === 1 ? {
            b: msg.content,
            c: common_vendor.o(($event) => previewImage(msg.content), index)
          } : {
            d: common_vendor.t(msg.content)
          }, {
            e: common_vendor.n(msg.msgType === 1 ? "image-bubble" : ""),
            f: common_vendor.t(msg.sendTime),
            g: index,
            h: "msg-" + index,
            i: common_vendor.n(msg.isSelf ? "sent" : "received")
          });
        }),
        c: common_assets._imports_0,
        d: scrollTop.value,
        e: lastMsgId.value,
        f: common_vendor.o(loadMore),
        g: common_vendor.o(sendMsg),
        h: inputText.value,
        i: common_vendor.o(($event) => inputText.value = $event.detail.value),
        j: common_vendor.o(sendMsg)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0a633310"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
