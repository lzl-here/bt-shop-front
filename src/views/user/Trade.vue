<template>
  <div class="trade-list">
    <h2>我的交易</h2>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>
    
    <!-- 交易列表 -->
    <template v-else>
      <div v-if="trades.length > 0" class="trade-items">
        <div v-for="trade in trades" :key="trade.trade.trade_no" class="trade-item">
          <!-- 交易头部 -->
          <div class="trade-header">
            <span class="trade-no">交易号：{{ trade.trade.trade_no }}</span>
            <span class="trade-status">{{ getTradeStatusText(trade.trade.trade_status) }}</span>
          </div>
          
          <!-- 商品列表 -->
          <div class="order-list">
            <div v-for="order in trade.order_list" :key="order.order.order_no" class="order-item">
              <div v-if="order.order_item_list && order.order_item_list.length > 0">
                <div v-for="item in order.order_item_list" 
                     :key="item.id" 
                     class="product-info"
                >
                  <el-image 
                    :src="item.sku_img_url || '/placeholder.png'" 
                    fit="cover"
                    class="product-image"
                  >
                    <template #error>
                      <div class="image-error">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                  <div class="product-detail">
                    <h3>{{ item.spu_name }}</h3>
                    <div class="specs">
                      <span v-for="spec in item.spec_value_list" 
                            :key="spec.id"
                            class="spec-item"
                      >
                        {{ spec.spec_name }}: {{ spec.spec_value }}
                      </span>
                    </div>
                    <div class="price-qty">
                      <span class="price">¥{{ item.sku_amount }}</span>
                      <span class="quantity">x{{ item.buy_num || 1 }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-item">
                暂无商品信息
              </div>
            </div>
          </div>
          
          <!-- 交易底部 -->
          <div class="trade-footer">
            <div class="trade-amount">
              实付金额：<span class="amount">¥{{ trade.trade.trade_amount }}</span>
            </div>
            <div class="trade-actions">
              <el-button 
                v-if="trade.trade.trade_status === 'paying'"
                type="primary" 
                size="small"
                @click="handlePay(trade)"
              >
                继续支付
              </el-button>
              <el-button 
                v-if="trade.trade.trade_status === 'paying'"
                type="danger" 
                size="small"
                @click="handleCancel(trade)"
              >
                取消交易
              </el-button>
              <el-button 
                type="primary" 
                plain
                size="small"
                @click="handleDetail(trade)"
              >
                查看详情
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 分页器 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
          />
        </div>
      </div>
      
      <!-- 空状态 -->
      <el-empty v-else description="暂无交易" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { getTradeList, cancelTrade } from '../../api/orderApi'

const router = useRouter()
const trades = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10) // 默认每页显示10条
const total = ref(0)

// 获取交易列表
const fetchTradeList = async () => {
  try {
    loading.value = true
    const response = await getTradeList({
      page_no: currentPage.value,
      page_size: pageSize.value // 传递页大小参数
    })
    
    if (response.code === 1 && response.data) {
      trades.value = response.data.trade_list || []
      total.value = response.data.count || 0
      
      // 如果当前页没有数据且不是第一页，回到上一页
      if (trades.value.length === 0 && currentPage.value > 1) {
        currentPage.value--
        fetchTradeList()
      }
    } else {
      throw new Error(response.msg || '获取交易列表失败')
    }
  } catch (error) {
    console.error('Error fetching trade list:', error)
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

// 获取交易状态文本
const getTradeStatusText = (status) => {
  const statusMap = {
    'paying': '待支付',
    'TRADE_SUCCESS': '交易成功',
    'TRADE_CLOSED': '交易关闭',
    'TRADE_FINISHED': '交易完成'
  }
  return statusMap[status] || status
}

// 获取订单商品信息
const getOrderItems = (order) => {
  return order.order_item_list || []
}

// 继续支付
const handlePay = (trade) => {
  router.push({
    path: '/payment',
    query: {
      trade_no: trade.trade.trade_no,
      amount: trade.trade.trade_amount,
      subject: trade.order_list[0].order_item_list?.[0]?.spu_name + 
              (trade.order_list.length > 1 ? ` 等${trade.order_list.length}件商品` : '')
    }
  })
}

// 取消交易
const handleCancel = async (trade) => {
  try {
    await ElMessageBox.confirm('确定要取消该交易吗？', '提示', {
      type: 'warning'
    })
    
    const response = await cancelTrade({
      trade_no: trade.trade.trade_no
    })
    
    if (response.code === 1) {
      ElMessage.success('交易已取消')
      fetchTradeList() // 刷新列表
    } else {
      throw new Error(response.msg || '取消交易失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error canceling trade:', error)
      ElMessage.error(error.message || '取消交易失败')
    }
  }
}

// 查看详情
const handleDetail = (trade) => {
  router.push(`/user/trades/${trade.trade.trade_no}`)
}

// 处理每页条数变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1 // 重置到第一页
  fetchTradeList()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchTradeList()
}

onMounted(() => {
  fetchTradeList()
})
</script>

<style scoped>
.trade-list {
  padding: 20px;
}

.trade-items {
  margin-top: 20px;
}

.trade-item {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.trade-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.trade-no {
  color: #666;
}

.trade-status {
  color: #f56c6c;
  font-weight: 500;
}

.order-list {
  padding: 16px 0;
}

.order-item {
  margin-bottom: 16px;
}

.order-item:last-child {
  margin-bottom: 0;
}

.product-info {
  display: flex;
  gap: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  flex-shrink: 0;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  color: #909399;
}

.product-detail {
  flex: 1;
  min-width: 0;
}

.product-detail h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.specs {
  margin-bottom: 8px;
}

.spec-item {
  display: inline-block;
  padding: 2px 6px;
  background: #f0f2f5;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  margin-right: 8px;
  margin-bottom: 4px;
}

.price-qty {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f56c6c;
  font-weight: 500;
}

.quantity {
  color: #666;
}

.trade-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.trade-amount {
  color: #666;
}

.amount {
  color: #f56c6c;
  font-size: 18px;
  font-weight: 500;
}

.trade-actions {
  display: flex;
  gap: 8px;
}

.empty-item {
  text-align: center;
  color: #909399;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;
}

.loading-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.trade-list h2 {
  margin: 0 0 20px;
  font-size: 20px;
  color: #333;
}
</style> 