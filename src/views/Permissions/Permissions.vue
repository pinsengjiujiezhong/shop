<template>
  <div class="container">
    <div class="navigation">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table
      class="table"
      :data="permissList"
      style="width: 100%">
      <el-table-column
        label="索引"
        width="50"
        type="index">
      </el-table-column>
      <el-table-column
        label="权限名称"
        prop="authName">
      </el-table-column>
      <el-table-column
        label="路径"
        prop="path">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-tag :type="scope.row.level - 0 === 0 ? '' : scope.row.level - 0 === 1 ? 'success' : 'warning'">{{scope.row.level - 0 === 0 ? '一级权限' : scope.row.level - 0 === 1 ? '二级权限' : '三级权限'}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      permissList: []
    }
  },
  mounted() {
    this.getPermissList()
  },
  methods: {
    async getPermissList() {
      const { data: res } = await this.$http.get('/rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.permissList = res.data
    }
  }
}
</script>

<style lang="scss" scoped>

  .navigation{
    margin-bottom: 15px;
  }
  .table{
    font-size: 12px;
  }
</style>
