"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const utils_storage = require("../../utils/storage.js");
const _sfc_main = {
  __name: "verify",
  setup(__props) {
    const currentStep = common_vendor.ref(1);
    const auditStatus = common_vendor.ref("");
    const rejectReason = common_vendor.ref("");
    const isLoading = common_vendor.ref(true);
    const currentAuthId = common_vendor.ref(0);
    const formData = common_vendor.reactive({
      realName: "",
      code: "",
      authType: 1,
      //0-学生证认证，1-身份证认证
      images: {
        idCardFront: "",
        idCardBack: "",
        studentCard: ""
      }
    });
    common_vendor.onShow(async () => {
      const user = utils_storage.getUserInfo();
      if (!user || !user.id) {
        currentStep.value = 1;
        isLoading.value = false;
        return;
      }
      isLoading.value = true;
      try {
        const res = await utils_api.getVerificationStatus();
        if (res.code === 200) {
          currentAuthId.value = res.data.authId || 0;
          if (res.data.realName)
            formData.realName = res.data.realName;
          if (res.data.code)
            formData.code = res.data.code;
          if (res.data.idCardFront)
            formData.images.idCardFront = res.data.idCardFront;
          if (res.data.idCardBack)
            formData.images.idCardBack = res.data.idCardBack;
          if (res.data.studentCard)
            formData.images.studentCard = res.data.studentCard;
          const verifyStatus = res.data.verifyStatus;
          if (verifyStatus === 2) {
            currentStep.value = 5;
            auditStatus.value = "approved";
          } else if (verifyStatus === 1) {
            currentStep.value = 5;
            auditStatus.value = "pending";
          } else if (verifyStatus === 3) {
            currentStep.value = 5;
            auditStatus.value = "rejected";
            rejectReason.value = res.data.auditRemark;
          } else {
            currentStep.value = 1;
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user/verify.vue:266", "获取认证状态失败", e);
        currentStep.value = 1;
      } finally {
        isLoading.value = false;
      }
    });
    const nextStep = () => {
      if (currentStep.value === 1) {
        if (!formData.realName || !formData.code) {
          common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
          return;
        }
      }
      if (currentStep.value < 3) {
        currentStep.value++;
      }
    };
    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--;
      }
    };
    const selectType = (type) => {
      formData.authType = type;
    };
    const chooseImage = (key) => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          try {
            common_vendor.index.showLoading({ title: "处理中..." });
            const compressedPath = await compressImage(tempFilePath);
            const base64 = await fileToBase64(compressedPath);
            formData.images[key] = base64;
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({ title: "上传成功", icon: "success" });
          } catch (e) {
            common_vendor.index.hideLoading();
            common_vendor.index.__f__("error", "at pages/user/verify.vue:316", "图片转换失败", e);
            common_vendor.index.showToast({ title: "图片处理失败", icon: "none" });
          }
        }
      });
    };
    const compressImage = (filePath) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.getImageInfo({
          src: filePath,
          success: (info) => {
            if (info.width <= 800) {
              resolve(filePath);
              return;
            }
            const ratio = 800 / info.width;
            const targetHeight = Math.round(info.height * ratio);
            const ctx = common_vendor.index.createCanvasContext("auth-image-canvas");
            ctx.drawImage(filePath, 0, 0, 800, targetHeight);
            ctx.draw(false, () => {
              common_vendor.index.canvasToTempFilePath({
                canvasId: "auth-image-canvas",
                quality: 0.8,
                success: (res) => {
                  resolve(res.tempFilePath);
                },
                fail: () => {
                  resolve(filePath);
                }
              });
            });
          },
          fail: () => {
            resolve(filePath);
          }
        });
      });
    };
    const fileToBase64 = (filePath) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.getFileSystemManager().readFile({
          filePath,
          encoding: "base64",
          success: (res) => {
            resolve("data:image/jpeg;base64," + res.data);
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    };
    const submit = async () => {
      if (formData.authType === 1) {
        if (!formData.images.idCardFront || !formData.images.idCardBack) {
          common_vendor.index.showToast({ title: "请上传身份证正反面", icon: "none" });
          return;
        }
      } else {
        if (!formData.images.studentCard) {
          common_vendor.index.showToast({ title: "请上传学生证照片", icon: "none" });
          return;
        }
      }
      currentStep.value = 4;
      common_vendor.index.showLoading({ title: "提交中..." });
      try {
        const res = await utils_api.authenticate({
          cardType: formData.authType,
          realName: formData.realName,
          code: formData.code,
          idCardFront: formData.images.idCardFront,
          idCardBack: formData.images.idCardBack,
          studentCard: formData.images.studentCard
        });
        common_vendor.index.hideLoading();
        if (res.code === 200) {
          const user = utils_storage.getUserInfo() || {};
          user.verifyStatus = 1;
          utils_storage.setUserInfo(user);
          currentStep.value = 5;
          auditStatus.value = "pending";
          utils_api.getVerificationStatus();
        } else {
          common_vendor.index.showToast({ title: res.message || "提交失败", icon: "none" });
          currentStep.value = 3;
        }
      } catch (e) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/user/verify.vue:422", "提交认证失败", e);
        common_vendor.index.showToast({ title: "提交失败，请重试", icon: "none" });
        currentStep.value = 3;
      }
    };
    const reVerify = () => {
      currentStep.value = 1;
      auditStatus.value = "";
      rejectReason.value = "";
    };
    const goHome = () => {
      common_vendor.index.switchTab({ url: "/pages/index/index" });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: currentStep.value >= 1 ? 1 : "",
        b: currentStep.value > 1 ? 1 : "",
        c: currentStep.value > 1 ? 1 : "",
        d: currentStep.value >= 2 ? 1 : "",
        e: currentStep.value > 2 ? 1 : "",
        f: currentStep.value > 2 ? 1 : "",
        g: currentStep.value >= 3 ? 1 : "",
        h: currentStep.value > 3 ? 1 : "",
        i: currentStep.value > 3 ? 1 : "",
        j: currentStep.value >= 4 ? 1 : "",
        k: currentStep.value > 4 ? 1 : "",
        l: currentStep.value === 1
      }, currentStep.value === 1 ? {
        m: formData.realName,
        n: common_vendor.o(($event) => formData.realName = $event.detail.value),
        o: formData.code,
        p: common_vendor.o(($event) => formData.code = $event.detail.value),
        q: common_vendor.o(nextStep)
      } : {}, {
        r: currentStep.value === 2
      }, currentStep.value === 2 ? common_vendor.e({
        s: formData.authType === 1
      }, formData.authType === 1 ? {} : {}, {
        t: formData.authType === 1 ? 1 : "",
        v: common_vendor.o(($event) => selectType(1)),
        w: formData.authType === 0
      }, formData.authType === 0 ? {} : {}, {
        x: formData.authType === 0 ? 1 : "",
        y: common_vendor.o(($event) => selectType(0)),
        z: common_vendor.o(prevStep),
        A: common_vendor.o(nextStep)
      }) : {}, {
        B: currentStep.value === 3
      }, currentStep.value === 3 ? common_vendor.e({
        C: formData.authType === 1
      }, formData.authType === 1 ? common_vendor.e({
        D: formData.images.idCardFront
      }, formData.images.idCardFront ? {
        E: formData.images.idCardFront
      } : {}, {
        F: formData.images.idCardFront
      }, formData.images.idCardFront ? {} : {}, {
        G: common_vendor.o(($event) => chooseImage("idCardFront")),
        H: formData.images.idCardBack
      }, formData.images.idCardBack ? {
        I: formData.images.idCardBack
      } : {}, {
        J: formData.images.idCardBack
      }, formData.images.idCardBack ? {} : {}, {
        K: common_vendor.o(($event) => chooseImage("idCardBack"))
      }) : {}, {
        L: formData.authType === 0
      }, formData.authType === 0 ? common_vendor.e({
        M: formData.images.studentCard
      }, formData.images.studentCard ? {
        N: formData.images.studentCard
      } : {}, {
        O: formData.images.studentCard
      }, formData.images.studentCard ? {} : {}, {
        P: common_vendor.o(($event) => chooseImage("studentCard"))
      }) : {}, {
        Q: common_vendor.o(prevStep),
        R: common_vendor.o(submit)
      }) : {}, {
        S: currentStep.value === 4
      }, currentStep.value === 4 ? {} : {}, {
        T: currentStep.value === 5
      }, currentStep.value === 5 ? common_vendor.e({
        U: auditStatus.value === "approved"
      }, auditStatus.value === "approved" ? {
        V: common_vendor.t(formData.realName),
        W: common_vendor.t(formData.authType === 0 ? "身份证认证" : "学生证认证"),
        X: common_vendor.o(goHome)
      } : {}, {
        Y: auditStatus.value === "rejected"
      }, auditStatus.value === "rejected" ? {
        Z: common_vendor.t(rejectReason.value),
        aa: common_vendor.o(reVerify)
      } : {}, {
        ab: auditStatus.value === "pending"
      }, auditStatus.value === "pending" ? {
        ac: common_vendor.o(goHome)
      } : {}) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-71a5fc89"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/verify.js.map
