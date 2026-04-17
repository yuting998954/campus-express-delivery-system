<template>
	<view class="page">
		<!-- 顶部标题 -->
		<!-- <view class="page-header">
			<text class="page-title">纠纷记录</text>
			<text class="page-sub">申诉处理结果查询</text>
		</view> -->

		<!-- 筛选标签 -->
		<view class="filter-tabs">
			<view class="tab" :class="{ active: filter === 'all' }" @click="setFilter('all')">
				<text>全部</text>
			</view>
			<view class="tab" :class="{ active: filter === 'pending' }" @click="setFilter('pending')">
				<text>待处理</text>
				<view class="tab-dot" v-if="hasPending"></view>
			</view>
			<view class="tab" :class="{ active: filter === 'done' }" @click="setFilter('done')">
				<text>已处理</text>
			</view>
		</view>

		<!-- 纠纷列表 -->
		<scroll-view scroll-y class="list-area" @scrolltolower="loadMore">
			<view v-for="item in displayList" :key="item.disputeId" class="dispute-card"
				:class="item.status === 1 ? 'card-done' : 'card-pending'" @click="goToDetail(item)">

				<!-- 卡片左侧状态条 -->
				<view class="status-bar" :class="item.status === 1 ? 'bar-done' : 'bar-pending'"></view>

				<!-- 卡片主体 -->
				<view class="card-body">
					<view class="card-top">
						<view class="order-info">
							<text class="order-label">订单</text>
							<text class="order-no">{{ item.orderNo || 'ORD' + item.orderId }}</text>
						</view>
						<view class="status-badge" :class="item.status === 1 ? 'badge-done' : 'badge-pending'">
							<text>{{ item.status === 1 ? '已处理' : '待处理' }}</text>
						</view>
					</view>

					<view class="card-middle">
						<view class="info-line" v-if="item.disputeTypeLabel">
							<text class="line-label">纠纷类型</text>
							<text class="line-value">{{ item.disputeTypeLabel }}</text>
						</view>
						<view class="info-line">
							<text class="line-label">判定结果</text>
							<text class="line-value result" :class="item.status === 1 ? 'has-result' : 'no-result'">
								{{ item.responsiblePartyLabel || '等待仲裁' }}
							</text>
						</view>
						<view class="info-line" v-if="item.status == 1">
							<text class="line-label">判定理由</text>
							<text class="line-value result has-result">
								{{ item.result || '' }}
							</text>
						</view>
					</view>

					<view class="card-bottom">
						<text class="time-text">{{ item.status === 1 ? (item.updateTime || item.handleTime) :
							item.createTime }}</text>
						<view class="action-row">
							<text class="action-text">查看详情</text>
							<text class="action-arrow">›</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载中 -->
			<view class="loading-wrap" v-if="loading">
				<text class="loading-text">加载中...</text>
			</view>

			<!-- 没有更多 -->
			<view class="no-more" v-if="noMore && displayList.length > 0">
				<text>— 已加载全部 —</text>
			</view>

			<!-- 空状态 -->
			<view class="empty-wrap" v-if="!loading && displayList.length === 0">
				<view class="empty-icon-wrap">
					<text class="empty-icon">⚖️</text>
				</view>
				<text class="empty-title">暂无相关记录</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getMyDisputes } from '@/utils/api.js'
import { isLoggedIn } from '@/utils/storage.js'
import { onShow } from '@dcloudio/uni-app'
const allList = ref([])
const loading = ref(false)
const noMore = ref(false)
const pageSize = 10
const filter = ref('all')
const pageNum = ref(1)
const displayList = computed(() => {
	if (filter.value === 'pending') return allList.value.filter(i => i.status === 0)
	if (filter.value === 'done') return allList.value.filter(i => i.status === 1)
	return allList.value
})

const hasPending = computed(() => allList.value.some(i => i.status === 0))

onShow(() => {
	if (isLoggedIn()) {
		refresh()
	}
})

const setFilter = (f) => {
	filter.value = f
}

const refresh = async () => {
	noMore.value = false
	loading.value = true
	allList.value = []
	try {
		const res = await getMyDisputes({ pageNum: pageNum.value, pageSize: pageSize })
		if (res.code === 200) {
			allList.value = res.data.records || res.data || []
			noMore.value = allList.value.length < pageSize
		}
	} catch (e) {
		console.error('获取纠纷记录失败', e)
	} finally {
		loading.value = false
	}
}

const loadMore = async () => {
	if (loading.value || noMore.value) return
	loading.value = true
	pageNum.value++
	try {
		const res = await getMyDisputes(page.value, pageSize)
		if (res.code === 200) {
			const newList = res.data.records || res.data || []
			if (newList.length === 0) {
				noMore.value = true
			} else {
				allList.value = [...allList.value, ...newList]
				noMore.value = newList.length < pageSize
			}
		}
	} catch (e) {
		page.value--
	} finally {
		loading.value = false
	}
}

const goToDetail = (item) => {
	if (item.orderId) {
		uni.navigateTo({ url: `/pages/user/order-detail?id=${item.orderId}` })
	}
}
</script>

<style scoped>
.page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f0f2f5;
}

/* 顶部标题 */
/* .page-header {
	background: linear-gradient(135deg, #4f46e5, #7c3aed);
	padding: 40rpx 40rpx 40rpx;
} */

.page-title {
	display: block;
	font-size: 44rpx;
	font-weight: 700;
	color: #fff;
	letter-spacing: 2rpx;
}

.page-sub {
	display: block;
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.7);
	margin-top: 8rpx;
}

/* 筛选标签 */
.filter-tabs {
	display: flex;
	background-color: #fff;
	padding: 0 40rpx;
	border-bottom: 1rpx solid #eee;
}

.tab {
	position: relative;
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 28rpx 0;
	margin-right: 60rpx;
	font-size: 28rpx;
	color: #888;
	border-bottom: 4rpx solid transparent;
	transition: all 0.2s;
}

.tab.active {
	color: #4f46e5;
	font-weight: 600;
	border-bottom-color: #4f46e5;
}

.tab-dot {
	width: 12rpx;
	height: 12rpx;
	background-color: #f56c6c;
	border-radius: 50%;
}

/* 列表区域 */
.list-area {
	flex: 1;
	padding: 24rpx 30rpx;
}

/* 纠纷卡片 */
.dispute-card {
	display: flex;
	background-color: #fff;
	border-radius: 20rpx;
	margin-bottom: 24rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
	transition: transform 0.15s;
}

.dispute-card:active {
	transform: scale(0.98);
	opacity: 0.9;
}

/* 左侧状态条 */
.status-bar {
	width: 8rpx;
	flex-shrink: 0;
}

.bar-done {
	background: linear-gradient(to bottom, #52c41a, #73d13d);
}

.bar-pending {
	background: linear-gradient(to bottom, #fa8c16, #ffa940);
}

/* 卡片主体 */
.card-body {
	flex: 1;
	padding: 28rpx 28rpx 24rpx;
}

/* 卡片顶部：订单号 + 状态标签 */
.card-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.order-info {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.order-label {
	font-size: 22rpx;
	color: #fff;
	background-color: #4f46e5;
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
	font-weight: 600;
}

.order-no {
	font-size: 28rpx;
	color: #333;
	font-weight: 600;
	letter-spacing: 1rpx;
}

.status-badge {
	font-size: 22rpx;
	padding: 6rpx 16rpx;
	border-radius: 30rpx;
	font-weight: 500;
}

.badge-done {
	background-color: #f6ffed;
	color: #52c41a;
	border: 1rpx solid #b7eb8f;
}

.badge-pending {
	background-color: #fff7e6;
	color: #fa8c16;
	border: 1rpx solid #ffd591;
}

/* 卡片中部：信息行 */
.card-middle {
	background-color: #fafafa;
	border-radius: 12rpx;
	padding: 18rpx 20rpx;
	margin-bottom: 20rpx;
}

.info-line {
	display: flex;
	align-items: center;
	margin-bottom: 12rpx;
}

.info-line:last-child {
	margin-bottom: 0;
}

.line-label {
	font-size: 24rpx;
	color: #999;
	width: 140rpx;
	flex-shrink: 0;
}

.line-value {
	font-size: 26rpx;
	color: #555;
}

.line-value.result.has-result {
	color: #d46b08;
	font-weight: 600;
}

.line-value.result.no-result {
	color: #bfbfbf;
	font-style: italic;
}

/* 卡片底部：时间 + 操作 */
.card-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.time-text {
	font-size: 22rpx;
	color: #bbb;
}

.action-row {
	display: flex;
	align-items: center;
	gap: 4rpx;
}

.action-text {
	font-size: 24rpx;
	color: #4f46e5;
}

.action-arrow {
	font-size: 28rpx;
	color: #4f46e5;
	line-height: 1;
}

/* 加载/无更多 */
.loading-wrap {
	text-align: center;
	padding: 30rpx;
}

.loading-text {
	font-size: 24rpx;
	color: #bbb;
}

.no-more {
	text-align: center;
	padding: 20rpx 0 40rpx;
}

.no-more text {
	font-size: 24rpx;
	color: #ccc;
}

/* 空状态 */
.empty-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 160rpx;
}

.empty-icon-wrap {
	width: 160rpx;
	height: 160rpx;
	background: linear-gradient(135deg, #f0f0ff, #e8e8ff);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 32rpx;
}

.empty-icon {
	font-size: 80rpx;
}

.empty-title {
	font-size: 32rpx;
	color: #444;
	font-weight: 600;
	margin-bottom: 12rpx;
}
</style>
