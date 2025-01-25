<template>
  <div class="profile">
    <h2>个人资料</h2>
    <div class="profile-form">
      <div class="form-item">
        <label>用户名</label>
        <input type="text" v-model="profile.username" placeholder="请输入用户名">
      </div>
      <div class="form-item">
        <label>邮箱</label>
        <input type="email" v-model="profile.email" placeholder="请输入邮箱">
      </div>
      <div class="form-item">
        <label>手机号</label>
        <input type="tel" v-model="profile.phone" placeholder="请输入手机号">
      </div>
      <div class="form-item">
        <button @click="saveProfile" class="save-btn">保存修改</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      profile: {
        username: '',
        email: '',
        phone: ''
      }
    }
  },
  methods: {
    saveProfile() {
      // TODO: 实现保存个人资料的逻辑
      console.log('保存个人资料:', this.profile)
    }
  }
}
</script>

<style scoped>
.profile h2 {
  margin-bottom: 30px;
  color: #333;
}

.profile-form {
  max-width: 500px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  color: #333;
}

.form-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.save-btn {
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:hover {
  background-color: var(--primary-color-dark);
}
</style> 