<template>
	<view class="container">
		<view class="status-header">
			<view class="icon-box">
				<text class="status-icon">✅</text>
			</view>
			<text class="status-text">订单已完成</text>
			<text class="status-desc">感谢您的信任，期待再次为您服务</text>
		</view>

		<view class="card settlement-card">
			<view class="card-title">费用明细</view>
			<view class="amount-box">
				<text class="currency">¥</text>
				<text class="total-amount">{{ orderInfo.totalAmount }}</text>
			</view>
			<view class="detail-list">
				<view class="detail-item">
					<text class="label">基础跑腿费</text>
					<text class="value">¥{{ orderInfo.baseFee }}</text>
				</view>
				<view class="detail-item" v-if="orderInfo.urgentFee > 0">
					<text class="label">加急费</text>
					<text class="value">¥{{ orderInfo.urgentFee }}</text>
				</view>
				<view class="detail-item" v-if="orderInfo.tipFee > 0">
					<text class="label">小费</text>
					<text class="value">¥{{ orderInfo.tipFee }}</text>
				</view>
				<view class="divider"></view>
				<view class="detail-item total-row">
					<text class="label">实付金额</text>
					<text class="value highlight">¥{{ orderInfo.totalAmount }}</text>
				</view>
			</view>
		</view>

		<view class="card runner-card">
			<view class="runner-info">
				<image class="runner-avatar" :src="runnerInfo.avatar" mode="aspectFill"></image>
				<view class="runner-detail">
					<view class="name-row">
						<text class="runner-name">{{ runnerInfo.name }}</text>
						<text class="runner-tag">金牌骑手</text>
					</view>
					<text class="runner-desc">准时送达 · 服务热情</text>
				</view>
				<view class="contact-btn" @click="contactRunner">
					<text class="icon">📞</text>
				</view>
			</view>
		</view>

		<view class="card eval-card">
			<view class="card-title">服务评价</view>
			<view class="rating-box">
				<view class="stars">
					<text
						v-for="i in 5"
						:key="i"
						class="star"
						:class="{ active: i <= rating }"
						@click="setRating(i)"
					>★</text>
				</view>
				<text class="rating-text">{{ ratingText }}</text>
				<text class="credit-tip">好评可提升骑手信誉分</text>
			</view>

			<view class="tags-box">
				<view
					v-for="(tag, index) in availableTags"
					:key="index"
					class="tag"
					:class="{ active: selectedTags.includes(tag) }"
					@click="toggleTag(tag)"
				>
					{{ tag }}
				</view>
			</view>

			<textarea
				class="comment-input"
				v-model="comment"
				placeholder="配送员服务如何？说说您的体验吧..."
				maxlength="200"
			/>

			<view class="anonymous-row" @click="isAnonymous = !isAnonymous">
				<view class="checkbox" :class="{ checked: isAnonymous }">
					<text v-if="isAnonymous">✓</text>
				</view>
				<text class="label">匿名评价</text>
			</view>
		</view>

		<view class="footer-spacer"></view>
		<view class="footer-bar">
			<button class="submit-btn" hover-class="btn-hover" @click="submitEval">提交评价</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getOrderDetail, submitEvaluation, getUserInfo } from '@/utils/api'

const orderInfo = ref({
    orderNo: '',
    baseFee: '0.00',
    urgentFee: '0.00',
    tipFee: '0.00',
    totalAmount: '0.00'
})

const runnerInfo = ref({
    name: '',
    avatar: '/static/logo.png',
    phone: ''
})

const rating = ref(5)
const comment = ref('')
const selectedTags = ref([])
const isAnonymous = ref(false)
const orderId = ref(null)
const evaluatorId = ref(null)
const targetUserId = ref(null)

const availableTags = ['按时送达', '提前送达', '服务态度好', '穿着整洁', '风雨无阻', '餐品完好']

const ratingText = computed(() => {
    const texts = ['非常不满意', '不满意', '一般', '满意', '非常满意'];
    return texts[rating.value - 1] || '';
})

onLoad(async (options) => {
    if (options.id) {
        orderId.value = Number(options.id);
        uni.showLoading({ title: '加载中...' });
        try {
            // 获取订单详情
            const res = await getOrderDetail(orderId.value);
            if (res.code === 200 && res.data) {
                const order = res.data;
                orderInfo.value = {
                    orderNo: order.orderNo,
                    baseFee: order.reward || '0.00',
                    urgentFee: order.urgentFee || '0.00',
                    totalAmount: order.totalReward || '0.00'
                };
                // 设置跑腿人信息
                if (order.runnerId) {
                    targetUserId.value = order.runnerId;
                    runnerInfo.value = {
                        name: order.runnerName || '代取员',
                        avatar: order.runnerAvatar || '/static/logo.png',
                        phone: order.runnerPhone || ''
                    };
                }
                // 获取当前用户信息
                const userRes = await getUserInfo();
                if (userRes.code === 200 && userRes.data) {
                    evaluatorId.value = userRes.data.id;
                }
            }
        } catch (e) {
            console.error('加载订单信息失败', e);
        } finally {
            uni.hideLoading();
        }
    }
})

const setRating = (score) => {
    rating.value = score;
}

const toggleTag = (tag) => {
    const index = selectedTags.value.indexOf(tag);
    if (index > -1) {
        selectedTags.value.splice(index, 1);
    } else {
        selectedTags.value.push(tag);
    }
}

const contactRunner = () => {
    if (runnerInfo.value.phone) {
        uni.makePhoneCall({
            phoneNumber: runnerInfo.value.phone
        });
    }
}

const submitEval = async () => {
    if (rating.value === 0) {
        uni.showToast({ title: '请先打分哦', icon: 'none' });
        return;
    }
    if (!evaluatorId.value || !targetUserId.value) {
        uni.showToast({ title: '数据加载中，请稍后', icon: 'none' });
        return;
    }

    uni.showLoading({ title: '提交中...' });
    try {
        const res = await submitEvaluation({
            orderId: orderId.value,
            evaluatorId: evaluatorId.value,
            targetUserId: targetUserId.value,
            star: rating.value,
            content: comment.value,
            tags: selectedTags.value
        });
        if (res.code === 200) {
            uni.showToast({ title: '评价成功', icon: 'success' });
            setTimeout(() => {
                uni.navigateBack();
            }, 1500);
        }
    } catch (e) {
        console.error('提交评价失败', e);
    } finally {
        uni.hideLoading();
    }
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #f5f7fa;
	padding: 20rpx;
	padding-bottom: 120rpx;
}

.status-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0 60rpx;
}

.icon-box {
	width: 100rpx;
	height: 100rpx;
	background: #52c41a;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
	box-shadow: 0 10rpx 20rpx rgba(82, 196, 26, 0.2);
}

.status-icon {
	font-size: 50rpx;
	color: #fff;
}

.status-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.status-desc {
	font-size: 26rpx;
	color: #999;
}

.card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.02);
}

.card-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	border-left: 6rpx solid #667eea;
	padding-left: 16rpx;
}

.amount-box {
	text-align: center;
	margin-bottom: 40rpx;
}

.currency {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.total-amount {
	font-size: 60rpx;
	font-weight: bold;
	color: #333;
}

.detail-list {
	background: #f9f9f9;
	padding: 20rpx;
	border-radius: 12rpx;
}

.detail-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 16rpx;
	font-size: 26rpx;
	color: #666;
}

.detail-item:last-child {
	margin-bottom: 0;
}

.divider {
	height: 2rpx;
	background: #eee;
	margin: 20rpx 0;
}

.total-row {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.highlight {
	color: #ff4d4f;
	font-size: 32rpx;
}

.runner-info {
	display: flex;
	align-items: center;
}

.runner-avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-right: 24rpx;
	border: 2rpx solid #eee;
}

.runner-detail {
	flex: 1;
}

.name-row {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
}

.runner-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-right: 12rpx;
}

.runner-tag {
	font-size: 20rpx;
	color: #667eea;
	background: #eef2ff;
	padding: 2rpx 10rpx;
	border-radius: 6rpx;
}

.runner-desc {
	font-size: 24rpx;
	color: #999;
}

.contact-btn {
	width: 70rpx;
	height: 70rpx;
	background: #f0f7ff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.contact-btn .icon {
	font-size: 32rpx;
}

.rating-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 30rpx;
}

.stars {
	display: flex;
	gap: 20rpx;
	margin-bottom: 16rpx;
}

.star {
	font-size: 60rpx;
	color: #eee;
	transition: color 0.2s;
}

.star.active {
	color: #ffc107;
}

.rating-text {
	font-size: 28rpx;
	color: #ffc107;
	font-weight: bold;
}

.credit-tip {
	font-size: 22rpx;
	color: #999;
	margin-top: 8rpx;
}

.tags-box {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	margin-bottom: 30rpx;
}

.tag {
	padding: 12rpx 24rpx;
	background: #f5f5f5;
	border-radius: 30rpx;
	font-size: 24rpx;
	color: #666;
	border: 2rpx solid transparent;
	transition: all 0.3s;
}

.tag.active {
	background: #fff7e6;
	color: #fa8c16;
	border-color: #fa8c16;
}

.comment-input {
	width: 100%;
	height: 200rpx;
	background: #f9f9f9;
	border-radius: 12rpx;
	padding: 20rpx;
	box-sizing: border-box;
	font-size: 28rpx;
	margin-bottom: 20rpx;
}

.anonymous-row {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.checkbox {
	width: 32rpx;
	height: 32rpx;
	border: 2rpx solid #ccc;
	border-radius: 50%;
	margin-right: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: #fff;
}

.checkbox.checked {
	background: #667eea;
	border-color: #667eea;
}

.anonymous-row .label {
	font-size: 26rpx;
	color: #666;
}

.footer-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background: #fff;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	z-index: 100;
}

.submit-btn {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-radius: 50rpx;
	font-weight: bold;
	font-size: 32rpx;
	height: 88rpx;
	line-height: 88rpx;
}

.btn-hover {
	opacity: 0.9;
	transform: translateY(2rpx);
}
</style>
