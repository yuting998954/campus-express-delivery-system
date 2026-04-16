<template>
	<view class="container">
		<view class="status-section">
			<view class="status-text">{{ order.statusLabel }}</view>
			<view class="status-desc">{{ statusDesc }}</view>
		</view>

		<view class="info-card">
			<view class="card-title">订单信息</view>
			<view class="info-row">
				<text class="label">订单编号</text>
				<text class="value">{{ order.orderNo }}</text>
			</view>
			<view class="info-row">
				<text class="label">取件码/单号</text>
				<text class="value">{{ order.pickupCode }}</text>
			</view>
			<view class="info-row">
				<text class="label">包裹数量</text>
				<text class="value">{{ order.quantity }}</text>
			</view>
			<view class="info-row">
				<text class="label">包裹属性</text>
				<text class="value">{{ order.weightLabel }}</text>
			</view>
			<view class="info-row">
				<text class="label">收件地址</text>
				<text class="value">{{ order.address }}</text>
			</view>
			<view class="info-row">
				<text class="label">期望时间</text>
				<text class="value">{{ order.expectedTime }}</text>
			</view>
			<view class="info-row">
				<text class="label">特殊备注</text>
				<text class="value">{{ order.notes || '无' }}</text>
			</view>
		</view>

		<view class="info-card">
			<view class="card-title">费用明细</view>
			<view class="info-row">
				<text class="label">代取报酬</text>
				<text class="value">￥{{ order.reward }}</text>
			</view>
			<view class="info-row" v-if="order.isUrgent">
				<text class="label">加急费用</text>
				<text class="value">￥{{ order.urgentFee }}</text>
			</view>
			<view class="info-row total">
				<text class="label">合计</text>
				<text class="value">￥{{ order.totalReward }}</text>
			</view>
		</view>

		<!-- 发布者信息（代取员视角） -->
		<view class="info-card" v-if="isRunner && order.publisherId">
			<view class="card-title">发布者信息</view>
			<view class="publisher-info">
				<image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
				<view class="name-box">
					<view class="name">{{ order.publisherName || '用户' + order.publisherId }}</view>
					<view class="phone">{{ order.publisherPhone || '暂无电话' }}</view>
				</view>
				<button class="chat-btn" size="mini" @click="goToChatWithPublisher">联系他</button>
			</view>
		</view>

		<!-- 代取人信息（发布者视角） -->
		<view class="info-card" v-if="!isRunner && order.runnerId">
			<view class="card-title">代取人信息</view>
			<view class="runner-info">
				<image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
				<view class="name-box">
					<view class="name">{{ order.runnerName || '代取员' + order.runnerId }}</view>
					<view class="rating">评分: {{ order.runnerRating || '暂无' }}</view>
				</view>
				<button class="chat-btn" size="mini" @click="goToChat">联系他</button>
			</view>
		</view>

		<!-- 凭证照片 -->
		<view class="info-card" v-if="order.pickupPhoto || order.deliveryPhoto">
			<view class="card-title">凭证照片</view>
			<view class="photo-list">
				<view v-if="order.pickupPhoto" class="photo-item">
					<image :src="order.pickupPhoto" mode="aspectFill" @click="previewImg(order.pickupPhoto)"></image>
					<text>取件凭证</text>
				</view>
				<view v-if="order.deliveryPhoto" class="photo-item">
					<image :src="order.deliveryPhoto" mode="aspectFill" @click="previewImg(order.deliveryPhoto)">
					</image>
					<text>送达凭证</text>
				</view>
			</view>
		</view>

		<!-- 代取员进度上报面板 -->
		<view class="info-card progress-panel" v-if="isRunner && canReportProgress">
			<view class="card-title">进度上报</view>
			<view class="progress-steps">
				<view class="step" :class="{ active: order.status >= 1, completed: order.status > 1 }">
					<view class="step-dot"></view>
					<view class="step-label">已接单</view>
				</view>
				<view class="step-line" :class="{ active: order.status > 1 }"></view>
				<view class="step" :class="{ active: order.status >= 1, completed: order.status > 1 }">
					<view class="step-dot"></view>
					<view class="step-label">取件完成</view>
				</view>
				<view class="step-line" :class="{ active: order.status > 2 }"></view>
				<view class="step" :class="{ active: order.status >= 2, completed: order.status > 2 }">
					<view class="step-dot"></view>
					<view class="step-label">配送中</view>
				</view>
				<view class="step-line" :class="{ active: order.status > 3 }"></view>
				<view class="step" :class="{ active: order.status >= 3, completed: order.status >= 3 }">
					<view class="step-dot"></view>
					<view class="step-label">已送达</view>
				</view>
			</view>
			<view class="progress-actions">
				<button v-if="order.status === 1" class="progress-btn" @click="showProgressModal('picked')">
					取件完成上报
				</button>
				<button v-if="order.status === 2" class="progress-btn" @click="showProgressModal('delivered')">
					送达完成上报
				</button>
				<button v-if="order.status === 3" class="progress-btn" disabled>
					等待用户确认
				</button>
			</view>
		</view>

		<view class="bottom-bar">
			<button v-if="order.status === 0 || order.status === 1" class="bar-btn secondary"
				@click="cancelOrder">取消订单</button>

			<button v-if="order.status === 3 && !isRunner" class="bar-btn primary"
				@click="confirmReceipt">确认收到并支付</button>

			<button v-if="order.status === 4 || order.status === 5" class="bar-btn secondary"
				@click="goToAppeal">申诉</button>

			<button v-if="order.status === 4 && !order.isEvaluated && !isRunner" class="bar-btn primary"
				@click="goToEvaluate">评价</button>
		</view>

		<!-- 进度上报弹窗 -->
		<view class="modal-mask" v-if="showModal" @click="showModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-title">{{ modalTitle }}</view>
				<view class="modal-body">
					<view class="upload-section">
						<text class="upload-label">上传凭证照片（可选）</text>
						<view class="upload-box" @click="chooseImage">
							<image v-if="proofImage" :src="proofImage" class="proof-preview"></image>
							<view v-else class="upload-placeholder">
								<text class="upload-icon">+</text>
								<text class="upload-text">点击上传</text>
							</view>
						</view>
					</view>
				</view>
				<view class="modal-actions">
					<button class="modal-btn cancel" @click="showModal = false">取消</button>
					<button class="modal-btn confirm" @click="submitProgress">确认上报</button>
				</view>
			</view>
		</view>

		<!-- 用于图片压缩的隐藏 canvas -->
		<canvas canvas-id="image-canvas" id="image-canvas" style="width:800px;height:800px;position:fixed;left:-9999px;top:-9999px;opacity:0;"></canvas>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getOrderDetail, cancelOrderApi, reportProgress } from '@/utils/api'
import { getUserInfo } from '@/utils/storage.js'

const order = ref({})
const userInfo = ref({})
const showModal = ref(false)
const modalTitle = ref('')
const currentProgress = ref('')
const proofImage = ref('')
const orderId = ref(null)

onLoad(async (options) => {
	userInfo.value = getUserInfo()
	if (options.id) {
		orderId.value = options.id
		loadOrderDetail()
	}
});

// 页面显示时刷新订单详情（用于接收仲裁结果后更新）
onShow(() => {
	if (orderId.value) {
		loadOrderDetail()
	}
	// 监听仲裁结果刷新事件
	uni.$on('refreshOrderDetail', () => {
		if (orderId.value) {
			loadOrderDetail()
		}
	})
})

onUnmounted(() => {
	uni.$off('refreshOrderDetail')
})

const loadOrderDetail = async () => {
	uni.showLoading({ title: '加载中...' });
	try {
		const res = await getOrderDetail(orderId.value);
		if (res.code === 200) {
			order.value = res.data;
		}
	} catch (e) {
		console.error('加载订单详情失败', e);
		uni.showToast({ title: '加载失败', icon: 'none' });
	} finally {
		uni.hideLoading();
	}
}

// 判断是否为代取员视角
const isRunner = computed(() => {
	return userInfo.value?.role === 1
});

// 代取员是否可以上报进度
const canReportProgress = computed(() => {
	if (!order.value) return false
	return order.value.status === 1 || order.value.status === 2 || order.value.status === 3 || order.value.status === 7  // 包含纠纷中的状态
});

const statusDesc = computed(() => {
	if (!order.value) return '';
	const descMap = {
		0: '等待代取人承接...',
		1: '代取人已接单，正前往取件点',
		2: '快递已取到，正在配送中',
		3: '快递已送达，等待确认',
		4: '用户已确认，等待评价',
		5: '订单已完成，感谢使用',
		6: '订单已取消',
		7: '订单纠纷中'
	};
	return descMap[order.value.status] || '';
});

const previewImg = (url) => {
	uni.previewImage({ urls: [url] });
}

// 联系发布者（代取员视角）
const goToChatWithPublisher = () => {
	if (order.value && order.value.publisherId) {
		uni.navigateTo({ url: '/pages/chat/chat?id=' + order.value.publisherId + '&orderId=' + order.value.id });
	}
}

// 联系代取人（发布者视角）
const goToChat = () => {
	if (order.value && order.value.runnerId) {
		uni.navigateTo({ url: '/pages/chat/chat?id=' + order.value.runnerId + '&orderId=' + order.value.id });
	}
}

// 显示进度上报弹窗
const showProgressModal = (progress) => {
	currentProgress.value = progress
	modalTitle.value = progress === 'picked' ? '取件完成上报' : '送达完成上报'
	proofImage.value = ''
	showModal.value = true
}

// 选择图片
const chooseImage = () => {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: async (res) => {
			const tempFilePath = res.tempFilePaths[0]
			uni.showLoading({ title: '处理中...' })
			try {
				// 先压缩再转Base64
				const compressedPath = await compressImage(tempFilePath)
				const base64 = await fileToBase64(compressedPath)
				proofImage.value = base64
				uni.showToast({ title: '上传成功', icon: 'success' })
			} catch (e) {
				console.error('上传失败', e)
				uni.showToast({ title: '上传失败', icon: 'none' })
			} finally {
				uni.hideLoading()
			}
		}
	})
}

// 压缩图片：限制宽度为800px，质量80%
const compressImage = (filePath) => {
	return new Promise((resolve, reject) => {
		uni.getImageInfo({
			src: filePath,
			success: (info) => {
				// 如果图片宽度已经小于800，直接使用原图
				if (info.width <= 800) {
					resolve(filePath)
					return
				}
				// 计算压缩后的高度
				const ratio = 800 / info.width
				const targetHeight = Math.round(info.height * ratio)
				// 使用 canvas 压缩
				const ctx = uni.createCanvasContext('image-canvas')
				uni.showLoading({ title: '压缩中...' })
				ctx.drawImage(filePath, 0, 0, 800, targetHeight)
				ctx.draw(false, () => {
					uni.canvasToTempFilePath({
						canvasId: 'image-canvas',
						quality: 0.8,
						success: (res) => {
							uni.hideLoading()
							resolve(res.tempFilePath)
						},
						fail: (err) => {
							uni.hideLoading()
							// 压缩失败，使用原图
							resolve(filePath)
						}
					})
				})
			},
			fail: () => {
				// 获取图片信息失败，使用原图
				resolve(filePath)
			}
		})
	})
}

// 将文件路径转换为Base64
const fileToBase64 = (filePath) => {
	return new Promise((resolve, reject) => {
		uni.getFileSystemManager().readFile({
			filePath: filePath,
			encoding: 'base64',
			success: (res) => {
				resolve('data:image/jpeg;base64,' + res.data)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// 提交进度
const submitProgress = async () => {
	if (!orderId.value) return
	uni.showLoading({ title: '提交中...' })
	try {
		const result = await reportProgress(orderId.value, currentProgress.value, proofImage.value)
		if (result.code === 200) {
			uni.showToast({ title: '上报成功', icon: 'success' })
			showModal.value = false
			// 刷新订单详情
			loadOrderDetail()
		}
	} catch (e) {
		console.error('上报失败', e)
		uni.showToast({ title: e.message || '上报失败', icon: 'none' })
	} finally {
		uni.hideLoading()
	}
}

const cancelOrder = async () => {
	if (!orderId.value) return;
	uni.showModal({
		title: '提示',
		content: '确定取消订单吗？',
		success: async (res) => {
			if (res.confirm) {
				try {
					const result = await cancelOrderApi(orderId.value);
					if (result.code === 200) {
						uni.showToast({ title: '已取消', icon: 'success' });
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					}
				} catch (e) {
					console.error('取消订单失败', e);
				}
			}
		}
	});
}

const confirmReceipt = () => {
	if (!orderId.value) return;
	uni.navigateTo({ url: '/pages/payment/pay?id=' + orderId.value });
}

const goToEvaluate = () => {
	if (orderId.value) {
		uni.navigateTo({ url: '/pages/user/evaluate?id=' + orderId.value });
	}
}

const goToAppeal = () => {
	if (orderId.value) {
		uni.navigateTo({
			url: '/pages/user/appeal',
			success: () => {
				setTimeout(() => {
					uni.$emit('disputeOrder', order.value)
				}, 100)
			}
		});
	}
}
</script>

<style scoped>
.container {
	padding-bottom: 120rpx;
	background-color: #f8f8f8;
	min-height: 100vh;
}

.status-section {
	background-color: #007AFF;
	color: #fff;
	padding: 40rpx 30rpx;
}

.status-text {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.status-desc {
	font-size: 24rpx;
	opacity: 0.8;
}

.info-card {
	background-color: #fff;
	margin: 20rpx;
	padding: 30rpx;
	border-radius: 12rpx;
}

.card-title {
	font-weight: bold;
	font-size: 30rpx;
	margin-bottom: 20rpx;
	border-left: 8rpx solid #007AFF;
	padding-left: 20rpx;
}

.info-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15rpx;
	font-size: 26rpx;
}

.label {
	color: #8c8c8c;
}

.value {
	color: #262626;
}

.total {
	border-top: 1rpx solid #f0f0f0;
	padding-top: 20rpx;
	font-weight: bold;
	font-size: 30rpx;
}

.total .value {
	color: #f5222d;
}

.runner-info,
.publisher-info {
	display: flex;
	align-items: center;
}

.avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: #eee;
	margin-right: 20rpx;
}

.name-box {
	flex: 1;
}

.name {
	font-weight: bold;
	font-size: 28rpx;
}

.rating {
	font-size: 22rpx;
	color: #faad14;
}

.phone {
	font-size: 24rpx;
	color: #666;
	margin-top: 4rpx;
}

.photo-list {
	display: flex;
	gap: 20rpx;
}

.photo-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 22rpx;
	color: #999;
}

.photo-item image {
	width: 150rpx;
	height: 150rpx;
	border-radius: 8rpx;
	margin-bottom: 10rpx;
}

/* 进度上报面板 */
.progress-panel {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
}

.progress-panel .card-title {
	color: #fff;
	border-left-color: #fff;
}

.progress-steps {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 10rpx;
}

.step {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.step-dot {
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.3);
	margin-bottom: 10rpx;
}

.step.active .step-dot {
	background-color: #fff;
}

.step.completed .step-dot {
	background-color: #52c41a;
}

.step-label {
	font-size: 22rpx;
	white-space: nowrap;
}

.step-line {
	flex: 1;
	height: 4rpx;
	background-color: rgba(255, 255, 255, 0.3);
	margin: 0 10rpx;
	margin-bottom: 30rpx;
}

.step-line.active {
	background-color: #52c41a;
}

.progress-actions {
	margin-top: 20rpx;
}

.progress-btn {
	width: 100%;
	background-color: #fff;
	color: #667eea;
	border-radius: 40rpx;
	font-weight: bold;
}

.progress-btn[disabled] {
	background-color: rgba(255, 255, 255, 0.5);
	color: #999;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.bar-btn {
	flex: 1;
	height: 70rpx;
	line-height: 70rpx;
	margin: 0 10rpx;
	font-size: 26rpx;
}

.primary {
	background-color: #007AFF;
	color: #fff;
}

.secondary {
	background-color: #f5f5f5;
	color: #666;
}

/* 进度上报弹窗 */
.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-content {
	width: 600rpx;
	background-color: #fff;
	border-radius: 24rpx;
	padding: 40rpx;
}

.modal-title {
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 30rpx;
}

.modal-body {
	margin-bottom: 30rpx;
}

.upload-section {
	display: flex;
	flex-direction: column;
}

.upload-label {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 15rpx;
}

.upload-box {
	width: 200rpx;
	height: 200rpx;
	border: 2rpx dashed #ddd;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.upload-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.upload-icon {
	font-size: 60rpx;
	color: #ccc;
}

.upload-text {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
}

.proof-preview {
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
}

.modal-actions {
	display: flex;
	gap: 20rpx;
}

.modal-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 40rpx;
	font-size: 28rpx;
}

.modal-btn.cancel {
	background-color: #f5f5f5;
	color: #666;
}

.modal-btn.confirm {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
}
</style>
