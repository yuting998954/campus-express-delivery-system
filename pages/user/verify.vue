<template>
	<view class="container">
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
					<view class="label">证件号码</view>
					<view class="input-wrapper">
						<input class="input" type="idcard" v-model="formData.code" placeholder="请输入证件号码"
							maxlength="18" />
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
			<view class="method-card" :class="{ active: formData.authType === 1 }" @click="selectType(1)">
				<view class="method-icon">🆔</view>
				<view class="method-info">
					<text class="method-title">身份证认证</text>
					<text class="method-desc">上传身份证正反面照片</text>
					<text class="method-tag">推荐</text>
				</view>
				<view class="check-icon" v-if="formData.authType === 1">✓</view>
			</view>

			<view class="method-card" :class="{ active: formData.authType === 0 }" @click="selectType(0)">
				<view class="method-icon">🎓</view>
				<view class="method-info">
					<text class="method-title">学生证认证</text>
					<text class="method-desc">上传学生证个人信息页</text>
				</view>
				<view class="check-icon" v-if="formData.authType === 0">✓</view>
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
			<view v-if="formData.authType === 1">
				<view class="upload-card">
					<view class="card-title">身份证人像面</view>
					<view class="upload-box" @click="chooseImage('idCardFront')">
						<image v-if="formData.images.idCardFront" :src="formData.images.idCardFront" mode="aspectFit"
							class="preview-img"></image>
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
						<image v-if="formData.images.idCardBack" :src="formData.images.idCardBack" mode="aspectFit"
							class="preview-img"></image>
						<view v-else class="placeholder">
							<text class="camera-icon">📷</text>
							<text class="text">点击上传国徽面</text>
						</view>
						<view class="re-upload" v-if="formData.images.idCardBack">重新上传</view>
					</view>
				</view>
			</view>

			<view v-if="formData.authType === 0">
				<view class="upload-card">
					<view class="card-title">学生证信息页</view>
					<view class="upload-box" @click="chooseImage('studentCard')">
						<image v-if="formData.images.studentCard" :src="formData.images.studentCard" mode="aspectFit"
							class="preview-img"></image>
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

		<!-- 步骤 4: 等待审核 -->
		<view class="step-content status-page" v-if="currentStep === 4">
			<view class="loading-spinner"></view>
			<text class="status-title">正在提交审核...</text>
			<text class="status-desc">请稍候，系统正在处理您的提交</text>
		</view>

		<!-- 步骤 5: 审核结果 -->
		<view class="step-content status-page" v-if="currentStep === 5">
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
						<text class="value">{{ formData.authType === 0 ? '身份证认证' : '学生证认证' }}</text>
					</view>
					<view class="info-row">
						<text class="label">有效期至：</text>
						<text class="value">2026-12-31</text>
					</view>
				</view>
				<button class="action-btn" @click="goHome">返回首页</button>
			</view>

			<view v-if="auditStatus === 'rejected'" class="result-box fail">
				<view class="result-icon">✕</view>
				<text class="result-title">审核驳回</text>
				<text class="result-reason">驳回原因：{{ rejectReason }}</text>
				<button class="action-btn" @click="reVerify">重新认证</button>
			</view>

			<view v-if="auditStatus === 'pending'" class="result-box pending">
				<view class="result-icon">⏳</view>
				<text class="result-title">等待审核</text>
				<text class="result-desc">预计 1-2 个工作日内完成审核</text>
				<button class="action-btn outline" @click="goHome">返回首页</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { authenticate, getVerificationStatus } from '@/utils/api.js'
import { getUserInfo, setUserInfo } from '@/utils/storage.js'

const currentStep = ref(1)
const auditStatus = ref('')
const rejectReason = ref('')
const isLoading = ref(true)
const currentAuthId = ref(0)  // 当前认证记录的ID
const formData = reactive({
	realName: '',
	code: '',
	authType: 1,//0-学生证认证，1-身份证认证
	images: {
		idCardFront: '',
		idCardBack: '',
		studentCard: ''
	}
})

// 页面显示时：查询当前认证状态
onShow(async () => {
	const user = getUserInfo()
	if (!user || !user.id) {
		currentStep.value = 1
		isLoading.value = false
		return
	}

	isLoading.value = true
	try {
		const res = await getVerificationStatus()
		if (res.code === 200) {
			// 保存认证ID
			currentAuthId.value = res.data.authId || 0

			// 回填表单数据
			if (res.data.realName) formData.realName = res.data.realName
			if (res.data.code) formData.code = res.data.code
			// if (res.data.cardType !== undefined && res.data.cardType !== null) {
			// 	formData.authType = res.data.cardType === 1 ? 1 : 0
			// }
			if (res.data.idCardFront) formData.images.idCardFront = res.data.idCardFront
			if (res.data.idCardBack) formData.images.idCardBack = res.data.idCardBack
			if (res.data.studentCard) formData.images.studentCard = res.data.studentCard

			const verifyStatus = res.data.verifyStatus

			if (verifyStatus === 2) {
				// 已认证：直接显示认证成功页面
				currentStep.value = 5
				auditStatus.value = 'approved'
			} else if (verifyStatus === 1) {
				// 待审核：显示等待审核
				currentStep.value = 5
				auditStatus.value = 'pending'
			} else if (verifyStatus === 3) {
				// 审核驳回：显示驳回原因，可重新认证
				currentStep.value = 5
				auditStatus.value = 'rejected'
				rejectReason.value = res.data.auditRemark
			} else {
				// 未认证：显示填写表单
				currentStep.value = 1
			}
		}
	} catch (e) {
		console.error('获取认证状态失败', e)
		currentStep.value = 1
	} finally {
		isLoading.value = false
	}
})

const nextStep = () => {
	if (currentStep.value === 1) {
		if (!formData.realName || !formData.code) {
			uni.showToast({ title: '请填写完整信息', icon: 'none' })
			return
		}
		// if (!/^\d{17}[\dXx]$/.test(formData.idCardNumber)) {
		// 	uni.showToast({ title: '证件号码格式不正确', icon: 'none' })
		// 	return
		// }
	}
	if (currentStep.value < 3) {
		currentStep.value++
	}
}

const prevStep = () => {
	if (currentStep.value > 1) {
		currentStep.value--
	}
}

const selectType = (type) => {
	formData.authType = type
}

const chooseImage = (key) => {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		success: async (res) => {
			const tempFilePath = res.tempFilePaths[0]
			// 转换为Base64
			try {
				const base64 = await fileToBase64(tempFilePath)
				formData.images[key] = base64
				uni.showToast({ title: '上传成功', icon: 'success' })
			} catch (e) {
				console.error('图片转换失败', e)
				uni.showToast({ title: '图片处理失败', icon: 'none' })
			}
		}
	})
}

// 将文件路径转换为Base64
const fileToBase64 = (filePath) => {
	return new Promise((resolve, reject) => {
		uni.getFileSystemManager().readFile({
			filePath: filePath,
			encoding: 'base64',
			success: (res) => {
				resolve('data:image/jpeg;base64,' + res.data)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

const submit = async () => {
	if (formData.authType === 1) {
		if (!formData.images.idCardFront || !formData.images.idCardBack) {
			uni.showToast({ title: '请上传身份证正反面', icon: 'none' })
			return
		}
	} else {
		if (!formData.images.studentCard) {
			uni.showToast({ title: '请上传学生证照片', icon: 'none' })
			return
		}
	}

	currentStep.value = 4 // loading 状态
	uni.showLoading({ title: '提交中...' })

	try {
		// 直接提交Base64图片数据
		const res = await authenticate({
			cardType: formData.authType,
			realName: formData.realName,
			code: formData.code,
			idCardFront: formData.images.idCardFront,
			idCardBack: formData.images.idCardBack,
			studentCard: formData.images.studentCard
		})
		uni.hideLoading()

		if (res.code === 200) {
			// 同步更新本地存储的认证状态为待审核
			const user = getUserInfo() || {}
			user.verifyStatus = 1 // 1-待审核
			setUserInfo(user)

			currentStep.value = 5
			auditStatus.value = 'pending'
			// 重新获取状态，回显提交的信息
			getVerificationStatus()
		} else {
			uni.showToast({ title: res.message || '提交失败', icon: 'none' })
			currentStep.value = 3 // 回退到上一步
		}
	} catch (e) {
		uni.hideLoading()
		console.error('提交认证失败', e)
		uni.showToast({ title: '提交失败，请重试', icon: 'none' })
		currentStep.value = 3
	}
}

const reVerify = () => {
	currentStep.value = 1
	auditStatus.value = ''
	rejectReason.value = ''
}

const goHome = () => {
	uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style scoped>
.container {
	padding: 30rpx;
	background-color: #f5f7fa;
	min-height: 100vh;
}

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

.next-btn,
.action-btn {
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
	background: rgba(0, 0, 0, 0.5);
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
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
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
