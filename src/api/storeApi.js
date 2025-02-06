import request from './axios'

// 获取店铺详情
export const getShopDetail = () => {
  return request({
    url: '/user/get_shop_detail',
    method: 'post'
  })
}

// 更新店铺信息
export const updateShopInfo = (data) => {
  return request({
    url: '/user/update_user_info',
    method: 'post',
    data: {
      shop_id: data.shop_id,
      name: data.name,
      description: data.description,
      logo: data.logo
    }
  })
} 