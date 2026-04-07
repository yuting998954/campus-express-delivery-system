"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentStep: 1,
      auditStatus: "",
      // pending, approved, rejected
      formData: {
        realName: "",
        phone: "",
        authType: "idcard",
        // idcard, student
        images: {
          idCardFront: "",
          idCardBack: "",
          studentCard: ""
        }
      }
    };
  },
  methods: {
    nextStep() {
      if (this.currentStep === 1) {
        if (!this.formData.realName || !this.formData.phone) {
          common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
          return;
        }
        if (!/^1[3-9]\d{9}$/.test(this.formData.phone)) {
          common_vendor.index.showToast({ title: "手机号格式不正确", icon: "none" });
          return;
        }
      }
      if (this.currentStep < 3) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    selectType(type) {
      this.formData.authType = type;
    },
    chooseImage(key) {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.formData.images[key] = tempFilePath;
        }
      });
    },
    submit() {
      if (this.formData.authType === "idcard") {
        if (!this.formData.images.idCardFront || !this.formData.images.idCardBack) {
          common_vendor.index.showToast({ title: "请上传身份证正反面", icon: "none" });
          return;
        }
      } else {
        if (!this.formData.images.studentCard) {
          common_vendor.index.showToast({ title: "请上传学生证照片", icon: "none" });
          return;
        }
      }
      this.currentStep = 4;
      setTimeout(() => {
        this.currentStep = 5;
        this.auditStatus = Math.random() > 0.2 ? "approved" : "rejected";
      }, 2e3);
    },
    reVerify() {
      this.currentStep = 1;
      this.auditStatus = "";
    },
    goHome() {
      common_vendor.index.switchTab({ url: "/pages/home/home" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentStep >= 1 ? 1 : "",
    b: $data.currentStep > 1 ? 1 : "",
    c: $data.currentStep > 1 ? 1 : "",
    d: $data.currentStep >= 2 ? 1 : "",
    e: $data.currentStep > 2 ? 1 : "",
    f: $data.currentStep > 2 ? 1 : "",
    g: $data.currentStep >= 3 ? 1 : "",
    h: $data.currentStep > 3 ? 1 : "",
    i: $data.currentStep > 3 ? 1 : "",
    j: $data.currentStep >= 4 ? 1 : "",
    k: $data.currentStep > 4 ? 1 : "",
    l: $data.currentStep === 1
  }, $data.currentStep === 1 ? {
    m: $data.formData.realName,
    n: common_vendor.o(($event) => $data.formData.realName = $event.detail.value),
    o: $data.formData.phone,
    p: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    q: common_vendor.o((...args) => $options.nextStep && $options.nextStep(...args))
  } : {}, {
    r: $data.currentStep === 2
  }, $data.currentStep === 2 ? common_vendor.e({
    s: $data.formData.authType === "idcard"
  }, $data.formData.authType === "idcard" ? {} : {}, {
    t: $data.formData.authType === "idcard" ? 1 : "",
    v: common_vendor.o(($event) => $options.selectType("idcard")),
    w: $data.formData.authType === "student"
  }, $data.formData.authType === "student" ? {} : {}, {
    x: $data.formData.authType === "student" ? 1 : "",
    y: common_vendor.o(($event) => $options.selectType("student")),
    z: common_vendor.o((...args) => $options.prevStep && $options.prevStep(...args)),
    A: common_vendor.o((...args) => $options.nextStep && $options.nextStep(...args))
  }) : {}, {
    B: $data.currentStep === 3
  }, $data.currentStep === 3 ? common_vendor.e({
    C: $data.formData.authType === "idcard"
  }, $data.formData.authType === "idcard" ? common_vendor.e({
    D: $data.formData.images.idCardFront
  }, $data.formData.images.idCardFront ? {
    E: $data.formData.images.idCardFront
  } : {}, {
    F: $data.formData.images.idCardFront
  }, $data.formData.images.idCardFront ? {} : {}, {
    G: common_vendor.o(($event) => $options.chooseImage("idCardFront")),
    H: $data.formData.images.idCardBack
  }, $data.formData.images.idCardBack ? {
    I: $data.formData.images.idCardBack
  } : {}, {
    J: $data.formData.images.idCardBack
  }, $data.formData.images.idCardBack ? {} : {}, {
    K: common_vendor.o(($event) => $options.chooseImage("idCardBack"))
  }) : {}, {
    L: $data.formData.authType === "student"
  }, $data.formData.authType === "student" ? common_vendor.e({
    M: $data.formData.images.studentCard
  }, $data.formData.images.studentCard ? {
    N: $data.formData.images.studentCard
  } : {}, {
    O: $data.formData.images.studentCard
  }, $data.formData.images.studentCard ? {} : {}, {
    P: common_vendor.o(($event) => $options.chooseImage("studentCard"))
  }) : {}, {
    Q: common_vendor.o((...args) => $options.prevStep && $options.prevStep(...args)),
    R: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  }) : {}, {
    S: $data.currentStep === 4
  }, $data.currentStep === 4 ? {} : {}, {
    T: $data.currentStep === 5
  }, $data.currentStep === 5 ? common_vendor.e({
    U: $data.auditStatus === "approved"
  }, $data.auditStatus === "approved" ? {
    V: common_vendor.t($data.formData.realName),
    W: common_vendor.t($data.formData.authType === "idcard" ? "身份证认证" : "学生证认证"),
    X: common_vendor.o((...args) => $options.goHome && $options.goHome(...args))
  } : {}, {
    Y: $data.auditStatus === "rejected"
  }, $data.auditStatus === "rejected" ? {
    Z: common_vendor.o((...args) => $options.reVerify && $options.reVerify(...args))
  } : {}, {
    aa: $data.auditStatus === "pending"
  }, $data.auditStatus === "pending" ? {
    ab: common_vendor.o((...args) => $options.goHome && $options.goHome(...args))
  } : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-71a5fc89"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/verify.js.map
