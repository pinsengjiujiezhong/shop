<template>
  <div class="container">
    <div class="navigation">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="operation">
        <el-button class="add-user" type="primary" @click="addCategories">添加分类</el-button>
      </div>
      <el-table
        :data="categorieList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="cat_id"
        border
        :tree-props="{children: 'children'}">
        <el-table-column
          prop="cat_name"
          label="分类名称"
          sortable
          width="300">
        </el-table-column>
        <el-table-column
          label="是否有效"
          width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.cat_deleted ? 'success' : 'danger'">{{scope.row.cat_deleted ? '是' : '否'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="排序">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.cat_level == '0' ? '' : scope.row.cat_level == '1' ? 'success' : 'info'">
              {{scope.row.cat_level == '0' ? '一级' : scope.row.cat_level == '1' ? '二级' : '三级'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="updateCategories(scope.row.attr_id)">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="delCategories(scope.row.attr_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Dialog
      :title="categoriesTitle"
      :DialogFormVisible="categoriesVisible"
      @setDialogStatus="setAddDialogStatus"
      @submitData="submitCategories">
      <el-form :model="categoriesForm" ref="categoriesFormRef" :rules="categoriesFormRules" label-width="100px" slot="form">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="categoriesForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="categoriesForm.cat_pid"
            :options="categoriesOptions"
            :props="{ checkStrictly: true, label: 'cat_name', value: 'cat_id'}"
            clearable></el-cascader>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script type="text/javascript">
import Dialog from '../../components/Dialog'
export default {
  data() {
    return {
      pagenum: 1,
      pagesize: 10,
      categorieList: [],
      total: 0,
      categoriesTitle: '添加分类',
      categoriesVisible: false,
      categoriesForm: {
        cat_name: '',
        cat_pid: '',
        cat_level: ''
      },
      categoriesFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Dialog
  },
  computed: {
    categoriesOptions() {
      const categoriesOptions = JSON.parse(JSON.stringify(this.categorieList))
      categoriesOptions.map(item => {
        if (item.children) {
          console.log(item.children)
          item.children.forEach(child => {
            delete child.children
          })
        }
        return item
      })
      console.log('this.categorieList: ', this.categorieList)
      return categoriesOptions
    }
  },
  mounted() {
    this.getCategories()
  },
  methods: {
    async getCategories() {
      const params = {
        type: 3,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }
      const { data: res } = await this.$http.get('/categories', { params })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // const nodes = CircularJSON.stringify(res.data.result)
      // this.categorieList = CircularJSON.parse(nodes)
      this.categorieList = res.data.result
      this.total = res.data.total
      console.log(this.categorieList)
    },
    async addCategories() {
      this.categoriesVisible = true
    },
    updateCategories(_id) {
      console.log('updateCategories: ', _id)
    },
    delCategories(_id) {
      console.log('delCategories: ', _id)
    },
    setAddDialogStatus() {
      this.$refs.categoriesFormRef.resetFields()
      this.categoriesVisible = false
    },
    async submitCategories() {
      this.categoriesForm.cat_level = this.categoriesForm.cat_pid.length + ''
      this.categoriesForm.cat_pid = this.categoriesForm.cat_pid.slice(-1)[0] || '0'
      const { data: res } = await this.$http.post('/categories', this.categoriesForm)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success('分类创建成功')
      this.setAddDialogStatus()
      this.getCategories()
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
      .operation{
        display: flex;
        flex-direction: row;
        justify-content: left;
        margin-bottom: 20px;
        .el-input{
          width: 400px;
        }
        .add-user{
          margin-left: 20px;
        }
      }
      .pagination{
        display: flex;
        margin-top: 20px;
        flex-direction: row;
        justify-content: right;
      }
    }
  }
</style>
