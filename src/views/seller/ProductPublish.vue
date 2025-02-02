<template>
  <div class="product-publish">
    <!-- 步骤条 -->
    <div class="steps-header">
      <el-steps :active="currentStep" finish-status="success">
        <el-step title="选择商品品类" />
        <el-step title="填写商品详情" />
        <el-step title="商品发布成功" />
      </el-steps>
    </div>

    <!-- 步骤内容 -->
    <div class="step-content">
      <!-- 第一步：选择商品品类 -->
      <div v-if="currentStep === 0" class="category-selection">
        <div class="category-columns">
          <!-- 第一列：主分类 -->
          <div class="category-column">
            <div
              v-for="category in mainCategories"
              :key="category.id"
              class="category-item"
              :class="{ active: selectedMainCategory === category.id }"
              @click="selectMainCategory(category)"
            >
              {{ category.name }}
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>

          <!-- 第二列：子分类 -->
          <div class="category-column" v-if="subCategories.length">
            <div
              v-for="category in subCategories"
              :key="category.id"
              class="category-item"
              :class="{ active: selectedSubCategory === category.id }"
              @click="selectSubCategory(category)"
            >
              {{ category.name }}
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>

          <!-- 第三列：具体商品类型 -->
          <div class="category-column" v-if="leafCategories.length">
            <div
              v-for="category in leafCategories"
              :key="category.id"
              class="category-item"
              :class="{ active: selectedLeafCategory === category.id }"
              @click="selectLeafCategory(category)"
            >
              {{ category.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 第二步：填写商品详情 -->
      <div v-if="currentStep === 1" class="product-form">
        <el-form
          ref="formRef"
          :model="productForm"
          :rules="rules"
          label-width="100px"
        >
          <!-- 添加品牌选择 -->
          <el-form-item label="商品品牌" prop="brand">
            <el-select
              v-model="productForm.brand"
              placeholder="请选择品牌"
              clearable
              filterable
            >
              <el-option
                v-for="brand in brands"
                :key="brand.id"
                :label="brand.name"
                :value="brand.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="商品名称" prop="name">
            <el-input v-model="productForm.name" placeholder="请输入商品名称" />
          </el-form-item>

          <el-form-item label="商品价格" prop="price">
            <el-input-number v-model="productForm.price" :min="0" :precision="2" placeholder="请输入商品价格" />
          </el-form-item>

          <el-form-item label="商品描述" prop="description">
            <el-input
              type="textarea"
              v-model="productForm.description"
              placeholder="请输入商品描述"
              :rows="4"
            />
          </el-form-item>

          <!-- 添加规格设置 -->
          <el-form-item label="商品规格" prop="specs">
            <div class="specs-section">
              <div class="specs-header">
                <span class="section-title">规格项</span>
                <el-button type="primary" @click="addSpecItem">添加规格项</el-button>
              </div>

              <div class="specs-content">
                <div class="specs-input">
                  <div class="spec-key-value">
                    <el-input
                      v-model="currentSpec.name"
                      placeholder="规格名称（如：内存）"
                      class="spec-key-input"
                    />
                    <el-input
                      v-model="currentSpec.value"
                      placeholder="规格值（如：256GB）"
                      class="spec-value-input"
                      @keyup.enter="addSpecValue"
                    >
                      <template #append>
                        <el-button @click="addSpecValue">添加规格值</el-button>
                      </template>
                    </el-input>
                  </div>
                </div>

                <!-- 显示已添加的规格项及其值 -->
                <div v-for="(spec, key) in productForm.specs" :key="key" class="spec-group">
                  <div class="spec-group-header">
                    <span class="spec-name">{{ key }}</span>
                    <el-button type="danger" link @click="removeSpecItem(key)">删除</el-button>
                  </div>
                  <div class="spec-values">
                    <el-tag
                      v-for="value in spec"
                      :key="value"
                      closable
                      @close="removeSpecValue(key, value)"
                    >
                      {{ value }}
                    </el-tag>
                  </div>
                </div>
              </div>

              <!-- 规格组合表格 -->
              <div class="specs-table" v-if="specCombinations.length">
                <el-table :data="specCombinations" border>
                  <el-table-column label="规格组合" min-width="180">
                    <template #default="{ row }">
                      <div class="spec-info">
                        {{ formatSpecCombination(row.specs) }}
                      </div>
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="价格" width="200">
                    <template #default="{ row }">
                      <el-input-number 
                        v-model="row.price" 
                        :min="0"
                        :precision="2"
                        placeholder="请输入价格"
                      />
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="库存" width="200">
                    <template #default="{ row }">
                      <el-input-number 
                        v-model="row.stock" 
                        :min="0"
                        placeholder="请输入库存"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="商品图片" prop="images">
            <el-upload
              class="image-uploader"
              action="/api/upload"
              :show-file-list="true"
              :on-success="handleImageSuccess"
              :before-upload="beforeImageUpload"
              multiple
              list-type="picture-card"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>

      <!-- 第三步：发布成功 -->
      <div v-if="currentStep === 2" class="publish-success">
        <el-result
          icon="success"
          title="商品发布成功"
          sub-title="您的商品已经成功发布，现在可以在商品列表中查看"
        >
          <template #extra>
            <el-button type="primary" @click="goToProductList">查看商品列表</el-button>
            <el-button @click="publishAnother">继续发布</el-button>
          </template>
        </el-result>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="step-actions">
      <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
      <el-button 
        v-if="currentStep < 2" 
        type="primary" 
        @click="nextStep"
        :disabled="!canProceed"
      >
        下一步
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const currentStep = ref(0)
const selectedMainCategory = ref(null)
const selectedSubCategory = ref(null)
const selectedLeafCategory = ref(null)

// 模拟分类数据
const mainCategories = [
  { id: 1, name: '数码办公' },
  { id: 2, name: '家用电器' },
  { id: 3, name: '服装鞋帽' },
  { id: 4, name: '食品饮料' },
  { id: 5, name: '礼品箱包' },
  { id: 6, name: '个护化妆' },
  { id: 7, name: '厨房餐饮' },
  { id: 8, name: '家居家装' },
  { id: 9, name: '汽车用品' },
  { id: 10, name: '玩具乐器' }
]

// 添加子分类和叶子分类的数据
const subCategories = ref([])
const leafCategories = ref([])

// 添加品牌数据
const brands = [
  { id: 1, name: '苹果' },
  { id: 2, name: '小米' },
  { id: 3, name: 'OPPO' },
  { id: 4, name: 'vivo' },
  { id: 5, name: '魅族' },
  { id: 6, name: '华为' },
  { id: 7, name: '三星' },
  { id: 8, name: '荣耀' }
]

// 当前正在编辑的规格
const currentSpec = ref({
  name: '',
  value: ''
})

// 商品表单
const productForm = ref({
  name: '',
  brand: '',
  price: 0,
  description: '',
  images: [],
  specs: {}, // { '内存': ['256GB', '512GB'], '颜色': ['黑色', '白色'] }
})

// 计算是否可以进行下一步
const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return selectedLeafCategory.value !== null
  }
  return true
})

// 模拟子分类数据
const getSubCategories = (parentId) => {
  // 模拟数据，实际应该从后端获取
  const subCategoryMap = {
    1: [ // 数码办公的子分类
      { id: 101, name: '手机通讯' },
      { id: 102, name: '摄影摄像' },
      { id: 103, name: '数码配件' },
      { id: 104, name: '时尚影音' },
      { id: 105, name: '电脑整机' },
      { id: 106, name: '电脑配件' },
      { id: 107, name: '外设产品' },
      { id: 108, name: '网络产品' },
      { id: 109, name: '办公打印' },
      { id: 110, name: '办公文仪' }
    ]
  }
  return subCategoryMap[parentId] || []
}

// 模拟叶子分类数据
const getLeafCategories = (parentId) => {
  // 模拟数据，实际应该从后端获取
  const leafCategoryMap = {
    101: [ // 手机通讯的子分类
      { id: 1001, name: '手机' },
      { id: 1002, name: '对讲机' }
    ]
  }
  return leafCategoryMap[parentId] || []
}

// 修改选择分类的方法
const selectMainCategory = (category) => {
  selectedMainCategory.value = category.id
  selectedSubCategory.value = null
  selectedLeafCategory.value = null
  subCategories.value = getSubCategories(category.id)
  leafCategories.value = []
}

const selectSubCategory = (category) => {
  selectedSubCategory.value = category.id
  selectedLeafCategory.value = null
  leafCategories.value = getLeafCategories(category.id)
}

const selectLeafCategory = (category) => {
  selectedLeafCategory.value = category.id
}

// 添加表单验证规则
const rules = {
  brand: [
    { required: true, message: '请选择商品品牌', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' }
  ],
  images: [
    { required: true, message: '请上传商品图片', trigger: 'change' }
  ]
}

// 修改下一步的逻辑
const formRef = ref(null)
const nextStep = async () => {
  if (currentStep.value === 1) {
    // 在第二步时，需要验证表单
    if (!formRef.value) return
    try {
      await formRef.value.validate()
      currentStep.value++
    } catch (error) {
      return
    }
  } else {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 图片上传
const handleImageSuccess = (response) => {
  productForm.value.images.push(response.url)
}

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 发布成功后的操作
const goToProductList = () => {
  router.push('/seller?tab=products')
}

// 计算规格组合
const specCombinations = computed(() => {
  const specs = productForm.value.specs
  const specNames = Object.keys(specs)
  if (specNames.length === 0) return []

  // 生成所有可能的组合
  const combinations = generateCombinations(specs)
  return combinations.map(combo => ({
    specs: combo,
    price: 0,
    stock: 0
  }))
})

// 生成规格组合
const generateCombinations = (specs) => {
  const specNames = Object.keys(specs)
  if (specNames.length === 0) return []

  const combine = (current, remainingSpecs) => {
    if (remainingSpecs.length === 0) return [current]
    
    const specName = remainingSpecs[0]
    const values = specs[specName]
    const results = []
    
    values.forEach(value => {
      results.push(...combine(
        { ...current, [specName]: value },
        remainingSpecs.slice(1)
      ))
    })
    
    return results
  }

  return combine({}, specNames)
}

// 格式化规格组合显示
const formatSpecCombination = (specs) => {
  return Object.entries(specs)
    .map(([name, value]) => `${name}: ${value}`)
    .join(', ')
}

// 添加规格值
const addSpecValue = () => {
  const { name, value } = currentSpec.value
  if (!name || !value) {
    ElMessage.warning('请输入规格名称和规格值')
    return
  }

  if (!productForm.value.specs[name]) {
    productForm.value.specs[name] = []
  }

  if (productForm.value.specs[name].includes(value)) {
    ElMessage.warning('该规格值已存在')
    return
  }

  productForm.value.specs[name].push(value)
  currentSpec.value.value = '' // 只清空规格值，保留规格名称
}

// 移除规格项
const removeSpecItem = (specName) => {
  delete productForm.value.specs[specName]
}

// 移除规格值
const removeSpecValue = (specName, value) => {
  const values = productForm.value.specs[specName]
  const index = values.indexOf(value)
  if (index > -1) {
    values.splice(index, 1)
    if (values.length === 0) {
      delete productForm.value.specs[specName]
    }
  }
}

// 修改重置表单的逻辑
const publishAnother = () => {
  currentStep.value = 0
  selectedMainCategory.value = null
  selectedSubCategory.value = null
  selectedLeafCategory.value = null
  currentSpec.value = { name: '', value: '' }
  productForm.value = {
    name: '',
    brand: '',
    price: 0,
    description: '',
    images: [],
    specs: {}
  }
}
</script>

<style scoped>
.product-publish {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 120px);
}

.steps-header {
  margin-bottom: 40px;
  padding: 20px 100px;
}

.step-content {
  padding: 20px;
  min-height: 400px;
}

.category-selection {
  margin: 20px 0;
}

.category-columns {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.category-column {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  min-height: 400px;
  overflow-y: auto;
  background: #fff;
}

.category-item {
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
  border-bottom: 1px solid #f5f5f5;
}

.category-item:last-child {
  border-bottom: none;
}

.category-item:hover {
  background-color: #f5f7fa;
}

.category-item.active {
  background-color: #f0f9eb;
  color: #67c23a;
}

.product-form {
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.step-actions {
  margin-top: 40px;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #ebeef5;
}

.image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.image-uploader:hover {
  border-color: var(--el-color-primary);
}

.publish-success {
  padding: 40px;
  text-align: center;
}

/* 添加品牌选择框样式 */
:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  width: 100%;
}

/* 添加规格相关样式 */
.specs-section {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
}

.specs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.specs-content {
  margin-bottom: 20px;
}

.specs-input {
  margin-bottom: 16px;
}

.spec-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.specs-table {
  margin-top: 20px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-table .el-input__wrapper) {
  padding: 0 8px;
}

:deep(.el-table .el-input-number__decrease),
:deep(.el-table .el-input-number__increase) {
  border: none;
  background: none;
}

.spec-key-value {
  display: flex;
  gap: 10px;
}

.spec-key-input {
  width: 200px;
}

.spec-value-input {
  flex: 1;
}

.spec-info {
  font-size: 14px;
  color: #606266;
}

:deep(.el-table) {
  margin-top: 20px;
}

:deep(.el-input-number.is-without-controls .el-input__wrapper) {
  padding-left: 15px;
  padding-right: 15px;
}

.spec-group {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.spec-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.spec-name {
  font-weight: 500;
  color: #303133;
}

.spec-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style> 