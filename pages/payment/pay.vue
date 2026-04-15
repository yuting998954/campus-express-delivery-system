<template>
	<view class="container">
		<view class="header-section">
			<text class="label">支付金额</text>
			<view class="amount-box">
				<text class="currency">¥</text>
				<text class="amount">{{ amount }}</text>
			</view>
			<view class="countdown">
				<text>支付剩余时间 </text>
				<text class="time">{{ countdown }}</text>
			</view>
		</view>

		<view class="order-info">
			<view class="info-item">
				<text class="info-label">订单编号</text>
				<text class="info-value">{{ orderInfo.orderNo || '' }}</text>
			</view>
			<view class="info-item">
				<text class="info-label">代取员</text>
				<text class="info-value">{{ orderInfo.runnerName || '待分配' }}</text>
			</view>
		</view>

		<view class="payment-methods">
			<view class="method-title">选择支付方式</view>
			<view class="method-item" @click="selectMethod('wechat')">
				<view class="left">
					<text class="icon wechat">💬</text>
					<text class="name">微信支付</text>
				</view>
				<view class="radio" :class="{ checked: paymentMethod === 'wechat' }">
					<view class="dot" v-if="paymentMethod === 'wechat'"></view>
				</view>
			</view>

			<view class="method-item" @click="selectMethod('alipay')">
				<view class="left">
					<text class="icon alipay">💳</text>
					<text class="name">支付宝支付</text>
				</view>
				<view class="radio" :class="{ checked: paymentMethod === 'alipay' }">
					<view class="dot" v-if="paymentMethod === 'alipay'"></view>
				</view>
			</view>

			<view class="method-item" @click="selectMethod('balance')">
				<view class="left">
					<text class="icon wallet">💰</text>
					<view class="info">
						<text class="name">余额支付</text>
						<text class="balance">可用余额 ¥{{ userBalance }}</text>
					</view>
				</view>
				<view class="radio" :class="{ checked: paymentMethod === 'balance' }">
					<view class="dot" v-if="paymentMethod === 'balance'"></view>
				</view>
			</view>
		</view>

		<view class="pay-tip" v-if="paymentMethod === 'balance' && parseFloat(amount) > userBalance">
			<text class="tip-icon">⚠️</text>
			<text class="tip-text">余额不足，请选择其他支付方式</text>
		</view>

		<button class="pay-btn" hover-class="pay-btn-hover" @click="handlePay" :disabled="isPaying">
			<text v-if="!isPaying">确认支付 ¥{{ amount }}</text>
			<text v-else>支付中...</text>
		</button>

		<view class="cancel-link" @click="cancelPay">取消支付</view>
	</view>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getOrderDetail, confirmReceiptApi } from '@/utils/api'
import { getUserInfo } from '@/utils/storage.js'

const orderId = ref('')
const orderInfo = ref({})
const amount = ref('0.00')
const userBalance = ref('128.50')
const paymentMethod = ref('wechat')
const countdown = ref('15:00')
const isPaying = ref(false)
let timer = null

onLoad(async (options) => {
	console.log(options);

	if (options.id) {
		orderId.value = options.id
		await loadOrderInfo()
	}
	startCountdown()
})

const loadOrderInfo = async () => {
	uni.showLoading({ title: '加载中...' })
	try {
		const res = await getOrderDetail(orderId.value)
		if (res.code === 200) {
			orderInfo.value = res.data
			amount.value = res.data.totalReward || '0.00'
		}
	} catch (e) {
		console.error('加载订单信息失败', e)
		uni.showToast({ title: '加载失败', icon: 'none' })
	} finally {
		uni.hideLoading()
	}
}

const selectMethod = (method) => {
	if (isPaying.value) return
	paymentMethod.value = method
}

const startCountdown = () => {
	let seconds = 15 * 60
	timer = setInterval(() => {
		seconds--
		if (seconds <= 0) {
			clearInterval(timer)
			countdown.value = '00:00'
			uni.showToast({ title: '支付超时', icon: 'none' })
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
			return
		}
		const m = Math.floor(seconds / 60).toString().padStart(2, '0')
		const s = (seconds % 60).toString().padStart(2, '0')
		countdown.value = `${m}:${s}`
	}, 1000)
}

const handlePay = async () => {
	if (isPaying.value) return

	if (paymentMethod.value === 'balance' && parseFloat(amount.value) > parseFloat(userBalance.value)) {
		uni.showToast({ title: '余额不足', icon: 'none' })
		return
	}

	isPaying.value = true
	uni.showLoading({ title: '支付中...' })

	try {
		// 调用后端确认收货接口（后端会自动更新订单状态并给代取员加收益）
		const result = await confirmReceiptApi(orderId.value)
		if (result.code === 200) {
			clearInterval(timer)
			uni.hideLoading()
			uni.showToast({ title: '支付成功', icon: 'success' })

			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/user/evaluate?id=' + orderId.value
				})
			}, 1500)
		}
	} catch (e) {
		console.error('支付失败', e)
		uni.hideLoading()
		uni.showToast({ title: '支付失败，请重试', icon: 'none' })
		isPaying.value = false
	}
}

const cancelPay = () => {
	uni.showModal({
		title: '提示',
		content: '确定取消支付吗？取消后订单将保持送达状态',
		success: (res) => {
			if (res.confirm) {
				clearInterval(timer)
				uni.navigateBack()
			}
		}
	})
}

onBeforeUnmount(() => {
	if (timer) clearInterval(timer)
})
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #f5f7fa;
	padding: 30rpx;
}

.header-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 24rpx;
	color: #fff;
}

.label {
	font-size: 28rpx;
	opacity: 0.9;
	margin-bottom: 20rpx;
}

.amount-box {
	display: flex;
	align-items: baseline;
	margin-bottom: 20rpx;
}

.currency {
	font-size: 40rpx;
	font-weight: bold;
	color: #fff;
}

.amount {
	font-size: 80rpx;
	font-weight: bold;
	color: #fff;
}

.countdown {
	font-size: 26rpx;
	opacity: 0.8;
}

.time {
	color: #fff;
	margin-left: 10rpx;
	font-weight: bold;
}

.order-info {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx 30rpx;
	margin-top: 30rpx;
}

.info-item {
	display: flex;
	justify-content: space-between;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.info-item:last-child {
	border-bottom: none;
}

.info-label {
	font-size: 26rpx;
	color: #999;
}

.info-value {
	font-size: 26rpx;
	color: #333;
}

.payment-methods {
	background: #fff;
	border-radius: 20rpx;
	padding: 0 30rpx;
	margin-top: 30rpx;
}

.method-title {
	font-size: 28rpx;
	color: #666;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.method-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 120rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.method-item:last-child {
	border-bottom: none;
}

.left {
	display: flex;
	align-items: center;
}

.icon {
	font-size: 50rpx;
	margin-right: 20rpx;
}

.wechat {
	color: #09bb07;
}

.alipay {
	color: #1296db;
}

.wallet {
	color: #ffc107;
}

.name {
	font-size: 30rpx;
	color: #333;
}

.info {
	display: flex;
	flex-direction: column;
}

.balance {
	font-size: 22rpx;
	color: #999;
	margin-top: 4rpx;
}

.radio {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	border: 2rpx solid #ccc;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s;
}

.radio.checked {
	border-color: #667eea;
	background: #fff;
}

.dot {
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
	background: #667eea;
}

.pay-tip {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20rpx;
	margin-top: 20rpx;
	background-color: #fff2f0;
	border-radius: 12rpx;
}

.tip-icon {
	font-size: 28rpx;
	margin-right: 10rpx;
}

.tip-text {
	font-size: 24rpx;
	color: #ff4d4f;
}

.pay-btn {
	margin-top: 40rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-radius: 50rpx;
	font-weight: bold;
	font-size: 34rpx;
	height: 100rpx;
	line-height: 100rpx;
	box-shadow: 0 10rpx 20rpx rgba(102, 126, 234, 0.3);
}

.pay-btn[disabled] {
	background: #ccc;
	box-shadow: none;
}

.pay-btn-hover {
	opacity: 0.9;
	transform: translateY(2rpx);
}

.cancel-link {
	text-align: center;
	margin-top: 30rpx;
	font-size: 26rpx;
	color: #999;
}
</style>
