<template>
  <div class="security-page">
    <h2>账户安全</h2>

    <div class="security-list">
      <el-card class="security-item">
        <template #header>
          <div class="item-header">
            <span>登录密码</span>
            <el-button type="primary" link @click="changePassword">
              修改
            </el-button>
          </div>
        </template>
        <div class="item-content">
          用于保护账户信息安全
        </div>
      </el-card>

      <el-card class="security-item">
        <template #header>
          <div class="item-header">
            <span>手机号码</span>
            <el-button type="primary" link @click="changePhone">
              {{ userInfo.phone ? '修改' : '绑定' }}
            </el-button>
          </div>
        </template>
        <div class="item-content">
          {{ userInfo.phone || '未绑定手机号码' }}
        </div>
      </el-card>

      <el-card class="security-item">
        <template #header>
          <div class="item-header">
            <span>邮箱地址</span>
            <el-button type="primary" link @click="changeEmail">
              {{ userInfo.email ? '修改' : '绑定' }}
            </el-button>
          </div>
        </template>
        <div class="item-content">
          {{ userInfo.email || '未绑定邮箱地址' }}
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 模拟用户数据
const userInfo = ref({
  phone: '138****8000',
  email: 'ex***@example.com'
})

// 修改密码
const changePassword = () => {
  // TODO: 实现修改密码的逻辑
  console.log('修改密码')
}

// 修改手机号
const changePhone = () => {
  // TODO: 实现修改手机号的逻辑
  console.log('修改手机号')
}

// 修改邮箱
const changeEmail = () => {
  // TODO: 实现修改邮箱的逻辑
  console.log('修改邮箱')
}
</script>

<style scoped>
.security-page h2 {
  margin-bottom: 24px;
}

.security-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.item-content {
  color: #666;
  font-size: 14px;
}
</style> 