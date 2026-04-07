<template>
	<view class="container">
		<!-- 筛选栏 -->
		<view class="filter-section">
			<!-- 搜索框 -->
			<view class="search-box">
				<text class="search-icon">🔍</text>
				<input 
					class="search-input" 
					type="text" 
					v-model="searchKeyword" 
					placeholder="搜索地址/备注..." 
					confirm-type="search"
				/>
				<view class="clear-icon" v-if="searchKeyword" @click="searchKeyword = ''">✕</view>
			</view>
			
			<!-- 筛选标签 -->
			<view class="filter-tags">
				<view 
					class="filter-tag" 
					:class="{ active: filterUrgent }" 
					@click="toggleUrgent"
				>
					加急单
				</view>
				<picker 
					mode="selector" 
					:range="weightOptions" 
					range-key="label" 
					@change="onWeightChange"
				>
					<view class="filter-tag" :class="{ active: filterWeight !== 'all' }">
						{{ currentWeightLabel }} ▾
					</view>
				</picker>
				<view 
					class="filter-tag" 
					:class="{ active: sortBy === 'reward_desc' }" 
					@click="toggleSort"
				>
					报酬最高
				</view>
			</view>
		</view>

		<!-- 订单列表 -->
		<view class="order-list">
			<view v-for="order in filteredOrders" :key="order.id" class="order-card">
				<view class="order-header">
					<view class="header-left">
						<view class="tag urgent" v-if="order.isUrgent">加急</view>
						<view class="tag weight">{{order.weightLabel}}</view>
					</view>
					<view class="reward">
						<text class="currency">￥</text>
						<text class="amount">{{order.totalReward}}</text>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="order-body">
					<view class="info-row">
						<text class="info-icon">📦</text>
						<text class="info-text">{{order.quantity}} 个包裹</text>
					</view>
					<view class="info-row">
						<text class="info-icon">📍</text>
						<text class="info-text address">{{order.address}}</text>
					</view>
					<view class="info-row">
						<text class="info-icon">⏰</text>
						<text class="info-text">{{order.expectedTime}}</text>
					</view>
					<view class="info-row" v-if="order.notes">
						<text class="info-icon">📝</text>
						<text class="info-text notes">{{order.notes}}</text>
					</view>
				</view>
				
				<view class="order-footer">
					<button class="take-btn" hover-class="take-btn-hover" @tap="takeOrder(order)">立即抢单</button>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="filteredOrders.length === 0" class="empty-state">
			<text class="empty-icon">📭</text>
			<text class="empty-text">暂无符合条件的订单</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchKeyword: '',
			filterUrgent: false,
			filterWeight: 'all', // all, light, medium, heavy
			sortBy: 'default', // default, reward_desc
			
			weightOptions: [
				{ label: '全部重量', value: 'all' },
				{ label: '轻件 (<1kg)', value: 'light' },
				{ label: '中件 (1-3kg)', value: 'medium' },
				{ label: '重件 (>3kg)', value: 'heavy' }
			],
			
			// 模拟更多数据以便测试筛选
			availableOrders: [
				{
					id: 1,
					isUrgent: true,
					weightLabel: '轻件',
					weightValue: 'light',
					totalReward: 15,
					quantity: 1,
					address: '学生宿舍 A 栋 302',
					expectedTime: '今天 18:00',
					notes: '请送到门口即可'
				},
				{
					id: 2,
					isUrgent: false,
					weightLabel: '重件',
					weightValue: 'heavy',
					totalReward: 12,
					quantity: 2,
					address: '教职工公寓 3 号楼 101',
					expectedTime: '明天 10:00',
					notes: '电梯房'
				},
				{
					id: 3,
					isUrgent: true,
					weightLabel: '中件',
					weightValue: 'medium',
					totalReward: 25,
					quantity: 3,
					address: '图书馆正门',
					expectedTime: '今天 14:30',
					notes: '到了打电话'
				},
				{
					id: 4,
					isUrgent: false,
					weightLabel: '轻件',
					weightValue: 'light',
					totalReward: 5,
					quantity: 1,
					address: '第二食堂门口',
					expectedTime: '今天 12:00',
					notes: ''
				},
				{
					id: 5,
					isUrgent: false,
					weightLabel: '中件',
					weightValue: 'medium',
					totalReward: 8,
					quantity: 1,
					address: '学生宿舍 B 栋 505',
					expectedTime: '明天 09:00',
					notes: '放门口鞋柜上'
				}
			]
		}
	},
	computed: {
		currentWeightLabel() {
			const option = this.weightOptions.find(o => o.value === this.filterWeight);
			return option ? (option.value === 'all' ? '包裹重量' : option.label.split(' ')[0]) : '包裹重量';
		},
		filteredOrders() {
			let result = [...this.availableOrders];
			
			// 1. 关键词搜索
			if (this.searchKeyword) {
				const keyword = this.searchKeyword.toLowerCase();
				result = result.filter(order => 
					order.address.toLowerCase().includes(keyword) || 
					(order.notes && order.notes.toLowerCase().includes(keyword))
				);
			}
			
			// 2. 加急筛选
			if (this.filterUrgent) {
				result = result.filter(order => order.isUrgent);
			}
			
			// 3. 重量筛选
			if (this.filterWeight !== 'all') {
				result = result.filter(order => order.weightValue === this.filterWeight);
			}
			
			// 4. 排序
			if (this.sortBy === 'reward_desc') {
				result.sort((a, b) => b.totalReward - a.totalReward);
			}
			
			return result;
		}
	},
	methods: {
		toggleUrgent() {
			this.filterUrgent = !this.filterUrgent;
		},
		onWeightChange(e) {
			const index = e.detail.value;
			this.filterWeight = this.weightOptions[index].value;
		},
		toggleSort() {
			this.sortBy = this.sortBy === 'default' ? 'reward_desc' : 'default';
		},
		takeOrder(order) {
			uni.showModal({
				title: '确认接单',
				content: `确认承接送往 ${order.address} 的订单吗？`,
				confirmColor: '#667eea',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '接单中...' });
						setTimeout(() => {
							uni.hideLoading();
							uni.showToast({ title: '接单成功', icon: 'success' });
							// 模拟移除订单
							const index = this.availableOrders.findIndex(o => o.id === order.id);
							if (index > -1) {
								this.availableOrders.splice(index, 1);
							}
						}, 1000);
					}
				}
			});
		}
	}
}
</script>

<style scoped>
.container {
	background-color: #f5f7fa;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

/* 筛选栏样式 */
.filter-section {
	background-color: #ffffff;
	padding: 20rpx 30rpx;
	position: sticky;
	top: 0;
	z-index: 100;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
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

/* 订单列表样式 */
.order-list {
	padding: 20rpx 30rpx;
}

.order-card {
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03);
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

/* 空状态样式 */
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
