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
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="goodForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="goodForm.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="goodForm.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="goodForm.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <br>
                <el-cascader
                  v-model="goodForm.goods_cat"
                  :options="categorieList"
                  :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }">
                </el-cascader>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <div class="checkbox-group">
              <el-form>
                <el-form-item :label="manyTable.attr_name" v-for="(manyTable, index) in manyTableData" :key="index">
                  <br><el-checkbox-group v-model="manyTable.label">
                    <el-checkbox :label="item" v-for="(item, index) in manyTable.label" :key="index" border></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form>
              <el-form-item :label="item.attr_name" v-for="(item, index) in onlyTableData" :key="index">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              class="upload-demo"
              :action="actionUrl"
              :headers="headers"
              :http-request="uploadFile"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <div class="editor-body">
              <quill-editor ref="text" v-model="goodForm.goods_introduce" class="editor" :options="editorOption"/>
            </div>
            <el-button type="primary" @click="submitGood">提交</el-button>
          </el-tab-pane>
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
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      goodRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入数量数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      goodAttrForm: {},
      actionUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headers: {
        Authorization: storage.get('token')
      },
      editorOption: {},
      goodManyParams: [],
      goodOnlyParams: [],
      checkList: '',
      manyTableData: [],
      onlyTableData: []
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
      if (oldActiveName - 0 === 1) {
        this.goodParamsSubmit()
      }
      if (activeName - 0 === 2) {
        this.getAttr()
      }
    },
    async getParams() {
      const { data: res } = await this.$http.get(`/categories/${this.goodForm.goods_cat.slice(-1)}/attributes?sel=many`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.manyTableData = res.data.map(item => {
        return {
          ...item,
          label: item.attr_vals.split(' ')
        }
      })
      console.log('manyTableData: ', this.manyTableData)
    },
    async getAttr() {
      const { data: res } = await this.$http.get(`/categories/${this.goodForm.goods_cat.slice(-1)}/attributes?sel=only`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log('res.data: ', res.data)
      this.onlyTableData = res.data
    },
    uploadFile(res) {
      this.goodForm.pics.push(res.file)
    },
    async submitGood() {
      this.manyTableData.forEach(item => {
        console.log('item: ', item)
        const manyInfo = {
          attr_id: item.attr_id,
          attr_value: item.label.join(' ')
        }
        this.goodForm.attrs.push(manyInfo)
      })
      console.log('this.onlyTableData: ', this.onlyTableData)
      this.onlyTableData.forEach(item => {
        const onlyInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.goodForm.attrs.push(onlyInfo)
      })
      console.log('this.goodForm.goods: ', this.goodForm.goods)
      this.goodForm.goods_cat = this.goodForm.goods_cat.join(',')
      console.log('this.goodForm: ', this.goodForm)
      const { data: res } = await this.$http.post('/goods', this.goodForm)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success('商品创建成功')
      this.$router.push('/goods')
    },
    goodParamsSubmit() {
      console.log('goodManyParams: ', this.goodManyParams)
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
      .editor-body{
        height: 280px;
        .editor{
          height: 200px;
        }
      }

    }
  }
</style>
