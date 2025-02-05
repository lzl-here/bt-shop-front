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
              <div class="form-item">
                <div class="form-label">
                  <span class="required">*</span>
                  用户名
                </div>
                <input
                  v-model="username"
                  type="text"
                  placeholder="请输入用户名"
                  class="input"
                >
              </div>
              
              <div class="form-item">
                <div class="form-label">
                  <span class="required">*</span>
                  密码
                </div>
                <input
                  v-model="password"
                  type="password"
                  placeholder="请输入密码"
                  class="input"
                >
              </div>

              <div class="form-options">
                <label class="remember-me">
                  <input 
                    type="checkbox"
                    v-model="rememberMe"
                    class="checkbox"
                  >
                  <span>记住我</span>
                </label>
                <a class="forget-link">忘记密码？</a>
              </div>

              <button 
                class="submit-btn"
                :disabled="loading"
                @click="handleLogin"
              >
                {{ loading ? '登录中...' : '登录' }}
              </button>
            </div>

            <!-- 微信扫码登录 -->
            <div v-show="loginType === 'wechat'" class="wechat-login">
              <div v-if="qrcodeError" class="qrcode-error">
                <el-empty 
                  description="获取二维码失败" 
                  :image-size="120"
                >
                  <template #extra>
                    <button class="retry-btn" @click="retryGenerateQrcode">
                      重试
                    </button>
                  </template>
                </el-empty>
              </div>
              <div v-else class="qrcode-box">
                <div ref="qrcodeRef" class="qrcode"></div>
                <div v-if="qrcodeExpired" class="qrcode-mask">
                  <p>二维码已过期</p>
                  <button class="refresh-btn" @click="refreshQrcode">刷新</button>
                </div>
              </div>
              <p class="scan-tip">
                <i class="iconfont icon-wechat"></i>
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
import { login, getWechatQrcode, checkWechatLogin } from '../api/userApi'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const loginType = ref('account')
const loading = ref(false)
const qrcodeRef = ref(null)
const qrcodeExpired = ref(false)
const checkTimer = ref(null)
const qrcodeError = ref(false)

// 使用独立的响应式变量替代表单对象
const username = ref('')
const password = ref('')
const rememberMe = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    ElMessage.warning('请填写完整信息')
    return
  }

  try {
    loading.value = true
    const response = await login({
      username: username.value,
      password: password.value
    })
    
    if (response.code === 1) {
      // 更新用户信息到 store
      userStore.setUserInfo(response.data.user)
      
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
    ElMessage.warning('微信登录功能暂未开放')
    qrcodeError.value = true
  } catch (error) {
    console.error('Generate QR code error:', error)
    qrcodeError.value = true
  }
}

// 开始轮询检查登录状态
const startCheckLogin = () => {
  // 暂时不实现
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
  background-color: #1890ff;
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 24px;
  font-weight: 500;
  letter-spacing: 2px;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
}

.submit-btn:hover {
  background-color: #40a9ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transform: translateY(-1px);
}

.submit-btn:active {
  background-color: #096dd9;
  transform: translateY(1px);
}

.submit-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
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

.form-item {
  margin-bottom: 24px;
}

.form-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.required {
  color: #f56c6c;
  margin-right: 4px;
}

.input {
  width: 100%;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  transition: all 0.2s;
  background-color: #fff;
}

.input:hover {
  border-color: #c0c4cc;
}

.input:focus {
  outline: none;
  border-color: #1890ff;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.checkbox {
  margin: 0;
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