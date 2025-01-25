<template>
  <div class="register-container">
    <div class="register-box">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-item">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="formData.username"
            placeholder="请输入用户名"
            required
          >
        </div>
        
        <div class="form-item">
          <label for="email">邮箱</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email"
            placeholder="请输入邮箱"
            required
          >
        </div>

        <div class="form-item">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="formData.password"
            placeholder="请输入密码"
            required
          >
        </div>

        <div class="form-item">
          <label for="confirmPassword">确认密码</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="formData.confirmPassword"
            placeholder="请再次输入密码"
            required
          >
        </div>

        <div class="form-item">
          <button type="submit" class="register-btn">注册</button>
        </div>

        <div class="login-link">
          已有账号？<router-link to="/login">立即登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      formData: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    handleRegister() {
      // 验证密码是否一致
      if (this.formData.password !== this.formData.confirmPassword) {
        alert('两次输入的密码不一致！')
        return
      }
      
      // TODO: 实现注册逻辑
      console.log('注册信息：', this.formData)
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.register-box {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.form-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-item input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.register-btn {
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-btn:hover {
  background-color: var(--primary-color-dark);
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style> 