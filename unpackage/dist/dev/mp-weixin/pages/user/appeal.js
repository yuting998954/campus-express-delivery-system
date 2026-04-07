"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      reasons: ["物品损坏", "快递错送", "代取人态度恶劣", "超时未送达", "其他"],
      selectedReason: "",
      description: "",
      photos: []
    };
  },
  methods: {
    reasonChange(e) {
      this.selectedReason = this.reasons[e.detail.value];
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 3 - this.photos.length,
        success: (res) => {
          this.photos = this.photos.concat(res.tempFilePaths);
        }
      });
    },
    deletePhoto(index) {
      this.photos.splice(index, 1);
    },
    previewImg(url) {
      common_vendor.index.previewImage({ urls: this.photos, current: url });
    },
    submitAppeal() {
      if (!this.selectedReason || !this.description) {
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
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.selectedReason || "请选择申诉原因"),
    b: common_vendor.o((...args) => $options.reasonChange && $options.reasonChange(...args)),
    c: $data.reasons,
    d: $data.description,
    e: common_vendor.o(($event) => $data.description = $event.detail.value),
    f: common_vendor.f($data.photos, (img, index, i0) => {
      return {
        a: img,
        b: common_vendor.o(($event) => $options.previewImg(img), index),
        c: common_vendor.o(($event) => $options.deletePhoto(index), index),
        d: index
      };
    }),
    g: $data.photos.length < 3
  }, $data.photos.length < 3 ? {
    h: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    i: common_vendor.o((...args) => $options.submitAppeal && $options.submitAppeal(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cccd44d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/appeal.js.map
