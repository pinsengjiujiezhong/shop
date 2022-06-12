<template>
    <div>
      <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script type="text/javascript">
import storage from '../../util/storage'
export default {
  data () {
    return {

    }
  },
  methods: {
    logout () {
      storage.remove('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
