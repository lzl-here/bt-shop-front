<template>
  <div class="trade-detail">
    <div class="page-header">
      <h2>交易详情</h2>
      <el-button @click="$router.back()">返回</el-button>
    </div>

    <!-- 交易信息 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>交易信息</span>
          <div class="trade-status">{{ trade.status }}</div>
        </div>
      </template>
      <div class="info-list">
        <div class="info-item">
          <span class="label">交易号：</span>
          <span class="value">{{ trade.id }}</span>
        </div>
        <div class="info-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ trade.createTime }}</span>
        </div>
        <div class="info-item">
          <span class="label">支付方式：</span>
          <span class="value">{{ trade.paymentMethod || '未支付' }}</span>
        </div>
        <div class="info-item">
          <span class="label">支付时间：</span>
          <span class="value">{{ trade.payTime || '-' }}</span>
        </div>
      </div>
    </el-card>

    <!-- 店铺订单列表 -->
    <el-card v-for="order in trade.orders" :key="order.id" class="order-card">
      <template #header>
        <div class="store-header">
          <div class="store-info">
            <el-icon><Shop /></el-icon>
            <span class="store-name">{{ order.storeName }}</span>
          </div>
          <div class="order-status">{{ order.status }}</div>
        </div>
      </template>

      <!-- 添加订单信息标题 -->
      <div class="section-title">订单信息</div>

      <div class="product-list">
        <div 
          v-for="product in order.products" 
          :key="product.id" 
          class="product-item"
          @click="viewOrderDetail(order.id)"
        >
          <img :src="product.image" :alt="product.name">
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-specs">
              <el-tag size="small" type="info">{{ product.specs.color }}</el-tag>
              <el-tag size="small" type="info">{{ product.specs.memory }}</el-tag>
              <el-tag size="small" type="info">{{ product.specs.storage }}</el-tag>
            </div>
            <div class="product-price">
              <span class="price">¥{{ product.price.toFixed(2) }}</span>
              <span class="quantity">x{{ product.quantity }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="order-footer">
        <div class="order-amount">
          共{{ order.totalItems }}件商品，小计：
          <span class="price">¥{{ order.totalAmount.toFixed(2) }}</span>
        </div>
        <div class="order-actions">
          <el-button 
            v-if="order.status === '待收货'"
            type="primary"
            @click="confirmReceipt(order)"
          >
            确认收货
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 交易金额信息 -->
    <el-card class="amount-card">
      <div class="amount-info">
        <div class="amount-item">
          <span class="label">商品总额：</span>
          <span class="value">¥{{ trade.totalAmount.toFixed(2) }}</span>
        </div>
        <div class="amount-item">
          <span class="label">运费：</span>
          <span class="value">¥0.00</span>
        </div>
        <div class="amount-item total">
          <span class="label">实付款：</span>
          <span class="value price">¥{{ trade.totalAmount.toFixed(2) }}</span>
        </div>
      </div>
    </el-card>

    <!-- 交易操作 -->
    <div class="trade-actions" v-if="trade.status === '待付款'">
      <el-button type="primary" @click="goToPayment">立即付款</el-button>
      <el-button type="danger" plain @click="cancelTrade">取消交易</el-button>
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

// 模拟交易数据
const trade = ref({
  id: 'T001',
  createTime: '2024-03-20 14:30:00',
  status: '待付款',
  totalAmount: 13998.00,
  orders: [
    {
      id: 'O001',
      storeName: '华为官方旗舰店',
      totalItems: 1,
      totalAmount: 6999.00,
      status: '待付款',
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
    },
    {
      id: 'O002',
      storeName: '小米官方旗舰店',
      totalItems: 1,
      totalAmount: 6999.00,
      status: '待付款',
      products: [
        {
          id: 2,
          name: '小米14 Pro',
          price: 6999.00,
          quantity: 1,
          image: 'https://via.placeholder.com/80',
          specs: {
            color: '黑色',
            memory: '12GB',
            storage: '512GB'
          }
        }
      ]
    }
  ]
})

// 确认收货
const confirmReceipt = (order) => {
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
    order.status = '已完成'
  })
}

// 跳转到收银台
const goToPayment = () => {
  router.push({
    path: '/payment',
    query: {
      tradeId: trade.value.id,
      amount: trade.value.totalAmount
    }
  })
}

// 取消交易
const cancelTrade = () => {
  ElMessageBox.confirm(
    '确定要取消该交易吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('交易已取消')
    trade.value.status = '已取消'
  })
}

// 获取交易详情
const fetchTradeDetail = async () => {
  // TODO: 实现获取交易详情的接口调用
  console.log('获取交易详情', route.params.tradeId)
}

// 查看订单详情
const viewOrderDetail = (orderId) => {
  router.push(`/user/orders/${orderId}`)
}

onMounted(() => {
  fetchTradeDetail()
})
</script>

<style scoped>
.trade-detail {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.info-card,
.order-card,
.amount-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trade-status {
  color: var(--el-color-primary);
  font-weight: 500;
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

.store-header {
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

.product-list {
  margin: 20px 0;
}

.product-item {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.product-item:hover {
  background-color: #f5f7fa;
}

.product-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 14px;
  margin-bottom: 8px;
}

.product-specs {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.product-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f56c6c;
  font-weight: 500;
}

.quantity {
  color: #909399;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  margin-top: 15px;
  border-top: 1px dashed #eee;
}

.amount-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
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

.trade-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.section-title {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid var(--el-color-primary);
}
</style> 