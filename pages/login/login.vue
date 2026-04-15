<template>
    <view class="container">
        <view class="bg-shape shape-1"></view>
        <view class="bg-shape shape-2"></view>
        <view class="bg-shape shape-3"></view>

        <view class="login-container">
            <view class="header-section">
                <view class="logo-wrapper">
                    <image class="logo" src="/static/logo.png" mode="aspectFill"></image>
                </view>
                <text class="welcome-text">欢迎回来</text>
                <text class="sub-text">登录以继续使用校园代取服务</text>
            </view>

            <view class="form-section">
                <view class="input-item">
                    <view class="icon-wrapper">
                        <text class="iconfont">📱</text>
                    </view>
                    <input class="input" type="number" v-model="formData.phone" placeholder="请输入手机号"
                        placeholder-class="input-placeholder" maxlength="11" />
                </view>

                <view class="input-item">
                    <view class="icon-wrapper">
                        <text class="iconfont">🔒</text>
                    </view>
                    <input class="input" type="password" v-model="formData.password" placeholder="请输入密码"
                        placeholder-class="input-placeholder" />
                </view>
                <view class="radio_box">
                    <view class="radio_title">身份选择</view>
                    <radio-group @change="radioChange" class="radio_item_box">
                        <label class="radio_item" v-for="(item, index) in userType" :key="item.value">
                            <view>
                                <radio :value="String(item.value)" :checked="index === current" />
                            </view>
                            <view>{{ item.name }}</view>
                        </label>
                    </radio-group>
                </view>
                <view class="action-bar">
                    <text class="forgot-pwd">忘记密码?</text>
                </view>

                <button class="login-btn" hover-class="login-btn-hover" @click="handleLogin">
                    <text>登 录</text>
                </button>

                <view class="register-bar">
                    <text class="tip">还没有账号?</text>
                    <text class="link" @click="goToRegister">立即注册</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { login } from "@/utils/api.js";
import { setToken, setUserInfo } from "@/utils/storage.js";

const formData = reactive({
    phone: "",
    password: "",
})

const userType = [
    { name: "普通用户", value: 0 },
    { name: "代取员", value: 1 },
]

const current = ref(0)

const validatePhone = (phone) => {
    const phoneReg = /^1[3-9]\d{9}$/;
    return phoneReg.test(phone);
}

const radioChange = (evt) => {
    for (let i = 0; i < userType.length; i++) {
        if (String(userType[i].value) === String(evt.detail.value)) {
            current.value = i;
            break;
        }
    }
}

const handleLogin = async () => {
    if (!formData.phone) {
        uni.showToast({ title: "请输入手机号", icon: "none" });
        return;
    }
    if (!validatePhone(formData.phone)) {
        uni.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
    }
    if (!formData.password) {
        uni.showToast({ title: "请输入密码", icon: "none" });
        return;
    }
    if (formData.password.length < 6) {
        uni.showToast({ title: "密码长度至少6位", icon: "none" });
        return;
    }

    uni.showLoading({ title: "登录中..." });
    try {
        const res = await login({
            phone: formData.phone,
            password: formData.password,
            role: userType[current.value].value,
        });
        uni.hideLoading();

        if (res.code === 200) {
            setToken(res.data.token);
            setUserInfo(res.data.userInfo);
            uni.showToast({ title: "登录成功", icon: "success" });
            setTimeout(() => {
                uni.switchTab({ url: "/pages/index/index" });
            }, 1500);
        } else {
            uni.showToast({ title: res.message || "登录失败", icon: "none" });
        }
    } catch (error) {
        uni.hideLoading();
        uni.showToast({ title: "登录失败，请稍后重试", icon: "none" });
        console.error("登录错误:", error);
    }
}

const goToRegister = () => {
    uni.navigateTo({ url: "/pages/login/register" });
}
</script>

<style scoped>
.container {
    min-height: 100vh;
    background-color: #f0f2f5;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bg-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(80rpx);
    z-index: 1;
}

.shape-1 {
    width: 400rpx;
    height: 400rpx;
    background: #667eea;
    top: -100rpx;
    left: -100rpx;
    opacity: 0.6;
}

.shape-2 {
    width: 300rpx;
    height: 300rpx;
    background: #764ba2;
    bottom: -50rpx;
    right: -50rpx;
    opacity: 0.5;
}

.shape-3 {
    width: 200rpx;
    height: 200rpx;
    background: #4facfe;
    top: 40%;
    right: -60rpx;
    opacity: 0.4;
}

.login-container {
    position: relative;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20rpx);
    border-radius: 40rpx;
    padding: 60rpx 40rpx;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
    border: 1rpx solid rgba(255, 255, 255, 0.8);
}

.header-section {
    text-align: center;
    margin-bottom: 30rpx;
    padding-top: 150rpx;
}

.logo-wrapper {
    width: 300rpx;
    height: 300rpx;
    background: #fff;
    border-radius: 35rpx;
    margin: 0 auto 30rpx;
    box-shadow: 0 10rpx 25rpx rgba(102, 126, 234, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo {
    border-radius: 35rpx;
    width: 300rpx;
    height: 300rpx;
}

.welcome-text {
    display: block;
    font-size: 44rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
}

.sub-text {
    font-size: 26rpx;
    color: #999;
}

.form-section {
    width: 100%;
}

.input-item {
    background: #f5f7fa;
    border-radius: 20rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    margin-bottom: 30rpx;
    border: 2rpx solid transparent;
    transition: all 0.3s;
}

.radio_box {
    display: flex;
    margin-bottom: 30rpx;
    padding: 20rpx 0 10rpx;
}

.radio_item_box {
    display: flex;
    gap: 50rpx;
}

.radio_title {
    margin-bottom: 20rpx;
    padding: 0 20rpx;
}

.radio_item {
    display: flex;
    padding-left: 20rpx;
}

.input-item:focus-within {
    background: #fff;
    border-color: #667eea;
    box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.1);
}

.icon-wrapper {
    width: 60rpx;
    display: flex;
    justify-content: center;
    margin-right: 10rpx;
}

.iconfont {
    font-size: 36rpx;
    color: #999;
}

.input {
    flex: 1;
    font-size: 30rpx;
    color: #333;
    height: 100%;
}

.input-placeholder {
    color: #bdc3c7;
}

.action-bar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 50rpx;
}

.forgot-pwd {
    font-size: 26rpx;
    color: #667eea;
}

.login-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 50rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    font-weight: bold;
    transition: all 0.3s;
    border: none;
}

.login-btn-hover {
    transform: translateY(2rpx);
    box-shadow: 0 5rpx 15rpx rgba(118, 75, 162, 0.2);
    opacity: 0.9;
}

.register-bar {
    margin-top: 50rpx;
    text-align: center;
}

.tip {
    font-size: 28rpx;
    color: #999;
}

.link {
    font-size: 28rpx;
    color: #667eea;
    font-weight: bold;
    margin-left: 10rpx;
}
</style>
