<template>
	<view class="container">
		<!-- Status Header -->
		<view class="status-section">
			<view class="status-text">{{order.statusLabel}}</view>
			<view class="status-desc">{{statusDesc}}</view>
		</view>

		<!-- Order Info -->
		<view class="info-card">
			<view class="card-title">订单信息</view>
			<view class="info-row">
				<text class="label">订单编号</text>
				<text class="value">{{order.orderNo}}</text>
			</view>
			<view class="info-row">
				<text class="label">取件码/单号</text>
				<text class="value">{{order.pickupCode}}</text>
			</view>
			<view class="info-row">
				<text class="label">包裹数量</text>
				<text class="value">{{order.quantity}}</text>
			</view>
			<view class="info-row">
				<text class="label">包裹属性</text>
				<text class="value">{{order.weightLabel}}</text>
			</view>
			<view class="info-row">
				<text class="label">收件地址</text>
				<text class="value">{{order.address}}</text>
			</view>
			<view class="info-row">
				<text class="label">期望时间</text>
				<text class="value">{{order.expectedTime}}</text>
			</view>
			<view class="info-row">
				<text class="label">特殊备注</text>
				<text class="value">{{order.notes || '无'}}</text>
			</view>
		</view>

		<!-- Payment Info -->
		<view class="info-card">
			<view class="card-title">费用明细</view>
			<view class="info-row">
				<text class="label">代取报酬</text>
				<text class="value">￥{{order.reward}}</text>
			</view>
			<view class="info-row" v-if="order.isUrgent">
				<text class="label">加急费用</text>
				<text class="value">￥{{order.urgentFee}}</text>
			</view>
			<view class="info-row total">
				<text class="label">合计</text>
				<text class="value">￥{{order.totalReward}}</text>
			</view>
		</view>

		<!-- Runner Info (if accepted) -->
		<view class="info-card" v-if="order.runner">
			<view class="card-title">代取人信息</view>
			<view class="runner-info">
				<image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
				<view class="name-box">
					<view class="name">{{order.runner.name}}</view>
					<view class="rating">评分: {{order.runner.rating}}</view>
				</view>
				<button class="chat-btn" size="mini" @tap="goToChat">联系他</button>
			</view>
		</view>

		<!-- Proof Photos (if picked up/delivered) -->
		<view class="info-card" v-if="order.pickupPhoto || order.deliveryPhoto">
			<view class="card-title">凭证照片</view>
			<view class="photo-list">
				<view v-if="order.pickupPhoto" class="photo-item">
					<image :src="order.pickupPhoto" mode="aspectFill" @tap="previewImg(order.pickupPhoto)"></image>
					<text>取件凭证</text>
				</view>
				<view v-if="order.deliveryPhoto" class="photo-item">
					<image :src="order.deliveryPhoto" mode="aspectFill" @tap="previewImg(order.deliveryPhoto)"></image>
					<text>送达凭证</text>
				</view>
			</view>
		</view>

		<!-- Actions -->
		<view class="bottom-bar">
			<button v-if="order.status === 'pending' || order.status === 'accepted'" 
				class="bar-btn secondary" @tap="cancelOrder">取消订单</button>
			
			<button v-if="order.status === 'delivered'" 
				class="bar-btn primary" @tap="confirmReceipt">确认收到并支付</button>
			
			<button v-if="order.status === 'completed'" 
				class="bar-btn secondary" @tap="goToAppeal">申诉</button>
				
			<button v-if="order.status === 'completed' && !order.isEvaluated" 
				class="bar-btn primary" @tap="goToEvaluate">评价</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			order: {
				id: 1,
				orderNo: 'ORD20260114002',
				pickupCode: 'SF123456789',
				status: 'shipping',
				statusLabel: '配送中',
				quantity: 2,
				weightLabel: '中件',
				address: '图书馆 4 楼阅览室',
				reward: 10,
				urgentFee: 5,
				totalReward: 15,
				isUrgent: true,
				expectedTime: '今天 18:00',
				notes: '轻拿轻放',
				runner: {
					name: '张三',
					rating: '4.8'
				},
				pickupPhoto: 'https://via.placeholder.com/150',
				isEvaluated: false
			}
		}
	},
	computed: {
		statusDesc() {
			const descMap = {
				'pending': '等待代取人承接...',
				'accepted': '代取人已接单，正前往取件点',
				'shipping': '快递已取到，正在为您配送中',
				'delivered': '快递已送达，请确认并支付',
				'completed': '订单已完成，感谢使用',
				'cancelled': '订单已取消'
			};
			return descMap[this.order.status] || '';
		}
	},
	onLoad(options) {
		if (options.id) {
			// Fetch order details here
		}
	},
	methods: {
		previewImg(url) {
			uni.previewImage({ urls: [url] });
		},
		goToChat() {
			uni.navigateTo({ url: '/pages/chat/chat?id=' + this.order.id });
		},
		cancelOrder() {
			uni.showModal({
				title: '提示',
				content: '确定取消订单吗？',
				success: (res) => {
					if (res.confirm) {
						this.order.status = 'cancelled';
						this.order.statusLabel = '已取消';
					}
				}
			});
		},
		confirmReceipt() {
			uni.showLoading({ title: '拉起支付...' });
			setTimeout(() => {
				uni.hideLoading();
				uni.showModal({
					title: '支付成功',
					content: '支付完成，快去给代取人评价吧',
					showCancel: false,
					success: () => {
						this.order.status = 'completed';
						this.order.statusLabel = '已完成';
					}
				});
			}, 1000);
		},
		goToEvaluate() {
			uni.navigateTo({ url: '/pages/user/evaluate?id=' + this.order.id });
		},
		goToAppeal() {
			uni.navigateTo({ url: '/pages/user/appeal?id=' + this.order.id });
		}
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
.runner-info {
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
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
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
</style>
