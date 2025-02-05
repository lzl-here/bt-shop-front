import request from './axios'

// 创建交易
export const createTrade = (data) => {
  return request({
    url: '/order/create_trade',
    method: 'post',
    data
  })
}

// 获取交易列表
export const getTradeList = (data) => {
  return request({
    url: '/order/get_trade_list',
    method: 'post',
    data
  })
}

// 获取交易详情
export const getTradeDetail = (data) => {
  return request({
    url: '/order/get_trade_detail',
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

// 获取订单详情
export const getOrderDetail = (data) => {
  return request({
    url: '/order/get_order_detail',
    method: 'post',
    data
  })
}

// 获取订单项
export const getOrderItems = (data) => {
  return request({
    url: '/order/get_order_items',
    method: 'post',
    data
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