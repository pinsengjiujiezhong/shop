<template>
  <div class="header-container">
    <div class="header-left">
      <img src="../assets/logo.png" alt="" class="logo">
      <span class="title">kai.yang的小卖部</span>
    </div>
    <el-button type="info" @click="logout" class="logout-btn" size="medium">退出</el-button>
  </div>
</template>

<script>
import storage from '../util/storage'
export default {
  methods: {
    logout () {
      storage.remove('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.header-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .header-left{
    display: flex;
    flex-direction: row;
    align-items: center;
    .title{
      font-size: 20px;
      color: #fff;
      margin-left: 20px
    }
  }
}
</style>
