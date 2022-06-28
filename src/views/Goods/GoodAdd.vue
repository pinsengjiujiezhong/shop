<template>
  <div class="container">
    <div class="navigation">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        show-icon>
      </el-alert>
      <div class="step-top">
        <el-steps :active="active" finish-status="success">
          <el-step :title="item" v-for="(item, index) in this.stepList" :key="index"></el-step>
        </el-steps>
      </div>
      <div class="tabs">
        <el-tabs tab-position="left" :before-leave="tabLeave">
          <el-tab-pane label="基本属性">
            <el-form :model="goodForm" :rules="goodRules" ref="goodRef" class="demo-ruleForm">
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="goodForm.name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="price">
                <el-input v-model="goodForm.price"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="weight">
                <el-input v-model="goodForm.weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="number">
                <el-input v-model="goodForm.number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="category">
                <br>
                <el-cascader
                  v-model="goodForm.category"
                  :options="categorieList"
                  :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }">
                </el-cascader>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <span v-for="(item, index) in goodParams" :key="index">{{item.attr_name}}</span>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form :model="goodAttrForm"  ref="goodAttrRef" class="demo-ruleForm">
              <el-form-item :label="item.attr_name" v-for="(item, index) in goodAttr" :key="index">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              class="upload-demo"
              :action="actionUrl"
              :headers="headers"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">商品内容</el-tab-pane>
        </el-tabs>
      </div>

    </div>
  </div>
</template>

<script type="text/javascript">
import storage from '../../util/storage'
export default {
  data() {
    return {
      active: 0,
      stepList: [
        '基本信息',
        '商品参数',
        '商品属性',
        '商品图片',
        '商品内容',
        '完成'
      ],
      categorieList: [],
      goodForm: {
        name: '',
        price: '',
        weight: '',
        number: '',
        category: ''
      },
      goodRules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入数量数量', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      goodParams: [],
      goodAttr: [],
      goodAttrForm: {},
      actionUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headers: {
        Authorization: storage.get('token')
      }
    }
  },
  mounted () {
    this.getCategorieList()
  },
  methods: {
    async getCategorieList() {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.categorieList = res.data
    },
    tabLeave(activeName, oldActiveName) {
      let isLeave = true
      console.log(activeName, oldActiveName)
      if (oldActiveName - 0 === 0) {
        console.log('goodForm: ', this.goodForm)
        console.log('进来了')
        this.$refs.goodRef.validate(valid => {
          console.log('valid: ', valid)
          if (!valid) {
            isLeave = false
          }
        })
      }
      if (!isLeave) return false
      if (activeName - 0 === 1) {
        this.getParams()
      }
      if (activeName - 0 === 2) {
        this.getAttr()
      }
    },
    async getParams() {
      const { data: res } = await this.$http.get(`/categories/${this.goodForm.category.slice(-1)}/attributes?sel=many`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodParams = res.data
    },
    async getAttr() {
      const { data: res } = await this.$http.get(`/categories/${this.goodForm.category.slice(-1)}/attributes?sel=only`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodAttr = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
  .container{
    display: flex;
    flex-direction: column;
    .navigation{
      margin-bottom: 15px;
      font-size: 12px;
    }
    .main{
      background-color: #fff;
      padding: 20px;
      .step-top{
        margin: 20px 100px;
        width: 1100px;
      }

    }
  }
</style>
