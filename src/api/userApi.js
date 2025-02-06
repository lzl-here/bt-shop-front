import request from './axios'

// 普通登录
export const login = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username: data.username,
      password: data.password
    }
  })
}

// 普通注册
export const register = (data) => {
  return request({
    url: '/user/register',
    method: 'post',
    data: {
      username: data.username,
      password: data.password,
      confirm_password: data.confirmPassword
    }
  })
}

// 退出登录
export const logout = (userId) => {
  return request({
    url: '/user/logout',
    method: 'post',
    data: {
      user_id: userId
    }
  })
}

// 获取用户信息
export const getUserInfo = (userId) => {
  return request({
    url: '/user/get_user_info',
    method: 'post',
    data: {
      user_id: userId
    }
  })
}

// 更新用户信息
export const updateUserInfo = (data) => {
  return request({
    url: '/user/update_user_info',
    method: 'post',
    data
  })
}

// 微信登录相关接口（暂时模拟）
export const getWechatQrcode = () => {
  return Promise.reject(new Error('微信登录功能暂未开放'))
}

export const checkWechatLogin = () => {
  return Promise.reject(new Error('微信登录功能暂未开放'))
}

// 添加获取店铺详情的方法
export const getShopDetail = () => {
  return request({
    url: '/user/get_shop_detail',
    method: 'post'
  })
} 