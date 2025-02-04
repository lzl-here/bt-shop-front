import request from './axios'

// 支付
export const pay = (data) => {
  return request({
    url: '/pay/pay',
    method: 'post',
    data
  })
}

// 取消支付
export const closePay = (data) => {
  return request({
    url: '/pay/close_pay',
    method: 'post',
    data
  })
}

// 退款
export const refundPay = (data) => {
  return request({
    url: '/pay/refund_pay',
    method: 'post',
    data
  })
} 