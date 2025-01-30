<template>
  <div class="payment-records">
    <!-- 搜索筛选区 -->
    <div class="filter-section">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderId" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="支付成功" value="success" />
            <el-option label="支付失败" value="failed" />
            <el-option label="已退款" value="refunded" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 统计信息 -->
    <div class="statistics-section">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">今日收入</div>
            </template>
            <div class="card-value">¥{{ statistics.todayIncome.toFixed(2) }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">本月收入</div>
            </template>
            <div class="card-value">¥{{ statistics.monthIncome.toFixed(2) }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">总收入</div>
            </template>
            <div class="card-value">¥{{ statistics.totalIncome.toFixed(2) }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 流水列表 -->
    <div class="records-table">
      <el-table :data="records" style="width: 100%" v-loading="loading">
        <el-table-column prop="time" label="交易时间" width="180" />
        <el-table-column prop="orderId" label="订单号" width="180" />
        <el-table-column prop="transactionId" label="交易号" width="180" />
        <el-table-column prop="type" label="交易类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'income' ? 'success' : 'danger'">
              {{ row.type === 'income' ? '入账' : '出账' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="交易金额" width="150">
          <template #default="{ row }">
            <span :class="{ 'income': row.type === 'income', 'expense': row.type === 'expense' }">
              ¥{{ row.amount.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="100" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === '支付成功'" 
              type="danger" 
              size="small"
              @click="handleRefund(row)"
            >
              退款
            </el-button>
            <el-button 
              type="primary" 
              size="small" 
              link
              @click="viewDetail(row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  dateRange: [],
  orderId: '',
  status: ''
})

// 统计数据
const statistics = reactive({
  todayIncome: 1234.56,
  monthIncome: 45678.90,
  totalIncome: 123456.78
})

// 模拟所有数据
const allRecords = [
  {
    time: '2024-03-20 14:30:00',
    orderId: 'ORDER2024032001',
    transactionId: '202403201430001',
    type: 'income',
    amount: 6999.00,
    status: '支付成功',
    paymentMethod: '支付宝'
  },
  {
    time: '2024-03-20 15:20:00',
    orderId: 'ORDER2024032002',
    transactionId: '202403201520002',
    type: 'expense',
    amount: 1999.00,
    status: '已退款',
    paymentMethod: '微信支付'
  },
  {
    time: '2024-03-20 16:30:00',
    orderId: 'ORDER2024032003',
    transactionId: '202403201630003',
    type: 'income',
    amount: 3999.00,
    status: '支付成功',
    paymentMethod: '支付宝'
  },
  {
    time: '2024-03-20 17:20:00',
    orderId: 'ORDER2024032004',
    transactionId: '202403201720004',
    type: 'income',
    amount: 4999.00,
    status: '支付成功',
    paymentMethod: '微信支付'
  },
  {
    time: '2024-03-20 18:10:00',
    orderId: 'ORDER2024032005',
    transactionId: '202403201810005',
    type: 'income',
    amount: 2999.00,
    status: '支付成功',
    paymentMethod: '支付宝'
  },
  {
    time: '2024-03-20 19:00:00',
    orderId: 'ORDER2024032006',
    transactionId: '202403201900006',
    type: 'income',
    amount: 5999.00,
    status: '支付成功',
    paymentMethod: '微信支付'
  },
  {
    time: '2024-03-20 19:30:00',
    orderId: 'ORDER2024032007',
    transactionId: '202403201930007',
    type: 'expense',
    amount: 1599.00,
    status: '已退款',
    paymentMethod: '支付宝'
  },
  {
    time: '2024-03-20 20:15:00',
    orderId: 'ORDER2024032008',
    transactionId: '202403202015008',
    type: 'income',
    amount: 7999.00,
    status: '支付成功',
    paymentMethod: '微信支付'
  },
  {
    time: '2024-03-20 21:00:00',
    orderId: 'ORDER2024032009',
    transactionId: '202403202100009',
    type: 'income',
    amount: 3499.00,
    status: '支付成功',
    paymentMethod: '支付宝'
  },
  {
    time: '2024-03-20 21:45:00',
    orderId: 'ORDER2024032010',
    transactionId: '202403202145010',
    type: 'income',
    amount: 4499.00,
    status: '支付成功',
    paymentMethod: '微信支付'
  },
  {
    time: '2024-03-20 22:30:00',
    orderId: 'ORDER2024032011',
    transactionId: '202403202230011',
    type: 'income',
    amount: 2799.00,
    status: '支付成功',
    paymentMethod: '支付宝'
  },
  {
    time: '2024-03-20 23:15:00',
    orderId: 'ORDER2024032012',
    transactionId: '202403202315012',
    type: 'income',
    amount: 6499.00,
    status: '支付成功',
    paymentMethod: '微信支付'
  },
  {
    time: '2024-03-21 00:00:00',
    orderId: 'ORDER2024032013',
    transactionId: '202403210000013',
    type: 'expense',
    amount: 1899.00,
    status: '已退款',
    paymentMethod: '支付宝'
  },
  {
    time: '2024-03-21 00:45:00',
    orderId: 'ORDER2024032014',
    transactionId: '202403210045014',
    type: 'income',
    amount: 8999.00,
    status: '支付成功',
    paymentMethod: '微信支付'
  },
  {
    time: '2024-03-21 01:30:00',
    orderId: 'ORDER2024032015',
    transactionId: '202403210130015',
    type: 'income',
    amount: 3299.00,
    status: '支付成功',
    paymentMethod: '支付宝'
  },
  {
    time: '2024-03-21 02:15:00',
    orderId: 'ORDER2024032016',
    transactionId: '202403210215016',
    type: 'income',
    amount: 4799.00,
    status: '支付成功',
    paymentMethod: '微信支付'
  },
  {
    time: '2024-03-21 03:00:00',
    orderId: 'ORDER2024032017',
    transactionId: '202403210300017',
    type: 'income',
    amount: 2599.00,
    status: '支付成功',
    paymentMethod: '支付宝'
  },
  {
    time: '2024-03-21 03:45:00',
    orderId: 'ORDER2024032018',
    transactionId: '202403210345018',
    type: 'income',
    amount: 5999.00,
    status: '支付成功',
    paymentMethod: '微信支付'
  },
  {
    time: '2024-03-21 04:30:00',
    orderId: 'ORDER2024032019',
    transactionId: '202403210430019',
    type: 'expense',
    amount: 1799.00,
    status: '已退款',
    paymentMethod: '支付宝'
  },
  {
    time: '2024-03-21 05:15:00',
    orderId: 'ORDER2024032020',
    transactionId: '202403210515020',
    type: 'income',
    amount: 7499.00,
    status: '支付成功',
    paymentMethod: '微信支付'
  },
  {
    time: '2024-03-21 06:00:00',
    orderId: 'ORDER2024032021',
    transactionId: '202403210600021',
    type: 'income',
    amount: 3799.00,
    status: '支付成功',
    paymentMethod: '支付宝'
  },
  {
    time: '2024-03-21 06:45:00',
    orderId: 'ORDER2024032022',
    transactionId: '202403210645022',
    type: 'income',
    amount: 4299.00,
    status: '支付成功',
    paymentMethod: '微信支付'
  },
  {
    time: '2024-03-21 07:30:00',
    orderId: 'ORDER2024032023',
    transactionId: '202403210730023',
    type: 'income',
    amount: 2899.00,
    status: '支付成功',
    paymentMethod: '支付宝'
  },
  {
    time: '2024-03-21 08:15:00',
    orderId: 'ORDER2024032024',
    transactionId: '202403210815024',
    type: 'income',
    amount: 6299.00,
    status: '支付成功',
    paymentMethod: '微信支付'
  },
  {
    time: '2024-03-21 09:00:00',
    orderId: 'ORDER2024032025',
    transactionId: '202403210900025',
    type: 'expense',
    amount: 1999.00,
    status: '已退款',
    paymentMethod: '支付宝'
  }
]

// 表格数据
const records = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(allRecords.length)
const goToPage = ref('')

// 查询 - 根据页码加载对应数据
const handleSearch = () => {
  loading.value = true
  
  // 计算当前页的数据范围
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  
  // 模拟异步请求
  setTimeout(() => {
    // 截取对应页码的数据
    records.value = allRecords.slice(start, end)
    loading.value = false
  }, 500)
}

// 重置查询
const resetSearch = () => {
  searchForm.dateRange = []
  searchForm.orderId = ''
  searchForm.status = ''
  handleSearch()
}

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case '支付成功':
      return 'success'
    case '支付失败':
      return 'danger'
    case '已退款':
      return 'info'
    default:
      return ''
  }
}

// 退款操作
const handleRefund = (row) => {
  ElMessageBox.confirm(
    `确定要对订单 ${row.orderId} 进行退款操作吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现退款逻辑
    ElMessage.success('退款申请已提交')
  })
}

// 查看详情
const viewDetail = (row) => {
  // TODO: 实现查看详情逻辑
  console.log('查看详情', row)
}

// 分页相关
const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}

// 跳转到指定页
const handleGoToPage = () => {
  const page = parseInt(goToPage.value)
  if (page && page > 0 && page <= Math.ceil(total.value / pageSize.value)) {
    currentPage.value = page
    handleSearch()
  }
  goToPage.value = ''
}

// 监听页码大小变化
watch(pageSize, () => {
  currentPage.value = 1
  handleSearch()
})

// 初始加载
handleSearch()
</script>

<style scoped>
.payment-records {
  padding: 20px;
}

.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.statistics-section {
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

.records-table {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.income {
  color: #67c23a;
}

.expense {
  color: #f56c6c;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 20px;
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
</style> 