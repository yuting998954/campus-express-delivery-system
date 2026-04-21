<template>
	<view class="container">
		<view class="header-bg">
			<view class="user-info">
				<view class="avatar-box">
					<image :src="userInfo && userInfo.avatar ? userInfo.avatar : '/static/logo.png'" mode="aspectFill"
						class="avatar"></image>
				</view>
				<view class="info-box">
					<text class="greeting">Hi, {{ (userInfo && userInfo.nickname) ? userInfo.nickname : '同学' }}</text>
					<text class="sub-text">欢迎使用校园代取预约服务</text>
				</view>
			</view>
		</view>

		<view class="main-card">
			<view class="card-header">
				<text class="card-title">核心服务</text>
			</view>

			<view class="action-area">
				<view class="action-btn publish-btn" @click="goPublish">
					<view class="icon-circle">
						<text class="iconfont">📤</text>
					</view>
					<text class="btn-title">发布代取</text>
					<text class="btn-desc">我是雇主</text>
				</view>

				<view class="action-btn pickup-btn" @click="goPickup">
					<view class="icon-circle">
						<text class="iconfont">🛵</text>
					</view>
					<text class="btn-title">接单大厅</text>
					<text class="btn-desc">我是骑手</text>
				</view>
			</view>
		</view>

		<view class="grid-card">
			<view class="card-header">
				<text class="card-title">常用功能</text>
			</view>
			<view class="grid-box">
				<view class="grid-item" @click="goOrders">
					<text class="grid-icon">📦</text>
					<text class="grid-text">{{ !userInfo || userInfo.role === 0 ? '我的订单' : '我的承接' }}</text>
				</view>
				<view class="grid-item" @click="goEarnings">
					<text class="grid-icon">💰</text>
					<text class="grid-text">收益明细</text>
				</view>
				<view class="grid-item" @click="goAddress">
					<text class="grid-icon">📍</text>
					<text class="grid-text">地址管理</text>
				</view>
				<view class="grid-item" @click="goHelp">
					<text class="grid-icon">❓</text>
					<text class="grid-text">帮助中心</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getUserInfo } from '@/utils/storage.js'

const userInfo = ref({})

onShow(() => {
	loadUserInfo()
})

const loadUserInfo = () => {
	const info = getUserInfo()
	if (info) {
		userInfo.value = info
	} else {
		userInfo.value = null
	}
}

const goLogin = () => {
	uni.navigateTo({ url: '/pages/login/login' })
}

const goPublish = () => {
	if (!userInfo.value) {
		uni.showToast({ title: '请先登录', icon: 'none', duration: 1500 })
		goLogin()
		return
	}
	if (userInfo.value.role !== 0) {
		uni.showToast({ title: '请使用普通用户账号登录', icon: 'none' })
		return
	}
	uni.navigateTo({ url: '/pages/publish/index' })
}

const goPickup = () => {
	if (!userInfo.value) {
		uni.showToast({ title: '请先登录', icon: 'none' })
		goLogin()
		return
	}
	if (userInfo.value.role !== 1) {
		uni.showToast({ title: '请使用代取员账号登录', icon: 'none' })
		return
	}
	uni.navigateTo({ url: '/pages/pickup/hall' })
}

const goOrders = () => {
	if (!userInfo.value) {
		uni.showToast({ title: '请先登录', icon: 'none' })
		goLogin()
		return
	}
	uni.switchTab({ url: '/pages/user/orders' })
}

const goEarnings = () => {
	if (!userInfo.value) {
		uni.showToast({ title: '请先登录', icon: 'none' })
		goLogin()
		return
	}
	uni.navigateTo({ url: '/pages/pickup/earnings' })
}

const goAddress = () => {
	uni.showToast({ title: '功能开发中', icon: 'none' })
}

const goHelp = () => {
	uni.showToast({ title: '功能开发中', icon: 'none' })
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #f5f7fa;
	padding-bottom: 50rpx;
}

.header-bg {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 100rpx 40rpx 120rpx;
	border-bottom-left-radius: 50rpx;
	border-bottom-right-radius: 50rpx;
}

.user-info {
	display: flex;
	align-items: center;
}

.avatar-box {
	margin-right: 30rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(255, 255, 255, 0.5);
}

.info-box {
	display: flex;
	flex-direction: column;
}

.greeting {
	font-size: 40rpx;
	font-weight: bold;
	color: #fff;
	margin-bottom: 10rpx;
}

.sub-text {
	color: rgba(255, 255, 255, 0.8);
	font-size: 28rpx;
}

.main-card {
	margin: -80rpx 30rpx 30rpx;
	background: #fff;
	border-radius: 30rpx;
	padding: 40rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);
}

.card-header {
	margin-bottom: 30rpx;
	border-left: 8rpx solid #667eea;
	padding-left: 20rpx;
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.action-area {
	display: flex;
	justify-content: space-between;
	gap: 20rpx;
}

.action-btn {
	width: 48%;
	height: 240rpx;
	border-radius: 25rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
	transition: all 0.3s;
}

.publish-btn {
	background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
}

.pickup-btn {
	background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
}

.action-btn:active {
	transform: scale(0.98);
}

.icon-circle {
	width: 80rpx;
	height: 80rpx;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
	box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
}

.iconfont {
	font-size: 40rpx;
}

.btn-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 6rpx;
}

.btn-desc {
	font-size: 22rpx;
	color: #666;
}

.grid-card {
	margin: 0 30rpx;
	background: #fff;
	border-radius: 30rpx;
	padding: 40rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);
}

.grid-box {
	display: flex;
	flex-wrap: wrap;
}

.grid-item {
	width: 25%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20rpx;
}

.grid-icon {
	font-size: 50rpx;
	margin-bottom: 15rpx;
}

.grid-text {
	font-size: 26rpx;
	color: #666;
}
</style>
