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
              <el-button type="primary" @click="goToProductPublish">
                <el-icon><Plus /></el-icon>
                添加商品
              </el-button>
            </div>
            <el-table
              v-loading="loading"
              :data="products"
              style="width: 100%"
              border
            >
              <el-table-column label="商品ID" prop="id" width="80" align="center" />
              
              <el-table-column label="商品信息" min-width="400">
                <template #default="{ row }">
                  <div class="product-info">
                    <el-image
                      :src="row.spu_img_url"
                      :preview-src-list="[row.spu_img_url]"
                      class="product-image"
                      fit="cover"
                    >
                      <template #error>
                        <div class="image-error">
                          <el-icon><Picture /></el-icon>
                        </div>
                      </template>
                    </el-image>
                    <div class="product-detail">
                      <div class="product-name">{{ row.spu_name }}</div>
                      <div class="product-desc">{{ row.spu_desc }}</div>
                      <div class="product-price">¥{{ Number(row.spu_price).toFixed(2) }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="分类" prop="category_name" width="120" align="center" />
              
              <el-table-column label="品牌" width="120" align="center">
                <template #default="{ row }">
                  <div class="brand-container">
                    <el-image
                      :src="row.brand_icon_url"
                      class="brand-logo"
                      fit="contain"
                    >
                      <template #error>
                        <span class="brand-fallback">{{ row.brand_name }}</span>
                      </template>
                    </el-image>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.enabled ? 'success' : 'info'">
                    {{ row.enabled ? '在售' : '已下架' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="totalProducts"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>

          <!-- 结算单面板 -->
          <div v-if="activeMenu === 'payment-records'" class="payment-records-panel">
            <BillRecords />
          </div>

          <!-- 订单管理面板 -->
          <div v-if="activeMenu === 'orders'" class="orders-panel">
            <!-- 搜索栏 -->
            <div class="search-form">
              <el-form :inline="true" :model="searchForm">
                <el-form-item label="订单状态">
                  <el-select v-model="searchForm.order_status" placeholder="全部状态" clearable>
                    <el-option label="待付款" value="paying" />
                    <el-option label="已付款" value="paid" />
                    <el-option label="部分发货" value="part_delivered" />
                    <el-option label="已发货" value="delivered" />
                    <el-option label="已完成" value="completed" />
                    <el-option label="已取消" value="canceled" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="fetchOrders">查询</el-button>
                  <el-button @click="resetSearch">重置</el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 订单列表 -->
            <el-table
              v-loading="loading"
              :data="orders"
              style="width: 100%"
              border
            >
              <el-table-column label="订单信息" min-width="400">
                <template #default="{ row }">
                  <div class="order-info">
                    <el-image
                      :src="row.sku_img_url"
                      class="order-image"
                      fit="cover"
                    >
                      <template #error>
                        <div class="image-error">
                          <el-icon><Picture /></el-icon>
                        </div>
                      </template>
                    </el-image>
                    <div class="order-detail">
                      <div class="order-name">{{ row.spu_name }}</div>
                      <div class="order-specs">
                        <span v-for="spec in row.spec_value_list" :key="spec.id">
                          {{ spec.spec_name }}: {{ spec.spec_value }}
                        </span>
                      </div>
                      <div class="order-price">
                        <span class="price">¥{{ row.sku_amount }}</span>
                        <span class="quantity">x{{ row.buy_num }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="订单号" prop="order_no" width="180" align="center" />
              
              <el-table-column label="实付金额" width="120" align="center">
                <template #default="{ row }">
                  <span class="amount">¥{{ row.order_amount }}</span>
                </template>
              </el-table-column>

              <el-table-column label="订单状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getOrderStatusType(row.order_status)">
                    {{ getOrderStatusText(row.order_status) }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column label="下单时间" width="180" align="center">
                <template #default="{ row }">
                  {{ formatDate(row.created_at) }}
                </template>
              </el-table-column>

              <el-table-column label="操作" width="120" align="center">
                <template #default="{ row }">
                  <el-button 
                    v-if="row.order_status === 'paid'"
                    type="primary" 
                    link
                    @click="handleShip(row)"
                  >
                    发货
                  </el-button>
                  <el-button type="primary" link @click="viewOrderDetail(row)">
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 在订单列表表格下方添加分页 -->
            <div class="pagination">
              <el-pagination
                v-model:current-page="orderCurrentPage"
                v-model:page-size="orderPageSize"
                :total="totalOrders"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next"
                @size-change="handleOrderSizeChange"
                @current-change="handleOrderCurrentChange"
              />
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
import { getSellerGoodsList } from '../../api/goodsApi'
import { getSellerOrderList } from '../../api/orderApi'
import { formatDate } from '../../utils/date'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const storeStore = useStoreStore()

// 从 URL 参数中获取要激活的标签
const activeMenu = ref(route.query.tab || 'settings')

// 使用 store 中的店铺状态
const hasStore = computed(() => storeStore.hasStore)
const storeInfo = computed(() => storeStore.storeInfo)

// 商品列表相关
const loading = ref(false)
const products = ref([])
const totalProducts = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取商品列表
const fetchProducts = async () => {
  if (!storeStore.storeInfo?.id) {
    ElMessage.warning('店铺信息不存在')
    return
  }

  loading.value = true
  try {
    const res = await getSellerGoodsList({
      shop_id: storeStore.storeInfo.id,
      page_size: pageSize.value,
      page_no: currentPage.value
    })
    
    if (res.code === 1) {
      products.value = res.data.spu_list
      totalProducts.value = res.data.total
    } else {
      throw new Error(res.msg || '获取商品列表失败')
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

// 处理分页变化
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchProducts()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchProducts()
}

// 监听菜单切换
watch(activeMenu, (newVal) => {
  if (newVal === 'products') {
    fetchProducts()
  } else if (newVal === 'orders') {
    fetchOrders()
  }
})

// 初始化时如果是商品管理页面则获取商品列表
onMounted(() => {
  if (activeMenu.value === 'products') {
    fetchProducts()
  } else if (activeMenu.value === 'orders') {
    fetchOrders()
  }
})

// 统计数据
const statistics = ref({
  todayOrders: 156,
  todaySales: 25680,
  totalProducts: 386,
  pendingOrders: 12
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
const orders = ref([])

// 搜索表单
const searchForm = ref({
  shop_id: '',
  order_status: ''
})

// 添加订单列表的分页相关变量
const orderCurrentPage = ref(1)
const orderPageSize = ref(10)
const totalOrders = ref(0)

// 修改获取订单列表的方法
const fetchOrders = async () => {
  if (!storeStore.storeInfo?.id) {
    ElMessage.warning('店铺信息不存在')
    return
  }

  loading.value = true
  try {
    const res = await getSellerOrderList({
      shop_id: Number(storeStore.storeInfo.id),
      order_status: searchForm.value.order_status || '',
      page_size: orderPageSize.value,
      page_no: orderCurrentPage.value
    })
    
    if (res.code === 1) {
      orders.value = res.data.order_list
      totalOrders.value = res.data.total
    } else {
      throw new Error(res.msg || '获取订单列表失败')
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

// 添加订单列表分页处理方法
const handleOrderSizeChange = (val) => {
  orderPageSize.value = val
  fetchOrders()
}

const handleOrderCurrentChange = (val) => {
  orderCurrentPage.value = val
  fetchOrders()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value.order_status = ''
  fetchOrders()
}

// 获取订单状态类型
const getOrderStatusType = (status) => {
  const statusMap = {
    'paying': 'warning',        // 待付款 - 黄色警告
    'paid': 'primary',         // 已付款 - 蓝色主色
    'part_delivered': 'info',  // 部分发货 - 灰色信息
    'delivered': 'success',    // 已发货 - 绿色成功
    'completed': 'success',    // 已完成 - 绿色成功
    'canceled': 'info'         // 已取消 - 灰色信息
  }
  return statusMap[status] || 'info'
}

// 获取订单状态文本
const getOrderStatusText = (status) => {
  const statusMap = {
    'paying': '待付款',
    'paid': '已付款',
    'part_delivered': '部分发货',
    'delivered': '已发货',
    'completed': '已完成',
    'canceled': '已取消'
  }
  return statusMap[status] || status
}

// 查看订单详情
const viewOrderDetail = (order) => {
  router.push(`/seller/order/${order.order_no}`)
}

// 发货处理
const handleShip = (order) => {
  ElMessageBox.confirm(
    `确定要发货订单 ${order.order_no} 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用发货接口
    ElMessage.success('发货成功')
  })
}

const goToApply = () => {
  router.push('/seller/apply')
}

// 跳转到商品发布页面
const goToProductPublish = () => {
  router.push('/seller/product/publish')
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
  gap: 16px;
  padding: 8px 0;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  flex-shrink: 0;
}

.product-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  line-height: 1.4;
}

.product-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 14px;
  color: #f56c6c;
  font-weight: 500;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #909399;
  font-size: 20px;
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

.dashboard-header {
  margin-bottom: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.product-list {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
}

.brand-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
}

.brand-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: 8px;
  padding: 4px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.brand-fallback {
  font-size: 14px;
  color: #606266;
}

/* 添加订单相关样式 */
.order-info {
  display: flex;
  gap: 16px;
  padding: 8px 0;
}

.order-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  flex-shrink: 0;
}

.order-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.order-specs {
  font-size: 12px;
  color: #909399;
  display: flex;
  gap: 8px;
}

.order-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price {
  color: #f56c6c;
  font-weight: 500;
}

.quantity {
  color: #909399;
  font-size: 12px;
}

.amount {
  color: #f56c6c;
  font-weight: 500;
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}
</style> 