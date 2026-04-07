<template>
	<view class="container">
		<view class="summary-card">
			<view class="summary-label">累计收益 (元)</view>
			<view class="total-amount">￥{{totalEarnings}}</view>
		</view>

		<view class="list-title">收益明细</view>
		<view class="earnings-list">
			<view v-for="item in earningsList" :key="item.id" class="earnings-item" @tap="goToDetail(item.orderId)">
				<view class="item-main">
					<view class="order-no">订单: {{item.orderNo}}</view>
					<view class="time">{{item.time}}</view>
				</view>
				<view class="amount-box">
					<view class="amount">+{{item.amount}}</view>
					<button class="appeal-link" size="mini" plain @tap.stop="goToAppeal(item.orderId)">申诉</button>
				</view>
			</view>
		</view>
		<view v-if="earningsList.length === 0" class="empty">
			暂无收益记录
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			totalEarnings: '128.50',
			earningsList: [
				{
					id: 1,
					orderId: 101,
					orderNo: 'ORD20260114001',
					time: '2026-01-14 11:20',
					amount: '8.00'
				},
				{
					id: 2,
					orderId: 102,
					orderNo: 'ORD20260114002',
					time: '2026-01-13 18:45',
					amount: '15.00'
				},
				{
					id: 3,
					orderId: 103,
					orderNo: 'ORD20260113005',
					time: '2026-01-13 14:10',
					amount: '12.00'
				}
			]
		}
	},
	methods: {
		goToDetail(orderId) {
			uni.navigateTo({ url: `/pages/user/order-detail?id=${orderId}` });
		},
		goToAppeal(orderId) {
			uni.navigateTo({ url: `/pages/user/appeal?id=${orderId}&role=runner` });
		}
	}
}
</script>

<style scoped>
.container {
	padding: 20rpx;
	background-color: #f8f8f8;
	min-height: 100vh;
}
.summary-card {
	background: linear-gradient(135deg, #007AFF, #00c6ff);
	color: #fff;
	padding: 60rpx 40rpx;
	border-radius: 20rpx;
	margin-bottom: 40rpx;
	box-shadow: 0 10rpx 20rpx rgba(0,122,255,0.2);
}
.summary-label {
	font-size: 28rpx;
	opacity: 0.9;
	margin-bottom: 20rpx;
}
.total-amount {
	font-size: 64rpx;
	font-weight: bold;
}
.list-title {
	font-weight: bold;
	font-size: 30rpx;
	margin-bottom: 20rpx;
	padding-left: 10rpx;
}
.earnings-item {
	background-color: #fff;
	padding: 30rpx;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.order-no {
	font-size: 28rpx;
	font-weight: 500;
	margin-bottom: 8rpx;
}
.time {
	font-size: 24rpx;
	color: #999;
}
.amount-box {
	text-align: right;
}
.amount {
	font-size: 32rpx;
	font-weight: bold;
	color: #52c41a;
	margin-bottom: 10rpx;
}
.appeal-link {
	padding: 0 10rpx;
	height: 40rpx;
	line-height: 40rpx;
	font-size: 20rpx;
	color: #ff4d4f;
	border-color: #ff4d4f;
	margin: 0;
}
.empty {
	text-align: center;
	margin-top: 100rpx;
	color: #999;
}
</style>
