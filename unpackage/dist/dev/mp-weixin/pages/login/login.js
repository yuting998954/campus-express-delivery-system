"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const utils_storage = require("../../utils/storage.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      formData: {
        phone: "",
        password: ""
      },
      userType: [
        { name: "普通用户", value: 0 },
        { name: "代取员", value: 1 }
      ],
      current: 0
    };
  },
  methods: {
    validatePhone(phone) {
      const phoneReg = /^1[3-9]\d{9}$/;
      return phoneReg.test(phone);
    },
    radioChange(evt) {
      for (let i = 0; i < this.userType.length; i++) {
        if (String(this.userType[i].value) === String(evt.detail.value)) {
          this.current = i;
          break;
        }
      }
    },
    async handleLogin() {
      if (!this.formData.phone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!this.validatePhone(this.formData.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      if (!this.formData.password) {
        common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
        return;
      }
      if (this.formData.password.length < 6) {
        common_vendor.index.showToast({ title: "密码长度至少6位", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "登录中..." });
      try {
        const res = await utils_api.login({
          phone: this.formData.phone,
          password: this.formData.password,
          role: this.userType[this.current].value
        });
        common_vendor.index.hideLoading();
        if (res.code === 200) {
          utils_storage.setToken(res.data.token);
          utils_storage.setUserInfo(res.data.userInfo);
          common_vendor.index.showToast({ title: "登录成功", icon: "success" });
          setTimeout(() => {
            common_vendor.index.switchTab({ url: "/pages/index/index" });
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: res.message || "登录失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "登录失败，请稍后重试", icon: "none" });
        common_vendor.index.__f__("error", "at pages/login/login.vue:138", "登录错误:", error);
      }
    },
    goToRegister() {
      common_vendor.index.navigateTo({ url: "/pages/login/register" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$1,
    b: $data.formData.phone,
    c: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    d: $data.formData.password,
    e: common_vendor.o(($event) => $data.formData.password = $event.detail.value),
    f: common_vendor.f($data.userType, (item, index, i0) => {
      return {
        a: item.value,
        b: index === $data.current,
        c: common_vendor.t(item.name),
        d: item.value
      };
    }),
    g: common_vendor.o((...args) => $options.radioChange && $options.radioChange(...args)),
    h: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    i: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
