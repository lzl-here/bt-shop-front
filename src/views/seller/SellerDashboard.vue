<template>
  <div class="seller-dashboard">
    <el-container>
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
            <span>概览</span>
          </el-menu-item>
          <el-menu-item index="products">
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="orders">
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="payment-records">
            <el-icon><Money /></el-icon>
            <span>支付流水</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main>
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

        <!-- 支付流水面板 -->
        <div v-if="activeMenu === 'payment-records'" class="payment-records-panel">
          <PaymentRecords />
        </div>

        <!-- 订单管理面板 -->
        <div v-if="activeMenu === 'orders'" class="orders-panel">
          <el-table :data="currentPageOrders" style="width: 100%">
            <el-table-column prop="orderNumber" label="订单号" width="180" />
            <el-table-column prop="orderTime" label="下单时间" width="180" />
            <el-table-column prop="customerName" label="买家" width="120" />
            <el-table-column prop="total" label="订单金额">
              <template #default="{ row }">
                ¥{{ row.total.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="paymentMethod" label="支付方式" width="120" />
            <el-table-column prop="status" label="订单状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button 
                  v-if="row.status === '待发货'"
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

        <!-- 用户下拉菜单 -->
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32" :src="userStore.userInfo?.avatar || '/default-avatar.png'" />
            <span class="username">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="orders">我的交易</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { DataLine, Goods, List, Setting, Plus, Money } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PaymentRecords from './PaymentRecords.vue'
import StoreSettings from './StoreSettings.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()

const activeMenu = ref('settings')

// 店铺信息
const storeInfo = ref({
  name: '华为官方旗舰店',
  logo: 'https://via.placeholder.com/60'
})

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
const orders = ref(Array.from({ length: 25 }, (_, index) => {
  const id = index + 1
  const orderNumber = `O202403200000${id.toString().padStart(3, '0')}`
  const hour = Math.floor(Math.random() * 24)
  const minute = Math.floor(Math.random() * 60)
  const orderTime = `2024-03-20 ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`
  const quantity = Math.floor(Math.random() * 3) + 1
  const total = 6999.00 * quantity
  
  // 随机生成买家名字
  const buyers = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  const customerName = buyers[Math.floor(Math.random() * buyers.length)]
  
  // 随机生成订单状态
  const statuses = ['待付款', '待发货', '已发货', '已完成']
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  
  // 根据状态设置支付方式
  const paymentMethod = status === '待付款' ? '未支付' : ['支付宝', '微信支付'][Math.floor(Math.random() * 2)]

  return {
    id,
    orderNumber,
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
        image: 'https://via.placeholder.com/100'
      }
    ]
  }
}))

// 分页相关的响应式变量
const currentPage = ref(1)
const pageSize = ref(10)
const goToPage = ref('')

// 计算总订单数
const totalOrders = computed(() => orders.value.length)

// 计算当前页的订单
const currentPageOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return orders.value.slice(start, end)
})

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
    case '待发货':
      return 'info'
    case '已发货':
      return 'primary'
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
        order.status = '已发货'
      })
      break
    case 'detail':
      // TODO: 查看订单详情
      console.log('查看订单详情', order)
      break
  }
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'orders':
      router.push('/user/trades')
      break
    case 'logout':
      ElMessageBox.confirm(
        '确定要退出登录吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        userStore.logout()
        router.push('/login')
      })
      break
  }
}
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
</style> 