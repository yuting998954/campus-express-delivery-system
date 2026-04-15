"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const utils_storage = require("../../utils/storage.js");
const _sfc_main = {
  __name: "register",
  setup(__props) {
    const formData = common_vendor.reactive({
      phone: "",
      password: "",
      confirmPassword: ""
    });
    const userType = [
      { name: "普通用户", value: 0 },
      { name: "代取人", value: 1 }
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
    const handleRegister = async () => {
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
      if (!formData.confirmPassword) {
        common_vendor.index.showToast({ title: "请确认密码", icon: "none" });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        common_vendor.index.showToast({ title: "两次输入的密码不一致", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "注册中..." });
      try {
        const res = await utils_api.register({
          phone: formData.phone,
          password: formData.password,
          role: userType[current.value].value
        });
        common_vendor.index.hideLoading();
        if (res.code === 200) {
          utils_storage.setToken(res.data.token);
          utils_storage.setUserInfo(res.data.userInfo);
          common_vendor.index.showToast({ title: "注册成功", icon: "success" });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: res.message || "注册失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "注册失败，请稍后重试", icon: "none" });
        common_vendor.index.__f__("error", "at pages/login/register.vue:143", "注册错误:", error);
      }
    };
    const goLogin = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: formData.phone,
        b: common_vendor.o(($event) => formData.phone = $event.detail.value),
        c: formData.password,
        d: common_vendor.o(($event) => formData.password = $event.detail.value),
        e: formData.confirmPassword,
        f: common_vendor.o(($event) => formData.confirmPassword = $event.detail.value),
        g: common_vendor.f(userType, (item, index, i0) => {
          return {
            a: String(item.value),
            b: index === current.value,
            c: common_vendor.t(item.name),
            d: item.value
          };
        }),
        h: common_vendor.o(radioChange),
        i: common_vendor.o(handleRegister),
        j: common_vendor.o(goLogin)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-838b72c9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/register.js.map
