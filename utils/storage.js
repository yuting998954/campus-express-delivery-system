// 存储工具类

// Token相关
export function setToken(token) {
	uni.setStorageSync('token', token)
}

export function getToken() {
	return uni.getStorageSync('token')
}

export function removeToken() {
	uni.removeStorageSync('token')
}

// 用户信息相关
export function setUserInfo(userInfo) {
	uni.setStorageSync('userInfo', userInfo)
}

export function getUserInfo() {
	return uni.getStorageSync('userInfo')
}

export function removeUserInfo() {
	uni.removeStorageSync('userInfo')
}

// 检查是否已登录
export function isLoggedIn() {
	return !!getToken()
}

// 清除所有登录信息
export function clearAuth() {
	removeToken()
	removeUserInfo()
}