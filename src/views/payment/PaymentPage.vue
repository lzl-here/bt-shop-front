<template>
  <div class="payment-page">
    <!-- 订单信息部分 -->
    <div class="order-section">
      <el-card class="order-card">
        <template #header>
          <div class="card-header">
            <span class="title">订单信息</span>
            <span class="order-number">订单号：{{ orderId }}</span>
          </div>
        </template>

        <!-- 商品信息 -->
        <div class="product-list">
          <div class="product-item" v-for="item in orderItems" :key="item.id">
            <el-image :src="item.image" class="product-image" />
            <div class="product-info">
              <div class="product-name">{{ item.name }}</div>
              <div class="product-specs">
                <el-tag size="small" type="info" v-for="(spec, key) in item.specs" :key="key">
                  {{ spec }}
                </el-tag>
              </div>
              <div class="product-price-info">
                <span class="price">¥{{ item.price }}</span>
                <span class="quantity">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 订单金额信息 -->
        <div class="order-amount">
          <div class="amount-item">
            <span class="label">商品总额</span>
            <span class="value">¥{{ totalAmount }}</span>
          </div>
          <div class="amount-item">
            <span class="label">运费</span>
            <span class="value">¥{{ shippingFee }}</span>
          </div>
          <div class="amount-item total">
            <span class="label">应付金额</span>
            <span class="value">¥{{ payAmount }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 收银台部分 -->
    <div class="payment-section">
      <el-card class="payment-card">
        <template #header>
          <div class="card-header">
            <span class="title">收银台</span>
          </div>
        </template>

        <div class="payment-amount">
          <span class="label">支付金额</span>
          <span class="amount">¥{{ payAmount }}</span>
        </div>

        <div class="payment-methods">
          <div class="section-title">选择支付方式</div>
          <div class="method-list">
            <div 
              class="method-item"
              :class="{ active: selectedMethod === 'alipay' }"
              @click="selectedMethod = 'alipay'"
            >
              <i class="method-icon alipay"></i>
              <span class="method-name">支付宝支付</span>
            </div>
            <div 
              class="method-item"
              :class="{ active: selectedMethod === 'wechat' }"
              @click="selectedMethod = 'wechat'"
            >
              <i class="method-icon wechat"></i>
              <span class="method-name">微信支付</span>
            </div>
          </div>
        </div>

        <div class="payment-action">
          <el-button type="primary" size="large" @click="handlePayment">
            立即支付
          </el-button>
          <el-button type="danger" size="large" @click="handleCancel">
            取消支付
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 订单信息
const orderId = ref(route.query.orderId)
const orderItems = ref([
  {
    id: 1,
    name: 'HUAWEI Mate 60 Pro',
    price: 6999,
    quantity: 1,
    image: 'https://via.placeholder.com/120',
    specs: {
      color: '墨玉青',
      memory: '12GB',
      storage: '512GB'
    }
  }
])

// 金额计算
const totalAmount = computed(() => {
  return orderItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
})
const shippingFee = ref(0)
const payAmount = computed(() => totalAmount.value + shippingFee.value)

// 支付方式
const selectedMethod = ref('')

// 处理支付
const handlePayment = () => {
  if (!selectedMethod.value) {
    ElMessage.warning('请选择支付方式')
    return
  }

  // TODO: 调用支付接口
  ElMessage.success('支付成功')
  router.push('/user/trades')
}

// 处理取消支付
const handleCancel = () => {
  ElMessageBox.confirm(
    '确定要取消支付吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 取消支付后返回订单列表页
    router.push('/user/trades')
  }).catch(() => {
    // 用户点击取消按钮，不做任何操作
  })
}

// 初始化
onMounted(() => {
  if (!orderId.value) {
    ElMessage.error('订单不存在')
    router.push('/')
  }
})
</script>

<style scoped>
.payment-page {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.order-card,
.payment-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: 500;
}

.order-number {
  color: #909399;
}

.product-list {
  margin-bottom: 20px;
}

.product-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  margin-bottom: 8px;
  font-size: 14px;
}

.product-specs {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.product-price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 500;
}

.quantity {
  color: #909399;
}

.order-amount {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.amount-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.amount-item.total {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  font-size: 16px;
  font-weight: 500;
}

.payment-amount {
  text-align: center;
  margin-bottom: 30px;
}

.payment-amount .amount {
  font-size: 24px;
  color: #f56c6c;
  font-weight: 500;
}

.section-title {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 500;
}

.method-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.method-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
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
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
}

.method-icon.alipay {
  background-image: url('path/to/alipay-icon.png');
}

.method-icon.wechat {
  background-image: url('path/to/wechat-icon.png');
}

.payment-action {
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.payment-action .el-button {
  width: 180px;
  height: 48px;
  font-size: 16px;
}
</style> 