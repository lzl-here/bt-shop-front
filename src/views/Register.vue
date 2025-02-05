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
            <el-form 
              ref="registerForm" 
              :model="registerForm" 
              :rules="rules"
              label-position="top"
            >
              <el-form-item 
                label="用户名" 
                prop="username"
              >
                <el-input
                  v-model="registerForm.username"
                  placeholder="请输入用户名"
                  :prefix-icon="User"
                />
              </el-form-item>
              
              <el-form-item 
                label="密码" 
                prop="password"
              >
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请输入密码"
                  :prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
              
              <el-form-item 
                label="确认密码" 
                prop="confirmPassword"
              >
                <el-input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  :prefix-icon="Lock"
                  show-password
                />
              </el-form-item>

              <el-form-item>
                <el-button 
                  type="primary" 
                  class="submit-btn" 
                  :loading="loading"
                  @click="handleRegister"
                >
                  注册
                </el-button>
              </el-form-item>
            </el-form>
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
import { User, Lock } from '@element-plus/icons-vue'
import { register } from '../api/userApi'

const router = useRouter()
const loading = ref(false)
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 自定义校验密码
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (registerForm.value.confirmPassword !== '') {
      registerFormRef.value.validateField('confirmPassword')
    }
    callback()
  }
}

// 自定义校验确认密码
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ]
}

const registerFormRef = ref(null)

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    loading.value = true
    
    const response = await register({
      username: registerForm.value.username,
      password: registerForm.value.password
    })
    
    if (response.code === 1) {
      ElMessage.success('注册成功')
      router.push('/login')
    } else {
      throw new Error(response.msg || '注册失败')
    }
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
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

.submit-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
  margin-top: 24px;
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

:deep(.el-form-item__label) {
  padding-bottom: 4px;
  font-size: 14px;
  color: #666;
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

:deep(.el-button--primary) {
  background-color: #1890ff;
}

:deep(.el-button--primary:hover) {
  background-color: #40a9ff;
}
</style> 