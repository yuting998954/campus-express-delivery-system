"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "appeal",
  setup(__props) {
    const reasons = ["物品损坏", "快递错送", "代取人态度恶劣", "超时未送达", "其他"];
    const selectedReason = common_vendor.ref("");
    const description = common_vendor.ref("");
    const photos = common_vendor.ref([]);
    const reasonChange = (e) => {
      selectedReason.value = reasons[e.detail.value];
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 3 - photos.value.length,
        success: (res) => {
          photos.value = photos.value.concat(res.tempFilePaths);
        }
      });
    };
    const deletePhoto = (index) => {
      photos.value.splice(index, 1);
    };
    const previewImg = (url) => {
      common_vendor.index.previewImage({ urls: photos.value, current: url });
    };
    const submitAppeal = () => {
      if (!selectedReason.value || !description.value) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "提交中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "提交成功",
          content: "您的申诉已提交，请耐心等待管理员仲裁。",
          showCancel: false,
          success: () => {
            common_vendor.index.navigateBack();
          }
        });
      }, 1e3);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(selectedReason.value || "请选择申诉原因"),
        b: common_vendor.o(reasonChange),
        c: reasons,
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
