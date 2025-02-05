<template>
  <div class="trade-detail">
    <div class="page-header">
      <h2>交易详情</h2>
      <el-button link @click="$router.back()">返回</el-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <template v-else-if="tradeDetail">
      <!-- 交易信息 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>交易信息</span>
            <span class="trade-status">{{ getTradeStatusText(tradeDetail.trade.trade.trade_status) }}</span>
          </div>
        </template>
        <el-descriptions :column="2">
          <el-descriptions-item label="交易号">
            {{ tradeDetail.trade.trade.trade_no }}
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">
            {{ getPayTypeText(tradeDetail.trade.trade.pay_type) }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 商品信息 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>商品信息</span>
          </div>
        </template>
        <div v-for="order in tradeDetail.trade.order_list" 
             :key="order.order.order_no" 
             class="order-section"
        >
          <div v-if="order.order_item_list && order.order_item_list.length > 0" 
               class="product-list"
          >
            <div v-for="item in order.order_item_list" 
                 :key="item.id" 
                 class="product-item"
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
              <div class="product-info">
                <h4>{{ item.spu_name }}</h4>
                <div class="specs">
                  <el-tag 
                    v-for="spec in item.spec_value_list" 
                    :key="spec.id"
                    size="small"
                    type="info"
                    effect="plain"
                  >
                    {{ spec.spec_name }}: {{ spec.spec_value }}
                  </el-tag>
                </div>
                <div class="price-qty">
                  <span class="price">¥{{ item.sku_amount }}</span>
                  <span class="quantity">x{{ item.buy_num || 1 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 支付信息 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>支付信息</span>
          </div>
        </template>
        <div class="payment-info">
          <div class="amount-item">
            <span>实付金额：</span>
            <span class="total-amount">¥{{ tradeDetail.trade.trade.trade_amount }}</span>
          </div>
          
          <!-- 待支付状态显示操作按钮 -->
          <div v-if="tradeDetail.trade.trade.trade_status === 'paying'" class="payment-actions">
            <el-button type="primary" @click="handlePay">继续支付</el-button>
            <el-button type="danger" @click="handleCancel">取消交易</el-button>
          </div>
        </div>
      </el-card>
    </template>

    <!-- 加载失败 -->
    <el-empty v-else description="交易信息加载失败" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { getTradeDetail, cancelTrade } from '../../api/orderApi'

const route = useRoute()
const router = useRouter()
const tradeDetail = ref(null)
const loading = ref(false)

// 获取交易详情
const fetchTradeDetail = async () => {
  try {
    loading.value = true
    console.log('Fetching trade detail for:', route.params.tradeNo)
    const response = await getTradeDetail({
      trade_no: route.params.tradeNo
    })
    
    if (response.code === 1 && response.data) {
      tradeDetail.value = response.data
      console.log('Trade detail loaded:', tradeDetail.value)
    } else {
      throw new Error(response.msg || '获取交易详情失败')
    }
  } catch (error) {
    console.error('Error fetching trade detail:', error)
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

// 获取支付方式文本
const getPayTypeText = (type) => {
  const typeMap = {
    'ALIPAY': '支付宝',
    'WECHAT': '微信支付',
    'BANK': '银行卡'
  }
  return typeMap[type] || '未支付'
}

// 继续支付
const handlePay = () => {
  router.push({
    path: '/payment',
    query: {
      trade_no: tradeDetail.value.trade.trade.trade_no,
      amount: tradeDetail.value.trade.trade.trade_amount
    }
  })
}

// 取消交易
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要取消该交易吗？', '提示', {
      type: 'warning'
    })
    
    const response = await cancelTrade({
      trade_no: tradeDetail.value.trade.trade.trade_no
    })
    
    if (response.code === 1) {
      ElMessage.success('交易已取消')
      fetchTradeDetail() // 刷新详情
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

onMounted(() => {
  fetchTradeDetail()
})
</script>

<style scoped>
.trade-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trade-status {
  color: #f56c6c;
  font-weight: 500;
}

.product-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.product-info {
  flex: 1;
}

.product-info h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #333;
}

.specs {
  margin-bottom: 8px;
}

.specs .el-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.price-qty {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: 500;
}

.payment-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}

.amount-item {
  font-size: 16px;
}

.total-amount {
  color: #f56c6c;
  font-size: 24px;
  font-weight: 500;
}

.payment-actions {
  display: flex;
  gap: 12px;
}

.loading-container {
  padding: 20px;
}
</style> 