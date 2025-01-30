<template>
  <div class="seller-order-detail">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="title">订单详情</div>
      <div class="order-number">订单号：{{ order?.orderNumber }}</div>
    </div>

    <!-- 订单基本信息 -->
    <div class="section">
      <div class="section-header">
        <h3>订单信息</h3>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">下单时间：</span>
          <span class="value">{{ order?.orderTime }}</span>
        </div>
        <div class="info-item">
          <span class="label">订单状态：</span>
          <span class="value">
            <el-tag :type="getStatusType(order?.status)">{{ order?.status }}</el-tag>
          </span>
        </div>
        <div class="info-item">
          <span class="label">支付方式：</span>
          <span class="value">{{ order?.paymentMethod }}</span>
        </div>
        <div class="info-item">
          <span class="label">支付时间：</span>
          <span class="value">{{ order?.paymentTime || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="section">
      <div class="section-header">
        <h3>商品信息</h3>
      </div>
      <el-table :data="order?.products" style="width: 100%">
        <el-table-column label="商品信息">
          <template #default="{ row }">
            <div class="product-info">
              <el-image :src="row.image" :preview-src-list="[row.image]" class="product-image" />
              <div class="product-detail">
                <div class="product-name">{{ row.name }}</div>
                <div class="product-price">¥{{ row.price.toFixed(2) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" align="center" />
        <el-table-column label="小计" width="150" align="right">
          <template #default="{ row }">
            ¥{{ (row.price * row.quantity).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="order-total">
        总计：<span class="total-amount">¥{{ order?.total.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 买家信息 -->
    <div class="section">
      <div class="section-header">
        <h3>买家信息</h3>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">买家：</span>
          <span class="value">{{ order?.customerName }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系电话：</span>
          <span class="value">{{ order?.customerPhone || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <el-button @click="goBack">返回</el-button>
      <el-button 
        v-if="['已支付', '待发货', '部分发货'].includes(order?.status)"
        type="primary" 
        @click="handleShip"
      >
        发货
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const order = ref(null)

// 获取订单详情
const fetchOrderDetail = async () => {
  // TODO: 调用API获取订单详情
  // 模拟数据
  order.value = {
    orderNumber: route.params.orderNumber,
    orderTime: '2024-03-20 13:09:00',
    paymentTime: '2024-03-20 13:10:25',
    status: '待发货',
    paymentMethod: '支付宝',
    customerName: '张三',
    customerPhone: '138****8888',
    total: 6999.00,
    products: [
      {
        id: 1,
        name: 'HUAWEI Mate 60 Pro',
        price: 6999.00,
        quantity: 1,
        image: 'https://via.placeholder.com/100',
        status: '待发货'
      }
    ]
  }
}

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case '待付款':
      return 'warning'
    case '已支付':
      return 'info'
    case '待发货':
      return 'primary'
    case '部分发货':
      return 'warning'
    case '已发货':
      return 'success'
    case '已完成':
      return 'success'
    default:
      return 'info'
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理发货
const handleShip = () => {
  ElMessageBox.confirm(
    `确定要发货订单 ${order.value.orderNumber} 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('发货成功')
    order.value.status = '已发货'
    order.value.products.forEach(product => {
      product.status = '已发货'
    })
  })
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
.seller-order-detail {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}

.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header .title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.page-header .order-number {
  color: #909399;
  font-size: 14px;
}

.section {
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.section-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  color: #909399;
  margin-right: 8px;
  min-width: 70px;
}

.value {
  color: #303133;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.product-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-size: 14px;
  color: #303133;
}

.product-price {
  font-size: 14px;
  color: #f56c6c;
}

.order-total {
  margin-top: 16px;
  text-align: right;
  font-size: 14px;
  color: #606266;
}

.total-amount {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
  margin-left: 8px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}
</style> 