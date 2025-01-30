<template>
  <div class="order-detail">
    <div class="page-header">
      <h2>订单详情</h2>
      <el-button @click="$router.back()">返回</el-button>
    </div>

    <!-- 订单信息 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <div class="store-info">
            <el-icon><Shop /></el-icon>
            <span class="store-name">{{ order.storeName }}</span>
          </div>
          <div class="order-status">{{ order.status }}</div>
        </div>
      </template>

      <div class="section-title">订单信息</div>
      <div class="info-list">
        <div class="info-item">
          <span class="label">订单号：</span>
          <span class="value">{{ order.id }}</span>
        </div>
        <div class="info-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ order.createTime }}</span>
        </div>
        <div class="info-item">
          <span class="label">支付方式：</span>
          <span class="value">{{ order.paymentMethod || '未支付' }}</span>
        </div>
        <div class="info-item">
          <span class="label">支付时间：</span>
          <span class="value">{{ order.payTime || '-' }}</span>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="section-title">商品信息</div>
      <div class="product-list">
        <div v-for="product in order.products" :key="product.id" class="product-item">
          <img :src="product.image" :alt="product.name">
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-specs">
              <el-tag size="small" type="info">{{ product.specs.color }}</el-tag>
              <el-tag size="small" type="info">{{ product.specs.memory }}</el-tag>
              <el-tag size="small" type="info">{{ product.specs.storage }}</el-tag>
            </div>
            <div class="product-price-info">
              <span class="price">¥{{ product.price.toFixed(2) }}</span>
              <span class="quantity">x{{ product.quantity }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单金额信息 -->
      <div class="amount-info">
        <div class="amount-item">
          <span class="label">商品总额：</span>
          <span class="value">¥{{ order.totalAmount.toFixed(2) }}</span>
        </div>
        <div class="amount-item">
          <span class="label">运费：</span>
          <span class="value">¥0.00</span>
        </div>
        <div class="amount-item total">
          <span class="label">实付款：</span>
          <span class="value price">¥{{ order.totalAmount.toFixed(2) }}</span>
        </div>
      </div>
    </el-card>

    <!-- 订单操作 -->
    <div class="order-actions" v-if="order.status === '待收货'">
      <el-button type="primary" @click="confirmReceipt">确认收货</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Shop } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 模拟订单数据
const order = ref({
  id: 'O001',
  storeName: '华为官方旗舰店',
  status: '待收货',
  createTime: '2024-03-20 14:30:00',
  totalAmount: 6999.00,
  totalItems: 1,
  products: [
    {
      id: 1,
      name: 'HUAWEI Mate 60 Pro',
      price: 6999.00,
      quantity: 1,
      image: 'https://via.placeholder.com/80',
      specs: {
        color: '墨玉青',
        memory: '12GB',
        storage: '512GB'
      }
    }
  ]
})

// 确认收货
const confirmReceipt = () => {
  ElMessageBox.confirm(
    '确认已收到商品？',
    '确认收货',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('确认收货成功')
    order.value.status = '已完成'
  })
}

// 获取订单详情
const fetchOrderDetail = async () => {
  // TODO: 实现获取订单详情的接口调用
  console.log('获取订单详情', route.params.orderId)
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
.order-detail {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.info-card {
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
}

.store-name {
  font-weight: 500;
}

.order-status {
  color: var(--el-color-primary);
  font-weight: 500;
}

.section-title {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  margin: 24px 0 16px;
  padding-left: 8px;
  border-left: 4px solid var(--el-color-primary);
}

.info-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.label {
  color: #909399;
}

.product-list {
  margin: 20px 0;
}

.product-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80px;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-specs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.product-specs :deep(.el-tag) {
  height: 20px;
  padding: 0 6px;
  font-size: 12px;
}

.product-price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f56c6c;
  font-size: 14px;
  font-weight: 500;
}

.quantity {
  color: #909399;
  font-size: 13px;
}

.amount-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.amount-item {
  display: flex;
  gap: 20px;
}

.amount-item.total {
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style> 