<template>
	<view class="container">
		<!-- 状态头部 -->
		<view class="status-header">
			<view class="icon-box">
				<text class="status-icon">✅</text>
			</view>
			<text class="status-text">订单已完成</text>
			<text class="status-desc">感谢您的信任，期待再次为您服务</text>
		</view>

		<!-- 费用结算卡片 -->
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

		<!-- 配送员信息 -->
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

		<!-- 评价卡片 -->
		<view class="card eval-card">
			<view class="card-title">服务评价</view>
			<view class="rating-box">
				<view class="stars">
					<text 
						v-for="i in 5" 
						:key="i" 
						class="star" 
						:class="{ active: i <= rating }"
						@tap="setRating(i)"
					>★</text>
				</view>
				<text class="rating-text">{{ ratingText }}</text>
			</view>

			<view class="tags-box">
				<view 
					v-for="(tag, index) in availableTags" 
					:key="index" 
					class="tag" 
					:class="{ active: selectedTags.includes(tag) }"
					@tap="toggleTag(tag)"
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
			<button class="submit-btn" hover-class="btn-hover" @tap="submitEval">提交评价</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderInfo: {
				orderNo: 'ORD20260305001',
				baseFee: '12.00',
				urgentFee: '5.00',
				tipFee: '2.00',
				totalAmount: '19.00'
			},
			runnerInfo: {
				name: '李同学',
				avatar: '/static/logo.png', // 实际项目中应替换为真实头像
				phone: '13800138000'
			},
			rating: 5,
			comment: '',
			selectedTags: [],
			availableTags: ['送达准时', '服务态度好', '穿着整洁', '餐品完好', '风雨无阻'],
			isAnonymous: false
		}
	},
	computed: {
		ratingText() {
			const texts = ['非常不满意', '不满意', '一般', '满意', '非常满意'];
			return texts[this.rating - 1] || '';
		}
	},
	methods: {
		setRating(score) {
			this.rating = score;
		},
		toggleTag(tag) {
			const index = this.selectedTags.indexOf(tag);
			if (index > -1) {
				this.selectedTags.splice(index, 1);
			} else {
				this.selectedTags.push(tag);
			}
		},
		contactRunner() {
			uni.makePhoneCall({
				phoneNumber: this.runnerInfo.phone
			});
		},
		submitEval() {
			if (this.rating === 0) {
				uni.showToast({ title: '请先打分哦', icon: 'none' });
				return;
			}
			
			uni.showLoading({ title: '提交中...' });
			
			// 模拟提交请求
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({ title: '评价成功', icon: 'success' });
				
				setTimeout(() => {
					// 返回上一页或跳转到订单列表
					uni.switchTab({ url: '/pages/user/orders' });
				}, 1500);
			}, 1000);
		}
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

/* 头部状态 */
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

/* 通用卡片样式 */
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

/* 结算卡片 */
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

/* 配送员卡片 */
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

/* 评价卡片 */
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

/* 底部按钮 */
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
