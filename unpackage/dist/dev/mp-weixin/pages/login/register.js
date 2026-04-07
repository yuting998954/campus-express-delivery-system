"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const utils_storage = require("../../utils/storage.js");
const _sfc_main = {
  data() {
    return {
      formData: {
        phone: "",
        password: "",
        confirmPassword: ""
      },
      userType: [
        { name: "普通用户", value: 0 },
        { name: "代取人", value: 1 }
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
    async handleRegister() {
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
      if (!this.formData.confirmPassword) {
        common_vendor.index.showToast({ title: "请确认密码", icon: "none" });
        return;
      }
      if (this.formData.password !== this.formData.confirmPassword) {
        common_vendor.index.showToast({ title: "两次输入的密码不一致", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "注册中..." });
      try {
        const res = await utils_api.register({
          phone: this.formData.phone,
          password: this.formData.password,
          role: this.userType[this.current].value
        });
        common_vendor.index.hideLoading();
        if (res.code === 200) {
          utils_storage.setToken(res.data.token);
          utils_storage.setUserInfo(res.data.userInfo);
          common_vendor.index.showToast({ title: "注册成功", icon: "success" });
          setTimeout(() => {
            common_vendor.index.switchTab({ url: "pages/login/login" });
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: res.message || "注册失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "注册失败，请稍后重试", icon: "none" });
        common_vendor.index.__f__("error", "at pages/login/register.vue:144", "注册错误:", error);
      }
    },
    goLogin() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.formData.phone,
    b: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    c: $data.formData.password,
    d: common_vendor.o(($event) => $data.formData.password = $event.detail.value),
    e: $data.formData.confirmPassword,
    f: common_vendor.o(($event) => $data.formData.confirmPassword = $event.detail.value),
    g: common_vendor.f($data.userType, (item, index, i0) => {
      return {
        a: item.value,
        b: index === $data.current,
        c: common_vendor.t(item.name),
        d: item.value
      };
    }),
    h: common_vendor.o((...args) => $options.radioChange && $options.radioChange(...args)),
    i: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    j: common_vendor.o((...args) => $options.goLogin && $options.goLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-838b72c9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/register.js.map
