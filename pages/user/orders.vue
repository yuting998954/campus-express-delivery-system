<template>
	<view class="container">
		<view class="tabs">
			<view v-for="(tab, index) in tabs" :key="index" 
				class="tab-item" :class="{active: currentTab === index}"
				@tap="currentTab = index">
				{{tab}}
			</view>
		</view>

		<scroll-view scroll-y class="order-list">
			<view v-for="order in filteredOrders" :key="order.id" class="order-card" @tap="goToDetail(order)">
				<view class="order-header">
					<text class="order-id">订单号: {{order.orderNo}}</text>
					<text class="status" :class="order.status">{{order.statusLabel}}</text>
				</view>
				<view class="order-info">
					<view>包裹: {{order.quantity}}件 ({{order.weightLabel}})</view>
					<view>地址: {{order.address}}</view>
					<view>报酬: <text class="reward">￥{{order.totalReward}}</text></view>
				</view>
				<view class="order-actions" @tap.stop>
					<button v-if="order.status === 'pending' || order.status === 'accepted'" 
						class="action-btn cancel" size="mini" @tap="cancelOrder(order)">取消订单</button>
					<button v-if="order.status === 'delivered'" 
						class="action-btn" type="primary" size="mini" @tap="confirmReceipt(order)">确认送达</button>
					<button v-if="order.status === 'completed'" 
						class="action-btn" size="mini" @tap="evaluateOrder(order)">去评价</button>
				</view>
			</view>
			<view v-if="filteredOrders.length === 0" class="empty">
				暂无该状态下的订单
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentTab: 0,
			tabs: ['全部', '待接单', '待取件', '配送中', '已完成', '已取消'],
			statusMap: {
				0: 'all',
				1: 'pending',
				2: 'accepted',
				3: 'shipping',
				4: 'completed',
				5: 'cancelled'
			},
			orders: [
				{
					id: 1,
					orderNo: 'ORD20260114001',
					status: 'pending',
					statusLabel: '待接单',
					quantity: 1,
					weightLabel: '轻件',
					address: '学生宿舍 A 栋 302',
					totalReward: 8,
					createTime: '2026-01-14 10:00'
				},
				{
					id: 2,
					orderNo: 'ORD20260114002',
					status: 'shipping',
					statusLabel: '配送中',
					quantity: 2,
					weightLabel: '中件',
					address: '图书馆 4 楼阅览室',
					totalReward: 15,
					createTime: '2026-01-14 09:30'
				}
			]
		}
	},
	computed: {
		filteredOrders() {
			const status = this.statusMap[this.currentTab];
			if (status === 'all') return this.orders;
			return this.orders.filter(o => o.status === status);
		}
	},
	methods: {
		goToDetail(order) {
			uni.navigateTo({
				url: `/pages/user/order-detail?id=${order.id}`
			});
		},
		cancelOrder(order) {
			uni.showModal({
				title: '取消订单',
				content: '确定要取消该订单吗？',
				success: (res) => {
					if (res.confirm) {
						order.status = 'cancelled';
						order.statusLabel = '已取消';
						uni.showToast({ title: '已取消', icon: 'success' });
					}
				}
			});
		},
		confirmReceipt(order) {
			// Mock payment trigger
			uni.navigateTo({
				url: `/pages/user/order-detail?id=${order.id}&action=pay`
			});
		},
		evaluateOrder(order) {
			uni.navigateTo({
				url: `/pages/user/evaluate?id=${order.id}`
			});
		}
	}
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f8f8f8;
}
.tabs {
	display: flex;
	background-color: #fff;
	padding: 20rpx 0;
	position: sticky;
	top: 0;
	z-index: 10;
}
.tab-item {
	flex: 1;
	text-align: center;
	font-size: 26rpx;
	color: #666;
	position: relative;
}
.tab-item.active {
	color: #007AFF;
	font-weight: bold;
}
.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: -10rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 40rpx;
	height: 4rpx;
	background-color: #007AFF;
}
.order-list {
	flex: 1;
	padding: 20rpx;
	box-sizing: border-box;
}
.order-card {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
}
.order-header {
	display: flex;
	justify-content: space-between;
	border-bottom: 1rpx solid #f0f0f0;
	padding-bottom: 15rpx;
	margin-bottom: 15rpx;
}
.order-id {
	font-size: 24rpx;
	color: #999;
}
.status {
	font-size: 24rpx;
}
.status.pending { color: #faad14; }
.status.accepted { color: #1890ff; }
.status.shipping { color: #52c41a; }
.status.completed { color: #bfbfbf; }
.status.cancelled { color: #ff4d4f; }

.order-info {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
}
.reward {
	color: #f5222d;
	font-weight: bold;
}
.order-actions {
	display: flex;
	justify-content: flex-end;
	margin-top: 20rpx;
	gap: 20rpx;
}
.action-btn {
	margin: 0;
}
.empty {
	text-align: center;
	padding-top: 200rpx;
	color: #ccc;
}
</style>
