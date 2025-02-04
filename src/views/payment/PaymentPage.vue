<template>
  <div class="payment-container">
    <div class="payment-card">
      <h2>订单支付</h2>
      
      <!-- 订单信息 -->
      <div class="order-info">
        <div class="info-item">
          <span class="label">订单号：</span>
          <span class="value">{{ tradeNo }}</span>
        </div>
        <div class="info-item">
          <span class="label">商品：</span>
          <span class="value">{{ subject }}</span>
        </div>
        <div class="info-item">
          <span class="label">金额：</span>
          <span class="amount">¥{{ amount }}</span>
        </div>
      </div>

      <!-- 支付方式选择 -->
      <div class="payment-methods">
        <h3>选择支付方式</h3>
        <el-radio-group v-model="paymentMethod">
          <el-radio label="alipay">
            <div class="payment-method-item">
              <img src="../../assets/alipay-logo.png" alt="支付宝" class="payment-icon" />
              <span>支付宝支付</span>
            </div>
          </el-radio>
          <el-radio label="wechat">
            <div class="payment-method-item">
              <img src="../../assets/wechat-logo.png" alt="微信支付" class="payment-icon" />
              <span>微信支付</span>
            </div>
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 支付按钮 -->
      <el-button 
        type="primary" 
        :loading="paying"
        @click="handlePay"
        class="pay-button"
      >
        立即支付
      </el-button>

      <!-- 温馨提示 -->
      <div class="payment-tips">
        <p>温馨提示：</p>
        <ul>
          <li>请在新打开的页面完成支付</li>
          <li>支付完成后请根据提示完成付款</li>
          <li>如遇到支付问题，请及时联系客服</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { pay } from '../../api/payApi'

const route = useRoute()
const router = useRouter()

const tradeNo = ref('')
const amount = ref('')
const subject = ref('')
const paymentMethod = ref('alipay')
const paying = ref(false)

// 初始化支付数据
onMounted(() => {
  tradeNo.value = route.query.trade_no || ''
  amount.value = route.query.amount || ''
  subject.value = route.query.subject || ''
  
  if (!tradeNo.value || !amount.value) {
    ElMessage.error('支付参数不完整')
    router.push('/')
  }
})

// 处理支付
const handlePay = async () => {
  if (paying.value) return
  
  try {
    paying.value = true
    ElMessage.info('正在发起支付...')
    
    const payData = {
      trade_no: tradeNo.value,
      subject: subject.value,
      total_amount: amount.value,
      pay_type: paymentMethod.value
    }
    
    console.log('Requesting payment with data:', payData)
    const response = await pay(payData)
    
    if (response.code === 1 && response.data?.pay_info?.pay_page_url) {
      // 存储支付相关信息
      localStorage.setItem('paying_trade_no', tradeNo.value)
      localStorage.setItem('paying_amount', amount.value)
      
      // 跳转到第三方支付页面
      const payPageUrl = response.data.pay_info.pay_page_url
      console.log('Redirecting to payment page:', payPageUrl)
      window.location.href = payPageUrl
    } else {
      throw new Error(response.msg || '获取支付链接失败')
    }
  } catch (error) {
    console.error('Payment error:', error)
    ElMessage.error(error.message || '发起支付失败，请重试')
  } finally {
    paying.value = false
  }
}
</script>

<style scoped>
.payment-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.payment-card {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 24px;
  color: #333;
  text-align: center;
}

.order-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
  width: 80px;
}

.value {
  color: #333;
  flex: 1;
}

.amount {
  color: #f56c6c;
  font-size: 20px;
  font-weight: 500;
}

.payment-methods {
  margin: 24px 0;
}

h3 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #333;
}

.pay-button {
  width: 100%;
  height: 48px;
  margin-top: 24px;
}

.payment-method-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.payment-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.payment-tips {
  margin-top: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.payment-tips p {
  margin: 0 0 8px;
  color: #333;
  font-weight: 500;
}

.payment-tips ul {
  margin: 0;
  padding-left: 20px;
}

.payment-tips li {
  margin-bottom: 4px;
}

.payment-tips li:last-child {
  margin-bottom: 0;
}
</style> 