<template>
	<view class="container">
		<view class="tabs">
			<view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === index }"
				@click="switchTab(index)">
				{{ tab }}
			</view>
		</view>

		<scroll-view scroll-y class="order-list" refresher-enabled :refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh">
			<view v-for="order in filteredOrders" :key="order.id" class="order-card" @click="goToDetail(order)">
				<view class="order-header">
					<text class="order-id">订单号: {{ order.orderNo }}</text>
					<text class="status-text" :class="getStatusClass(order.status)">{{ order.statusLabel }}</text>
				</view>
				<view class="order-info">
					<view>包裹: {{ order.quantity }}件 ({{ order.weightLabel }})</view>
					<view>地址: {{ order.address }}</view>
					<view>报酬: <text class="reward">￥{{ order.totalReward }}</text></view>
				</view>
				<view class="order-actions" @click.stop>
					<!-- 发布者视角的操作 -->
					<template v-if="userInfo?.role !== 1">
						<button v-if="order.status === 0 || order.status === 1" class="action-btn cancel" size="mini"
							@click="handleCancelOrder(order)">取消订单</button>
						<button v-if="order.status === 3" class="action-btn" type="primary" size="mini"
							@click="handleConfirmReceipt(order)">确认送达</button>
						<button v-if="order.status === 4" class="action-btn" size="mini"
							@click="evaluateOrder(order)">去评价</button>
					</template>
					<!-- 代取员视角的操作 -->
					<template v-else>
						<button v-if="order.status === 1" class="action-btn progress" size="mini"
							@click="reportPicked(order)">取件完成</button>
						<button v-if="order.status === 2" class="action-btn progress" size="mini"
							@click="reportDelivered(order)">送达完成</button>
						<button v-if="order.status === 3" class="action-btn" type="primary" size="mini"
							disabled>等待确认</button>
						<button v-if="order.status === 0" class="action-btn cancel" size="mini"
							@click="handleCancelOrder(order)">取消订单</button>
					</template>
				</view>
			</view>
			<view v-if="filteredOrders.length === 0 && !isLoading" class="empty">
				<text class="empty-icon">📦</text>
				<text class="empty-text">暂无该状态下的订单</text>
			</view>
			<view v-if="isLoading" class="loading-more">
				<text>加载中...</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { getMyOrders, cancelOrderApi, confirmReceiptApi, reportProgress } from '@/utils/api'
import { getUserInfo } from '@/utils/storage.js'

const currentTab = ref(0)
const userInfo = ref(null)

// 根据用户角色获取 tabs
const tabs = computed(() => {
	if (userInfo.value?.role === 1) {
		// 代取员
		return ['全部', '待取件', '配送中', '已送达', '已完成', '已取消']
	}
	// 普通用户
	return ['全部', '待接单', '待取件', '配送中', '已完成', '已取消']
})

// Tab索引到后端状态值的映射
const statusMap = computed(() => {
	if (userInfo.value?.role === 1) {
		// 代取员：0全部, 1待取件(1), 2配送中(2), 3已送达(3), 4已完成(4,5), 5已取消(6)
		return {
			0: '',      // 全部
			1: '1',     // 待取件
			2: '2',     // 配送中
			3: '3',     // 已送达
			4: '4,5',   // 已完成
			5: '6'      // 已取消
		}
	}
	// 普通用户：0全部, 1待接单(0), 2待取件(1), 3配送中(2), 4已完成(4,5), 5已取消(6)
	return {
		0: '',      // 全部
		1: '0',     // 待接单
		2: '1',     // 待取件
		3: '2',     // 配送中
		4: '4,5',   // 已完成
		5: '6'      // 已取消
	}
})

const orders = ref([])
const isLoading = ref(false)
const isRefreshing = ref(false)

const filteredOrders = computed(() => orders.value)

onLoad(() => {
	userInfo.value = getUserInfo()
	console.log(userInfo.value, 'sss');

	// 设置页面标题
	uni.setNavigationBarTitle({
		title: userInfo.value?.role === 1 ? '我的承接' : '我的订单'
	})

})

const loadOrders = async () => {
	// 确保用户信息已加载
	if (!userInfo.value) {
		userInfo.value = getUserInfo()
	}

	isLoading.value = true;
	try {
		const statusValue = statusMap.value[currentTab.value];
		// 当 statusValue 为空字符串时表示查询全部，不传 status 参数
		const status = statusValue === '' ? undefined : statusValue;

		const res = await getMyOrders(userInfo.value.role, status);
		if (res.code === 200) {
			orders.value = res.data || [];
		}
	} catch (e) {
		console.error('加载订单失败', e);
		uni.showToast({ title: '加载失败', icon: 'none' });
	} finally {
		isLoading.value = false;
		isRefreshing.value = false;
	}
}

// 切换Tab
const switchTab = (index) => {
	if (currentTab.value !== index) {
		currentTab.value = index;
		loadOrders();
	}
}

// 下拉刷新
const onRefresh = () => {
	isRefreshing.value = true;
	loadOrders();
}

onShow(() => {
	loadOrders();
})

const goToDetail = (order) => {
	uni.navigateTo({
		url: `/pages/user/order-detail?id=${order.id}`
	});
}

const handleCancelOrder = (order) => {
	uni.showModal({
		title: '取消订单',
		content: '确定要取消该订单吗？',
		success: async (res) => {
			if (res.confirm) {
				try {
					const result = await cancelOrderApi(order.id);
					if (result.code === 200) {
						uni.showToast({ title: '已取消', icon: 'success' });
						loadOrders();
					}
				} catch (e) {
					console.error('取消订单失败', e);
					uni.showToast({ title: '取消失败', icon: 'none' });
				}
			}
		}
	});
}

const handleConfirmReceipt = async (order) => {
	uni.showModal({
		title: '确认送达',
		content: '确认快递已送达并支付报酬吗？',
		success: async (res) => {
			if (res.confirm) {
				uni.showLoading({ title: '处理中...' });
				try {
					const result = await confirmReceiptApi(order.id);
					if (result.code === 200) {
						uni.showToast({ title: '确认成功', icon: 'success' });
						loadOrders();
					}
				} catch (e) {
					console.error('确认收货失败', e);
					uni.showToast({ title: '确认失败', icon: 'none' });
				} finally {
					uni.hideLoading();
				}
			}
		}
	});
}

// 代取员上报取件完成
const reportPicked = (order) => {
	uni.showModal({
		title: '取件完成上报',
		content: '确认已取到快递并准备配送吗？',
		success: async (res) => {
			if (res.confirm) {
				uni.showLoading({ title: '提交中...' });
				try {
					const result = await reportProgress(order.id, 'picked', null);
					if (result.code === 200) {
						uni.showToast({ title: '上报成功', icon: 'success' });
						loadOrders();
					}
				} catch (e) {
					console.error('上报失败', e);
					uni.showToast({ title: e.message || '上报失败', icon: 'none' });
				} finally {
					uni.hideLoading();
				}
			}
		}
	});
}

// 代取员上报送达完成
const reportDelivered = (order) => {
	uni.showModal({
		title: '送达完成上报',
		content: '确认已将快递送达收件人手中吗？',
		success: async (res) => {
			if (res.confirm) {
				uni.showLoading({ title: '提交中...' });
				try {
					const result = await reportProgress(order.id, 'delivered', null);
					if (result.code === 200) {
						uni.showToast({ title: '上报成功', icon: 'success' });
						loadOrders();
					}
				} catch (e) {
					console.error('上报失败', e);
					uni.showToast({ title: e.message || '上报失败', icon: 'none' });
				} finally {
					uni.hideLoading();
				}
			}
		}
	});
}

const evaluateOrder = (order) => {
	uni.navigateTo({
		url: `/pages/user/evaluate?id=${order.id}`
	});
}

// 根据状态值返回对应的样式类名
const getStatusClass = (status) => {
	const classMap = {
		0: 'pending',
		1: 'accepted',
		2: 'shipping',
		3: 'delivered',
		4: 'completed',
		5: 'completed',
		6: 'cancelled',
		7: 'disputed'
	}
	return classMap[status] || 'pending'
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

.status-text {
	font-size: 24rpx;
	padding: 4rpx 12rpx;
	border-radius: 4rpx;
}

.status.pending,
.status-text.pending {
	color: #faad14;
}

.status.accepted,
.status-text.accepted {
	color: #1890ff;
}

.status.shipping,
.status-text.shipping {
	color: #52c41a;
}

.status.delivered,
.status-text.delivered {
	color: #722ed1;
}

.status.completed,
.status-text.completed {
	color: #52c41a;
}

.status.cancelled,
.status-text.cancelled {
	color: #ff4d4f;
}

.status.disputed,
.status-text.disputed {
	color: #fa8c16;
}

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

.action-btn.progress {
	background-color: #667eea;
	color: #fff;
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 200rpx;
}

.empty-icon {
	font-size: 100rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.loading-more {
	text-align: center;
	padding: 30rpx;
	color: #999;
	font-size: 24rpx;
}
</style>
