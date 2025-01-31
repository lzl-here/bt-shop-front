<template>
  <div class="payment-records">
    <!-- 搜索条件 -->
    <div class="search-form">
      <el-form :inline="true" :model="searchForm" size="default">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
                <el-option label="待确认" value="pending_confirm" />
                <el-option label="已完成" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结算单号">
              <el-input 
                v-model="searchForm.tradeNo" 
                placeholder="请输入结算单号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单号">
              <el-input 
                v-model="searchForm.orderNo" 
                placeholder="请输入订单号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="买家">
              <el-input 
                v-model="searchForm.buyer" 
                placeholder="请输入买家名称"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="支付方式">
              <el-select v-model="searchForm.paymentMethod" placeholder="全部方式" clearable>
                <el-option label="支付宝" value="支付宝" />
                <el-option label="微信支付" value="微信支付" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="search-buttons">
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>查询
              </el-button>
              <el-button @click="resetSearch">
                <el-icon><RefreshRight /></el-icon>重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="tabs">
      <div 
        class="tab-item" 
        :class="{ active: status === 'pending' }"
        @click="status = 'pending'"
      >
        待确认
      </div>
      <div 
        class="tab-item"
        :class="{ active: status === 'confirmed' }"
        @click="status = 'confirmed'"
      >
        已确认
      </div>
    </div>

    <div class="records-table">
      <el-table 
        :data="currentPageRecords" 
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
        <el-table-column 
          v-for="column in columns" 
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
        >
          <template #default="{ row }" v-if="column.prop === 'amount'">
            <span class="amount">¥{{ row[column.prop].toFixed(2) }}</span>
          </template>
          <template #default="{ row }" v-else-if="column.prop === 'status'">
            <el-tag 
              :type="getStatusType(row.status)"
              size="small"
              effect="light"
            >
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column 
          fixed="right"
          label="操作" 
          width="180"
          class-name="operation-column"
        >
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button 
                v-if="row.status === 'pending_confirm'"
                type="primary" 
                size="small"
                @click="confirmPayment(row)"
              >
                确认
              </el-button>
              <el-button 
                type="primary" 
                size="small"
                link
                @click="viewDetail(row)"
              >
                查看详情
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[12, 24, 36]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pager-count="5"
        background
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { Search, RefreshRight } from '@element-plus/icons-vue'

const status = ref('pending')
const currentPage = ref(1)
const pageSize = ref(12) // 默认每页12条
const total = ref(0)
const router = useRouter()

// 订单状态枚举
const OrderStatus = {
  PENDING_PAYMENT: 'pending_payment',   // 待付款
  PENDING_CONFIRM: 'pending_confirm',   // 待确认收款
  COMPLETED: 'completed',              // 已完成（所有商品已发货）
  CANCELLED: 'cancelled'               // 已取消
}

// 商品状态枚举
const ItemStatus = {
  PENDING_SHIP: 'pending_ship',        // 待发货
  DELIVERED: 'delivered',              // 已送达
  CANCELLED: 'cancelled'               // 已取消
}

// 生成结算单数据
const records = ref(Array.from({ length: 37 }, (_, index) => {
  const id = index + 1
  const tradeNo = `JS${String(id).padStart(6, '0')}`
  
  // 生成结算时间区间
  const startTime = '2024-03-01'
  const endTime = '2024-03-20'
  
  // 随机生成金额
  const amount = [6999.00, 7999.00, 8999.00, 13998.00][Math.floor(Math.random() * 4)]
  
  // 随机生成支付方式
  const paymentMethod = ['支付宝', '微信支付'][Math.floor(Math.random() * 2)]
  
  // 随机生成状态
  const status = ['pending_confirm', 'completed'][Math.floor(Math.random() * 2)]

  return {
    id,
    tradeNo,
    amount,
    startTime,
    endTime,
    paymentMethod,
    status
  }
}))

// 定义表格列
const columns = [
  { prop: 'tradeNo', label: '结算单号', width: '170' },
  { prop: 'amount', label: '金额', width: '120' },
  { prop: 'startTime', label: '开始时间', width: '150' },
  { prop: 'endTime', label: '结束时间', width: '150' },
  { prop: 'paymentMethod', label: '支付方式', width: '100' },
  { prop: 'status', label: '状态', width: '90' }
]

// 搜索表单
const searchForm = ref({
  status: '',
  tradeNo: '',
  orderNo: '',
  buyer: '',
  paymentMethod: ''
})

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1 // 重置页码
  fetchRecords()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    status: '',
    tradeNo: '',
    orderNo: '',
    buyer: '',
    paymentMethod: ''
  }
  handleSearch()
}

// 修改过滤逻辑
const currentPageRecords = computed(() => {
  let filtered = records.value

  // 根据搜索条件过滤
  if (searchForm.value.status) {
    filtered = filtered.filter(record => record.status === searchForm.value.status)
  }
  if (searchForm.value.tradeNo) {
    filtered = filtered.filter(record => record.tradeNo.includes(searchForm.value.tradeNo))
  }
  if (searchForm.value.orderNo) {
    filtered = filtered.filter(record => record.orderNo.includes(searchForm.value.orderNo))
  }
  if (searchForm.value.buyer) {
    filtered = filtered.filter(record => record.buyer?.includes(searchForm.value.buyer))
  }
  if (searchForm.value.paymentMethod) {
    filtered = filtered.filter(record => record.paymentMethod === searchForm.value.paymentMethod)
  }
  
  // 更新总数
  total.value = filtered.length
  
  // 计算分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    pending_confirm: 'warning',
    completed: 'success'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending_confirm: '待确认',
    completed: '已完成'
  }
  return statusMap[status] || '未知状态'
}

// 处理状态切换
const handleStatusChange = (val) => {
  status.value = val
  fetchRecords()
}

// 获取流水记录
const fetchRecords = async () => {
  // TODO: 实现获取流水记录接口
  console.log('获取流水记录', {
    status: status.value,
    page: currentPage.value,
    pageSize: pageSize.value
  })
}

// 确认收款
const confirmPayment = async (record) => {
  try {
    await ElMessageBox.confirm(
      `确认收到订单 ${record.tradeNo} 的付款 ¥${record.amount.toFixed(2)} 吗？`,
      '确认收款',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // TODO: 实现确认收款接口
    console.log('确认收款', record)
    ElMessage.success('确认收款成功')
    fetchRecords()
  } catch {
    // 用户取消操作
  }
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchRecords()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchRecords()
}

// 查看详情
const viewDetail = (record) => {
  router.push(`/seller/bill/${record.tradeNo}`)
}
</script>

<style scoped>
.payment-records {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.search-form {
  background: #fff;
  padding: 24px;
  border-radius: 4px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

:deep(.el-form--inline) {
  display: block;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
  margin-right: 0;
  width: 100%;
}

:deep(.el-form-item__label) {
  font-weight: normal;
  color: #606266;
  padding-right: 12px;
  width: 70px !important;
}

:deep(.el-input__wrapper),
:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input) {
  width: 100%;
}

.search-buttons {
  display: flex;
  gap: 12px;
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

/* 表格样式优化 */
.records-table {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

:deep(.el-table) {
  --el-table-header-bg-color: #f5f7fa;
  --el-table-border-color: #ebeef5;
  border-radius: 4px;
}

:deep(.el-table::before) {
  display: none;
}

:deep(.el-table__inner-wrapper::before) {
  display: none;
}

:deep(.el-table .cell) {
  padding: 8px;
  line-height: 1.4;
}

/* 分页样式优化 */
.pagination-container {
  margin-top: 20px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

/* 标签页样式优化 */
.tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 0 20px;
}

.tab-item {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.tab-item:hover {
  background: #f0f2f5;
}

.tab-item.active {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 500;
}

.amount {
  color: #f56c6c;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

:deep(.el-tag) {
  border: none;
  padding: 0 8px;
  height: 22px;
  line-height: 22px;
  border-radius: 11px;
}

:deep(.el-tag--success) {
  background-color: #f0f9eb;
  color: #67c23a;
}

:deep(.el-tag--warning) {
  background-color: #fdf6ec;
  color: #e6a23c;
}

:deep(.el-tag--primary) {
  background-color: #ecf5ff;
  color: #409eff;
}

:deep(.el-tag--info) {
  background-color: #f4f4f5;
  color: #909399;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-button--small) {
  padding: 5px 12px;
  font-size: 12px;
  height: 24px;
  line-height: 1;
}

:deep(.el-button--small.is-link) {
  padding: 5px 0;
  height: auto;
}

:deep(.el-button--small.is-link:hover) {
  color: var(--el-color-primary);
  background: none;
}

:deep(.el-button--primary:not(.is-link)) {
  --el-button-bg-color: var(--el-color-primary);
  --el-button-border-color: var(--el-color-primary);
  --el-button-hover-bg-color: var(--el-color-primary-light-3);
  --el-button-hover-border-color: var(--el-color-primary-light-3);
  --el-button-active-bg-color: var(--el-color-primary-dark-2);
  --el-button-active-border-color: var(--el-color-primary-dark-2);
}

/* 修改操作列样式 */
:deep(.operation-column) {
  background-color: #fff !important;
}

:deep(.operation-column .cell) {
  padding-right: 20px !important;
}

:deep(.el-table__fixed-right) {
  height: 100% !important;
  box-shadow: -2px 0 8px rgba(0,0,0,0.05);
}

:deep(.el-table__fixed-right::before) {
  display: none;
}

:deep(.el-table__fixed-right .el-table__fixed-header-wrapper) {
  background-color: #F5F7FA;
}

/* 优化表格滚动条样式 */
:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  border-radius: 3px;
  background-color: #ddd;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
  background-color: #f5f5f5;
}
</style> 