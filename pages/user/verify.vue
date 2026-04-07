<template>
	<view class="container">
		<!-- 步骤条 -->
		<view class="steps-box">
			<view class="step-item" :class="{ active: currentStep >= 1, finished: currentStep > 1 }">
				<view class="step-circle">1</view>
				<text class="step-text">填写信息</text>
			</view>
			<view class="step-line" :class="{ active: currentStep > 1 }"></view>
			<view class="step-item" :class="{ active: currentStep >= 2, finished: currentStep > 2 }">
				<view class="step-circle">2</view>
				<text class="step-text">选择方式</text>
			</view>
			<view class="step-line" :class="{ active: currentStep > 2 }"></view>
			<view class="step-item" :class="{ active: currentStep >= 3, finished: currentStep > 3 }">
				<view class="step-circle">3</view>
				<text class="step-text">上传证件</text>
			</view>
			<view class="step-line" :class="{ active: currentStep > 3 }"></view>
			<view class="step-item" :class="{ active: currentStep >= 4, finished: currentStep > 4 }">
				<view class="step-circle">4</view>
				<text class="step-text">审核</text>
			</view>
		</view>

		<!-- 步骤 1: 填写信息 -->
		<view class="step-content" v-if="currentStep === 1">
			<view class="form-card">
				<view class="form-title">基本信息</view>
				<view class="input-group">
					<view class="label">真实姓名</view>
					<view class="input-wrapper">
						<input class="input" type="text" v-model="formData.realName" placeholder="请输入真实姓名" />
						<text class="security-icon">🔒</text>
					</view>
				</view>
				<view class="input-group">
					<view class="label">手机号码</view>
					<view class="input-wrapper">
						<input class="input" type="number" v-model="formData.phone" placeholder="请输入手机号码" maxlength="11" />
						<text class="security-icon">🔒</text>
					</view>
				</view>
				<view class="security-tip">
					<text class="icon">🛡️</text>
					<text>信息仅用于身份核验，我们将严格保密</text>
				</view>
			</view>
			<button class="next-btn" @click="nextStep">下一步</button>
		</view>

		<!-- 步骤 2: 选择认证方式 -->
		<view class="step-content" v-if="currentStep === 2">
			<view class="method-card" :class="{ active: formData.authType === 'idcard' }" @click="selectType('idcard')">
				<view class="method-icon">🆔</view>
				<view class="method-info">
					<text class="method-title">身份证认证</text>
					<text class="method-desc">上传身份证正反面照片</text>
					<text class="method-tag">推荐</text>
				</view>
				<view class="check-icon" v-if="formData.authType === 'idcard'">✓</view>
			</view>

			<view class="method-card" :class="{ active: formData.authType === 'student' }" @click="selectType('student')">
				<view class="method-icon">🎓</view>
				<view class="method-info">
					<text class="method-title">学生证认证</text>
					<text class="method-desc">上传学生证个人信息页</text>
				</view>
				<view class="check-icon" v-if="formData.authType === 'student'">✓</view>
			</view>

			<view class="info-tip">
				* 两种方式效力等同，审核时效均为 1-2 个工作日
			</view>

			<view class="btn-group">
				<button class="prev-btn" @click="prevStep">上一步</button>
				<button class="next-btn" @click="nextStep">下一步</button>
			</view>
		</view>

		<!-- 步骤 3: 上传证件 -->
		<view class="step-content" v-if="currentStep === 3">
			<!-- 身份证上传 -->
			<view v-if="formData.authType === 'idcard'">
				<view class="upload-card">
					<view class="card-title">身份证人像面</view>
					<view class="upload-box" @click="chooseImage('idCardFront')">
						<image v-if="formData.images.idCardFront" :src="formData.images.idCardFront" mode="aspectFit" class="preview-img"></image>
						<view v-else class="placeholder">
							<text class="camera-icon">📷</text>
							<text class="text">点击上传人像面</text>
						</view>
						<view class="re-upload" v-if="formData.images.idCardFront">重新上传</view>
					</view>
					<view class="example-box">
						<text class="example-label">示例：</text>
						<view class="example-img-box">
							<view class="example-rect front"></view>
							<text class="example-text">标准拍摄</text>
						</view>
					</view>
				</view>

				<view class="upload-card">
					<view class="card-title">身份证国徽面</view>
					<view class="upload-box" @click="chooseImage('idCardBack')">
						<image v-if="formData.images.idCardBack" :src="formData.images.idCardBack" mode="aspectFit" class="preview-img"></image>
						<view v-else class="placeholder">
							<text class="camera-icon">📷</text>
							<text class="text">点击上传国徽面</text>
						</view>
						<view class="re-upload" v-if="formData.images.idCardBack">重新上传</view>
					</view>
				</view>
			</view>

			<!-- 学生证上传 -->
			<view v-if="formData.authType === 'student'">
				<view class="upload-card">
					<view class="card-title">学生证信息页</view>
					<view class="upload-box" @click="chooseImage('studentCard')">
						<image v-if="formData.images.studentCard" :src="formData.images.studentCard" mode="aspectFit" class="preview-img"></image>
						<view v-else class="placeholder">
							<text class="camera-icon">📷</text>
							<text class="text">点击上传信息页</text>
						</view>
						<view class="re-upload" v-if="formData.images.studentCard">重新上传</view>
					</view>
					<view class="tips-box">
						<text>需包含：姓名、学号、学校、有效期</text>
					</view>
				</view>
			</view>

			<view class="upload-limit-tip">
				* 支持 jpg/png 格式，单张不超过 5MB
			</view>

			<view class="btn-group">
				<button class="prev-btn" @click="prevStep">上一步</button>
				<button class="next-btn" @click="submit">提交审核</button>
			</view>
		</view>

		<!-- 步骤 4: 等待审核 (Loading) -->
		<view class="step-content status-page" v-if="currentStep === 4">
			<view class="loading-spinner"></view>
			<text class="status-title">正在提交审核...</text>
			<text class="status-desc">请稍候，系统正在处理您的提交</text>
		</view>

		<!-- 步骤 5: 审核结果 -->
		<view class="step-content status-page" v-if="currentStep === 5">
			<!-- 审核通过 -->
			<view v-if="auditStatus === 'approved'" class="result-box success">
				<view class="result-icon">✓</view>
				<text class="result-title">认证通过</text>
				<view class="auth-info">
					<view class="info-row">
						<text class="label">真实姓名：</text>
						<text class="value">{{ formData.realName }}</text>
					</view>
					<view class="info-row">
						<text class="label">认证方式：</text>
						<text class="value">{{ formData.authType === 'idcard' ? '身份证认证' : '学生证认证' }}</text>
					</view>
					<view class="info-row">
						<text class="label">有效期至：</text>
						<text class="value">2026-12-31</text>
					</view>
				</view>
				<button class="action-btn" @click="goHome">返回首页</button>
			</view>

			<!-- 审核驳回 -->
			<view v-if="auditStatus === 'rejected'" class="result-box fail">
				<view class="result-icon">✕</view>
				<text class="result-title">审核驳回</text>
				<text class="result-reason">驳回原因：证件照片模糊，无法识别信息</text>
				<button class="action-btn" @click="reVerify">重新认证</button>
			</view>

			<!-- 审核中 (模拟状态，实际提交后可能直接跳转或显示此状态) -->
			<view v-if="auditStatus === 'pending'" class="result-box pending">
				<view class="result-icon">⏳</view>
				<text class="result-title">等待审核</text>
				<text class="result-desc">预计 1-2 个工作日内完成审核</text>
				<button class="action-btn outline" @click="goHome">返回首页</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentStep: 1,
			auditStatus: '', // pending, approved, rejected
			formData: {
				realName: '',
				phone: '',
				authType: 'idcard', // idcard, student
				images: {
					idCardFront: '',
					idCardBack: '',
					studentCard: ''
				}
			}
		}
	},
	methods: {
		nextStep() {
			if (this.currentStep === 1) {
				if (!this.formData.realName || !this.formData.phone) {
					uni.showToast({ title: '请填写完整信息', icon: 'none' })
					return
				}
				if (!/^1[3-9]\d{9}$/.test(this.formData.phone)) {
					uni.showToast({ title: '手机号格式不正确', icon: 'none' })
					return
				}
			}
			if (this.currentStep < 3) {
				this.currentStep++
			}
		},
		prevStep() {
			if (this.currentStep > 1) {
				this.currentStep--
			}
		},
		selectType(type) {
			this.formData.authType = type
		},
		chooseImage(key) {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				success: (res) => {
					const tempFilePath = res.tempFilePaths[0]
					// 模拟大小检查 (实际应读取文件信息)
					// if (res.tempFiles[0].size > 5 * 1024 * 1024) { ... }
					
					this.formData.images[key] = tempFilePath
				}
			})
		},
		submit() {
			// 验证图片是否上传
			if (this.formData.authType === 'idcard') {
				if (!this.formData.images.idCardFront || !this.formData.images.idCardBack) {
					uni.showToast({ title: '请上传身份证正反面', icon: 'none' })
					return
				}
			} else {
				if (!this.formData.images.studentCard) {
					uni.showToast({ title: '请上传学生证照片', icon: 'none' })
					return
				}
			}

			this.currentStep = 4 // 进入 loading 状态
			
			// 模拟提交审核
			setTimeout(() => {
				this.currentStep = 5
				// 模拟随机结果：80% 通过，20% 驳回
				this.auditStatus = Math.random() > 0.2 ? 'approved' : 'rejected'
			}, 2000)
		},
		reVerify() {
			this.currentStep = 1
			this.auditStatus = ''
		},
		goHome() {
			uni.switchTab({ url: '/pages/home/home' })
		}
	}
}
</script>

<style scoped>
.container {
	padding: 30rpx;
	background-color: #f5f7fa;
	min-height: 100vh;
}

/* 步骤条 */
.steps-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 20rpx;
	background: #fff;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
}

.step-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	z-index: 1;
}

.step-circle {
	width: 50rpx;
	height: 50rpx;
	border-radius: 50%;
	background: #e0e0e0;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	margin-bottom: 10rpx;
	transition: all 0.3s;
}

.step-text {
	font-size: 22rpx;
	color: #999;
}

.step-item.active .step-circle {
	background: #667eea;
}

.step-item.active .step-text {
	color: #667eea;
	font-weight: bold;
}

.step-line {
	flex: 1;
	height: 4rpx;
	background: #e0e0e0;
	margin: -30rpx 10rpx 0;
}

.step-line.active {
	background: #667eea;
}

/* 通用按钮 */
.next-btn, .action-btn {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-radius: 50rpx;
	margin-top: 40rpx;
	font-weight: bold;
}

.prev-btn {
	background: #fff;
	color: #666;
	border: 2rpx solid #eee;
	border-radius: 50rpx;
	margin-top: 40rpx;
}

.btn-group {
	display: flex;
	gap: 30rpx;
}

.btn-group button {
	flex: 1;
}

/* 步骤 1 */
.form-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 40rpx;
}

.form-title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 40rpx;
	text-align: center;
}

.input-group {
	margin-bottom: 30rpx;
}

.label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 15rpx;
}

.input-wrapper {
	background: #f5f7fa;
	border-radius: 12rpx;
	padding: 0 20rpx;
	height: 90rpx;
	display: flex;
	align-items: center;
}

.input {
	flex: 1;
	height: 100%;
	font-size: 28rpx;
}

.security-icon {
	font-size: 32rpx;
}

.security-tip {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 40rpx;
	color: #999;
	font-size: 24rpx;
}

.security-tip .icon {
	margin-right: 10rpx;
}

/* 步骤 2 */
.method-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	border: 2rpx solid transparent;
	transition: all 0.3s;
}

.method-card.active {
	border-color: #667eea;
	background: #f0f4ff;
}

.method-icon {
	font-size: 60rpx;
	margin-right: 30rpx;
}

.method-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.method-title {
	font-size: 30rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.method-desc {
	font-size: 24rpx;
	color: #999;
}

.method-tag {
	font-size: 20rpx;
	color: #ff4d4f;
	background: #fff0f0;
	padding: 2rpx 10rpx;
	border-radius: 8rpx;
	align-self: flex-start;
	margin-top: 8rpx;
}

.check-icon {
	color: #667eea;
	font-weight: bold;
	font-size: 40rpx;
}

.info-tip {
	font-size: 24rpx;
	color: #999;
	text-align: center;
	margin-top: 20rpx;
}

/* 步骤 3 */
.upload-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.card-title {
	font-size: 28rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.upload-box {
	height: 300rpx;
	background: #f5f7fa;
	border-radius: 12rpx;
	border: 2rpx dashed #ccc;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
}

.placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.camera-icon {
	font-size: 60rpx;
	color: #ccc;
	margin-bottom: 10rpx;
}

.text {
	color: #999;
	font-size: 26rpx;
}

.preview-img {
	width: 100%;
	height: 100%;
}

.re-upload {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	background: rgba(0,0,0,0.5);
	color: #fff;
	font-size: 24rpx;
	text-align: center;
	padding: 10rpx 0;
}

.example-box {
	margin-top: 20rpx;
	display: flex;
	align-items: center;
}

.example-label {
	font-size: 24rpx;
	color: #666;
}

.example-img-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-left: 10rpx;
}

.example-rect {
	width: 60rpx;
	height: 40rpx;
	background: #e0e0e0;
	border-radius: 4rpx;
	margin-bottom: 4rpx;
}

.example-text {
	font-size: 20rpx;
	color: #999;
}

.upload-limit-tip {
	font-size: 24rpx;
	color: #ff9900;
	text-align: center;
	margin-bottom: 30rpx;
}

/* 步骤 4 & 5 */
.status-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 100rpx;
}

.loading-spinner {
	width: 80rpx;
	height: 80rpx;
	border: 6rpx solid #f3f3f3;
	border-top: 6rpx solid #667eea;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-bottom: 40rpx;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.status-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.status-desc {
	font-size: 28rpx;
	color: #999;
}

.result-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

.result-icon {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 60rpx;
	color: #fff;
	margin-bottom: 30rpx;
}

.success .result-icon {
	background: #52c41a;
}

.fail .result-icon {
	background: #ff4d4f;
}

.pending .result-icon {
	background: #faad14;
}

.result-title {
	font-size: 40rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.auth-info {
	background: #fff;
	width: 100%;
	padding: 40rpx;
	border-radius: 20rpx;
	margin-top: 40rpx;
}

.info-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
	font-size: 28rpx;
}

.info-row .label {
	color: #999;
}

.info-row .value {
	color: #333;
	font-weight: bold;
}

.result-reason {
	color: #ff4d4f;
	font-size: 28rpx;
	margin: 20rpx 0;
	background: #fff0f0;
	padding: 20rpx;
	border-radius: 10rpx;
}

.action-btn.outline {
	background: transparent;
	border: 2rpx solid #667eea;
	color: #667eea;
}
</style>
