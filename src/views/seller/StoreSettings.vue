<template>
  <div class="store-settings">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>店铺设置</span>
          <div class="header-actions">
            <el-button 
              type="primary" 
              @click="saveSettings"
              :loading="saving"
            >
              保存设置
            </el-button>
          </div>
        </div>
      </template>

      <el-form 
        ref="formRef"
        :model="storeSettings"
        :rules="rules"
        label-width="80px"
        class="settings-form"
      >
        <!-- 基本信息 -->
        <div class="section-title">基本信息</div>
        
        <el-form-item label="店铺头像">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload"
          >
            <img v-if="storeSettings.logo" :src="storeSettings.logo" class="avatar">
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="店铺名称" prop="name">
          <el-input 
            v-model="storeSettings.name" 
            placeholder="请输入店铺名称"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="店铺描述" prop="description">
          <el-input
            v-model="storeSettings.description"
            type="textarea"
            :rows="4"
            placeholder="请输入店铺描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useStoreStore } from '../../stores/store'
import { updateShopInfo } from '../../api/storeApi'

const formRef = ref(null)
const saving = ref(false)
const storeStore = useStoreStore()

// 店铺设置数据
const storeSettings = ref({
  logo: storeStore.storeInfo?.logo || '',
  name: storeStore.storeInfo?.name || '',
  description: storeStore.storeInfo?.description || ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入店铺名称', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入店铺描述', trigger: 'blur' },
    { max: 200, message: '描述不能超过 200 个字符', trigger: 'blur' }
  ]
}

// 处理头像上传成功
const handleLogoSuccess = (res) => {
  storeSettings.value.logo = res.data.url
}

// 上传前校验
const beforeLogoUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 保存设置
const saveSettings = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    saving.value = true
    
    // 调用API保存设置
    const res = await updateShopInfo({
      shop_id: storeStore.storeInfo.id,
      name: storeSettings.value.name,
      description: storeSettings.value.description,
      logo: storeSettings.value.logo
    })

    if (res.code === 1) {
      // 更新store中的店铺信息
      storeStore.setStoreInfo({
        ...storeStore.storeInfo,
        name: storeSettings.value.name,
        description: storeSettings.value.description,
        logo: storeSettings.value.logo
      })
      
      ElMessage.success('设置保存成功')
    } else {
      throw new Error(res.msg || '保存失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error(error.message || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.store-settings {
  padding: 20px;
}

.settings-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.settings-form {
  margin-top: 20px;
}

.settings-form :deep(.el-form-item__label) {
  font-weight: normal;
  color: #606266;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 100px;
  height: 100px;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  max-width: 500px;
}
</style> 