"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_api = require("../../utils/api.js");
const utils_storage = require("../../utils/storage.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const formData = common_vendor.reactive({
      phone: "",
      password: ""
    });
    const userType = [
      { name: "普通用户", value: 0 },
      { name: "代取员", value: 1 }
    ];
    const current = common_vendor.ref(0);
    const validatePhone = (phone) => {
      const phoneReg = /^1[3-9]\d{9}$/;
      return phoneReg.test(phone);
    };
    const radioChange = (evt) => {
      for (let i = 0; i < userType.length; i++) {
        if (String(userType[i].value) === String(evt.detail.value)) {
          current.value = i;
          break;
        }
      }
    };
    const handleLogin = async () => {
      if (!formData.phone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!validatePhone(formData.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      if (!formData.password) {
        common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
        return;
      }
      if (formData.password.length < 6) {
        common_vendor.index.showToast({ title: "密码长度至少6位", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "登录中..." });
      try {
        const res = await utils_api.login({
          phone: formData.phone,
          password: formData.password,
          role: userType[current.value].value
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
        common_vendor.index.__f__("error", "at pages/login/login.vue:131", "登录错误:", error);
      }
    };
    const goToRegister = () => {
      common_vendor.index.navigateTo({ url: "/pages/login/register" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: formData.phone,
        c: common_vendor.o(($event) => formData.phone = $event.detail.value),
        d: formData.password,
        e: common_vendor.o(($event) => formData.password = $event.detail.value),
        f: common_vendor.f(userType, (item, index, i0) => {
          return {
            a: String(item.value),
            b: index === current.value,
            c: common_vendor.t(item.name),
            d: item.value
          };
        }),
        g: common_vendor.o(radioChange),
        h: common_vendor.o(handleLogin),
        i: common_vendor.o(goToRegister)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
