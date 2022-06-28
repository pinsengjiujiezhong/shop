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
      <div class="operation">
        <el-input placeholder="请输入用户名称" v-model="query" @keyup.enter.native="getGoodList">
          <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
        </el-input>
        <el-button class="add-user" type="primary" @click="goodAdd">添加商品</el-button>
      </div>
      <el-table
        :data="goodList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="1000">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="100">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="100">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <div class="operation-btn">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoodVisible=true">{{scope.row.id}}</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGood">{{scope.row.id}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      query: '',
      goodList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      addGoodsVisible: false,
      editGoodVisible: false
    }
  },
  mounted() {
    this.getGoodList()
  },
  methods: {
    async getGoodList() {
      const params = {
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }
      const { data: res } = await this.$http.get('/goods', { params })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.total = res.data.total
      this.goodList = res.data.goods
    },
    goodAdd() {
      this.$router.push('/goods/add')
    },
    delGood() {
      console.log('delGood')
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
    }
  }
</style>
