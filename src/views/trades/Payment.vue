<template>
  <div class="payment-container">
    <div class="payment-header">
      <h2>收银台</h2>
      <div class="order-info">
        订单号：{{ orderId }}
      </div>
    </div>

    <el-card class="payment-card">
      <div class="amount-section">
        <div class="amount-label">支付金额</div>
        <div class="amount">¥{{ amount.toFixed(2) }}</div>
      </div>

      <div class="payment-methods">
        <div class="method-title">选择支付方式</div>
        <div class="method-list">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            :class="['method-item', { active: selectedMethod === method.id }]"
            @click="selectMethod(method.id)"
          >
            <img :src="method.icon" :alt="method.name" class="method-icon">
            <span class="method-name">{{ method.name }}</span>
          </div>
        </div>
      </div>

      <div class="action-section">
        <el-button 
          type="primary" 
          size="large" 
          :loading="paying"
          :disabled="!selectedMethod"
          @click="handlePayment"
        >
          立即支付
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const orderId = ref(route.query.orderId)
const amount = ref(Number(route.query.amount) || 0)
const paying = ref(false)
const selectedMethod = ref(null)

const paymentMethods = [
  {
    id: 'alipay',
    name: '支付宝',
    icon: '/icons/alipay.png'
  },
  {
    id: 'wechat',
    name: '微信支付',
    icon: '/icons/wechat.png'
  }
]

const selectMethod = (methodId) => {
  selectedMethod.value = methodId
}

const handlePayment = async () => {
  if (!selectedMethod.value) {
    ElMessage.warning('请选择支付方式')
    return
  }

  paying.value = true
  try {
    // 模拟支付过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    ElMessage.success('支付成功')
    // 跳转到购物车页面
    router.push('/cart')
  } catch (error) {
    ElMessage.error('支付失败，请重试')
  } finally {
    paying.value = false
  }
}

// 检查订单信息
onMounted(() => {
  if (!orderId.value || !amount.value) {
    ElMessage.error('订单信息无效')
    router.push('/')
  }
})
</script>

<style scoped>
.payment-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.payment-header {
  margin-bottom: 30px;
  text-align: center;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.order-info {
  color: #666;
  font-size: 14px;
}

.payment-card {
  padding: 30px;
}

.amount-section {
  text-align: center;
  margin-bottom: 40px;
}

.amount-label {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.amount {
  font-size: 36px;
  color: #f56c6c;
  font-weight: bold;
}

.payment-methods {
  margin-bottom: 40px;
}

.method-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.method-list {
  display: flex;
  gap: 20px;
}

.method-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.method-item:hover {
  border-color: var(--el-color-primary);
}

.method-item.active {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.method-icon {
  width: 32px;
  height: 32px;
}

.method-name {
  font-size: 16px;
  color: #333;
}

.action-section {
  text-align: center;
}

.action-section .el-button {
  width: 200px;
}
</style> 