<template>
  <div class="seller-dashboard">
    <!-- 未入驻状态 -->
    <div v-if="!hasStore" class="no-store">
      <el-empty description="暂无店铺">
        <template #image>
          <el-icon :size="60"><Shop /></el-icon>
        </template>
        <template #description>
          <p>您还没有开通店铺</p>
        </template>
        <el-button type="primary" @click="goToApply">立即入驻</el-button>
      </el-empty>
    </div>

    <!-- 已入驻状态 -->
    <el-container v-else>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <div class="store-info">
          <el-avatar :size="60" :src="storeInfo.logo" />
          <div class="store-name">{{ storeInfo.name }}</div>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleSelect"
        >
          <el-menu-item index="settings">
            <el-icon><Setting /></el-icon>
            <span>店铺设置</span>
          </el-menu-item>
          <el-menu-item index="overview">
            <el-icon><DataLine /></el-icon>
            <span>店铺概览</span>
          </el-menu-item>
          <el-menu-item index="products">
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="orders">
            <el-icon><List /></el-icon>
            <span>订单列表</span>
          </el-menu-item>
          <el-menu-item index="payment-records">
            <el-icon><Money /></el-icon>
            <span>结算列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main>
        <!-- 添加路由视图以显示子路由组件 -->
        <router-view v-if="$route.path.includes('/order/')" />
        
        <!-- 其他面板内容，当不是订单详情路由时显示 -->
        <template v-else>
          <!-- 概览面板 -->
          <div v-if="activeMenu === 'overview'" class="overview-panel">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-card shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <span>今日订单</span>
                    </div>
                  </template>
                  <div class="card-value">{{ statistics.todayOrders }}</div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <span>今日销售额</span>
                    </div>
                  </template>
                  <div class="card-value">¥{{ statistics.todaySales }}</div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <span>商品总数</span>
                    </div>
                  </template>
                  <div class="card-value">{{ statistics.totalProducts }}</div>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <span>待处理订单</span>
                    </div>
                  </template>
                  <div class="card-value">{{ statistics.pendingOrders }}</div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <!-- 商品管理 -->
          <div v-if="activeMenu === 'products'" class="products-panel">
            <div class="panel-header">
              <el-button type="primary" @click="addProduct">
                <el-icon><Plus /></el-icon>添加商品
              </el-button>
            </div>
            <el-table :data="currentPageProducts" style="width: 100%">
              <el-table-column prop="id" label="商品ID" width="80" />
              <el-table-column label="商品信息">
                <template #default="{ row }">
                  <div class="product-info">
                    <el-image :src="row.image" :preview-src-list="[row.image]" class="product-image" />
                    <div class="product-detail">
                      <div class="product-name">{{ row.name }}</div>
                      <div class="product-price">¥{{ row.price }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="stock" label="库存" width="100" />
              <el-table-column prop="sales" label="销量" width="100" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === '在售' ? 'success' : 'info'">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="{ row }">
                  <el-button-group>
                    <el-button size="small" @click="editProduct(row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="deleteProduct(row)">删除</el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>

            <!-- 添加分页组件 -->
            <div class="pagination-container">
              <div class="pagination-left">
                Total {{ totalProducts }}
                <el-select v-model="productPageSize" class="page-size-select">
                  <el-option
                    v-for="size in [10, 20, 30, 50]"
                    :key="size"
                    :label="`${size}/page`"
                    :value="size"
                  />
                </el-select>
              </div>
              <div class="pagination-center">
                <el-pagination
                  v-model:current-page="productCurrentPage"
                  :page-size="productPageSize"
                  :total="totalProducts"
                  layout="prev, pager, next"
                  @current-change="handleProductPageChange"
                />
              </div>
              <div class="pagination-right">
                Go to
                <el-input
                  v-model="productGoToPage"
                  class="go-to-input"
                  @keyup.enter="handleProductGoToPage"
                />
              </div>
            </div>
          </div>

          <!-- 结算单面板 -->
          <div v-if="activeMenu === 'payment-records'" class="payment-records-panel">
            <BillRecords />
          </div>

          <!-- 订单管理面板 -->
          <div v-if="activeMenu === 'orders'" class="orders-panel">
            <!-- 添加搜索表单 -->
            <div class="search-form">
              <el-form :inline="true" :model="orderSearchForm" size="default">
                <div class="search-content">
                  <div class="search-items">
                    <el-form-item label="状态">
                      <el-select v-model="orderSearchForm.status" placeholder="全部状态" clearable>
                        <el-option label="待付款" value="pending_payment" />
                        <el-option label="待发货" value="pending_ship" />
                        <el-option label="已发货" value="shipped" />
                        <el-option label="已完成" value="completed" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="订单号">
                      <el-input 
                        v-model="orderSearchForm.orderNo" 
                        placeholder="请输入订单号"
                        clearable
                        :input-style="{ textAlign: 'left' }"
                      />
                    </el-form-item>
                    <el-form-item label="买家">
                      <el-input 
                        v-model="orderSearchForm.buyer" 
                        placeholder="请输入买家名称"
                        clearable
                        :input-style="{ textAlign: 'left' }"
                      />
                    </el-form-item>
                    <el-form-item label="支付方式">
                      <el-select v-model="orderSearchForm.paymentMethod" placeholder="全部方式" clearable>
                        <el-option label="支付宝" value="支付宝" />
                        <el-option label="微信支付" value="微信支付" />
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="search-buttons">
                    <el-button type="primary" @click="handleOrderSearch">
                      <el-icon><Search /></el-icon>查询
                    </el-button>
                    <el-button @click="resetOrderSearch">
                      <el-icon><RefreshRight /></el-icon>重置
                    </el-button>
                  </div>
                </div>
              </el-form>
            </div>

            <el-table 
              :data="currentPageOrders" 
              style="width: 100%"
              :header-cell-style="{
                background: '#F5F7FA',
                color: '#606266',
                fontWeight: 500,
                fontSize: '12px',
                height: '36px',
                padding: '4px 12px'
              }"
              :cell-style="{
                fontSize: '12px',
                padding: '8px 12px'
              }"
            >
              <el-table-column prop="tradeNo" label="交易单号" width="170" />
              <el-table-column prop="orderNumber" label="订单号" width="170" />
              <el-table-column prop="customerName" label="买家" width="80" />
              <el-table-column prop="total" label="订单金额" width="120">
                <template #default="{ row }">
                  <span class="amount">¥{{ row.total.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="paymentMethod" label="支付方式" width="100" />
              <el-table-column prop="status" label="订单状态" width="90">
                <template #default="{ row }">
                  <el-tag 
                    :type="getStatusType(row.status)"
                    size="small"
                    effect="light"
                  >
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="orderTime" label="下单时间" min-width="150" />
              <el-table-column label="操作" width="140" fixed="right">
                <template #default="{ row }">
                  <el-button 
                    v-if="['已支付', '待发货', '部分发货'].includes(row.status)"
                    type="primary" 
                    size="small"
                    @click="handleOrderAction(row, 'ship')"
                  >
                    发货
                  </el-button>
                  <el-button 
                    type="primary" 
                    size="small"
                    link
                    @click="handleOrderAction(row, 'detail')"
                  >
                    查看详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 添加分页组件 -->
            <div class="pagination-container">
              <div class="pagination-left">
                Total {{ totalOrders }}
                <el-select v-model="pageSize" class="page-size-select">
                  <el-option
                    v-for="size in [10, 20, 30, 50]"
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
                  :total="totalOrders"
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

          <!-- 店铺设置面板 -->
          <div v-if="activeMenu === 'settings'" class="settings-panel">
            <StoreSettings />
          </div>
        </template>

      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { DataLine, Goods, List, Setting, Plus, Money, Shop, Search, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BillRecords from './BillRecords.vue'
import StoreSettings from './StoreSettings.vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useStoreStore } from '../../stores/store'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const storeStore = useStoreStore()

// 从 URL 参数中获取要激活的标签
const activeMenu = ref(route.query.tab || 'settings')

// 使用 store 中的店铺状态
const hasStore = computed(() => storeStore.hasStore)
const storeInfo = computed(() => storeStore.storeInfo)

// 统计数据
const statistics = ref({
  todayOrders: 156,
  todaySales: 25680,
  totalProducts: 386,
  pendingOrders: 12
})

// 商品分页相关的响应式变量
const productCurrentPage = ref(1)
const productPageSize = ref(10)
const productGoToPage = ref('')

// 模拟25条商品数据
const products = ref(Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  name: `HUAWEI Mate ${60 + index} Pro`,
  price: 6999 + index * 1000,
  image: 'https://via.placeholder.com/100',
  stock: 100 + index * 10,
  sales: 1000 + index * 100,
  status: index % 2 === 0 ? '在售' : '已下架'
})))

// 计算总商品数
const totalProducts = computed(() => products.value.length)

// 计算当前页的商品
const currentPageProducts = computed(() => {
  const start = (productCurrentPage.value - 1) * productPageSize.value
  const end = start + productPageSize.value
  return products.value.slice(start, end)
})

// 商品页码改变处理
const handleProductPageChange = (val) => {
  productCurrentPage.value = val
}

// 跳转到指定商品页
const handleProductGoToPage = () => {
  const page = parseInt(productGoToPage.value)
  if (page && page > 0 && page <= Math.ceil(totalProducts.value / productPageSize.value)) {
    productCurrentPage.value = page
  }
  productGoToPage.value = ''
}

// 监听商品页码大小变化
watch(productPageSize, () => {
  productCurrentPage.value = 1
})

// 菜单选择
const handleSelect = (index) => {
  activeMenu.value = index
}

// 添加商品
const addProduct = () => {
  // TODO: 实现添加商品逻辑
  console.log('添加商品')
}

// 编辑商品
const editProduct = (product) => {
  // TODO: 实现编辑商品逻辑
  console.log('编辑商品', product)
}

// 删除商品
const deleteProduct = (product) => {
  ElMessageBox.confirm(
    '确定要删除该商品吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除商品逻辑
    ElMessage.success('商品已删除')
  })
}

// 订单数据
const orders = ref(Array.from({ length: 37 }, (_, index) => {
  const id = index + 1
  const orderNumber = `O202403200000${id.toString().padStart(3, '0')}`
  const tradeNo = `T202403200000${id.toString().padStart(3, '0')}`
  const hour = Math.floor(Math.random() * 24)
  const minute = Math.floor(Math.random() * 60)
  const orderTime = `2024-03-20 ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`
  const quantity = Math.floor(Math.random() * 3) + 1
  const total = 6999.00 * quantity
  
  // 随机生成买家名字
  const buyers = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  const customerName = buyers[Math.floor(Math.random() * buyers.length)]
  
  // 修改订单状态，增加已发货状态
  const statuses = ['待付款', '已支付', '待发货', '部分发货', '已发货', '已完成']
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  
  // 根据状态设置支付方式
  const paymentMethod = status === '待付款' ? '未支付' : ['支付宝', '微信支付'][Math.floor(Math.random() * 2)]

  return {
    id,
    orderNumber,
    tradeNo,
    orderTime,
    customerName,
    total,
    status,
    paymentMethod,
    products: [
      {
        id: 1,
        name: 'HUAWEI Mate 60 Pro',
        price: 6999.00,
        quantity,
        image: 'https://via.placeholder.com/100',
        status: status === '部分发货' ? (Math.random() > 0.5 ? '已发货' : '待发货') : 
                status === '已完成' ? '已发货' : '待发货'
      },
      {
        id: 2,
        name: 'HUAWEI Mate 60 Pro',
        price: 6999.00,
        quantity,
        image: 'https://via.placeholder.com/100',
        status: status === '部分发货' ? (Math.random() > 0.5 ? '已发货' : '待发货') : 
                status === '已完成' ? '已发货' : '待发货'
      }
    ]
  }
}))

// 分页相关的响应式变量
const currentPage = ref(1)
const pageSize = ref(10)
const goToPage = ref('')

// 修改订单过滤逻辑
const currentPageOrders = computed(() => {
  let filtered = orders.value

  // 根据搜索条件过滤
  if (orderSearchForm.value.status) {
    filtered = filtered.filter(order => order.status === orderSearchForm.value.status)
  }
  if (orderSearchForm.value.orderNo) {
    filtered = filtered.filter(order => order.orderNumber.includes(orderSearchForm.value.orderNo))
  }
  if (orderSearchForm.value.buyer) {
    filtered = filtered.filter(order => order.customerName.includes(orderSearchForm.value.buyer))
  }
  if (orderSearchForm.value.paymentMethod) {
    filtered = filtered.filter(order => order.paymentMethod === orderSearchForm.value.paymentMethod)
  }
  
  // 计算分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 修改总订单数计算逻辑
const totalOrders = computed(() => {
  let filtered = orders.value
  
  // 根据搜索条件过滤
  if (orderSearchForm.value.status) {
    filtered = filtered.filter(order => order.status === orderSearchForm.value.status)
  }
  if (orderSearchForm.value.orderNo) {
    filtered = filtered.filter(order => order.orderNumber.includes(orderSearchForm.value.orderNo))
  }
  if (orderSearchForm.value.buyer) {
    filtered = filtered.filter(order => order.customerName.includes(orderSearchForm.value.buyer))
  }
  if (orderSearchForm.value.paymentMethod) {
    filtered = filtered.filter(order => order.paymentMethod === orderSearchForm.value.paymentMethod)
  }
  
  return filtered.length
})

// 订单搜索表单
const orderSearchForm = ref({
  status: '',
  orderNo: '',
  buyer: '',
  paymentMethod: ''
})

// 处理订单搜索
const handleOrderSearch = () => {
  currentPage.value = 1 // 重置页码
  fetchOrders()
}

// 重置订单搜索
const resetOrderSearch = () => {
  orderSearchForm.value = {
    status: '',
    orderNo: '',
    buyer: '',
    paymentMethod: ''
  }
  handleOrderSearch()
}

// 页码改变处理
const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 跳转到指定页
const handleGoToPage = () => {
  const page = parseInt(goToPage.value)
  if (page && page > 0 && page <= Math.ceil(totalOrders.value / pageSize.value)) {
    currentPage.value = page
  }
  goToPage.value = ''
}

// 监听页码大小变化
watch(pageSize, () => {
  currentPage.value = 1
})

// 订单状态标签颜色
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

// 处理订单操作
const handleOrderAction = (order, action) => {
  switch (action) {
    case 'ship':
      ElMessageBox.confirm(
        `确定要发货订单 ${order.orderNumber} 吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        ElMessage.success('发货成功')
        // 如果是部分发货状态，检查是否所有商品都已发货
        if (order.status === '部分发货') {
          const allShipped = order.products.every(product => product.status === '已发货')
          order.status = allShipped ? '已发货' : '部分发货'
        } else {
          order.status = '已发货'
        }
        // 更新商品发货状态
        order.products.forEach(product => {
          if (product.status === '待发货') {
            product.status = '已发货'
          }
        })
      })
      break
    case 'detail':
      router.push({
        path: `/seller/order/${order.orderNumber}`,
        query: { 
          from: 'seller-dashboard'  // 添加来源标记
        }
      })
      break
  }
}

const goToApply = () => {
  router.push('/seller/apply')
}

onMounted(async () => {
  // TODO: 获取店铺信息
  // const response = await getStoreInfo()
  // if (response.success) {
  //   storeStore.setStoreInfo(response.data)
  // }
  
  // 临时模拟数据
  if (!storeStore.hasStore) {
    storeStore.clearStoreInfo()
  }
})

</script>

<style scoped>
.seller-dashboard {
  min-height: calc(100vh - 60px);
}

.store-info {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.store-name {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
}

.sidebar-menu {
  border-right: none;
}

.overview-panel {
  margin-bottom: 20px;
}

.card-header {
  font-size: 14px;
  color: #666;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.panel-header {
  margin-bottom: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.product-detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.product-name {
  font-size: 14px;
}

.product-price {
  color: #f56c6c;
  font-weight: bold;
}

.el-aside {
  background-color: #fff;
  border-right: 1px solid #eee;
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
}

.orders-panel {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 20px 0 0;
  color: #666;
  border-top: 1px solid #eee;
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

.settings-panel {
  background: #fff;
  border-radius: 4px;
}

.products-panel {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-size: 14px;
}

.no-store {
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.no-store :deep(.el-empty__image) {
  color: #909399;
}

.no-store p {
  color: #909399;
  font-size: 14px;
  margin: 10px 0;
}

.orders-panel :deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #F5F7FA;
  border-radius: 4px;
  border: 1px solid var(--el-table-border-color);
}

.orders-panel :deep(.el-table::before) {
  display: none;
}

.orders-panel :deep(.el-table__inner-wrapper::before) {
  display: none;
}

.orders-panel :deep(.el-table th.el-table__cell) {
  background: var(--el-table-header-bg-color);
}

.orders-panel :deep(.el-table .cell) {
  padding: 0;
  white-space: nowrap;
}

.orders-panel :deep(.el-table__cell) {
  padding: 4px 0;
}

.orders-panel :deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
  background-color: #f5f7fa;
}

.amount {
  color: #f56c6c;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.orders-panel :deep(.el-tag) {
  border: none;
  padding: 0 8px;
  height: 22px;
  line-height: 22px;
  border-radius: 11px;
}

.orders-panel :deep(.el-tag--success) {
  background-color: #f0f9eb;
  color: #67c23a;
}

.orders-panel :deep(.el-tag--warning) {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.orders-panel :deep(.el-tag--primary) {
  background-color: #ecf5ff;
  color: #409eff;
}

.orders-panel :deep(.el-tag--info) {
  background-color: #f4f4f5;
  color: #909399;
}

.search-form {
  background: #fff;
  padding: 24px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.search-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.search-items {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  flex: 1;
}

:deep(.el-form-item) {
  margin: 0;
  width: 220px;
}

:deep(.el-form-item__label) {
  font-weight: normal;
  color: #606266;
  padding-right: 12px;
  width: 70px !important;
}

:deep(.el-input__wrapper),
:deep(.el-select) {
  width: 150px;
}

.search-buttons {
  display: flex;
  gap: 12px;
  margin-left: 20px;
  padding-top: 1px;
}

:deep(.el-button) {
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-button .el-icon) {
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  padding-left: 11px !important;
}

:deep(.el-input__inner) {
  text-align: left !important;
}

:deep(.el-input__inner::placeholder) {
  text-align: left;
}
</style> 