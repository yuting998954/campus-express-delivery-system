"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const inputText = common_vendor.ref("");
    const lastMsgId = common_vendor.ref("");
    const messages = common_vendor.ref([
      { type: "received", text: "您好，我已经接单了，正在取件中。" },
      { type: "sent", text: "好的，麻烦轻拿轻放，谢谢！" },
      { type: "received", text: "没问题，我会注意的。" }
    ]);
    const sendMsg = () => {
      if (!inputText.value.trim())
        return;
      messages.value.push({
        type: "sent",
        text: inputText.value
      });
      inputText.value = "";
      scrollToBottom();
      setTimeout(() => {
        messages.value.push({
          type: "received",
          text: "收到。"
        });
        scrollToBottom();
      }, 1e3);
    };
    const scrollToBottom = () => {
      common_vendor.nextTick$1(() => {
        lastMsgId.value = "msg-" + (messages.value.length - 1);
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(messages.value, (msg, index, i0) => {
          return {
            a: common_vendor.t(msg.text),
            b: index,
            c: "msg-" + index,
            d: common_vendor.n(msg.type)
          };
        }),
        b: common_assets._imports_0,
        c: lastMsgId.value,
        d: common_vendor.o(sendMsg),
        e: inputText.value,
        f: common_vendor.o(($event) => inputText.value = $event.detail.value),
        g: common_vendor.o(sendMsg)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0a633310"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
