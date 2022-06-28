<template>
  <div class="container">
    <div class="navigation">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="operation">
        <el-button type="primary" class="add-role" @click="addRoleUser">添加角色</el-button>
      </div>
      <el-table
        border
        :data="roleList"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <span v-if="!props.row.children.length">暂无数据</span>
            <el-row v-else :class="['border-bottom', index == 0 ? 'border-top' : '' ]" v-for="(firstItem, index) in props.row.children" :key="firstItem.id">
              <el-col :span="6">
                <el-tag
                  closable
                  @close="delPerMissItem(props.row, firstItem.id)">
                  {{firstItem.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row  v-for="(secondItem, index) in firstItem.children" :key="secondItem.id" :class="index != firstItem.children.length - 1 ? 'border-bottom' : ''">
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="delPerMissItem(props.row, secondItem.id)">
                      {{secondItem.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      v-for="lastItem in secondItem.children"
                      :key="lastItem.id"
                      @close="delPerMissItem(props.row, lastItem.id)">
                      {{lastItem.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="序号"
          type="index">
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName">
        </el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <div class="operation-btn">
              <el-button icon="el-icon-edit" type="primary" size="mini" @click="editRole(scope.row.id)">编辑</el-button>
              <el-button icon="el-icon-delete" type="danger" size="mini" @click="delRole(scope.row.id)">删除</el-button>
              <el-button icon="el-icon-setting" type="warning" size="mini" @click="allocationRole(scope.row.id)">分配权限</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Dialog
      :title="title"
      :DialogFormVisible="DialogFormVisible"
      @setDialogStatus="setDialogStatus"
      @submitData="submitData">
      <el-form :model="roleForm" ref="roleFormRef" :rules="roleFormRules" label-width="100px" slot="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog
      title="分配权限"
      :DialogFormVisible="allocateDialogVisible"
      @setDialogStatus="setAllocateDialogStatus"
      @submitData="submitAllocate">
      <el-tree
        slot="form"
        :data="permissionTree"
        ref="permissionRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="permissionChecked"
        :props="defaultProps">
      </el-tree>
    </Dialog>>
  </div>
</template>

<script type="text/javascript">
import Dialog from '../../components/Dialog'
export default {
  data() {
    return {
      roleList: [],
      title: '新建角色',
      DialogFormVisible: false,
      allocateDialogVisible: false,
      isEdit: false,
      editId: '',
      allocateId: '',
      permissionTree: [],
      permissionChecked: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      roleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Dialog
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleList = res.data
    },
    async delPerMissSubmit(role, rightId) {
      console.log('role: ', role)
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      role.children = res.data
    },
    setDialogStatus() {
      this.DialogFormVisible = false
      this.$refs.roleFormRef.resetFields()
    },
    submitData() {
      if (this.isEdit) return this.submitEditRole()
      this.submitAddRole()
    },
    addRoleUser() {
      this.title = '新建角色'
      this.DialogFormVisible = true
      this.roleForm.roleName = ''
      this.roleForm.roleDesc = ''
    },
    submitAddRole() {
      this.$refs.roleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/roles', this.roleForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getRoleList()
        this.DialogFormVisible = false
      })
    },
    async editRole(id) {
      this.title = '编辑角色'
      this.isEdit = true
      this.editId = id
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleForm.roleName = res.data.roleName
      this.roleForm.roleDesc = res.data.roleDesc
      this.DialogFormVisible = true
    },
    submitEditRole() {
      this.$refs.roleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(`/roles/${this.editId}`, this.roleForm)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getRoleList()
        this.DialogFormVisible = false
        this.roleForm.roleName = ''
        this.roleForm.roleDesc = ''
      })
    },
    async delPerMissItem(role, rightId) {
      this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const result = this.delPerMissSubmit(role, rightId)
        if (!result) return this.$message.error('权限删除失败')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delRole(id) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const result = this.delRoleSubmit(id)
        if (!result) return this.$message.error('角色删除失败')
        this.$message({
          type: 'success',
          message: '角色删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async delRoleSubmit(id) {
      const { data: res } = await this.$http.delete(`/roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getRoleList()
    },
    async allocationRole(id) {
      this.allocateId = id
      const { data: treeRes } = await this.$http.get('/rights/tree')
      if (treeRes.meta.status !== 200) return this.$message.error(treeRes.meta.msg)
      this.permissionTree = treeRes.data
      const { data: listRes } = await this.$http.get('/rights/list')
      if (listRes.meta.status !== 200) return this.$message.error(listRes.meta.msg)
      this.permissionChecked = listRes.data.map((item) => {
        return item.id
      })
      console.log('permissionChecked: ', this.permissionChecked)
      this.allocateDialogVisible = true
    },
    setAllocateDialogStatus() {
      this.allocateDialogVisible = false
    },
    async submitAllocate() {
      console.log(this.$refs.permissionRef.getCheckedKeys())
      const nodes = this.$refs.permissionRef.getCheckedKeys().join(',')
      const { data: res } = await this.$http.post(`roles/${this.allocateId}/rights`, { rids: nodes })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.border-top{
  border-top: 1px solid #eee;
}
.border-bottom{
  border-bottom: 1px solid #eee;
}
.el-tag{
  margin: 7px;
}
.container{
  .navigation{
    margin-bottom: 15px;
  }
  .main{
    padding: 15px;
    background-color: #fff;
    .add-role{
      margin-bottom: 15px;
    }
  }
}
</style>
