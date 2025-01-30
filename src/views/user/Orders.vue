<template>
  <div class="content-container">
    <!-- 订单状态标签 -->
    <div class="order-tabs">
      <div class="tab active">我的订单</div>
      <div class="tab">全部订单</div>
      <div class="tab">待付款</div>
      <div class="tab">待收货</div>
      <div class="tab">已完成</div>
      <div class="tab logout-tab" @click="handleLogout">退出登录</div>
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
            <span class="order-time">{{ order.orderTime }}</span>
            <span class="order-number">订单号：{{ order.orderNumber }}</span>
            <span class="store-name">{{ order.storeName }}</span>
          </div>
          <span class="order-status">{{ order.status }}</span>
        </div>
        <div class="order-products">
          <div v-for="product in order.products" :key="product.id" class="product-item">
            <img :src="product.image" :alt="product.name">
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-price">¥{{ product.price }}</div>
              <div class="product-quantity">x{{ product.quantity }}</div>
            </div>
          </div>
        </div>
        <div class="order-footer">
          <div class="order-total">
            总计：<span class="price">¥{{ order.total }}</span>
          </div>
          <div class="order-actions">
            <el-button type="primary" link>订单详情</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <div class="pagination-left">
        Total {{ total }}
        <el-select v-model="pageSize" class="page-size-select">
          <el-option
            v-for="size in [12, 24, 36]"
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
import { ref, computed, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()

const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(25)
const goToPage = ref('')

// 模拟更多订单数据
const allOrders = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  orderTime: '2024-03-20 14:30:00',
  orderNumber: `O202403200000${(index + 1).toString().padStart(3, '0')}`,
  storeName: index % 2 === 0 ? '跨境贸易6666' : '杭州潘小二X123',
  status: '已关闭',
  total: (index + 1) * 1000,
  products: [
    {
      id: index + 1,
      name: `商品${index + 1}`,
      price: (index + 1) * 1000,
      quantity: 1,
      image: 'https://via.placeholder.com/80'
    }
  ]
}))

// 表格数据使用计算属性
const orders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allOrders.slice(start, end)
})

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

// 监听页码大小变化
watch(pageSize, () => {
  currentPage.value = 1
})

// 退出登录处理
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
    center: true,
    closeOnClickModal: false
  })
    .then(() => {
      userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
    })
    .catch(() => {
      // 用户取消时不做任何操作
    })
}
</script>

<style scoped>
.content-container {
  width: 100%;
  padding: 0;  /* 移除内边距 */
  background-color: #f5f7fa;
}

.order-tabs {
  display: flex;
  gap: 120px;  /* 减小间距 */
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding: 0 0 10px 0;
  background-color: #fff;
}

.tab {
  font-size: 16px;
  color: #666;
  cursor: pointer;
  padding: 15px 0;  /* 移除左右内边距，只保留上下内边距 */
  position: relative;
}

.tab:first-child {
  padding-left: 20px;  /* 只给第一个标签添加左边距 */
}

.tab.active {
  color: #ff4d4f;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ff4d4f;
}

.search-box {
  margin: 20px;
}

.search-input {
  width: 300px;
}

.order-item {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;  /* 减小底部间距 */
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  background-color: #fafafa;
}

.order-info {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 13px;
}

.store-name {
  color: #409eff;
  font-size: 13px;
}

.order-status {
  color: #ff4d4f;
  font-size: 13px;
}

.order-products {
  padding: 15px;
}

.product-item {
  display: flex;
  margin-bottom: 12px;
}

.product-item:last-child {
  margin-bottom: 0;
}

.product-item img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  margin-left: 12px;
  flex: 1;
}

.product-name {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
}

.product-price {
  color: #ff4d4f;
  font-size: 13px;
}

.product-quantity {
  color: #999;
  font-size: 12px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-top: 1px solid #eee;
  background-color: #fafafa;
}

.order-total {
  color: #666;
  font-size: 13px;
}

.order-total .price {
  color: #ff4d4f;
  font-size: 16px;
  font-weight: bold;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  color: #666;
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

:deep(.el-select .el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

:deep(.el-pagination .el-pager li) {
  border: none;
  background: none;
}

:deep(.el-pagination .el-pager li.is-active) {
  color: #409eff;
  font-weight: bold;
}

:deep(.el-pagination button:disabled) {
  background: none;
}

/* 修改退出登录按钮样式 */
.logout-tab {
  margin-left: auto;  /* 将退出登录推到最右边 */
  color: #ff4d4f;
  cursor: pointer;
  padding: 15px 20px !important;  /* 增加点击区域 */
}

.logout-tab:hover {
  opacity: 0.8;
}
</style> 