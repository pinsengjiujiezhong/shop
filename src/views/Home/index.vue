<template>
  <el-container class="home-container">
    <!--页面顶部-->
    <el-header>
      <Header></Header>
    </el-header>
    <!--页面主体-->
    <el-container>
      <!--// 侧边栏-->
      <el-aside width="200px">
        <Menu></Menu>
      </el-aside>
      <!--// 右侧主体-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script type="text/javascript">
import Header from '../../components/Header'
import Menu from '../../components/Menu'
export default {
  data () {
    return {

    }
  },
  components: {
    Header,
    Menu
  }
}
</script>

<style lang="scss" scoped>
.el-header{
  background-color: #373d41;
}
.el-aside{
  width: 200px;
  background-color: #373d41;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.el-main{
  background-color: #eaedf1;
}
.home-container{
  height: 100%;
}
</style>
