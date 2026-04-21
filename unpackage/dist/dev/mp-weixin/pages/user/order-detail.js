"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_api = require("../../utils/api.js");
const utils_storage = require("../../utils/storage.js");
const _sfc_main = {
  __name: "order-detail",
  setup(__props) {
    const order = common_vendor.ref({});
    const evaluation = common_vendor.ref(null);
    const userInfo = common_vendor.ref({});
    const showModal = common_vendor.ref(false);
    const modalTitle = common_vendor.ref("");
    const currentProgress = common_vendor.ref("");
    const proofImage = common_vendor.ref("");
    const orderId = common_vendor.ref(null);
    common_vendor.onLoad(async (options) => {
      userInfo.value = utils_storage.getUserInfo();
      if (options.id) {
        orderId.value = options.id;
        loadOrderDetail();
      }
    });
    common_vendor.onShow(() => {
      if (orderId.value) {
        loadOrderDetail();
      }
      common_vendor.index.$on("refreshOrderDetail", () => {
        if (orderId.value) {
          loadOrderDetail();
        }
      });
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.$off("refreshOrderDetail");
    });
    const loadOrderDetail = async () => {
      common_vendor.index.showLoading({ title: "加载中..." });
      try {
        const res = await utils_api.getOrderDetail(orderId.value);
        if (res.code === 200) {
          order.value = res.data;
          if (order.value.status === 4 || order.value.status === 5) {
            loadEvaluation();
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user/order-detail.vue:261", "加载订单详情失败", e);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const loadEvaluation = async () => {
      try {
        const res = await utils_api.getEvaluationByOrderId(orderId.value);
        if (res.code === 200 && res.data) {
          evaluation.value = res.data;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user/order-detail.vue:275", "加载评价信息失败", e);
      }
    };
    const isRunner = common_vendor.computed(() => {
      var _a;
      return ((_a = userInfo.value) == null ? void 0 : _a.role) === 1;
    });
    const canReportProgress = common_vendor.computed(() => {
      if (!order.value)
        return false;
      return order.value.status === 1 || order.value.status === 2 || order.value.status === 3 || order.value.status === 7;
    });
    const statusDesc = common_vendor.computed(() => {
      if (!order.value)
        return "";
      const descMap = {
        0: "等待代取人承接...",
        1: "代取人已接单，正前往取件点",
        2: "快递已取到，正在配送中",
        3: "快递已送达，等待确认",
        4: "用户已确认，等待评价",
        5: "订单已完成，感谢使用",
        6: "订单已取消",
        7: "订单纠纷中"
      };
      return descMap[order.value.status] || "";
    });
    const previewImg = (url) => {
      common_vendor.index.previewImage({ urls: [url] });
    };
    const getCreditScoreClass = (score) => {
      if (!score)
        return "default";
      if (score >= 90)
        return "excellent";
      if (score >= 80)
        return "good";
      if (score >= 60)
        return "fair";
      return "poor";
    };
    const getStarLabel = (star) => {
      const labels = ["", "非常不满意", "不满意", "一般", "满意", "非常满意"];
      return labels[star] || "";
    };
    const goToChatWithPublisher = () => {
      if (order.value && order.value.publisherId) {
        common_vendor.index.navigateTo({ url: "/pages/chat/chat?id=" + order.value.publisherId + "&orderId=" + order.value.id });
      }
    };
    const goToChat = () => {
      if (order.value && order.value.runnerId) {
        common_vendor.index.navigateTo({ url: "/pages/chat/chat?id=" + order.value.runnerId + "&orderId=" + order.value.id });
      }
    };
    const showProgressModal = (progress) => {
      currentProgress.value = progress;
      modalTitle.value = progress === "picked" ? "取件完成上报" : "送达完成上报";
      proofImage.value = "";
      showModal.value = true;
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          common_vendor.index.showLoading({ title: "处理中..." });
          try {
            const compressedPath = await compressImage(tempFilePath);
            const base64 = await fileToBase64(compressedPath);
            proofImage.value = base64;
            common_vendor.index.showToast({ title: "上传成功", icon: "success" });
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/user/order-detail.vue:364", "上传失败", e);
            common_vendor.index.showToast({ title: "上传失败", icon: "none" });
          } finally {
            common_vendor.index.hideLoading();
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
            const ctx = common_vendor.index.createCanvasContext("image-canvas");
            common_vendor.index.showLoading({ title: "压缩中..." });
            ctx.drawImage(filePath, 0, 0, 800, targetHeight);
            ctx.draw(false, () => {
              common_vendor.index.canvasToTempFilePath({
                canvasId: "image-canvas",
                quality: 0.8,
                success: (res) => {
                  common_vendor.index.hideLoading();
                  resolve(res.tempFilePath);
                },
                fail: (err) => {
                  common_vendor.index.hideLoading();
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
    const submitProgress = async () => {
      if (!orderId.value)
        return;
      common_vendor.index.showLoading({ title: "提交中..." });
      try {
        const result = await utils_api.reportProgress(orderId.value, currentProgress.value, proofImage.value);
        if (result.code === 200) {
          common_vendor.index.showToast({ title: "上报成功", icon: "success" });
          showModal.value = false;
          loadOrderDetail();
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/user/order-detail.vue:444", "上报失败", e);
        common_vendor.index.showToast({ title: e.message || "上报失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const cancelOrder = async () => {
      if (!orderId.value)
        return;
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消订单吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await utils_api.cancelOrderApi(orderId.value);
              if (result.code === 200) {
                common_vendor.index.showToast({ title: "已取消", icon: "success" });
                setTimeout(() => {
                  common_vendor.index.navigateBack();
                }, 1500);
              }
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/user/order-detail.vue:467", "取消订单失败", e);
            }
          }
        }
      });
    };
    const confirmReceipt = () => {
      if (!orderId.value)
        return;
      common_vendor.index.navigateTo({ url: "/pages/payment/pay?id=" + orderId.value });
    };
    const goToEvaluate = () => {
      if (orderId.value) {
        common_vendor.index.navigateTo({ url: "/pages/user/evaluate?id=" + orderId.value });
      }
    };
    const goToAppeal = () => {
      if (orderId.value) {
        common_vendor.index.navigateTo({
          url: "/pages/user/appeal",
          success: () => {
            setTimeout(() => {
              common_vendor.index.$emit("disputeOrder", order.value);
            }, 100);
          }
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(order.value.statusLabel),
        b: common_vendor.t(statusDesc.value),
        c: common_vendor.t(order.value.orderNo),
        d: common_vendor.t(order.value.pickupCode),
        e: common_vendor.t(order.value.quantity),
        f: common_vendor.t(order.value.weightLabel),
        g: common_vendor.t(order.value.address),
        h: common_vendor.t(order.value.expectedTime),
        i: common_vendor.t(order.value.notes || "无"),
        j: common_vendor.t(order.value.reward),
        k: order.value.isUrgent
      }, order.value.isUrgent ? {
        l: common_vendor.t(order.value.urgentFee)
      } : {}, {
        m: common_vendor.t(order.value.totalReward),
        n: isRunner.value && order.value.publisherId
      }, isRunner.value && order.value.publisherId ? {
        o: common_assets._imports_0,
        p: common_vendor.t(order.value.publisherName || "用户" + order.value.publisherId),
        q: common_vendor.t(order.value.publisherPhone || "暂无电话"),
        r: common_vendor.o(goToChatWithPublisher)
      } : {}, {
        s: !isRunner.value && order.value.runnerId
      }, !isRunner.value && order.value.runnerId ? {
        t: common_assets._imports_0,
        v: common_vendor.t(order.value.runnerName || "代取员" + order.value.runnerId),
        w: common_vendor.t(order.value.runnerCreditScore || 100),
        x: common_vendor.n(getCreditScoreClass(order.value.runnerCreditScore)),
        y: common_vendor.o(goToChat)
      } : {}, {
        z: order.value.pickupPhoto || order.value.deliveryPhoto
      }, order.value.pickupPhoto || order.value.deliveryPhoto ? common_vendor.e({
        A: order.value.pickupPhoto
      }, order.value.pickupPhoto ? {
        B: order.value.pickupPhoto,
        C: common_vendor.o(($event) => previewImg(order.value.pickupPhoto))
      } : {}, {
        D: order.value.deliveryPhoto
      }, order.value.deliveryPhoto ? {
        E: order.value.deliveryPhoto,
        F: common_vendor.o(($event) => previewImg(order.value.deliveryPhoto))
      } : {}) : {}, {
        G: order.value.status === 4 || order.value.status === 5
      }, order.value.status === 4 || order.value.status === 5 ? common_vendor.e({
        H: evaluation.value
      }, evaluation.value ? common_vendor.e({
        I: common_vendor.f(5, (i, k0, i0) => {
          return {
            a: i,
            b: i <= evaluation.value.star ? 1 : ""
          };
        }),
        J: common_vendor.t(getStarLabel(evaluation.value.star)),
        K: evaluation.value.tags && evaluation.value.tags.length
      }, evaluation.value.tags && evaluation.value.tags.length ? {
        L: common_vendor.f(evaluation.value.tags, (tag, idx, i0) => {
          return {
            a: common_vendor.t(tag),
            b: idx
          };
        })
      } : {}, {
        M: evaluation.value.content
      }, evaluation.value.content ? {
        N: common_vendor.t(evaluation.value.content)
      } : {}, {
        O: evaluation.value.createTime
      }, evaluation.value.createTime ? {
        P: common_vendor.t(evaluation.value.createTime)
      } : {}) : {}) : {}, {
        Q: isRunner.value && canReportProgress.value
      }, isRunner.value && canReportProgress.value ? common_vendor.e({
        R: order.value.status >= 1 ? 1 : "",
        S: order.value.status > 1 ? 1 : "",
        T: order.value.status > 1 ? 1 : "",
        U: order.value.status >= 1 ? 1 : "",
        V: order.value.status > 1 ? 1 : "",
        W: order.value.status > 2 ? 1 : "",
        X: order.value.status >= 2 ? 1 : "",
        Y: order.value.status > 2 ? 1 : "",
        Z: order.value.status > 3 ? 1 : "",
        aa: order.value.status >= 3 ? 1 : "",
        ab: order.value.status >= 3 ? 1 : "",
        ac: order.value.status === 1
      }, order.value.status === 1 ? {
        ad: common_vendor.o(($event) => showProgressModal("picked"))
      } : {}, {
        ae: order.value.status === 2
      }, order.value.status === 2 ? {
        af: common_vendor.o(($event) => showProgressModal("delivered"))
      } : {}, {
        ag: order.value.status === 3
      }, order.value.status === 3 ? {} : {}) : {}, {
        ah: order.value.status === 0 || order.value.status === 1
      }, order.value.status === 0 || order.value.status === 1 ? {
        ai: common_vendor.o(cancelOrder)
      } : {}, {
        aj: order.value.status === 3 && !isRunner.value
      }, order.value.status === 3 && !isRunner.value ? {
        ak: common_vendor.o(confirmReceipt)
      } : {}, {
        al: order.value.status === 4 || order.value.status === 5
      }, order.value.status === 4 || order.value.status === 5 ? {
        am: common_vendor.o(goToAppeal)
      } : {}, {
        an: order.value.status === 4 && !order.value.isEvaluated && !isRunner.value
      }, order.value.status === 4 && !order.value.isEvaluated && !isRunner.value ? {
        ao: common_vendor.o(goToEvaluate)
      } : {}, {
        ap: showModal.value
      }, showModal.value ? common_vendor.e({
        aq: common_vendor.t(modalTitle.value),
        ar: proofImage.value
      }, proofImage.value ? {
        as: proofImage.value
      } : {}, {
        at: common_vendor.o(chooseImage),
        av: common_vendor.o(($event) => showModal.value = false),
        aw: common_vendor.o(submitProgress),
        ax: common_vendor.o(() => {
        }),
        ay: common_vendor.o(($event) => showModal.value = false)
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-29badeee"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/order-detail.js.map
