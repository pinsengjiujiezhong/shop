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
      <v-chart :option="option" class="echarts"></v-chart>
      <!--<v-chart :option="chartOption" style="height:500px;"></v-chart>-->
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      option: {},
      chartOption: {
        color: ['#3393BD'],
        title: {
          text: '年度销售额',
          textStyle: {
            fontSize: '14px'
          },
          top: 20,
          left: 20
        },
        xAxis: {
          type: 'category',
          show: true,
          axisTick: {
            alignWithLabel: true
          },
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
          show: true,
          type: 'value'
        },
        series: [
          {
            data: [620, 432, 220, 534, 790, 430, 220, 320, 532, 320, 834, 690, 220, 620],
            type: 'bar',
            barWidth: '35%'
          }
        ],
        grid: {
          top: 70,
          bottom: 50,
          left: 50,
          right: 50
        }
      }
    }
  },
  mounted() {
    this.getReports()
  },
  methods: {
    async getReports() {
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.option = res.data
      this.option.title = {
        text: '用户来源',
        left: 'left'
      }
      console.log('this.option: ', this.option)
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
      .echarts{
        width: 1000px;
        height: 500px;
      }
    }
  }
</style>
