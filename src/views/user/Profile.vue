<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人资料</span>
          <el-button 
            type="primary" 
            @click="handleEdit" 
            v-if="!isEditing"
          >
            编辑资料
          </el-button>
          <div v-else>
            <el-button @click="cancelEdit">取消</el-button>
            <el-button type="primary" @click="saveProfile">保存</el-button>
          </div>
        </div>
      </template>

      <div class="profile-content">
        <!-- 头像部分 -->
        <div class="avatar-section">
          <el-avatar 
            :size="100" 
            :src="userInfo.avatar || '/default-avatar.png'"
          />
          <el-upload
            v-if="isEditing"
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <el-button size="small" type="primary">更换头像</el-button>
          </el-upload>
        </div>

        <!-- 个人信息表单 -->
        <div class="info-section">
          <el-form 
            :model="userInfo"
            label-width="100px"
            :disabled="!isEditing"
          >
            <el-form-item label="用户名">
              <el-input v-model="userInfo.username" disabled />
            </el-form-item>

            <el-form-item label="昵称">
              <el-input v-model="userInfo.nickname" />
            </el-form-item>

            <el-form-item label="性别">
              <el-radio-group v-model="userInfo.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
                <el-radio :label="0">保密</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="手机号码">
              <el-input v-model="userInfo.phone" />
            </el-form-item>

            <el-form-item label="电子邮箱">
              <el-input v-model="userInfo.email" />
            </el-form-item>

            <el-form-item label="生日">
              <el-date-picker
                v-model="userInfo.birthday"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
              />
            </el-form-item>

            <el-form-item label="个人简介">
              <el-input
                v-model="userInfo.bio"
                type="textarea"
                :rows="3"
                placeholder="介绍一下自己吧"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>

    <!-- 安全设置卡片 -->
    <el-card class="security-card">
      <template #header>
        <div class="card-header">
          <span>安全设置</span>
        </div>
      </template>

      <div class="security-items">
        <div class="security-item">
          <div class="item-info">
            <div class="item-title">登录密码</div>
            <div class="item-desc">建议您定期更改密码，设置一个包含字母和数字的密码会更安全</div>
          </div>
          <el-button link type="primary" @click="changePassword">修改</el-button>
        </div>

        <div class="security-item">
          <div class="item-info">
            <div class="item-title">手机绑定</div>
            <div class="item-desc">已绑定手机：{{ maskPhone(userInfo.phone) }}</div>
          </div>
          <el-button link type="primary" @click="changePhone">修改</el-button>
        </div>

        <div class="security-item">
          <div class="item-info">
            <div class="item-title">邮箱绑定</div>
            <div class="item-desc">已绑定邮箱：{{ maskEmail(userInfo.email) }}</div>
          </div>
          <el-button link type="primary" @click="changeEmail">修改</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const isEditing = ref(false)

// 用户信息
const userInfo = reactive({
  username: userStore.userInfo?.username || '',
  nickname: userStore.userInfo?.nickname || '',
  gender: userStore.userInfo?.gender || 0,
  phone: userStore.userInfo?.phone || '',
  email: userStore.userInfo?.email || '',
  birthday: userStore.userInfo?.birthday || '',
  bio: userStore.userInfo?.bio || '',
  avatar: userStore.userInfo?.avatar || ''
})

// 开始编辑
const handleEdit = () => {
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  // 重置表单数据到原始状态
  Object.assign(userInfo, userStore.userInfo)
}

// 保存资料
const saveProfile = () => {
  // TODO: 调用API保存用户资料
  ElMessage.success('保存成功')
  isEditing.value = false
}

// 头像上传成功
const handleAvatarSuccess = (response) => {
  userInfo.avatar = response.url
  ElMessage.success('头像上传成功')
}

// 修改密码
const changePassword = () => {
  // TODO: 实现修改密码逻辑
}

// 修改手机
const changePhone = () => {
  // TODO: 实现修改手机逻辑
}

// 修改邮箱
const changeEmail = () => {
  // TODO: 实现修改邮箱逻辑
}

// 手机号码脱敏
const maskPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 邮箱脱敏
const maskEmail = (email) => {
  if (!email) return ''
  const [username, domain] = email.split('@')
  const maskedUsername = username.charAt(0) + '****' + username.charAt(username.length - 1)
  return `${maskedUsername}@${domain}`
}
</script>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}

.profile-card {
  margin-bottom: 20px;
}

.security-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-content {
  display: flex;
  gap: 50px;
  padding: 20px 0;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.info-section {
  flex: 1;
}

.avatar-uploader {
  text-align: center;
}

.security-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.security-item:last-child {
  border-bottom: none;
}

.item-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.item-desc {
  font-size: 14px;
  color: #999;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: var(--el-fill-color-light);
}

:deep(.el-radio-group) {
  display: flex;
  gap: 20px;
}

@media screen and (max-width: 768px) {
  .profile-content {
    flex-direction: column;
    align-items: center;
  }

  .info-section {
    width: 100%;
  }
}
</style> 