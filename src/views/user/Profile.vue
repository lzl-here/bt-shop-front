<template>
  <div class="profile-page">
    <h2>个人资料</h2>

    <el-form
      ref="formRef"
      :model="userForm"
      :rules="rules"
      label-width="100px"
      class="profile-form"
    >
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username" disabled />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="userForm.nickname" />
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="userForm.phone">
          <template #append>
            <el-button type="primary" link @click="verifyPhone">
              {{ userForm.phone ? '更换' : '绑定' }}
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email">
          <template #append>
            <el-button type="primary" link @click="verifyEmail">
              {{ userForm.email ? '更换' : '绑定' }}
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="userForm.gender">
          <el-radio label="male">男</el-radio>
          <el-radio label="female">女</el-radio>
          <el-radio label="other">保密</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="userForm.birthday"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">保存修改</el-button>
        <el-button @click="resetForm(formRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const userForm = ref({
  avatar: 'https://via.placeholder.com/100',
  username: 'lzl',
  nickname: '李先生',
  phone: '138****8888',
  email: 'ex***@example.com',
  gender: 'male',
  birthday: '1990-01-01'
})

interface FormRules {
  nickname: {
    required: boolean;
    message: string;
    trigger: string;
  }[];
  phone: {
    pattern: RegExp;
    message: string;
    trigger: string;
  }[];
  email: {
    type: string;
    message: string;
    trigger: string;
  }[];
}

const rules: FormRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const handleAvatarSuccess = (res) => {
  userForm.value.avatar = res.url
  ElMessage.success('头像上传成功')
}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

const verifyPhone = () => {
  // TODO: 实现手机号验证逻辑
  ElMessage.info('手机号验证功能开发中')
}

const verifyEmail = () => {
  // TODO: 实现邮箱验证逻辑
  ElMessage.info('邮箱验证功能开发中')
}

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      // TODO: 实现保存逻辑
      ElMessage.success('保存成功')
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped>
.profile-page {
  padding: 20px;
}

.profile-page h2 {
  margin-bottom: 30px;
}

.profile-form {
  max-width: 600px;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}

:deep(.el-input-group__append) {
  padding: 0 10px;
}
</style>