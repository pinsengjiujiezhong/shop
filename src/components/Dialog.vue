<template>
  <el-dialog :title="title" :visible.sync="DialogFormVisible" :before-close="setDialogStatus">
    <slot name="form"></slot>
    <div slot="footer" class="dialog-footer">
      <el-button @click="setDialogStatus">取 消</el-button>
      <el-button type="primary" @click="submitData">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: { type: String },
    DialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    submitData() {
      this.$emit('submitData')
    },
    setDialogStatus() {
      console.log('DialogFormVisible: ', this.DialogFormVisible)
      console.log('调用了这个')
      this.$emit('setDialogStatus')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
