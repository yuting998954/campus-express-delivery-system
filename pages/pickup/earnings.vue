<template>
	<view class="container">
		<!-- 统计卡片 -->
		<view class="summary-card">
			<view class="summary-label">累计收益 (元)</view>
			<view class="total-amount">￥{{ stats.totalAmount || '0.00' }}</view>
			<view class="summary-bottom">
				<view class="summary-item">
					<view class="item-value">￥{{ stats.todayAmount || '0.00' }}</view>
					<view class="item-label">今日收益</view>
				</view>
				<view class="summary-divider"></view>
				<view class="summary-item">
					<view class="item-value">{{ stats.totalCount || 0 }}</view>
					<view class="item-label">累计订单</view>
				</view>
				<view class="summary-divider"></view>
				<view class="summary-item">
					<view class="item-value">{{ stats.todayCount || 0 }}</view>
					<view class="item-label">今日订单</view>
				</view>
			</view>
		</view>

		<!-- 收益明细 -->
		<view class="list-title">收益明细</view>
		<view class="earnings-list">
			<view v-for="item in earningsList" :key="item.earningId" class="earnings-item" @click="goToDetail(item.orderId)">
				<view class="item-main">
					<view class="order-no">订单: {{ item.orderNo }}</view>
					<view class="time">{{ item.createTime }}</view>
				</view>
				<view class="amount-box">
					<view class="amount">+￥{{ item.amount }}</view>
					<button class="appeal-link" size="mini" plain @click.stop="goToAppeal(item.orderId)">申诉</button>
				</view>
			</view>
		</view>
		<view v-if="loading" class="loading-wrap">
			<text class="loading-text">加载中...</text>
		</view>
		<view v-else-if="earningsList.length === 0" class="empty">
			<text>暂无收益记录</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getEarningStatistics, getEarningList } from '@/utils/api'

const stats = ref({})
const earningsList = ref([])
const loading = ref(false)

onMounted(async () => {
	await loadStatistics()
	await loadEarnings()
})

const loadStatistics = async () => {
	try {
		const res = await getEarningStatistics()
		if (res.code === 200) {
			stats.value = res.data || {}
		}
	} catch (e) {
		console.error('加载收益统计失败', e)
	}
}

const loadEarnings = async () => {
	loading.value = true
	try {
		const res = await getEarningList({ pageNum: 1, pageSize: 100 })
		if (res.code === 200) {
			earningsList.value = res.data?.records || []
		}
	} catch (e) {
		console.error('加载收益列表失败', e)
	} finally {
		loading.value = false
	}
}

const goToDetail = (orderId) => {
	uni.navigateTo({ url: `/pages/user/order-detail?id=${orderId}` })
}

const goToAppeal = (orderId) => {
	uni.navigateTo({ url: `/pages/user/appeal?id=${orderId}&role=runner` })
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
	padding: 40rpx 30rpx 30rpx;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 10rpx 20rpx rgba(0, 122, 255, 0.2);
}

.summary-label {
	font-size: 26rpx;
	opacity: 0.85;
	margin-bottom: 10rpx;
}

.total-amount {
	font-size: 56rpx;
	font-weight: bold;
	margin-bottom: 24rpx;
}

.summary-bottom {
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.summary-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
}

.item-value {
	font-size: 28rpx;
	font-weight: bold;
	margin-bottom: 6rpx;
}

.item-label {
	font-size: 22rpx;
	opacity: 0.75;
}

.summary-divider {
	width: 1rpx;
	height: 50rpx;
	background-color: rgba(255, 255, 255, 0.3);
}

.list-title {
	font-weight: bold;
	font-size: 30rpx;
	margin-bottom: 20rpx;
	padding-left: 10rpx;
}

.earnings-item {
	background-color: #fff;
	padding: 28rpx 30rpx;
	border-radius: 12rpx;
	margin-bottom: 16rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.item-main {
	flex: 1;
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
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.amount {
	font-size: 32rpx;
	font-weight: bold;
	color: #52c41a;
	margin-bottom: 8rpx;
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

.loading-wrap,
.empty {
	text-align: center;
	margin-top: 60rpx;
	color: #999;
	font-size: 26rpx;
}
</style>
