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
        label-width="120px"
      >
        <!-- 联系方式 -->
        <div class="section-title">联系方式</div>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="storeSettings.phone" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item label="客服QQ" prop="qq">
          <el-input v-model="storeSettings.qq" placeholder="请输入客服QQ" />
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="storeSettings.email" placeholder="请输入电子邮箱" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref(null)
const saving = ref(false)

// 店铺设置数据
const storeSettings = ref({
  phone: '400-088-6888',
  qq: '10000',
  email: 'service@huawei.com'
})

// 表单验证规则
const rules = {
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 保存设置
const saveSettings = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    saving.value = true
    
    // TODO: 调用API保存设置
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    ElMessage.success('设置保存成功')
  } catch (error) {
    console.error('表单验证失败:', error)
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
</style> 