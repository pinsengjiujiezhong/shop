<template>
  <div class="permiss-item">
    <el-tag
      closable
      @close="delPerMissItem(item.id)">
      {{item.authName}}
    </el-tag>
    <i class="el-icon-right"></i>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    delPerMissItem(id) {
      console.log('id: ', id)
      this.$emit('delPerMissItem', id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .permiss-item{
    display: flex;
    flex-direction: row;
    align-items: center;
    i{
      margin-left: 5px;
    }
  }
</style>
