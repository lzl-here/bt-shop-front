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
              v-for="category in categories"
              :key="category.category_id"
              class="category-item"
              :class="{ active: selectedMainCategory === category.category_id }"
              @click="selectMainCategory(category)"
            >
              {{ category.category_name }}
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>

          <!-- 第二列：子分类 -->
          <div class="category-column" v-if="subCategories.length">
            <div
              v-for="category in subCategories"
              :key="category.category_id"
              class="category-item"
              :class="{ active: selectedSubCategory === category.category_id }"
              @click="selectSubCategory(category)"
            >
              {{ category.category_name }}
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>

          <!-- 第三列：具体商品类型 -->
          <div class="category-column" v-if="leafCategories.length">
            <div
              v-for="category in leafCategories"
              :key="category.category_id"
              class="category-item"
              :class="{ active: selectedLeafCategory === category.category_id }"
              @click="selectLeafCategory(category)"
            >
              {{ category.category_name }}
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
          label-width="120px"
        >
          <el-form-item label="商品名称" required>
            <el-input v-model="productForm.spu_name" placeholder="请输入商品名称" />
          </el-form-item>

          <el-form-item label="商品描述" required>
            <el-input
              v-model="productForm.spu_desc"
              type="textarea"
              placeholder="请输入商品描述"
            />
          </el-form-item>

          <el-form-item label="商品图片" required>
            <el-upload
              class="product-image-upload"
              action="/api/upload"
              :show-file-list="false"
              :on-success="handleImageSuccess"
            >
              <img v-if="productForm.spu_img_url" :src="productForm.spu_img_url" class="preview-image">
              <el-button v-else type="primary">上传图片</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item label="商品价格" required>
            <el-input-number 
              v-model="productForm.spu_price"
              :precision="2"
              :step="0.01"
              :min="0"
            />
          </el-form-item>

          <!-- 商品规格部分 -->
          <el-form-item label="商品规格" prop="specs">
            <div class="specs-section">
              <div class="specs-header">
                <span class="section-title">规格项</span>
                <el-button type="primary" @click="addNewSpecInput">添加规格项</el-button>
              </div>

              <div class="specs-content">
                <!-- 规格输入列表 -->
                <div v-for="(spec, index) in specInputs" :key="index" class="spec-input-item">
                  <div class="spec-key-value">
                    <el-input
                      v-model="spec.name"
                      placeholder="规格名称（如：内存）"
                      class="spec-key-input"
                      :disabled="spec.isExisting"
                    />
                    <el-input
                      v-model="spec.value"
                      placeholder="规格值（如：256GB）"
                      class="spec-value-input"
                      @keyup.enter="confirmSpec(index)"
                    >
                      <template #append>
                        <el-button @click="confirmSpec(index)">确定</el-button>
                      </template>
                    </el-input>
                    <el-button type="danger" link @click="removeSpecInput(index)">删除</el-button>
                  </div>
                </div>

                <!-- 已添加的规格列表 -->
                <div v-for="(values, name) in productForm.specs" :key="name" class="spec-group">
                  <div class="spec-group-header">
                    <span class="spec-name">{{ name }}</span>
                    <el-button type="danger" link @click="removeSpecItem(name)">删除</el-button>
                  </div>
                  <div class="spec-values">
                    <el-tag
                      v-for="value in values"
                      :key="value"
                      closable
                      @close="removeSpecValue(name, value)"
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

          <el-form-item>
            <el-button type="primary" @click="publishProduct">发布商品</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 第三步：发布成功 -->
      <div v-if="currentStep === 2" class="publish-success">
        <el-result
          icon="success"
          title="商品发布成功"
          sub-title="您可以继续发布新商品或返回商品列表"
        >
          <template #extra>
            <el-button type="primary" @click="publishAnother">继续发布</el-button>
            <el-button @click="$router.push('/seller/dashboard?tab=products')">返回列表</el-button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getCategoryList, publishGoods } from '../../api/goodsApi'

const router = useRouter()
const currentStep = ref(0)
const loading = ref(false)

// 分类相关
const categories = ref([])
const subCategories = ref([])
const leafCategories = ref([])
const selectedMainCategory = ref(null)
const selectedSubCategory = ref(null)
const selectedLeafCategory = ref(null)

// 获取分类列表
const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await getCategoryList()
    if (res.code === 1) {
      categories.value = res.data.category_list.map(category => ({
        ...category,
        id: category.category_id,
        name: category.category_name
      }))
    } else {
      throw new Error(res.msg || '获取分类列表失败')
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

// 选择主分类
const selectMainCategory = (category) => {
  selectedMainCategory.value = category.category_id
  selectedSubCategory.value = null
  selectedLeafCategory.value = null
  subCategories.value = category.children?.map(subCat => ({
    ...subCat,
    id: subCat.category_id,
    name: subCat.category_name
  })) || []
  leafCategories.value = []
}

// 选择子分类
const selectSubCategory = (category) => {
  selectedSubCategory.value = category.category_id
  selectedLeafCategory.value = null
  leafCategories.value = category.children?.map(leafCat => ({
    ...leafCat,
    id: leafCat.category_id,
    name: leafCat.category_name
  })) || []
}

// 选择叶子分类
const selectLeafCategory = (category) => {
  selectedLeafCategory.value = category.category_id
  currentStep.value = 1 // 选择完最后一级分类后进入下一步
}

onMounted(() => {
  fetchCategories()
})

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

// 商品表单数据
const productForm = ref({
  category_id: null,
  category_name: '',
  brand_id: null,
  brand_name: '',
  spu_name: '',
  spu_desc: '',
  spu_price: '',
  spu_img_url: '',
  sku_list: [],
  attribute_list: [],
  specs: {}
})

// SKU规格输入
const specInputs = ref([])

// 添加规格项
const addNewSpecInput = () => {
  specInputs.value.push({
    name: '',
    value: '',
    isExisting: false
  })
}

// 删除规格项
const removeSpecInput = (index) => {
  specInputs.value.splice(index, 1)
}

// 处理图片上传成功
const handleImageSuccess = (response) => {
  productForm.value.spu_img_url = response.data.url
}

// 计算规格组合
const specCombinations = computed(() => {
  const specs = productForm.value.specs
  const specNames = Object.keys(specs)
  if (specNames.length === 0) return []

  // 生成所有可能的组合
  const combinations = []
  const generateCombinations = (current, remainingSpecs) => {
    if (remainingSpecs.length === 0) {
      combinations.push({
        specs: current,
        price: productForm.value.spu_price,
        stock: 0
      })
      return
    }

    const currentSpec = remainingSpecs[0]
    const values = specs[currentSpec]
    values.forEach(value => {
      generateCombinations(
        { ...current, [currentSpec]: value },
        remainingSpecs.slice(1)
      )
    })
  }

  generateCombinations({}, specNames)
  return combinations
})

// 格式化规格组合显示
const formatSpecCombination = (specs) => {
  return Object.entries(specs)
    .map(([name, value]) => `${name}: ${value}`)
    .join('; ')
}

// 发布商品
const publishProduct = async () => {
  // 构建SKU列表
  const skuList = specCombinations.value.map(combo => ({
    stock_num: combo.stock,
    sku_price: combo.price.toString(),
    spec_key_value: Object.entries(combo.specs).map(([name, value]) => ({
      spec_name: name,
      spec_value: value
    }))
  }))

  // 构建发布数据
  const publishData = {
    ...productForm.value,
    category_id: selectedLeafCategory.value,
    category_name: leafCategories.value.find(cat => cat.category_id === selectedLeafCategory.value)?.category_name,
    sku_list: skuList
  }

  try {
    const res = await publishGoods(publishData)
    if (res.code === 1) {
      ElMessage.success('商品发布成功')
      currentStep.value = 2 // 进入发布成功步骤
    } else {
      throw new Error(res.msg || '发布失败')
    }
  } catch (error) {
    console.error('发布商品失败:', error)
    ElMessage.error(error.message)
  }
}

// 计算是否可以进行下一步
const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return selectedMainCategory.value !== null
  }
  return true
})

// 添加表单验证规则
const rules = {
  spu_name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  spu_desc: [
    { required: true, message: '请输入商品描述', trigger: 'blur' }
  ],
  spu_price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  spu_img_url: [
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

// 发布成功后的操作
const publishAnother = () => {
  currentStep.value = 0
  selectedMainCategory.value = null
  selectedSubCategory.value = null
  selectedLeafCategory.value = null
  specInputs.value = []
  productForm.value = {
    category_id: null,
    category_name: '',
    brand_id: null,
    brand_name: '',
    spu_name: '',
    spu_desc: '',
    spu_price: '',
    spu_img_url: '',
    sku_list: [],
    attribute_list: [],
    specs: {}
  }
}

// 添加规格项
const addSpecItem = (groupIndex) => {
  specInputs.value[groupIndex].specs.push({
    spec_name: '',
    spec_value: ''
  })
}

// 删除规格项
const removeSpecItem = (name) => {
  delete productForm.value.specs[name]
}

// 确认规格项
const confirmSpec = (index) => {
  const spec = specInputs.value[index]
  if (spec.name && spec.value) {
    if (!productForm.value.specs[spec.name]) {
      productForm.value.specs[spec.name] = []
    }
    productForm.value.specs[spec.name].push(spec.value)
    spec.isExisting = true
    spec.name = ''
    spec.value = ''
  }
}

// 删除规格值
const removeSpecValue = (name, value) => {
  productForm.value.specs[name] = productForm.value.specs[name].filter(v => v !== value)
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
  padding: 20px;
  background: #fff;
  border-radius: 4px;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

.spec-input-item {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.spec-key-value {
  display: flex;
  gap: 10px;
  align-items: center;
}

.spec-key-input {
  width: 200px;
}

.spec-value-input {
  flex: 1;
}

.sku-section {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.spec-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.sku-price-stock {
  margin-top: 10px;
  display: flex;
  gap: 20px;
}

.preview-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.sku-section {
  margin: 20px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.spec-group {
  margin-bottom: 20px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  padding: 16px;
}

.spec-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.group-title {
  font-size: 14px;
  font-weight: 500;
}

.spec-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.spec-input {
  flex: 1;
}

.add-spec-btn {
  margin-top: 10px;
}

:deep(.el-input-number .el-input__wrapper) {
  padding-left: 11px;
}

:deep(.el-input__wrapper) {
  padding-left: 11px !important;
}

:deep(.el-input__inner) {
  text-align: left !important;
}

:deep(.el-input__inner::placeholder) {
  text-align: left;
}
</style> 