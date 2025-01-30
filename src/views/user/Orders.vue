<template>
  <div class="orders">
    <!-- 订单状态标签 -->
    <div class="order-tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.value"
        :class="['tab', { active: currentTab === tab.value }]"
        @click="currentTab = tab.value"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-box">
      <el-input
        v-model="searchText"
        placeholder="请输入订单号搜索"
        class="search-input"
      >
        <template #append>
          <el-button type="primary">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>

    <!-- 订单列表 -->
    <div class="order-list" v-if="orders.length">
      <div v-for="order in orders" :key="order.id" class="order-item">
        <div class="order-header">
          <div class="order-info">
            <span class="order-time">{{ order.createTime }}</span>
            <span class="order-id">订单号：{{ order.id }}</span>
            <span class="store-name">{{ order.storeName }}</span>
          </div>
          <div class="order-status">{{ order.status }}</div>
        </div>
        
        <div class="order-products">
          <div v-for="product in order.products" :key="product.id" class="product-item">
            <img :src="product.image" :alt="product.name">
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
              <div class="product-quantity">x{{ product.quantity }}</div>
            </div>
          </div>
        </div>
        
        <div class="order-footer">
          <div class="order-amount">
            总计：<span class="price">¥{{ order.totalAmount.toFixed(2) }}</span>
          </div>
          <div class="order-actions">
            <template v-if="order.status === '待付款'">
              <el-button 
                type="primary" 
                @click="goToPayment(order)"
              >
                立即付款
              </el-button>
              <el-button 
                type="danger" 
                plain
                @click="cancelOrder(order)"
              >
                取消订单
              </el-button>
            </template>
            <el-button 
              v-if="order.status === '待收货'" 
              type="success"
              @click="handleConfirm(order)"
            >
              确认收货
            </el-button>
            <el-button 
              v-if="['已完成', '已取消'].includes(order.status)"
              type="primary" 
              link
              @click="handleDelete(order)"
            >
              删除订单
            </el-button>
            <el-button type="primary" link @click="viewDetail(order)">
              订单详情
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-else
      description="暂无订单"
    />

    <!-- 分页 -->
    <div class="pagination-container">
      <div class="pagination-left">
        Total {{ total }}
        <el-select v-model="pageSize" class="page-size-select">
          <el-option
            v-for="size in [10, 20, 30]"
            :key="size"
            :label="`${size}/page`"
            :value="size"
          />
        </el-select>
      </div>
      <div class="pagination-center">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="pagination-right">
        Go to
        <el-input
          v-model="goToPage"
          class="go-to-input"
          @keyup.enter="handleGoToPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 订单状态标签
const tabs = [
  { label: '全部订单', value: 'all' },
  { label: '待付款', value: 'unpaid' },
  { label: '待发货', value: 'unshipped' },
  { label: '待收货', value: 'unreceived' },
  { label: '已完成', value: 'completed' }
]

const currentTab = ref('all')
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const goToPage = ref('')

// 模拟订单数据
const mockOrders = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  orderTime: '2024-03-20 14:30:00',
  orderNumber: `ORDER20240320${String(index + 1).padStart(3, '0')}`,
  storeName: '华为官方旗舰店',
  status: ['待付款', '待发货', '待收货', '已完成', '已取消'][index % 5],
  total: 6999.00,
  products: [
    {
      id: 1,
      name: 'HUAWEI Mate 60 Pro',
      price: 6999.00,
      quantity: 1,
      image: 'https://via.placeholder.com/80'
    }
  ]
}))

// 根据当前标签筛选订单
const orders = computed(() => {
  let filteredOrders = mockOrders
  if (currentTab.value !== 'all') {
    const statusMap = {
      unpaid: '待付款',
      unshipped: '待发货',
      unreceived: '待收货',
      completed: '已完成'
    }
    filteredOrders = mockOrders.filter(order => order.status === statusMap[currentTab.value])
  }
  if (searchText.value) {
    filteredOrders = filteredOrders.filter(order => 
      order.orderNumber.toLowerCase().includes(searchText.value.toLowerCase())
    )
  }
  total.value = filteredOrders.length
  const start = (currentPage.value - 1) * pageSize.value
  return filteredOrders.slice(start, start + pageSize.value)
})

// 获取状态样式
const getStatusClass = (status) => {
  const classMap = {
    '待付款': 'warning',
    '待发货': 'info',
    '待收货': 'primary',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return classMap[status]
}

// 跳转到收银台
const goToPayment = (order) => {
  router.push({
    path: '/payment',
    query: {
      orderId: order.id,
      amount: order.totalAmount
    }
  })
}

// 确认收货
const handleConfirm = (order) => {
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

// 删除订单
const handleDelete = (order) => {
  ElMessageBox.confirm(
    '确定要删除该订单吗？',
    '删除订单',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('订单已删除')
    // TODO: 实现删除逻辑
  })
}

// 查看订单详情
const viewDetail = (order) => {
  router.push(`/user/orders/${order.id}`)
}

// 分页相关
const handleCurrentChange = (val) => {
  currentPage.value = val
}

const handleGoToPage = () => {
  const page = parseInt(goToPage.value)
  if (page && page > 0 && page <= Math.ceil(total.value / pageSize.value)) {
    currentPage.value = page
  }
  goToPage.value = ''
}

// 取消订单
const cancelOrder = (order) => {
  ElMessageBox.confirm(
    '确定要取消该订单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现取消订单的逻辑
    ElMessage.success('订单已取消')
    // 更新订单状态
    order.status = '已取消'
  })
}
</script>

<style scoped>
.orders {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.order-tabs {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
  background: #fff;
  padding: 0 20px;
  border-radius: 4px;
}

.tab {
  padding: 15px 0;
  cursor: pointer;
  position: relative;
  color: #606266;
}

.tab.active {
  color: var(--el-color-primary);
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--el-color-primary);
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.order-item {
  background: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.order-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  display: flex;
  gap: 20px;
  color: #909399;
  font-size: 14px;
}

.store-name {
  color: var(--el-color-primary);
}

.order-status {
  font-weight: 500;
}

.order-status.warning { color: var(--el-color-warning) }
.order-status.info { color: var(--el-color-info) }
.order-status.primary { color: var(--el-color-primary) }
.order-status.success { color: var(--el-color-success) }
.order-status.danger { color: var(--el-color-danger) }

.order-products {
  padding: 20px;
}

.product-item {
  display: flex;
  gap: 15px;
  padding: 10px 0;
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

.product-price {
  color: #f56c6c;
  font-weight: 500;
  margin-bottom: 4px;
}

.product-quantity {
  color: #909399;
  font-size: 13px;
}

.order-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-amount {
  color: #606266;
}

.order-amount .price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 15px 20px;
  border-radius: 4px;
  margin-top: 20px;
}

.pagination-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-size-select {
  width: 110px;
}

.pagination-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.pagination-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.go-to-input {
  width: 60px;
}

:deep(.el-input__wrapper) {
  padding: 0 8px;
}

:deep(.el-input__inner) {
  text-align: center;
}
</style> 