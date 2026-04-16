"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const _sfc_main = {
  __name: "appeal",
  setup(__props) {
    const disputeTypes = ["物品损坏", "报酬争议", "未收到货", "其他"];
    const description = common_vendor.ref("");
    const photos = common_vendor.ref([]);
    const orderInfo = common_vendor.ref({});
    const disputeType = common_vendor.ref(0);
    common_vendor.onLoad(() => {
      common_vendor.index.$on("disputeOrder", (order) => {
        common_vendor.index.__f__("log", "at pages/user/appeal.vue:48", "收到订单数据:", order);
        orderInfo.value = order;
      });
    });
    common_vendor.onUnload(() => {
      common_vendor.index.$off("disputeOrder");
    });
    const reasonChange = (e) => {
      disputeType.value = Number(e.detail.value) + 1;
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 3 - photos.value.length,
        sizeType: ["compressed"],
        success: async (res) => {
          for (const path of res.tempFilePaths) {
            try {
              const base64 = await fileToBase64(path);
              photos.value.push(base64);
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/user/appeal.vue:70", "图片处理失败", e);
              common_vendor.index.showToast({ title: "图片处理失败", icon: "none" });
            }
          }
        }
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
          fail: (err) => reject(err)
        });
      });
    };
    const deletePhoto = (index) => {
      photos.value.splice(index, 1);
    };
    const previewImg = (url) => {
      common_vendor.index.previewImage({ urls: photos.value, current: url });
    };
    const submitAppeal = async () => {
      var _a, _b, _c;
      if (!disputeType.value || !description.value) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "提交中..." });
      const submitData = {
        orderId: (_a = orderInfo.value) == null ? void 0 : _a.id,
        applicantId: (_b = orderInfo.value) == null ? void 0 : _b.publisherId,
        respondentId: (_c = orderInfo.value) == null ? void 0 : _c.runnerId,
        disputeType: disputeType.value,
        reason: description.value,
        evidenceList: photos.value
      };
      common_vendor.index.__f__("log", "at pages/user/appeal.vue:118", "提交申诉数据:", submitData);
      await utils_api.submitDispute(submitData).then((res) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "提交成功",
          content: "您的申诉已提交，请耐心等待管理员仲裁。",
          showCancel: false,
          success: () => {
            common_vendor.index.navigateBack();
          }
        });
      }).catch((err) => {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/user/appeal.vue:132", "提交失败:", err);
        common_vendor.index.showToast({ title: err.message || "提交失败，请稍后再试", icon: "none" });
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(disputeType.value > 0 ? disputeTypes[disputeType.value - 1] : "请选择申诉原因"),
        b: common_vendor.o(reasonChange),
        c: disputeTypes,
        d: description.value,
        e: common_vendor.o(($event) => description.value = $event.detail.value),
        f: common_vendor.f(photos.value, (img, index, i0) => {
          return {
            a: img,
            b: common_vendor.o(($event) => previewImg(img), index),
            c: common_vendor.o(($event) => deletePhoto(index), index),
            d: index
          };
        }),
        g: photos.value.length < 3
      }, photos.value.length < 3 ? {
        h: common_vendor.o(chooseImage)
      } : {}, {
        i: common_vendor.o(submitAppeal)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cccd44d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/appeal.js.map
