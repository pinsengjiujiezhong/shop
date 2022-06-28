<template>
  <el-dialog title="分配角色" :visible.sync="allocationDialog" :before-close="setDialogStatus">
    <el-form label-width="100px">
      <el-form-item label="名称:">
        <span>{{user.username}}</span>
      </el-form-item>
      <el-form-item label="当前的角色:">
        <span>{{user.role_name}}</span>
      </el-form-item>
      <el-form-item label="分配新角色">
        <el-select v-model="roleId" placeholder="请选择角色">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="setDialogStatus">取 消</el-button>
      <el-button type="primary" @click="submitAllocation">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    allocationDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleList: {},
      roleId: ''
    }
  },
  mounted() {
    this.getRole()
  },
  methods: {
    submitData() {
      this.$emit('submitData')
    },
    async getRole() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleList = res.data.filter((item) => {
        return {
          id: item.id,
          roleName: item.roleName
        }
      })
    },
    setDialogStatus() {
      this.roleId = ''
      this.$emit('setDialogStatus')
    },
    submitAllocation() {
      this.$emit('submitAllocation', this.roleId)
    }
  }
}
</script>

<style scoped>

</style>
