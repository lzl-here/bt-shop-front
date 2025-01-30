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
      <div class="table-header">
        <div class="col-trade-no">交易号</div>
        <div class="col-order">订单号</div>
        <div class="col-amount">金额</div>
        <div class="col-time">支付时间</div>
        <div class="col-method">支付方式</div>
        <div class="col-status">状态</div>
        <div class="col-action">操作</div>
      </div>

      <div class="table-body">
        <div v-for="record in filteredRecords" :key="record.id" class="table-row">
          <div class="col-trade-no">{{ record.tradeNo }}</div>
          <div class="col-order">{{ record.orderNo }}</div>
          <div class="col-amount">¥{{ record.amount.toFixed(2) }}</div>
          <div class="col-time">{{ record.paymentTime }}</div>
          <div class="col-method">{{ record.paymentMethod }}</div>
          <div class="col-status">
            <span :class="['status-tag', getStatusTag(record.status).type]">
              {{ getStatusTag(record.status).text }}
            </span>
          </div>
          <div class="col-action">
            <button 
              v-if="record.status === 'pending_confirm'"
              class="confirm-btn"
              @click="confirmPayment(record)"
            >
              确认收款
            </button>
          </div>
          <div class="order-items" v-if="record.items.length > 1">
            <div v-for="item in record.items" :key="item.id" class="order-item">
              <div class="item-info">
                <span class="item-name">{{ item.productName }}</span>
                <span class="item-price">¥{{ item.price.toFixed(2) }} × {{ item.quantity }}</span>
              </div>
              <div class="item-status">
                <span :class="['status-tag', getStatusTag(item.status).type]">
                  {{ getStatusTag(item.status).text }}
                </span>
                <span v-if="item.trackingNo" class="tracking-no">
                  物流单号: {{ item.trackingNo }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
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

const status = ref('pending')
const currentPage = ref(1)
const pageSize = ref(12) // 默认每页12条
const total = ref(0)

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

// 修改模拟数据
const records = ref([
  {
    id: 1,
    tradeNo: '2024031510302500001',
    orderNo: 'P202403150001',
    amount: 6999.00,
    paymentTime: '2024-03-15 10:30:25',
    paymentMethod: '支付宝',
    status: 'pending_confirm',
    items: [
      {
        id: 1,
        productId: 101,
        productName: 'HUAWEI Mate 60 Pro',
        price: 6999.00,
        quantity: 1,
        status: 'pending_ship',
        shipTime: null,
        trackingNo: null
      }
    ]
  },
  {
    id: 2,
    tradeNo: '2024031511201500002',
    orderNo: 'P202403150002',
    amount: 7998.00,
    paymentTime: '2024-03-15 11:20:15',
    paymentMethod: '微信支付',
    status: 'pending_ship', // 部分商品未发货
    items: [
      {
        id: 2,
        productId: 102,
        productName: 'HUAWEI MatePad Pro',
        price: 4999.00,
        quantity: 1,
        status: 'shipped',
        shipTime: '2024-03-15 14:30:00',
        trackingNo: 'SF1234567890'
      },
      {
        id: 3,
        productId: 103,
        productName: 'HUAWEI FreeBuds Pro 3',
        price: 2999.00,
        quantity: 1,
        status: 'pending_ship',
        shipTime: null,
        trackingNo: null
      }
    ]
  }
])

// 修改状态显示
const getStatusTag = (status) => {
  const statusMap = {
    // 订单状态
    pending_payment: { text: '待付款', type: 'info' },
    pending_confirm: { text: '待确认', type: 'warning' },
    pending_ship: { text: '待发货', type: 'primary' },
    completed: { text: '已完成', type: 'success' },
    cancelled: { text: '已取消', type: 'danger' },
    // 商品状态
  }
  return statusMap[status] || { text: '未知状态', type: 'info' }
}

// 根据状态过滤记录
const filteredRecords = computed(() => {
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
      `确认收到订单 ${record.orderNo} 的付款 ¥${record.amount.toFixed(2)} 吗？`,
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

.col-trade-no { width: 18%; padding: 0 15px; }
.col-order { width: 17%; padding: 0 15px; }
.col-amount { width: 15%; padding: 0 15px; color: #f56c6c; }
.col-time { width: 15%; padding: 0 15px; }
.col-method { width: 15%; padding: 0 15px; }
.col-status { width: 10%; padding: 0 15px; }
.col-action { width: 10%; padding: 0 15px; }

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
  padding: 2px 8px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  line-height: 1.5;
  min-height: 24px;
}

.confirm-btn:hover {
  background-color: #66b1ff;
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

.order-items {
  margin-top: 8px;
  padding: 8px 15px;
  background-color: #f8f9fa;
  border-radius: 2px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 12px;
}

.order-item + .order-item {
  border-top: 1px dashed #ebeef5;
  margin-top: 4px;
  padding-top: 8px;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-name {
  color: #303133;
}

.item-price {
  color: #909399;
}

.tracking-no {
  margin-left: 8px;
  color: #909399;
}
</style> 