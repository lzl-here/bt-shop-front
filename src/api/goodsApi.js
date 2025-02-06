import axios from './axios'

// 获取关键词下拉列表
export const getKeywordDownList = (prefix) => {
  return axios.post('/goods/get_keyword_down_list', { prefix })
}

// 根据关键词和搜索参数进行搜索
export const searchSpuList = (params) => {
  return axios.post('/goods/search_spu_list', {
    page_size: params.pageSize,
    page_no: params.pageNo,
    keyword: params.keyword,
    category_ids: params.categoryIds,
    brand_ids: params.brandIds,
    order_by: params.orderBy
  })
}

// 获取单个商品详情
export const getGoodsDetail = (spuId) => {
  if (typeof spuId !== 'number' || isNaN(spuId)) {
    return Promise.reject(new Error('Invalid spu_id'))
  }
  return axios.post('/goods/get_goods_detail', { spu_id: spuId })
}

// 获取商品列表详情
export const getGoodsList = (spuIds) => {
  return axios.post('/goods/get_goods_list', { spu_ids: spuIds })
}

// 获取商品分类
export const getCategoryList = () => {
  return axios.post('/goods/get_category_list', {})
}

// 获取品牌列表
export const getBrandList = () => {
  return axios.post('/goods/get_brand_list', {})
}

// 添加到购物车
export const addToCart = (cartData) => {
  return axios.post('/goods/add_to_cart', cartData)
}

// 发布商品
export const publishGoods = (goodsData) => {
  return axios.post('/goods/publish_goods', goodsData)
}

// 获取商家商品列表
export const getSellerGoodsList = (params) => {
  return axios.post('/goods/get_seller_goods_list', {
    shop_id: params.shop_id,
    page_size: params.page_size,
    page_no: params.page_no
  })
}