<template>
	<view class="container">
		<view class="header">
			<image class="avatar" :src="userInfo.avatar || '/static/logo.png'" mode="aspectFill" @click="changeAvatar">
			</image>
			<view class="user-info">
				<view class="nickname-row">
					<view class="nickname">{{ userInfo.phone || '普通用户 / 代取人' }}</view>
					<!-- 已认证标识 -->
					<view class="verify-badge" v-if="userInfo.verifyStatus === 2">
						<text class="badge-text">已认证</text>
					</view>
				</view>
			</view>
			<!-- 系统消息入口 -->
			<view class="message-icon" @click="navigateTo('/pages/my/messages')">
				<text class="icon">🔔</text>
				<view class="badge" v-if="unreadCount > 0">{{ unreadCount > 99 ? '99+' : unreadCount }}</view>
			</view>
		</view>

		<view class="stats-card" :class="{ 'only-child': userInfo.role !== 1 }">
			<!-- 订单统计 - 所有人都显示 -->
			<view class="stat-item" @click="navigateTo('/pages/user/orders')">
				<view class="num">{{ orderCount || 0 }}</view>
				<view class="label">我的订单</view>
			</view>
			<!-- 收益统计 - 只有代取员显示 -->
			<view class="stat-item" v-if="userInfo.role === 1" @click="navigateTo('/pages/pickup/earnings')">
				<view class="num">￥{{ earnings || '0.00' }}</view>
				<view class="label">我的收益</view>
			</view>
			<!-- 评价得分 - 所有人都显示 -->
			<view class="stat-item">
				<view class="num">{{ userInfo.rating || '5.0' }}</view>
				<view class="label">评价得分</view>
			</view>
		</view>

		<view class="menu-list">
			<view class="menu-item" @click="navigateTo('/pages/user/orders')">
				<text class="icon">📋</text>
				<text class="text">订单管理</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="navigateTo('/pages/pickup/hall')" v-if="userInfo.role === 1">
				<text class="icon">🏢</text>
				<text class="text">接单大厅</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="navigateTo('/pages/pickup/earnings')" v-if="userInfo.role === 1">
				<text class="icon">💰</text>
				<text class="text">收益明细</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="navigateTo('/pages/user/verify')">
				<text class="icon">🛡️</text>
				<text class="text">身份认证</text>
				<view class="status-tag" :class="getVerifyStatusClass(userInfo.verifyStatus)">
					{{ getVerifyStatusText(userInfo.verifyStatus) }}
				</view>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="goDispute">
				<text class="icon">⚖️</text>
				<text class="text">纠纷记录</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item">
				<text class="icon">🛠️</text>
				<text class="text">设置</text>
				<text class="arrow">></text>
			</view>
		</view>

		<button class="logout-btn" @click="handleLogout" v-if="isLoggedIn">退出登录</button>
		<button class="login-btn" @click="goLogin" v-else>去登录</button>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { isLoggedIn as checkIsLoggedIn, getUserInfo, clearAuth, setUserInfo } from '@/utils/storage.js'
import { logout, uploadAvatar, getMyOrders, getMyDisputes } from '@/utils/api.js'

const userInfo = ref({})
const isLoggedIn = ref(false)
const unreadCount = ref(0)
const orderCount = ref(0)
const earnings = ref('0.00')

onShow(() => {
	checkLoginStatus()
	loadUserData()
})

const checkLoginStatus = () => {
	isLoggedIn.value = checkIsLoggedIn()
	if (isLoggedIn.value) {
		userInfo.value = getUserInfo() || {}
	} else {
		userInfo.value = {}
	}
}

const loadUserData = async () => {
	if (!isLoggedIn.value) return
	try {
		// 获取待处理纠纷数作为未读数
		const disputeRes = await getMyDisputes(1, 100)
		if (disputeRes.code === 200) {
			const list = disputeRes.data.records || disputeRes.data || []
			unreadCount.value = list.filter(i => i.status === 0).length
		}
		// 获取订单数量
		const orderRes = await getMyOrders(userInfo.value.role, undefined)
		if (orderRes.code === 200) {
			orderCount.value = orderRes.data.total || 0
		}
	} catch (e) {
		console.error('加载用户数据失败', e)
	}
}

// 获取认证状态文本
const getVerifyStatusText = (status) => {
	switch (status) {
		case 0: return '未认证'
		case 1: return '审核中'
		case 2: return '已认证'
		case 3: return '已驳回'
		default: return '未认证'
	}
}

// 获取认证状态样式类
const getVerifyStatusClass = (status) => {
	switch (status) {
		case 2: return 'status-pass'
		case 1: return 'status-pending'
		case 3: return 'status-reject'
		default: return 'status-none'
	}
}

const handleLogout = () => {
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: async (res) => {
			if (res.confirm) {
				try {
					await logout()
				} catch (error) {
					console.error('退出登录接口调用失败:', error)
				}
				clearAuth()
				checkLoginStatus()
				uni.showToast({ title: '已退出登录', icon: 'success' })
			}
		}
	})
}

const goLogin = () => {
	uni.showModal({
		title: '提示',
		content: '请先登录',
		success: (res) => {
			if (res.confirm) {
				uni.navigateTo({ url: '/pages/login/login' })
			}
		}
	})

}
const goDispute = () => {
	if (!isLoggedIn.value) {
		goLogin()
	}
	uni.navigateTo({ url: '/pages/my/dispute/index' })
}
const navigateTo = (url) => {
	const needLoginPages = ['/pages/user/orders', '/pages/pickup/earnings']
	if (needLoginPages.includes(url) && !isLoggedIn.value) {
		uni.showModal({
			title: '提示',
			content: '请先登录',
			success: (res) => {
				if (res.confirm) {
					goLogin()
				}
			}
		})
		return
	}

	if (url.includes('hall') || url.includes('orders') || url.includes('profile') || url.includes('index')) {
		uni.switchTab({ url });
	} else {
		uni.navigateTo({ url });
	}
}

// 点击头像：选择图片并上传
const changeAvatar = () => {
	if (!isLoggedIn.value) {
		uni.showModal({
			title: '提示',
			content: '请先登录后再修改头像',
			success: (res) => {
				if (res.confirm) goLogin()
			}
		})
		return
	}

	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: async (res) => {
			const tempFilePath = res.tempFilePaths[0]
			uni.showLoading({ title: '上传中...' })
			try {
				const result = await uploadAvatar(tempFilePath)
				uni.hideLoading()
				if (result.code === 200) {
					// 更新本地显示
					userInfo.value.avatar = result.data.avatar || result.data.avatarUrl
					// 同步更新本地存储
					const stored = getUserInfo() || {}
					stored.avatar = result.data.avatar || result.data.avatarUrl
					setUserInfo(stored)
					uni.showToast({ title: '头像已更新', icon: 'success' })
				} else {
					uni.showToast({ title: result.message || '上传失败', icon: 'none' })
				}
			} catch (error) {
				uni.hideLoading()
				console.error('上传头像失败:', error)
				uni.showToast({ title: '上传头像失败', icon: 'none' })
			}
		},
		fail: () => {
			// 用户取消选择不提示
		}
	})
}
</script>

<style scoped>
.container {
	padding: 30rpx;
	background-color: #f8f8f8;
	min-height: 100vh;
}

.header {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
	padding: 20rpx 0;
	position: relative;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	background-color: #fff;
	margin-right: 30rpx;
	border: 4rpx solid #fff;
}

.user-info {
	flex: 1;
}

.nickname-row {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.verify-badge {
	background: linear-gradient(135deg, #52c41a, #73d13d);
	color: #fff;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
	font-size: 20rpx;
	font-weight: bold;
}

.badge-text {
	font-size: 20rpx;
}

.nickname {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.uid {
	font-size: 24rpx;
	color: #999;
	margin-top: 10rpx;
}

.message-icon {
	position: relative;
	padding: 10rpx;
}

.icon {
	font-size: 44rpx;
}

.badge {
	position: absolute;
	top: 0;
	right: 0;
	background-color: #ff4d4f;
	color: #fff;
	font-size: 18rpx;
	min-width: 32rpx;
	height: 32rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 6rpx;
}

.stats-card {
	background-color: #fff;
	border-radius: 16rpx;
	display: flex;
	padding: 30rpx 0;
	margin-bottom: 40rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
}

.stats-card.only-child {
	justify-content: center;
}

.stat-item {
	flex: 1;
	text-align: center;
	border-right: 1rpx solid #f0f0f0;
}

.stats-card.only-child .stat-item {
	flex: none;
	width: 50%;
}

.stat-item:last-child {
	border-right: none;
}

.num {
	font-size: 32rpx;
	font-weight: bold;
	color: #007AFF;
	margin-bottom: 10rpx;
}

.label {
	font-size: 22rpx;
	color: #666;
}

.menu-list {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 0 30rpx;
	margin-bottom: 40rpx;
}

.menu-item {
	display: flex;
	align-items: center;
	height: 100rpx;
	border-bottom: 1rpx solid #f0f0f0;
	position: relative;
}

.menu-item:last-child {
	border-bottom: none;
}

.icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.text {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.arrow {
	color: #ccc;
	font-size: 24rpx;
}

.status-tag {
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
	font-size: 20rpx;
	margin-right: 20rpx;
}

.status-pass {
	background-color: #f6ffed;
	color: #52c41a;
}

.status-pending {
	background-color: #fffbe6;
	color: #faad14;
}

.status-reject {
	background-color: #fff1f0;
	color: #ff4d4f;
}

.status-none {
	background-color: #f5f5f5;
	color: #999;
}

.badge-dot {
	width: 12rpx;
	height: 12rpx;
	background-color: #ff4d4f;
	border-radius: 50%;
	margin-right: 20rpx;
}

.logout-btn,
.login-btn {
	margin-top: 60rpx;
	background-color: #fff;
	color: #ff4d4f;
	border: none;
}

.login-btn {
	color: #007AFF;
}
</style>
