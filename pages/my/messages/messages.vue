<template>
	<view class="container">
		<!-- 顶部操作栏 -->
		<view class="header-bar" v-if="messageList.length > 0">
			<text class="mark-read" @click="markAllRead">全部标为已读</text>
		</view>

		<!-- 消息列表 -->
		<scroll-view scroll-y class="message-list" @scrolltolower="loadMore">
			<view v-for="msg in messageList" :key="msg.id" class="message-card" :class="{ unread: !msg.isRead }"
				@click="goToDetail(msg)">
				<view class="message-header">
					<view class="message-type">
						<text class="type-icon">{{ getTypeIcon(msg.type) }}</text>
						<text class="type-text">{{ getTypeText(msg.type) }}</text>
					</view>
					<text class="message-time">{{ formatTime(msg.createTime) }}</text>
				</view>
				<view class="message-title">{{ msg.title }}</view>
				<view class="message-content">{{ msg.content }}</view>
				<view class="unread-dot" v-if="!msg.isRead"></view>
			</view>

			<!-- 加载状态 -->
			<view class="loading-more" v-if="messageList.length > 0">
				<text v-if="loading">加载中...</text>
				<text v-else-if="noMore">没有更多了</text>
			</view>

			<!-- 空状态 -->
			<view class="empty-state" v-if="!loading && messageList.length === 0">
				<text class="empty-icon">📭</text>
				<text class="empty-text">暂无系统消息</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { getMessageList, markMessageRead, markAllMessagesRead } from '@/utils/api.js'
import { isLoggedIn } from '@/utils/storage.js'

const messageList = ref([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 20

onShow(() => {
	if (isLoggedIn()) {
		refreshMessages()
	}
})

const refreshMessages = async () => {
	page.value = 1
	noMore.value = false
	loading.value = true
	try {
		const res = await getMessageList(1, pageSize)
		if (res.code === 200) {
			messageList.value = res.data.records || res.data || []
		}
	} catch (e) {
		console.error('获取消息列表失败', e)
	} finally {
		loading.value = false
	}
}

const loadMore = async () => {
	if (loading.value || noMore.value) return
	loading.value = true
	page.value++
	try {
		const res = await getMessageList(page.value, pageSize)
		if (res.code === 200) {
			const newList = res.data.records || res.data || []
			if (newList.length === 0) {
				noMore.value = true
			} else {
				messageList.value = [...messageList.value, ...newList]
			}
		}
	} catch (e) {
		console.error('加载更多消息失败', e)
		page.value--
	} finally {
		loading.value = false
	}
}

const markAllRead = async () => {
	try {
		await markAllMessagesRead()
		messageList.value.forEach(msg => {
			msg.isRead = true
		})
		uni.showToast({ title: '已全部标为已读', icon: 'success' })
	} catch (e) {
		console.error('标记已读失败', e)
	}
}

const goToDetail = async (msg) => {
	// 标记已读
	if (!msg.isRead) {
		try {
			await markMessageRead(msg.id)
			msg.isRead = true
		} catch (e) {
			console.error('标记已读失败', e)
		}
	}

	// 根据消息类型跳转
	if (msg.type === 'verify_reject' || msg.type === 'verify_pass') {
		// 认证相关消息，跳转到认证页面
		uni.navigateTo({ url: '/pages/user/verify' })
	} else if (msg.type === 'order') {
		// 订单相关消息，跳转到订单详情
		if (msg.orderId) {
			uni.navigateTo({ url: `/pages/user/order-detail?id=${msg.orderId}` })
		}
	}
}

const getTypeIcon = (type) => {
	switch (type) {
		case 'verify_reject': return '❌'
		case 'verify_pass': return '✅'
		case 'order': return '📦'
		case 'system': return '📢'
		default: return '📋'
	}
}

const getTypeText = (type) => {
	switch (type) {
		case 'verify_reject': return '认证驳回'
		case 'verify_pass': return '认证通过'
		case 'order': return '订单通知'
		case 'system': return '系统消息'
		default: return '通知'
	}
}

const formatTime = (time) => {
	if (!time) return ''
	const date = new Date(time)
	const now = new Date()
	const diff = now - date
	const days = Math.floor(diff / (1000 * 60 * 60 * 24))

	if (days === 0) {
		return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
	} else if (days === 1) {
		return '昨天'
	} else if (days < 7) {
		return `${days}天前`
	} else {
		return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
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

.header-bar {
	display: flex;
	justify-content: flex-end;
	padding: 20rpx 30rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #f0f0f0;
}

.mark-read {
	font-size: 26rpx;
	color: #667eea;
}

.message-list {
	flex: 1;
	padding: 20rpx 30rpx;
}

.message-card {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
	position: relative;
}

.message-card.unread {
	border-left: 6rpx solid #667eea;
}

.message-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.message-type {
	display: flex;
	align-items: center;
	gap: 10rpx;
}

.type-icon {
	font-size: 32rpx;
}

.type-text {
	font-size: 24rpx;
	color: #667eea;
	font-weight: bold;
}

.message-time {
	font-size: 22rpx;
	color: #999;
}

.message-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 12rpx;
}

.message-content {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.unread-dot {
	position: absolute;
	top: 30rpx;
	right: 30rpx;
	width: 16rpx;
	height: 16rpx;
	background-color: #ff4d4f;
	border-radius: 50%;
}

.loading-more {
	text-align: center;
	padding: 30rpx;
	color: #999;
	font-size: 24rpx;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 200rpx;
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
