<template>
	<view class="container">
		<view class="card">
			<view class="form-group">
				<view class="title">
					<text class="icon">📦</text>
					<text>快递单号/取件码</text>
				</view>
				<input class="input" type="text" v-model="formData.pickupCode" placeholder="请输入快递单号或取件码"
					placeholder-class="placeholder" />
			</view>

			<view class="form-group">
				<view class="title">
					<text class="icon">🔢</text>
					<text>包裹数量</text>
				</view>
				<input class="input" type="number" v-model="formData.quantity" placeholder="请输入包裹数量"
					placeholder-class="placeholder" />
			</view>

			<view class="form-group">
				<view class="title">
					<text class="icon">⚖️</text>
					<text>包裹属性</text>
				</view>
				<view class="tags-container">
					<view class="tag-item" v-for="item in weightOptions" :key="item.value"
						:class="{ active: formData.weightType === item.value }"
						@click="formData.weightType = item.value">
						{{ item.label }}
					</view>
				</view>
			</view>
		</view>

		<view class="card">
			<view class="form-group">
				<view class="title">
					<text class="icon">📍</text>
					<text>收件地址</text>
				</view>
				<input class="input" type="text" v-model="formData.address" placeholder="请输入宿舍号/送达地点"
					placeholder-class="placeholder" />
			</view>

			<view class="form-group">
				<view class="title">
					<text class="icon">⏰</text>
					<text>期望送达时间</text>
				</view>
				<picker mode="multiSelector" :range="timeRange" @change="timeChange" @columnchange="timeColumnChange">
					<view class="picker-value" :class="{ 'has-value': formData.expectedTime }">
						{{ formData.expectedTime || '请选择送达时间' }}
						<text class="arrow">></text>
					</view>
				</picker>
			</view>
		</view>

		<view class="card">
			<view class="form-group">
				<view class="title">
					<text class="icon">💰</text>
					<text>代取报酬</text>
				</view>
				<view class="reward-input-container">
					<text class="currency">¥</text>
					<input class="input reward-input" type="digit" v-model="formData.reward" placeholder="0.00" />
					<view class="tip">推荐 3-5 元</view>
				</view>
			</view>

			<view class="form-group">
				<view class="title-row">
					<view class="title">
						<text class="icon">🚀</text>
						<text>加急服务</text>
					</view>
					<switch :checked="formData.urgent" color="#667eea" @change="urgentChange"
						style="transform:scale(0.8)" />
				</view>
				<view class="urgent-info" v-if="formData.urgent">
					<text class="urgent-price">+ ¥5.00</text>
					<text class="urgent-desc">优先派送，极速送达</text>
				</view>
			</view>

			<view class="form-group no-border">
				<view class="title">
					<text class="icon">📝</text>
					<text>备注信息</text>
				</view>
				<textarea class="textarea" v-model="formData.notes" placeholder="如有特殊要求请在此填写..."
					placeholder-class="placeholder" />
			</view>
		</view>

		<view class="footer-spacer"></view>
		<view class="footer-bar">
			<view class="price-info">
				<text class="label">预估费用:</text>
				<text class="price">¥{{ calculateTotal }}</text>
			</view>
			<button class="submit-btn" hover-class="submit-btn-hover" @tap="submitOrder">立即发布</button>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { publishTask } from '@/utils/api';
import { getUserInfo } from '@/utils/storage.js';

const formData = reactive({
	pickupCode: '',
	quantity: 1,
	weightType: 'light',
	address: '',
	expectedTime: '',
	reward: '',
	urgent: 0,//是否加急：0-不加急，1-加急
	notes: ''
})

const weightOptions = [
	{ label: '轻件 (<1kg)', value: 'light' },
	{ label: '中件 (1-3kg)', value: 'medium' },
	{ label: '重件 (>3kg)', value: 'heavy' }
]

const timeRange = ref([[], []])

const calculateTotal = computed(() => {
	let total = parseFloat(formData.reward) || 0;
	if (formData.urgent) {
		total += 5;
	}
	return total.toFixed(2);
})

onMounted(() => {
	initTimeRange();
})

const initTimeRange = () => {
	const dates = ['今天', '明天', '后天'];
	const hours = [];
	for (let i = 8; i <= 22; i++) {
		hours.push(i + ':00');
	}
	timeRange.value = [dates, hours];
}

const timeChange = (e) => {
	const indices = e.detail.value;
	formData.expectedTime = `${timeRange.value[0][indices[0]]} ${timeRange.value[1][indices[1]]}`;
}

const timeColumnChange = (e) => {
	// Handle column changes if needed
}

const urgentChange = (e) => {
	formData.urgent = Number(e.detail.value);
}

const submitOrder = async () => {
	// 检查认证状态（只有代取员需要认证）
	const userInfo = getUserInfo()
	if (userInfo && userInfo.role === 1 && userInfo.verifyStatus !== 2) {
		uni.showModal({
			title: '提示',
			content: '您还未通过身份认证，无法发布任务。请先完成身份认证。',
			confirmText: '去认证',
			success: (res) => {
				if (res.confirm) {
					uni.navigateTo({ url: '/pages/user/verify' })
				}
			}
		})
		return
	}

	if (!formData.pickupCode || !formData.address || !formData.reward) {
		uni.showToast({ title: '请填写完整信息', icon: 'none' });
		return;
	}
	uni.showLoading({ title: '提交中...' });

	const res = await publishTask(formData);
	if (res.code == 200) {
		uni.hideLoading();
		uni.showToast({ title: '发布成功', icon: 'success' });
		setTimeout(() => {
			uni.switchTab({ url: '/pages/user/orders' });
		}, 1500);
	} else {
		uni.hideLoading();
		uni.showToast({ title: res.message, icon: 'none' });
	}
}
</script>

<style scoped>
.container {
	padding: 20rpx 20rpx 120rpx;
	background-color: #f5f7fa;
	min-height: 100vh;
}

.card {
	background: #ffffff;
	border-radius: 24rpx;
	padding: 0 30rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
}

.form-group {
	padding: 30rpx 0;
	border-bottom: 2rpx solid #f0f0f0;
}

.form-group.no-border {
	border-bottom: none;
}

.title {
	display: flex;
	align-items: center;
	font-weight: 600;
	font-size: 30rpx;
	color: #333;
	margin-bottom: 20rpx;
}

.title-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.icon {
	margin-right: 12rpx;
	font-size: 34rpx;
}

.input {
	height: 80rpx;
	font-size: 30rpx;
	color: #333;
	width: 100%;
}

.placeholder {
	color: #c0c4cc;
	font-size: 28rpx;
}

.tags-container {
	display: flex;
	gap: 20rpx;
}

.tag-item {
	padding: 12rpx 30rpx;
	background: #f5f7fa;
	border-radius: 30rpx;
	font-size: 26rpx;
	color: #666;
	border: 2rpx solid transparent;
	transition: all 0.3s;
}

.tag-item.active {
	background: #eef2ff;
	color: #667eea;
	border-color: #667eea;
	font-weight: bold;
}

.picker-value {
	height: 80rpx;
	line-height: 80rpx;
	font-size: 30rpx;
	color: #c0c4cc;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.picker-value.has-value {
	color: #333;
}

.arrow {
	color: #c0c4cc;
	font-family: monospace;
}

.reward-input-container {
	display: flex;
	align-items: center;
	background: #f9fafe;
	border-radius: 12rpx;
	padding: 0 20rpx;
	height: 90rpx;
}

.currency {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-right: 10rpx;
}

.reward-input {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.tip {
	font-size: 24rpx;
	color: #999;
	white-space: nowrap;
}

.urgent-info {
	display: flex;
	flex-direction: column;
	background: #fff0f0;
	padding: 15rpx 20rpx;
	border-radius: 12rpx;
	margin-top: 10rpx;
}

.urgent-price {
	color: #ff4d4f;
	font-weight: bold;
	font-size: 28rpx;
}

.urgent-desc {
	color: #ff7875;
	font-size: 22rpx;
}

.textarea {
	width: 100%;
	height: 160rpx;
	background: #f9fafe;
	border-radius: 12rpx;
	padding: 20rpx;
	box-sizing: border-box;
	font-size: 28rpx;
}

.footer-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background: #fff;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
	z-index: 100;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.price-info {
	display: flex;
	align-items: baseline;
}

.label {
	font-size: 28rpx;
	color: #666;
	margin-right: 10rpx;
}

.price {
	font-size: 44rpx;
	font-weight: bold;
	color: #ff4d4f;
}

.submit-btn {
	margin: 0;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-radius: 50rpx;
	padding: 0 60rpx;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 30rpx;
	font-weight: bold;
	box-shadow: 0 8rpx 20rpx rgba(102, 126, 234, 0.3);
}

.submit-btn-hover {
	opacity: 0.9;
	transform: translateY(2rpx);
}
</style>
