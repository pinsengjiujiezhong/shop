<template>
  <div class="container">
    <div class="navigation">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="operation">
        <el-input placeholder="请输入内容" v-model="query" @keyup.enter.native="getOrderList">
          <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
        </el-input>
      </div>
      <el-table
        :data="orderList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="300">
        </el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="100">
        </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag :type="scope.row.order_pay - 0 ? 'success' : 'danger'">{{scope.row.order_pay - 0 ? '已付款' : '未付款'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间">
        </el-table-column>
        <el-table-column lable="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editLocation">{{scope.row.id}}</el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="catLogistics">{{scope.row.id}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Dialog
      title="修改地址"
      :DialogFormVisible="locationFormVisible"
      @setDialogStatus="setEditDialogStatus"
      @submitData="submitLocation">
      <el-form :model="locationForm" ref="locationFormRef" :rules="locationFormRules" label-width="100px" slot="form">
        <el-form-item label="省市区/县" prop="area">
          <el-cascader
            v-model="locationForm.area"
            style="width: 100%"
            :options="options"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="location">
          <el-input v-model="locationForm.location" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
    <el-dialog
      title="物流进度"
      :visible.sync="logisticsFormVisible"
      width="60%"
      :before-close="logisticsStatus">
      <el-timeline style="margin-left: 50px">
        <el-timeline-item
          v-for="(activity, index) in logistics"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import Dialog from '../../components/Dialog'
import Data from '../../util/locationData'
export default {
  data() {
    return {
      orderList: [],
      query: '',
      pagenum: 1,
      pagesize: 10,
      total: 0,
      locationFormVisible: false,
      locationForm: {
        area: '',
        location: ''
      },
      options: Data.locationData,
      logisticsFormVisible: false,
      logistics: Data.logistics,
      locationFormRules: {
        area: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Dialog
  },
  mounted() {
    this.getOrderList()
    console.log('logistics: ', Data.logistics)
  },
  methods: {
    async getOrderList() {
      const params = {
        pagesize: this.pagesize,
        pagenum: this.pagenum,
        query: this.query
      }
      const { data: res } = await this.$http.get('/orders', { params })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.orderList = res.data.goods.map((item) => {
        return {
          ...item
        }
      })
      this.total = res.data.total
      console.log('orderList: ', this.orderList)
      console.log(res)
    },
    editLocation() {
      console.log('editLocation:')
      this.locationFormVisible = true
    },
    submitLocation() {
      console.log('submitLocation')
      console.log(this.locationForm)
    },
    setEditDialogStatus() {
      this.locationFormVisible = false
      this.$refs.locationForm.resetFields()
    },
    catLogistics() {
      this.logisticsFormVisible = true
    },
    logisticsStatus() {
      this.logisticsFormVisible = false
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
    .del-dialog{
      display: flex;
      flex-direction: row;
      justify-content: left;
      align-items: center;
    }
  }
  .el-dialog__body{
    padding: 10px 15px !important;
  }
  .el-scrollbar__wrap{
    height: 204px !important;
  }
</style>
