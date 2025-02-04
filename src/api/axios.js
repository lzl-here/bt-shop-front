import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8081', // 后端网关地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  },
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理，比如添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      // 处理 HTTP 错误状态
      console.error('Response error:', error.response.status, error.response.data)
    } else if (error.request) {
      // 请求发出但没有收到响应
      console.error('No response received:', error.request)
    } else {
      // 请求配置出错
      console.error('Request error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default instance 