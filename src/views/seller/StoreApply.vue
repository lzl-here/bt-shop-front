<template>
  <div class="store-apply">
    <div class="apply-container">
      <h2>店铺入驻</h2>
      <el-form 
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="店铺名称" prop="storeName">
          <el-input v-model="formData.storeName" placeholder="请输入店铺名称" />
        </el-form-item>
        
        <el-form-item label="店铺简介" prop="description">
          <el-input 
            v-model="formData.description" 
            type="textarea" 
            placeholder="请输入店铺简介"
            :rows="4"
          />
        </el-form-item>
        
        <el-form-item label="店铺logo" prop="logo">
          <el-upload
            class="logo-uploader"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="(file) => beforeLogoUpload(file.raw)"
          >
            <img v-if="formData.logo" :src="formData.logo" class="logo">
            <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        
        <el-form-item label="经营类目" prop="category">
          <el-select v-model="formData.category" placeholder="请选择经营类目">
            <el-option label="数码电子" value="electronics" />
            <el-option label="服装服饰" value="clothing" />
            <el-option label="美妆个护" value="beauty" />
            <el-option label="食品生鲜" value="food" />
            <el-option label="图书文具" value="books" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交申请</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useStoreStore } from '../../stores/store'

const router = useRouter()
const storeStore = useStoreStore()
const formRef = ref(null)

const formData = ref({
  storeName: '',
  description: '',
  logo: '',
  phone: '',
  category: ''
})

const rules = {
  storeName: [
    { required: true, message: '请输入店铺名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入店铺简介', trigger: 'blur' }
  ],
  logo: [
    { required: true, message: '请上传店铺logo', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择经营类目', trigger: 'change' }
  ]
}

const handleLogoSuccess = (res) => {
  // 由于没有实际的上传接口，我们直接使用本地 FileReader 来预览图片
  formData.value.logo = res // 这里 res 就是我们在 beforeLogoUpload 中创建的 URL
}

const beforeLogoUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }

  // 创建本地预览URL
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    formData.value.logo = e.target.result
  }

  return false // 阻止默认上传行为
}

const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用店铺入驻API
        // 模拟API调用成功
        const storeInfo = {
          ...formData.value,
          id: 'S' + Date.now(),
          status: 'active',
          createTime: new Date().toISOString()
        }
        
        // 更新店铺状态
        storeStore.setStoreInfo(storeInfo)
        
        ElMessage.success('申请提交成功，店铺已开通')
        // 跳转到店铺管理页面并选中概览标签
        router.push('/seller?tab=overview')
      } catch (error) {
        ElMessage.error('提交失败，请重试')
      }
    }
  })
}
</script>

<style scoped>
.store-apply {
  padding: 40px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.apply-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.logo-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  transition: border-color 0.3s;
}

.logo-uploader:hover {
  border-color: var(--el-color-primary);
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.logo {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}

/* 添加一些动画效果 */
.logo-enter-active,
.logo-leave-active {
  transition: opacity 0.3s ease;
}

.logo-enter-from,
.logo-leave-to {
  opacity: 0;
}
</style> 