<template>
  <div class="payment-records">
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
          :fixed="column.fixed"
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
          <template #default="{ row }" v-else-if="!column.prop">
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
                link
                size="small"
                @click="viewDetail(row)"
              >
                查看
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
  { prop: 'status', label: '状态', width: '90' },
  { 
    label: '操作', 
    width: '140',
    fixed: 'right'
  }
]

// 计算当前页的记录
const currentPageRecords = computed(() => {
  const filtered = records.value.filter(record => 
    status.value === 'pending' ? record.status === 'pending_confirm' : record.status === 'completed'
  )
  
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
  background: #fff;
  border-radius: 4px;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 20px;
}

.tab-item {
  padding: 12px 20px;
  cursor: pointer;
  color: #606266;
  border-bottom: 2px solid transparent;
  margin-right: 20px;
}

.tab-item.active {
  color: #409eff;
  border-bottom-color: #409eff;
}

.records-table {
  width: 100%;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.table-header {
  display: flex;
  background-color: #f5f7fa;
  padding: 12px 0;
  font-weight: 500;
  font-size: 12px;
}

.table-row {
  display: flex;
  padding: 12px 0;
  border-top: 1px solid #ebeef5;
  font-size: 12px;
}

.table-row:hover {
  background-color: #f5f7fa;
}

.col-trade-no { width: 15%; padding: 0 15px; }
.col-amount { width: 15%; padding: 0 15px; color: #f56c6c; }
.col-start-time { width: 15%; padding: 0 15px; }
.col-end-time { width: 15%; padding: 0 15px; }
.col-method { width: 15%; padding: 0 15px; }
.col-status { width: 10%; padding: 0 15px; }
.col-action { width: 15%; padding: 0 15px; display: flex; gap: 8px; }

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 11px;
}

.status-tag.pending {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.status-tag.confirmed {
  background-color: #f0f9eb;
  color: #67c23a;
}

.confirm-btn {
  padding: 0 6px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  line-height: 1.4;
  min-height: 18px;
  height: 18px;
  white-space: nowrap;
  min-width: 36px;
}

.confirm-btn:hover {
  background-color: #66b1ff;
}

.detail-btn {
  padding: 0 6px;
  background-color: #fff;
  color: #409eff;
  border: 1px solid #409eff;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  line-height: 1.4;
  min-height: 18px;
  height: 18px;
  white-space: nowrap;
  min-width: 36px;
}

.detail-btn:hover {
  color: #66b1ff;
  border-color: #66b1ff;
  background-color: #ecf5ff;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.pagination :deep(.el-pagination) {
  padding: 2px 5px;
}

.pagination :deep(.el-pagination.is-background .el-pager li) {
  margin: 0 4px;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  font-weight: normal;
  color: #606266;
  background-color: #f4f4f5;
  border-radius: 4px;
}

.pagination :deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background-color: var(--el-color-primary);
  color: #fff;
  font-weight: bold;
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
}

.pagination :deep(.el-pagination.is-background .el-pager li:not(.disabled):hover) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
  transition: all 0.3s;
}

.pagination :deep(.btn-prev),
.pagination :deep(.btn-next) {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  background-color: #f4f4f5;
  color: #606266;
  border-radius: 4px;
}

.pagination :deep(.btn-prev:hover),
.pagination :deep(.btn-next:hover) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.pagination :deep(.el-pagination__sizes) {
  margin-right: 16px;
}

.pagination :deep(.el-pagination__total) {
  margin-right: 16px;
  line-height: 32px;
}

.pagination :deep(.el-input__inner) {
  height: 32px;
  line-height: 32px;
}

.bill-records {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #F5F7FA;
  border-radius: 4px;
  border: 1px solid var(--el-table-border-color);
}

:deep(.el-table::before) {
  display: none;
}

:deep(.el-table__inner-wrapper::before) {
  display: none;
}

:deep(.el-table th.el-table__cell) {
  background: var(--el-table-header-bg-color);
}

:deep(.el-table .cell) {
  padding: 0;
  white-space: nowrap;
}

:deep(.el-table__cell) {
  padding: 4px 0;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
  background-color: #f5f7fa;
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

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-pagination) {
  padding: 0;
  font-weight: normal;
}

:deep(.el-pagination button) {
  background-color: transparent;
}

:deep(.el-pagination .el-pager li) {
  background-color: transparent;
  border: none;
}

:deep(.el-pagination .el-pager li.is-active) {
  color: var(--el-color-primary);
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 8px;
}
</style> 