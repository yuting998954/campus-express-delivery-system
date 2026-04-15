<template>
	<view class="container">
		<view class="filter-section">
			<view class="search-box">
				<text class="search-icon">🔍</text>
				<input class="search-input" type="text" v-model="searchKeyword" placeholder="搜索地址/备注..."
					confirm-type="search" />
				<view class="clear-icon" v-if="searchKeyword" @click="searchKeyword = ''">✕</view>
			</view>

			<view class="filter-tags">
				<view class="filter-tag" :class="{ active: filterUrgent }" @click="toggleUrgent">
					加急单
				</view>
				<picker mode="selector" :range="weightOptions" range-key="label" @change="onWeightChange">
					<view class="filter-tag" :class="{ active: filterWeight !== 'all' }">
						{{ currentWeightLabel }} ▾
					</view>
				</picker>
				<view class="filter-tag" :class="{ active: sortBy === 'reward_desc' }" @click="toggleSort">
					报酬最高
				</view>
			</view>
		</view>

		<view class="order-list" v-if="availableOrders.length > 0">
			<view v-for="order in sortedOrders" :key="order.id" class="order-card">
				<view class="order-header">
					<view class="header-left">
						<view class="tag urgent" v-if="order.isUrgent">加急</view>
						<view class="tag weight">{{ order.weightLabel }}</view>
					</view>
					<view class="reward">
						<text class="currency">￥</text>
						<text class="amount">{{ order.totalReward }}</text>
					</view>
				</view>

				<view class="divider"></view>

				<view class="order-body">
					<view class="info-row">
						<text class="info-icon">📦</text>
						<text class="info-text">{{ order.quantity }} 个包裹</text>
					</view>
					<view class="info-row">
						<text class="info-icon">📍</text>
						<text class="info-text address">{{ order.address }}</text>
					</view>
					<view class="info-row">
						<text class="info-icon">⏰</text>
						<text class="info-text">{{ order.expectedTime }}</text>
					</view>
					<view class="info-row" v-if="order.notes">
						<text class="info-icon">📝</text>
						<text class="info-text notes">{{ order.notes }}</text>
					</view>
				</view>

				<view class="order-footer">
					<button class="take-btn" hover-class="take-btn-hover" @tap="takeOrder(order)">立即抢单</button>
				</view>
			</view>
		</view>

		<view v-if="isLoading" class="loading-state">
			<text>加载中...</text>
		</view>

		<view v-if="availableOrders.length === 0 && !isLoading" class="empty-state">
			<text class="empty-icon">📭</text>
			<text class="empty-text">暂无符合条件的订单</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getPickupHall, acceptOrder } from '@/utils/api'
import { getUserInfo } from '@/utils/storage.js'

const searchKeyword = ref('')
const filterUrgent = ref(false)
const filterWeight = ref('')
const sortBy = ref('default')

const weightOptions = [
	{ label: '全部重量', value: '' },
	{ label: '轻件 (<1kg)', value: 'light' },
	{ label: '中件 (1-3kg)', value: 'medium' },
	{ label: '重件 (>3kg)', value: 'heavy' }
]

const availableOrders = ref([])
const isLoading = ref(false)

const currentWeightLabel = computed(() => {
	const option = weightOptions.find(o => o.value === filterWeight.value);
	return option ? (option.value === '' ? '包裹重量' : option.label.split(' ')[0]) : '包裹重量';
})

// 后端已过滤，前端只需排序
const sortedOrders = computed(() => {
	const result = [...availableOrders.value];
	if (sortBy.value === 'reward_desc') {
		result.sort((a, b) => {
			const aReward = parseFloat(a.totalReward) || 0;
			const bReward = parseFloat(b.totalReward) || 0;
			return bReward - aReward;
		});
	}
	return result;
})

// 构建查询参数
const buildQuery = () => {
	const query = {}
	if (searchKeyword.value) query.keyword = searchKeyword.value
	if (filterUrgent.value) query.urgent = true
	if (filterWeight.value) query.weightType = filterWeight.value
	return query
}

// 加载订单列表
const loadOrders = async () => {
	isLoading.value = true
	try {
		const res = await getPickupHall(buildQuery())
		if (res.code === 200) {
			availableOrders.value = res.data || []
		}
	} catch (e) {
		console.error('加载订单列表失败', e)
		uni.showToast({ title: '加载失败', icon: 'none' })
	} finally {
		isLoading.value = false
	}
}

// 监听筛选条件变化，重新加载
watch([searchKeyword, filterUrgent, filterWeight, sortBy], () => {
	loadOrders()
}, { debounce: 300 } // 防抖，避免频繁请求
)

onShow(() => {
	loadOrders()
})

const toggleUrgent = () => {
	filterUrgent.value = !filterUrgent.value
}

const onWeightChange = (e) => {
	const index = e.detail.value
	filterWeight.value = weightOptions[index].value
}

const toggleSort = () => {
	sortBy.value = sortBy.value === 'default' ? 'reward_desc' : 'default'
}

// 抢单
const takeOrder = (order) => {
	const userInfo = getUserInfo()
	if (!userInfo) {
		uni.showToast({ title: '请先登录', icon: 'none' })
		return
	}
	if (userInfo.verifyStatus !== 2) {
		uni.showModal({
			title: '提示',
			content: '您还未通过身份认证，无法接单。请先完成身份认证。',
			confirmText: '去认证',
			success: (res) => {
				if (res.confirm) {
					uni.navigateTo({ url: '/pages/user/verify' })
				}
			}
		})
		return
	}

	uni.showModal({
		title: '确认接单',
		content: `确认承接送往 ${order.address} 的订单吗？`,
		confirmColor: '#667eea',
		success: async (res) => {
			if (res.confirm) {
				uni.showLoading({ title: '接单中...' })
				try {
					const result = await acceptOrder(order.id)
					if (result.code === 200) {
						uni.showToast({ title: '接单成功', icon: 'success' })
						// 从列表中移除该订单
						const index = availableOrders.value.findIndex(o => o.id === order.id)
						if (index > -1) {
							availableOrders.value.splice(index, 1)
						}
					}
				} catch (e) {
					console.error('接单失败', e)
					uni.showToast({ title: e.message || '接单失败', icon: 'none' })
				} finally {
					uni.hideLoading()
				}
			}
		}
	})
}
</script>

<style scoped>
.container {
	background-color: #f5f7fa;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.filter-section {
	background-color: #ffffff;
	padding: 20rpx 30rpx;
	position: sticky;
	top: 0;
	z-index: 100;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.search-box {
	background-color: #f5f7fa;
	border-radius: 40rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	margin-bottom: 20rpx;
}

.search-icon {
	font-size: 32rpx;
	margin-right: 15rpx;
	color: #999;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.clear-icon {
	color: #999;
	font-size: 32rpx;
	padding: 10rpx;
}

.filter-tags {
	display: flex;
	gap: 20rpx;
}

.filter-tag {
	padding: 10rpx 30rpx;
	background-color: #f5f7fa;
	border-radius: 30rpx;
	font-size: 26rpx;
	color: #666;
	transition: all 0.3s;
	border: 2rpx solid transparent;
}

.filter-tag.active {
	background-color: #eef2ff;
	color: #667eea;
	border-color: #667eea;
	font-weight: bold;
}

.order-list {
	padding: 20rpx 30rpx;
}

.order-card {
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 15rpx;
}

.tag {
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	font-size: 22rpx;
	font-weight: bold;
}

.urgent {
	background-color: #fff0f0;
	color: #ff4d4f;
}

.weight {
	background-color: #f0f7ff;
	color: #1890ff;
}

.reward {
	color: #ff4d4f;
	font-weight: bold;
}

.currency {
	font-size: 28rpx;
}

.amount {
	font-size: 40rpx;
}

.divider {
	height: 2rpx;
	background-color: #f5f5f5;
	margin: 10rpx 0 20rpx;
}

.info-row {
	display: flex;
	align-items: flex-start;
	margin-bottom: 16rpx;
}

.info-icon {
	font-size: 32rpx;
	margin-right: 16rpx;
	width: 40rpx;
	text-align: center;
}

.info-text {
	font-size: 28rpx;
	color: #666;
	flex: 1;
	line-height: 1.5;
}

.address {
	color: #333;
	font-weight: 500;
}

.notes {
	color: #999;
	font-style: italic;
}

.order-footer {
	margin-top: 30rpx;
	display: flex;
	justify-content: flex-end;
}

.take-btn {
	margin: 0;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-radius: 40rpx;
	padding: 0 50rpx;
	font-size: 28rpx;
	height: 70rpx;
	line-height: 70rpx;
	font-weight: bold;
	box-shadow: 0 6rpx 16rpx rgba(102, 126, 234, 0.3);
}

.take-btn-hover {
	opacity: 0.9;
	transform: translateY(2rpx);
}

.loading-state {
	display: flex;
	justify-content: center;
	padding: 60rpx;
	color: #999;
	font-size: 28rpx;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 150rpx;
}

.empty-icon {
	font-size: 100rpx;
	margin-bottom: 30rpx;
	opacity: 0.5;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}
</style>
