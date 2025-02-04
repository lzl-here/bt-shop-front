import request from './axios'

// 创建交易
export const createTrade = (data) => {
  return request({
    url: '/order/create_trade',
    method: 'post',
    data
  })
}

// 继续支付
export const reTrade = (data) => {
  return request({
    url: '/order/re_trade',
    method: 'post',
    data
  })
}

// 取消交易
export const cancelTrade = (data) => {
  return request({
    url: '/order/cancel_trade',
    method: 'post',
    data
  })
}

// 查询订单项
export const getOrderItems = (tradeNo) => {
  return request({
    url: '/order/get_order_items',
    method: 'get',
    params: {
      trade_no: tradeNo
    }
  })
}

// 支付成功通知
export const paySuccessToOrder = (data) => {
  return request({
    url: '/order/pay_success_to_order',
    method: 'post',
    data
  })
}

// 支付取消通知
export const payCancelToOrder = (data) => {
  return request({
    url: '/order/pay_cancel_to_order',
    method: 'post',
    data
  })
} 