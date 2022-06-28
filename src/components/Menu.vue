<template>
  <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#373d41" unique-opened text-color="#fff" :collapse="isCollapse" router>
    <el-submenu :index="menu.id + ''" v-for="menu in menuList" :key="menu.id">
      <template slot="title">
        <i :class="iconObj[menu.id]"></i>
        <span slot="title">{{ menu.authName }}</span>
      </template>
      <el-menu-item :index="childItem.path" v-for="childItem in menu.children" :key="childItem.id">
        <i class="el-icon-menu"></i>
        <span slot="title">{{childItem.authName}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menuList: [],
      iconObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-promotion\n',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      }
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log('open: ', key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log('close: ', key, keyPath)
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log('menuList: ', this.menuList)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
