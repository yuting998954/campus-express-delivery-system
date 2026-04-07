"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      inputText: "",
      lastMsgId: "",
      messages: [
        { type: "received", text: "您好，我已经接单了，正在取件中。" },
        { type: "sent", text: "好的，麻烦轻拿轻放，谢谢！" },
        { type: "received", text: "没问题，我会注意的。" }
      ]
    };
  },
  methods: {
    sendMsg() {
      if (!this.inputText.trim())
        return;
      this.messages.push({
        type: "sent",
        text: this.inputText
      });
      this.inputText = "";
      this.scrollToBottom();
      setTimeout(() => {
        this.messages.push({
          type: "received",
          text: "收到。"
        });
        this.scrollToBottom();
      }, 1e3);
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.lastMsgId = "msg-" + (this.messages.length - 1);
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.messages, (msg, index, i0) => {
      return {
        a: common_vendor.t(msg.text),
        b: index,
        c: "msg-" + index,
        d: common_vendor.n(msg.type)
      };
    }),
    b: common_assets._imports_0,
    c: $data.lastMsgId,
    d: common_vendor.o((...args) => $options.sendMsg && $options.sendMsg(...args)),
    e: $data.inputText,
    f: common_vendor.o(($event) => $data.inputText = $event.detail.value),
    g: common_vendor.o((...args) => $options.sendMsg && $options.sendMsg(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0a633310"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
