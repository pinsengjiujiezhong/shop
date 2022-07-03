<template>
  <div class="container">
    <div class="navigation">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-alert
        title="只允许为第三级分类设置相关参数"
        type="warning"
        show-icon>
      </el-alert>
      <div class="cascader">
        <span>选择商品分类：</span>
        <el-cascader
          @change="getParamsList"
          size="medium"
          v-model="goods_cat"
          :options="categorieList"
          :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }">
        </el-cascader>
      </div>
      <div class="tab-pane">
        <el-tabs v-model="currTab">
          <el-tab-pane label="动态参数">
            <el-button type="primary" size="small" @click="addParams" :disabled="!goods_cat.length">添加参数</el-button>
            <el-table
              :data="manyTableData"
              style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <div class="params-body">
                    <el-tag
                      class="params-tab"
                      v-for="(label, index) in props.row.labels"
                      :key="index"
                      closable
                      @close="delManyTab(props, label)"
                      v-show="label">
                      {{label}}
                    </el-tag>
                    <!--<span>{{props.row.labels.length ? !props.row.labels.slice(-1)[0] ? '2-true' : '2-false' : '1-false'}}</span>-->
                    <el-input v-model="tabName" class="tag-input" autofocus size="small" @keyup.enter.native="$event.target.blur()" @blur="addManyNewTag(props)" v-if="props.row.labels.length ? !props.row.labels.slice(-1)[0] : false"></el-input>
                    <el-button icon="el-icon-plus" size="small" @click="props.row.labels.push('')" v-else>New tag</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                type="index">
              </el-table-column>
              <el-table-column
                label="参数名称"
                prop="attr_name">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" icon="el-icon-edit" @click="updateManyParams(scope)">编辑</el-button>
                  <el-button type="danger" size="small" icon="el-icon-delete" @click="delManyParams(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态参数">
            配置管理
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <Dialog
      :title="manyTitle"
      :DialogFormVisible="manyVisible"
      @setDialogStatus="setAddDialogStatus"
      @submitData="submitParams">
      <el-form :model="manyForm" ref="manyFormRef" :rules="manyFormRules" label-width="100px" slot="form">
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="manyForm.attr_name" autocomplete="off"></el-input>
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
      categorieList: [],
      goods_cat: [],
      currTab: '0',
      tabName: '',
      manyTableData: [],
      onlyTableData: [],
      manyVisible: false,
      isMany: true,
      isManyEdit: false,
      isOnlyEdit: false,
      manyTitle: '',
      manyForm: {
        attr_name: '',
        attr_sel: 'many'
      },
      manyFormRules: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Dialog
  },
  mounted() {
    this.getCategorieList()
  },
  methods: {
    async getCategorieList() {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.categorieList = res.data
    },
    async getParamsList() {
      console.log('good_cat: ', this.goods_cat)
      const { data: only } = await this.$http.get(`/categories/${this.goods_cat.slice(-1)}/attributes?sel=only`)
      console.log('only: ', only)
      if (only.meta.status !== 200) return this.$message.error(only.meta.msg)
      console.log('res.data: ', only.data)
      this.onlyTableData = only.data
      const { data: many } = await this.$http.get(`/categories/${this.goods_cat.slice(-1)}/attributes?sel=many`)
      if (many.meta.status !== 200) return this.$message.error(many.meta.msg)
      console.log('many.data: ', many.data)
      this.manyTableData = many.data.map(item => {
        return {
          ...item,
          labels: item.attr_vals.length ? item.attr_vals.split(' ') : []
        }
      })
      console.log('this.manyTableData: ', this.manyTableData)
    },
    async addManyNewTag(props) {
      if (!this.tabName) {
        this.manyTableData[props.$index].labels.pop()
        return
      }
      const labels = this.manyTableData[props.$index].labels.filter(item => {
        if (item) return item
      })
      labels.push(this.tabName)
      const params = {
        attr_name: props.row.attr_name,
        attr_sel: 'many',
        attr_vals: labels.join(' ').trim()
      }
      const { data: res } = await this.$http.put(`/categories/${this.goods_cat.slice(-1)}/attributes/${props.row.attr_id}`, params)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      const len = this.manyTableData[props.$index].labels.length
      if (!len) {
        this.manyTableData[props.$index].labels.push(this.tabName)
      } else {
        this.manyTableData[props.$index].labels[len - 1] = this.tabName
      }
      this.tabName = ''
    },
    async delManyTab(props, label) {
      console.log('进来了')
      const labels = this.manyTableData[props.$index].labels
      const index = labels.indexOf(label)
      labels.splice(index, 1)
      const params = {
        attr_name: props.row.attr_name,
        attr_sel: 'many',
        attr_vals: labels.join(' ').trim()
      }
      const { data: res } = await this.$http.put(`/categories/${this.goods_cat.slice(-1)}/attributes/${props.row.attr_id}`, params)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.manyTableData[props.$index].labels = labels
    },
    delManyParams(scope) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`/categories/${this.goods_cat.slice(-1)}/attributes/${scope.row.attr_id}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.manyTableData.splice(scope.$index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updateManyParams(scope) {
      this.manyVisible = true
      this.manyTitle = '修改动态参数'
      this.manyForm.attr_name = scope.row.attr_name
    },
    addParams() {
      this.manyVisible = true
      this.manyTitle = '添加动态参数'
    },
    setAddDialogStatus() {
      this.$refs.manyFormRef.resetFields()
      this.manyVisible = false
    },
    async addManyParamsSumbit() {
      const { data: res } = await this.$http.post(`categories/${this.goods_cat.slice(-1)}/attributes`, this.manyForm)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success('参数添加成功')
      res.data.labels = []
      console.log('res.data: ', res.data)
      this.manyTableData.push(res.data)
      this.$refs.manyFormRef.resetFields()
      this.manyVisible = false
    },
    async updateManyParamsSubmit(scope) {
      const params = {
        attr_name: this.manyForm.attr_name,
        attr_sel: 'many',
        attr_vals: scope.row.attr_vals
      }
      const { data: res } = await this.$http.put(`/categories/${this.goods_cat.slice(-1)}/attributes/${scope.row.attr_id}`, params)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res)
    },
    addOnlyParamsSumbit() {
      console.log('addOnlyParamsSumbit')
    },
    updateOnlyParamsSubmit() {
      console.log('updateOnlyParamsSubmit')
    },
    submitParams() {
      if (this.isMany && !this.isManyEdit) this.addManyParamsSumbit()
      if (this.isMany && this.isManyEdit) this.updateManyParamsSubmit()
      if (!this.isMany && !this.isOnlyEdit) this.addOnlyParamsSumbit()
      if (!this.isMany && this.isOnlyEdit) this.updateOnlyParamsSubmit()
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
      .cascader{
        margin-top: 10px;
        font-size: 18px;
        margin-bottom: 20px;
        span{
          margin-right: 10px;
        }
        .el-cascader{
          width: 250px;
        }
      }
    }
    .params-body{
      .params-tab{
        margin: 5px 15px;
      }
      .el-input{
        width: 100px;
      }
    }
  }
</style>
