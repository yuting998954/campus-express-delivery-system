<template>
	<view class="container">
		<view class="header">
			<image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
			<view class="user-info">
				<view class="nickname">{{ userInfo.phone || '普通用户 / 代取人' }}</view>
				<view class="uid">ID: {{ userInfo.id || '未登录' }}</view>
			</view>
		</view>

		<view class="stats-card">
			<view class="stat-item" @click="navigateTo('/pages/user/orders')">
				<view class="num">12</view>
				<view class="label">我的订单</view>
			</view>
			<view class="stat-item" @click="navigateTo('/pages/pickup/earnings')">
				<view class="num">￥128.5</view>
				<view class="label">我的收益</view>
			</view>
			<view class="stat-item">
				<view class="num">4.9</view>
				<view class="label">评价得分</view>
			</view>
		</view>

		<view class="menu-list">
			<view class="menu-item" @click="navigateTo('/pages/user/orders')">
				<text class="icon">📋</text>
				<text class="text">订单管理</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="navigateTo('/pages/pickup/hall')">
				<text class="icon">🏢</text>
				<text class="text">接单大厅</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="navigateTo('/pages/pickup/earnings')">
				<text class="icon">💰</text>
				<text class="text">收益明细</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @click="navigateTo('/pages/user/verify')">
				<text class="icon">🛡️</text>
				<text class="text">身份认证</text>
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

<script>
import { isLoggedIn, getUserInfo, clearAuth } from '@/utils/storage.js'
import { logout } from '@/utils/api.js'

export default {
	data() {
		return {
			userInfo: {},
			isLoggedIn: false
		}
	},
	onLoad() {
		this.checkLoginStatus()
	},
	onShow() {
		// 每次显示页面时检查登录状态
		this.checkLoginStatus()
	},
	methods: {
		checkLoginStatus() {
			this.isLoggedIn = isLoggedIn()
			if (this.isLoggedIn) {
				this.userInfo = getUserInfo() || {}
			} else {
				this.userInfo = {}
			}
		},
		async handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							// 调用退出登录接口
							await logout()
						} catch (error) {
							console.error('退出登录接口调用失败:', error)
						}
						// 清除本地存储
						clearAuth()
						this.checkLoginStatus()
						uni.showToast({ title: '已退出登录', icon: 'success' })
					}
				}
			})
		},
		goLogin() {
			uni.navigateTo({ url: '/pages/login/login' })
		},
		navigateTo(url) {
			// 某些页面需要登录才能访问
			const needLoginPages = ['/pages/user/orders', '/pages/pickup/earnings']
			if (needLoginPages.includes(url) && !this.isLoggedIn) {
				uni.showModal({
					title: '提示',
					content: '请先登录',
					success: (res) => {
						if (res.confirm) {
							this.goToLogin()
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
	}
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
}
.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	background-color: #fff;
	margin-right: 30rpx;
	border: 4rpx solid #fff;
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
.stats-card {
	background-color: #fff;
	border-radius: 16rpx;
	display: flex;
	padding: 30rpx 0;
	margin-bottom: 40rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.03);
}
.stat-item {
	flex: 1;
	text-align: center;
	border-right: 1rpx solid #f0f0f0;
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
