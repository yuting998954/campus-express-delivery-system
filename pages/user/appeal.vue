<template>
	<view class="container">
		<view class="form-group">
			<view class="title">申诉原因</view>
			<picker @change="reasonChange" :range="reasons">
				<view class="picker-value">{{selectedReason || '请选择申诉原因'}}</view>
			</picker>
		</view>

		<view class="form-group">
			<view class="title">问题描述</view>
			<textarea class="textarea" v-model="description" placeholder="请详细说明您遇到的问题，以便我们尽快处理。" />
		</view>

		<view class="form-group">
			<view class="title">上传凭证 (最多 3 张)</view>
			<view class="photo-uploader">
				<view v-for="(img, index) in photos" :key="index" class="photo-item">
					<image :src="img" mode="aspectFill" @click="previewImg(img)"></image>
					<view class="delete" @click="deletePhoto(index)">×</view>
				</view>
				<view v-if="photos.length < 3" class="upload-btn" @click="chooseImage">
					<text class="plus">+</text>
					<text>上传照片</text>
				</view>
			</view>
		</view>

		<button class="submit-btn" type="primary" @click="submitAppeal">提交申诉</button>
		<view class="tip">注：提交申诉后，管理员将在 1-3 个工作日内处理，请保持电话畅通。</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const reasons = ['物品损坏', '快递错送', '代取人态度恶劣', '超时未送达', '其他']
const selectedReason = ref('')
const description = ref('')
const photos = ref([])

const reasonChange = (e) => {
    selectedReason.value = reasons[e.detail.value];
}

const chooseImage = () => {
    uni.chooseImage({
        count: 3 - photos.value.length,
        success: (res) => {
            photos.value = photos.value.concat(res.tempFilePaths);
        }
    });
}

const deletePhoto = (index) => {
    photos.value.splice(index, 1);
}

const previewImg = (url) => {
    uni.previewImage({ urls: photos.value, current: url });
}

const submitAppeal = () => {
    if (!selectedReason.value || !description.value) {
        uni.showToast({ title: '请填写完整信息', icon: 'none' });
        return;
    }
    uni.showLoading({ title: '提交中...' });
    setTimeout(() => {
        uni.hideLoading();
        uni.showModal({
            title: '提交成功',
            content: '您的申诉已提交，请耐心等待管理员仲裁。',
            showCancel: false,
            success: () => {
                uni.navigateBack();
            }
        });
    }, 1000);
}
</script>

<style scoped>
.container {
	padding: 30rpx;
	background-color: #f8f8f8;
	min-height: 100vh;
}
.form-group {
	background-color: #fff;
	padding: 30rpx;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
}
.title {
	font-weight: bold;
	font-size: 28rpx;
	margin-bottom: 20rpx;
}
.picker-value {
	height: 80rpx;
	line-height: 80rpx;
	border: 1rpx solid #eee;
	padding: 0 20rpx;
	border-radius: 8rpx;
	color: #333;
}
.textarea {
	width: 100%;
	height: 250rpx;
	background-color: #f9f9f9;
	padding: 20rpx;
	box-sizing: border-box;
	border-radius: 8rpx;
	font-size: 26rpx;
}
.photo-uploader {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}
.photo-item {
	width: 180rpx;
	height: 180rpx;
	position: relative;
}
.photo-item image {
	width: 100%;
	height: 100%;
	border-radius: 8rpx;
}
.delete {
	position: absolute;
	top: -15rpx;
	right: -15rpx;
	width: 40rpx;
	height: 40rpx;
	background-color: rgba(0,0,0,0.5);
	color: #fff;
	border-radius: 50%;
	text-align: center;
	line-height: 36rpx;
}
.upload-btn {
	width: 180rpx;
	height: 180rpx;
	background-color: #f9f9f9;
	border: 2rpx dashed #ddd;
	border-radius: 8rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: #999;
	font-size: 24rpx;
}
.plus {
	font-size: 50rpx;
	margin-bottom: 10rpx;
}
.submit-btn {
	margin-top: 60rpx;
}
.tip {
	font-size: 24rpx;
	color: #999;
	margin-top: 30rpx;
	text-align: center;
}
</style>
