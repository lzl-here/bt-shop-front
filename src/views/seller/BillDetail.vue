<template>
  <div class="bill-detail">
    <!-- 返回按钮 -->
    <div class="back-btn">
      <el-button 
        type="primary" 
        link 
        @click="goBack"
      >
        <el-icon><ArrowLeft /></el-icon>
        返回结算单列表
      </el-button>
    </div>

    <!-- 结算单基本信息 -->
    <div class="bill-info">
      <div class="bill-header">
        <h2>结算单详情</h2>
        <div class="bill-status">
          <el-tag :type="getStatusType(billInfo.status)">
            {{ getStatusText(billInfo.status) }}
          </el-tag>
        </div>
      </div>
      
      <el-descriptions :column="4" border>
        <el-descriptions-item label="结算单号">{{ billInfo.billNo }}</el-descriptions-item>
        <el-descriptions-item label="结算金额">¥{{ billInfo.amount.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ billInfo.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ billInfo.endTime }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 支付流水列表 -->
    <div class="payment-list">
      <div class="section-title">支付流水</div>
      <el-table 
        :data="paymentRecords" 
        style="width: 100%" 
        v-loading="loading"
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
        <el-table-column prop="paymentNo" label="支付单号" width="180" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="orderItemNo" label="订单项号" width="180" />
        <el-table-column prop="amount" label="支付金额" width="150">
          <template #default="{ row }">
            <span class="amount">¥{{ row.amount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag 
              :type="getPaymentStatusType(row.status)"
              size="small"
              effect="light"
            >
              {{ getPaymentStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentTime" label="支付时间" min-width="180" />
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const billNo = route.params.billNo

// 结算单信息
const billInfo = ref({
  billNo: 'JS000001',
  amount: 139980.00,
  startTime: '2024-03-01',
  endTime: '2024-03-20',
  status: 'pending_confirm'
})

// 支付流水列表
const paymentRecords = ref(Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  paymentNo: `P202403${String(index + 1).padStart(6, '0')}`,
  orderNo: `O202403${String(index + 1).padStart(6, '0')}`,
  amount: 6999.00,
  paymentTime: '2024-03-20 14:30:00',
  paymentMethod: index % 2 === 0 ? '支付宝' : '微信支付',
  status: 'completed'
})))

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 计算当前页的支付流水记录
const currentPageRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return paymentRecords.value.slice(start, end)
})

// 监听页码变化
watch([currentPage, pageSize], () => {
  fetchPaymentRecords()
})

// 状态处理函数
const getStatusType = (status) => {
  const statusMap = {
    pending_confirm: 'warning',
    completed: 'success'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    pending_confirm: '待确认',
    completed: '已完成'
  }
  return statusMap[status] || '未知状态'
}

const getPaymentStatusType = (status) => {
  const statusMap = {
    completed: 'success',
    pending: 'warning'
  }
  return statusMap[status] || 'info'
}

const getPaymentStatusText = (status) => {
  const statusMap = {
    completed: '已完成',
    pending: '处理中'
  }
  return statusMap[status] || '未知状态'
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchPaymentRecords()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchPaymentRecords()
}

// 获取支付流水记录
const fetchPaymentRecords = () => {
  // 模拟获取数据
  const mockData = Array.from({ length: 100 }, (_, index) => {
    const id = index + 1
    const orderNo = `O202403${String(Math.floor(id / 2) + 1).padStart(6, '0')}`
    const orderItemNo = `${orderNo}-${id % 2 + 1}`
    
    return {
      id,
      paymentNo: `P202403${String(id).padStart(6, '0')}`,
      orderNo,
      orderItemNo,
      amount: [6999.00, 7999.00, 8999.00, 13998.00][Math.floor(Math.random() * 4)],
      paymentTime: `2024-03-20 ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      paymentMethod: Math.random() > 0.5 ? '支付宝' : '微信支付',
      status: Math.random() > 0.3 ? 'completed' : 'pending'
    }
  })

  // 更新总数
  total.value = mockData.length

  // 获取当前页数据
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  paymentRecords.value = mockData.slice(start, end)
}

// 返回上一页
const goBack = () => {
  router.push('/seller?tab=payment-records')
}

onMounted(() => {
  // 获取结算单详情
  // TODO: 实现获取结算单详情的接口
  console.log('获取结算单详情', billNo)
  
  // 获取支付流水列表
  fetchPaymentRecords()
})
</script>

<style scoped>
.bill-detail {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}

.back-btn {
  margin-bottom: 20px;
}

.back-btn :deep(.el-button) {
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 0;
}

.back-btn :deep(.el-icon) {
  margin-right: 4px;
  font-size: 16px;
}

.bill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.bill-header h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.section-title {
  margin: 0 -20px 20px;
  padding: 15px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
}

.payment-list {
  margin: 20px 0 0;
  padding: 0 20px 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

:deep(.el-descriptions) {
  margin-top: 20px;
}

:deep(.el-descriptions__label) {
  width: 100px;
  color: #606266;
}

:deep(.el-descriptions__content) {
  color: #303133;
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

:deep(.el-table .el-table__cell) {
  padding: 4px 0;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
  background-color: #f5f7fa;
}

:deep(.el-table .cell) {
  white-space: nowrap;
}

:deep(.el-table__cell) {
  text-align: left;
}

:deep(.el-table__cell:last-child .cell) {
  text-align: center;
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

.pagination {
  margin-top: 20px;
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
}

:deep(.el-pagination) {
  padding: 0;
  font-weight: normal;
}

:deep(.el-pagination .el-select .el-input) {
  width: 100px;
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
</style> 