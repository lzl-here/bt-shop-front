<template>
  <div class="trades">
    <!-- 交易状态标签 -->
    <div class="trade-tabs">
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
        placeholder="请输入交易号搜索"
        class="search-input"
      >
        <template #append>
          <el-button type="primary">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>

    <!-- 交易列表 -->
    <div class="trade-list" v-if="trades.length">
      <div v-for="trade in trades" :key="trade.id" class="trade-item">
        <div class="trade-header">
          <div class="trade-info">
            <span class="trade-time">{{ trade.createTime }}</span>
            <span class="trade-id">交易号：{{ trade.id }}</span>
          </div>
          <div class="trade-status">{{ trade.status }}</div>
        </div>

        <!-- 店铺订单列表 -->
        <div class="store-orders">
          <div v-for="order in trade.orders" :key="order.id" class="store-order">
            <div class="store-info">
              <el-icon><Shop /></el-icon>
              <span class="store-name">{{ order.storeName }}</span>
            </div>

            <div class="product-list">
              <div 
                v-for="product in order.products" 
                :key="product.id" 
                class="product-item"
                @click="viewTradeDetail(trade.id)"
              >
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
          </div>
        </div>

        <div class="trade-footer">
          <div class="trade-amount">
            总计：<span class="price">¥{{ trade.totalAmount.toFixed(2) }}</span>
          </div>
          <div class="trade-actions">
            <template v-if="trade.status === '待付款'">
              <el-button 
                type="primary" 
                @click="goToPayment(trade)"
              >
                立即付款
              </el-button>
              <el-button 
                type="danger" 
                plain
                @click="cancelTrade(trade)"
              >
                取消交易
              </el-button>
            </template>
            <el-button type="primary" link @click="viewTradeDetail(trade.id)">
              交易详情
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-else
      description="暂无交易"
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
import { Search, Shop } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 交易状态标签
const tabs = [
  { label: '全部交易', value: 'all' },
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

// 模拟交易数据
const mockTrades = Array.from({ length: 25 }, (_, index) => ({
  id: `T${String(index + 1).padStart(3, '0')}`,
  createTime: '2024-03-20 14:30:00',
  status: ['待付款', '待发货', '待收货', '已完成', '已取消'][index % 5],
  totalAmount: 13998.00,
  orders: [
    {
      id: `O${String(index * 2 + 1).padStart(3, '0')}`,
      storeName: '华为官方旗舰店',
      totalItems: 1,
      totalAmount: 6999.00,
      status: ['待付款', '待发货', '待收货', '已完成', '已取消'][index % 5],
      products: [
        {
          id: index * 2 + 1,
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
      id: `O${String(index * 2 + 2).padStart(3, '0')}`,
      storeName: '小米官方旗舰店',
      totalItems: 1,
      totalAmount: 6999.00,
      status: ['待付款', '待发货', '待收货', '已完成', '已取消'][index % 5],
      products: [
        {
          id: index * 2 + 2,
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
}))

// 根据当前标签筛选交易
const trades = computed(() => {
  let filteredTrades = mockTrades
  if (currentTab.value !== 'all') {
    const statusMap = {
      unpaid: '待付款',
      unshipped: '待发货',
      unreceived: '待收货',
      completed: '已完成'
    }
    filteredTrades = mockTrades.filter(trade => trade.status === statusMap[currentTab.value])
  }
  if (searchText.value) {
    filteredTrades = filteredTrades.filter(trade => 
      trade.id.toLowerCase().includes(searchText.value.toLowerCase())
    )
  }
  total.value = filteredTrades.length
  const start = (currentPage.value - 1) * pageSize.value
  return filteredTrades.slice(start, start + pageSize.value)
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
const goToPayment = (trade) => {
  router.push({
    path: '/payment',
    query: {
      tradeId: trade.id,
      amount: trade.totalAmount
    }
  })
}

// 取消交易
const cancelTrade = (trade) => {
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
    trade.status = '已取消'
  })
}

// 查看交易详情
const viewTradeDetail = (tradeId) => {
  router.push(`/user/trades/${tradeId}`)
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
</script>

<style scoped>
.trades {
  padding: 20px;
}

.trade-tabs {
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

.trade-item {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.trade-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trade-info {
  display: flex;
  gap: 20px;
  color: #909399;
  font-size: 14px;
}

.trade-status {
  font-weight: 500;
  color: var(--el-color-primary);
}

.store-orders {
  padding: 0 20px;
}

.store-order {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.store-order:last-child {
  border-bottom: none;
}

.store-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.store-name {
  font-weight: 500;
}

.product-list {
  margin-left: 20px;
}

.product-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.product-item:hover {
  background-color: #f5f7fa;
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
  height: 80px; /* 与图片等高 */
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  /* 文本超出两行显示省略号 */
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

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  margin-top: 15px;
  border-top: 1px dashed #eee;
}

.trade-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trade-amount {
  font-size: 16px;
}

.trade-amount .price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

.order-amount .price {
  color: #f56c6c;
  font-weight: 500;
}

.trade-actions,
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