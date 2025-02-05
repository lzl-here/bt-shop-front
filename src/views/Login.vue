<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <div class="welcome-text">
          <h1>欢迎回来</h1>
          <p>登录后即可享受全部功能和服务</p>
        </div>
        <img src="../assets/login-bg.png" alt="welcome" class="welcome-image">
      </div>
      
      <div class="login-right">
        <div class="login-form">
          <div class="form-header">
            <img src="../assets/logo.png" alt="logo" class="logo">
            <h2>用户登录</h2>
          </div>

          <!-- 登录方式切换 -->
          <div class="login-type">
            <span 
              :class="['type-item', { active: loginType === 'account' }]"
              @click="loginType = 'account'"
            >
              账号密码登录
            </span>
            <span 
              :class="['type-item', { active: loginType === 'wechat' }]"
              @click="loginType = 'wechat'"
            >
              微信扫码登录
            </span>
          </div>

          <div class="login-content">
            <!-- 账号密码登录 -->
            <div v-show="loginType === 'account'" class="account-form">
              <el-form ref="loginForm" :model="loginForm" :rules="rules">
                <el-form-item prop="username">
                  <el-input
                    v-model="loginForm.username"
                    placeholder="请输入用户名"
                    :prefix-icon="User"
                  />
                </el-form-item>
                
                <el-form-item prop="password">
                  <el-input
                    v-model="loginForm.password"
                    type="password"
                    placeholder="请输入密码"
                    :prefix-icon="Lock"
                    show-password
                  />
                </el-form-item>

                <div class="form-options">
                  <el-checkbox v-model="rememberMe">记住我</el-checkbox>
                  <a class="forget-link">忘记密码？</a>
                </div>

                <el-button 
                  type="primary" 
                  class="submit-btn" 
                  :loading="loading"
                  @click="handleLogin"
                >
                  登录
                </el-button>
              </el-form>
            </div>

            <!-- 微信扫码登录 -->
            <div v-show="loginType === 'wechat'" class="wechat-login">
              <div v-if="qrcodeError" class="qrcode-error">
                <el-empty 
                  description="获取二维码失败" 
                  :image-size="120"
                >
                  <template #extra>
                    <el-button type="primary" @click="retryGenerateQrcode">
                      重试
                    </el-button>
                  </template>
                </el-empty>
              </div>
              <div v-else class="qrcode-box">
                <div ref="qrcodeRef" class="qrcode"></div>
                <div v-if="qrcodeExpired" class="qrcode-mask">
                  <p>二维码已过期</p>
                  <el-button type="primary" @click="refreshQrcode">刷新</el-button>
                </div>
              </div>
              <p class="scan-tip">
                <el-icon><Iphone /></el-icon>
                请使用微信扫一扫登录
              </p>
            </div>
          </div>

          <div class="form-footer">
            <div class="register-tip">
              还没有账号？
              <router-link to="/register" class="register-link">立即注册</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Iphone } from '@element-plus/icons-vue'
import QRCode from 'qrcode'
import { useUserStore } from '../stores/user'
import { login, getWechatQrcode, checkWechatLogin } from '../api/userApi'

const router = useRouter()
const userStore = useUserStore()
const loginType = ref('account')
const loading = ref(false)
const qrcodeRef = ref(null)
const qrcodeExpired = ref(false)
const checkTimer = ref(null)
const rememberMe = ref(false)
const qrcodeError = ref(false)

const loginForm = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 账号密码登录
const handleLogin = async () => {
  try {
    loading.value = true
    const response = await login(loginForm.value)
    if (response.code === 1) {
      await userStore.setUserInfo(response.data)
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      throw new Error(response.msg || '登录失败')
    }
  } catch (error) {
    console.error('Login error:', error)
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

// 生成微信二维码
const generateQrcode = async () => {
  try {
    qrcodeError.value = false
    const response = await getWechatQrcode()
    if (response.code === 1 && response.data) {
      const { qrcode_url, scene_str } = response.data
      await QRCode.toCanvas(qrcodeRef.value, qrcode_url, {
        width: 200,
        margin: 1
      })
      startCheckLogin(scene_str)
    } else {
      throw new Error(response.msg || '获取二维码失败')
    }
  } catch (error) {
    console.error('Generate QR code error:', error)
    qrcodeError.value = true
    ElMessage.error(error.message || '获取二维码失败')
  }
}

// 开始轮询检查登录状态
const startCheckLogin = (sceneStr) => {
  qrcodeExpired.value = false
  if (checkTimer.value) {
    clearInterval(checkTimer.value)
  }
  checkTimer.value = setInterval(async () => {
    try {
      const response = await checkWechatLogin({ scene_str: sceneStr })
      if (response.code === 1) {
        if (response.data.status === 'SUCCESS') {
          clearInterval(checkTimer.value)
          await userStore.setUserInfo(response.data.user_info)
          ElMessage.success('登录成功')
          router.push('/')
        } else if (response.data.status === 'EXPIRED') {
          clearInterval(checkTimer.value)
          qrcodeExpired.value = true
        }
      }
    } catch (error) {
      console.error('Check login status error:', error)
    }
  }, 2000)
}

// 刷新二维码
const refreshQrcode = () => {
  generateQrcode()
}

// 重试生成二维码
const retryGenerateQrcode = () => {
  generateQrcode()
}

// 监听登录方式切换
watch(loginType, (newType) => {
  if (newType === 'wechat') {
    nextTick(() => {
      qrcodeError.value = false
      generateQrcode()
    })
  } else {
    if (checkTimer.value) {
      clearInterval(checkTimer.value)
    }
  }
})

onMounted(() => {
  if (loginType.value === 'wechat') {
    generateQrcode()
  }
})

onUnmounted(() => {
  if (checkTimer.value) {
    clearInterval(checkTimer.value)
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 20px;
}

.login-box {
  width: 1000px;
  height: 600px;
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
}

.welcome-text h1 {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 16px;
}

.welcome-text p {
  font-size: 16px;
  opacity: 0.9;
}

.welcome-image {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.login-right {
  flex: 1;
  padding: 40px;
  display: flex;
  align-items: center;
}

.login-form {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 80px;
  margin-bottom: 16px;
}

.form-header h2 {
  font-size: 24px;
  color: #333;
  font-weight: 500;
}

.login-type {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.type-item {
  flex: 1;
  padding: 12px 0;
  text-align: center;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 15px;
}

.type-item:hover {
  color: #1890ff;
}

.type-item.active {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}

.login-content {
  margin-top: 24px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
}

.forget-link {
  color: #1890ff;
  font-size: 14px;
  text-decoration: none;
}

.forget-link:hover {
  color: #40a9ff;
}

.submit-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
  margin-top: 24px;
}

.wechat-login {
  text-align: center;
  padding: 20px 0;
}

.qrcode-box {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  position: relative;
}

.qrcode {
  width: 100%;
  height: 100%;
}

.qrcode-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.98);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.scan-tip {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.form-footer {
  margin-top: 40px;
  text-align: center;
}

.register-tip {
  color: #666;
  font-size: 14px;
}

.register-link {
  color: #1890ff;
  text-decoration: none;
  margin-left: 4px;
}

.register-link:hover {
  color: #40a9ff;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1890ff inset;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #1890ff;
  border-color: #1890ff;
}

:deep(.el-button--primary) {
  background-color: #1890ff;
}

:deep(.el-button--primary:hover) {
  background-color: #40a9ff;
}

.qrcode-error {
  padding: 40px 0;
}

:deep(.el-empty__description) {
  margin-top: 12px;
  margin-bottom: 20px;
}

:deep(.el-empty__bottom) {
  margin-top: 0;
}
</style> 