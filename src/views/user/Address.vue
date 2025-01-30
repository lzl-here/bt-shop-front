<template>
  <div class="address-page">
    <div class="page-header">
      <h2>收货地址</h2>
      <el-button type="primary" @click="showAddressDialog">
        <el-icon><Plus /></el-icon>
        新增地址
      </el-button>
    </div>

    <div class="address-list">
      <el-card v-for="address in addresses" :key="address.id" class="address-item">
        <div class="address-info">
          <div class="contact-info">
            <span class="name">{{ address.name }}</span>
            <span class="phone">{{ address.phone }}</span>
            <el-tag v-if="address.isDefault" size="small" type="success">默认</el-tag>
          </div>
          <div class="address-detail">
            {{ address.province }}{{ address.city }}{{ address.district }}
            {{ address.detail }}
          </div>
        </div>
        <div class="address-actions">
          <el-button type="primary" link @click="editAddress(address)">编辑</el-button>
          <el-button type="danger" link @click="deleteAddress(address)">删除</el-button>
          <el-button 
            v-if="!address.isDefault" 
            type="primary" 
            link 
            @click="setDefault(address)"
          >
            设为默认
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

// 模拟地址数据
const addresses = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园南路XX号',
    isDefault: true
  },
  // ... 其他地址数据
])

// 编辑地址
const editAddress = (address) => {
  // TODO: 实现编辑地址的逻辑
  console.log('编辑地址', address)
}

// 删除地址
const deleteAddress = (address) => {
  ElMessageBox.confirm(
    '确定要删除该地址吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除地址的逻辑
    ElMessage.success('地址已删除')
  })
}

// 设为默认地址
const setDefault = (address) => {
  // TODO: 实现设置默认地址的逻辑
  addresses.value.forEach(item => {
    item.isDefault = item.id === address.id
  })
  ElMessage.success('已设为默认地址')
}

// 显示地址编辑对话框
const showAddressDialog = () => {
  // TODO: 实现新增地址的逻辑
  console.log('新增地址')
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.contact-info {
  margin-bottom: 8px;
}

.name {
  font-weight: 500;
  margin-right: 16px;
}

.phone {
  color: #666;
  margin-right: 16px;
}

.address-detail {
  color: #666;
  line-height: 1.5;
}

.address-actions {
  display: flex;
  gap: 16px;
}
</style> 