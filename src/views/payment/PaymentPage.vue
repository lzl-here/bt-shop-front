<template>
  <div class="payment-page">
    <div class="page-header">
      <h2>交易详情</h2>
      <el-button plain @click="router.push('/user/trades')">返回</el-button>
    </div>

    <!-- 交易信息卡片 -->
    <el-card class="info-card">
      <div class="info-header">
        <div class="trade-info">
          <span class="trade-id">交易号：{{ orderId }}</span>
          <span class="trade-time">创建时间：{{ createTime }}</span>
          <span class="trade-status">支付方式：未支付</span>
          <span class="trade-time">支付时间：-</span>
        </div>
        <div class="trade-status">
          <el-tag type="warning">待付款</el-tag>
        </div>
      </div>
    </el-card>

    <!-- 订单列表卡片 -->
    <el-card class="order-card">
      <template #header>
        <div class="card-header">
          <span class="title">订单信息</span>
        </div>
      </template>

      <div class="store-info">
        <el-icon><Shop /></el-icon>
        <span class="store-name">华为官方旗舰店</span>
      </div>

      <div class="order-items">
        <div class="order-item">
          <el-image 
            src="https://via.placeholder.com/80" 
            class="product-image"
            fit="cover"
          />
          <div class="product-info">
            <div class="product-name">HUAWEI Mate 60 Pro</div>
            <div class="product-specs">
              <el-tag size="small" type="info">墨玉青</el-tag>
              <el-tag size="small" type="info">12GB</el-tag>
              <el-tag size="small" type="info">512GB</el-tag>
            </div>
          </div>
          <div class="price-info">
            <div class="price">¥6999</div>
            <div class="quantity">x1</div>
          </div>
        </div>
      </div>

      <div class="order-summary">
        共1件商品，小计：<span class="total-amount">¥6999</span>
      </div>
    </el-card>

    <!-- 收银台卡片 -->
    <el-card class="payment-card">
      <template #header>
        <div class="card-header">
          <span class="title">收银台</span>
        </div>
      </template>

      <div class="payment-amount">
        <span class="label">交易金额</span>
        <span class="amount">¥{{ amount }}</span>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Shop } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 交易基本信息
const orderId = ref(route.query.orderId)
const amount = ref(Number(route.query.amount) || 0)
const createTime = ref('2024-03-20 14:30:00')
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
    router.push('/user/trades')
  }).catch(() => {
    // 用户点击取消按钮，不做任何操作
  })
}

// 初始化
onMounted(() => {
  if (!orderId.value || !amount.value) {
    ElMessage.error('交易不存在')
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
}

.info-card,
.payment-card {
  margin-bottom: 20px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trade-info {
  display: flex;
  gap: 24px;
  color: #606266;
  font-size: 14px;
}

.payment-amount {
  text-align: center;
  margin-bottom: 30px;
}

.payment-amount .label {
  font-size: 16px;
  color: #606266;
  margin-right: 10px;
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

/* 订单列表样式 */
.order-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.store-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 0 15px;
  border-bottom: 1px solid #f0f0f0;
  color: #606266;
}

.store-name {
  font-size: 14px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.order-items {
  padding: 20px 0;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
}

.product-specs {
  display: flex;
  gap: 8px;
}

.price-info {
  text-align: right;
  min-width: 100px;
}

.price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.quantity {
  color: #909399;
  font-size: 13px;
}

.order-summary {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  color: #606266;
  font-size: 14px;
}

.total-amount {
  margin-left: 8px;
  color: #f56c6c;
  font-size: 16px;
  font-weight: 500;
}
</style> 