<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-left">
        <div class="welcome-text">
          <h1>欢迎加入</h1>
          <p>注册成为会员，享受更多权益</p>
        </div>
      </div>
      
      <div class="register-right">
        <div class="register-form">
          <div class="form-header">
            <h2>用户注册</h2>
          </div>

          <div class="form-content">
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
              <div class="form-tip">长度在 3 到 20 个字符</div>
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
              <div class="form-tip">密码长度不能小于6位</div>
            </div>
            
            <div class="form-item">
              <div class="form-label">
                <span class="required">*</span>
                确认密码
              </div>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                class="input"
              >
            </div>

            <button 
              class="submit-btn"
              :disabled="loading"
              @click="handleRegister"
            >
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </div>

          <div class="form-footer">
            <div class="login-tip">
              已有账号？
              <router-link to="/login" class="login-link">立即登录</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '../api/userApi'

const router = useRouter()
const loading = ref(false)
const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  if (!username.value || !password.value || !confirmPassword.value) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  if (password.value !== confirmPassword.value) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  
  try {
    loading.value = true
    const response = await register({
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    })
    
    if (response.code === 1) {
      ElMessage.success('注册成功')
      router.push('/login')
    } else {
      throw new Error(response.msg || '注册失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  padding: 20px;
}

.register-box {
  width: 1000px;
  height: 600px;
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.register-left {
  flex: 1;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.register-right {
  flex: 1;
  padding: 40px;
  display: flex;
  align-items: center;
}

.register-form {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 24px;
  color: #333;
  font-weight: 500;
}

.form-content {
  margin-top: 24px;
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

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

.input {
  width: 100%;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
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
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
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

.form-footer {
  margin-top: 24px;
  text-align: center;
}

.login-tip {
  color: #666;
  font-size: 14px;
}

.login-link {
  color: #1890ff;
  text-decoration: none;
  margin-left: 4px;
}

.login-link:hover {
  color: #40a9ff;
}
</style> 