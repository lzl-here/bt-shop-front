import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8081', // 修改为实际的后端 API 地址
  timeout: 15000,
  withCredentials: true // 允许跨域请求携带凭证
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 添加跨域请求头
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    config.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization'
    
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果响应成功但业务状态码不为 1
    if (res.code !== 1) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    return res
  },
  error => {
    console.error('Response error:', error)
    // 处理 CORS 错误
    if (error.message.includes('Network Error') || error.message.includes('CORS')) {
      ElMessage.error('网络错误，请确保后端服务正常运行并已配置跨域')
    } else {
      ElMessage.error(error.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default request 