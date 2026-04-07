<template>
	<view class="container">
		<!-- 订单金额区域 -->
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

		<!-- 支付方式选择 -->
		<view class="payment-methods">
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
						<text class="balance">可用余额 ¥128.50</text>
					</view>
				</view>
				<view class="radio" :class="{ checked: paymentMethod === 'balance' }">
					<view class="dot" v-if="paymentMethod === 'balance'"></view>
				</view>
			</view>
		</view>

		<!-- 底部支付按钮 -->
		<button class="pay-btn" hover-class="pay-btn-hover" @click="handlePay">
			确认支付 ¥{{ amount }}
		</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			amount: '0.00',
			orderId: '',
			paymentMethod: 'wechat',
			countdown: '14:59',
			timer: null
		}
	},
	onLoad(options) {
		// 接收上个页面传递的金额和订单ID
		this.amount = options.amount || '15.00';
		this.orderId = options.orderId || 'TEMP_ORDER_001';
		this.startCountdown();
	},
	onUnload() {
		if (this.timer) clearInterval(this.timer);
	},
	methods: {
		selectMethod(method) {
			this.paymentMethod = method;
		},
		startCountdown() {
			let seconds = 15 * 60; // 15 minutes
			this.timer = setInterval(() => {
				seconds--;
				if (seconds < 0) {
					clearInterval(this.timer);
					this.countdown = '00:00';
					return;
				}
				const m = Math.floor(seconds / 60).toString().padStart(2, '0');
				const s = (seconds % 60).toString().padStart(2, '0');
				this.countdown = `${m}:${s}`;
			}, 1000);
		},
		handlePay() {
			uni.showLoading({ title: '支付中...' });
			
			// 模拟支付过程
			setTimeout(() => {
				uni.hideLoading();
				
				// 模拟成功
				uni.showToast({
					title: '支付成功',
					icon: 'success',
					duration: 1500
				});

				setTimeout(() => {
					// 支付成功后跳转到订单列表或详情页
					// 这里为了演示，跳转到订单列表
					uni.switchTab({
						url: '/pages/user/orders',
						success: () => {
							// 可以在这里触发订单列表刷新
						}
					});
				}, 1500);
			}, 1500);
		}
	}
}
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
}

.label {
	font-size: 28rpx;
	color: #666;
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
	color: #333;
}

.amount {
	font-size: 80rpx;
	font-weight: bold;
	color: #333;
}

.countdown {
	font-size: 26rpx;
	color: #999;
}

.time {
	color: #ff4d4f;
	margin-left: 10rpx;
}

.payment-methods {
	background: #fff;
	border-radius: 20rpx;
	padding: 0 30rpx;
	margin-top: 40rpx;
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

.wechat { color: #09bb07; }
.alipay { color: #1296db; }
.wallet { color: #ffc107; }

.info {
	display: flex;
	flex-direction: column;
}

.name {
	font-size: 30rpx;
	color: #333;
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

.pay-btn {
	margin-top: 80rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-radius: 50rpx;
	font-weight: bold;
	font-size: 34rpx;
	height: 100rpx;
	line-height: 100rpx;
	box-shadow: 0 10rpx 20rpx rgba(102, 126, 234, 0.3);
}

.pay-btn-hover {
	opacity: 0.9;
	transform: translateY(2rpx);
}
</style>
