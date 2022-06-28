<template>
    <div class="container">
      <div class="navigation">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="main">
        <div class="operation">
          <el-input placeholder="请输入用户名称" v-model="query" @keyup.enter.native="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
          <el-button class="add-user" type="primary" @click="addDialogFormVisible=true">添加用户</el-button>
        </div>
        <el-table
          :data="userList"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            label="索引"
            width="50">
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="角色">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                @change="statusChange(scope.row.id, scope.row.mg_state)"
                inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div class="operation-btn">
                <el-button icon="el-icon-edit" type="primary" size="mini" @click="editUser(scope.row.id)" circle></el-button>
                <el-button icon="el-icon-delete" type="danger" size="mini" @click="delUser(scope.row.id)" circle></el-button>
                <el-button icon="el-icon-setting" type="warning" size="mini" @click="allocationUser(scope.row)" circle></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Dialog
        title="添加用户"
        :DialogFormVisible="addDialogFormVisible"
        @setDialogStatus="setAddDialogStatus"
        @submitData="submitUser">
        <el-form :model="userForm" ref="userFormRef" :rules="userFormRules" label-width="100px" slot="form">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="userForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="userForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </Dialog>

      <Dialog
        title="修改用户"
        :DialogFormVisible="editDialogFormVisible"
        @setDialogStatus="setEditDialogStatus"
        @submitData="submitUser">
        <el-form :model="editUserForm" ref="editUserFormRef" :rules="editUserFormRules" label-width="100px" slot="form">
          <el-form-item label="用户名称">
            <el-input v-model="editUserForm.username" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </Dialog>
      <AllocationDialog
        :user="allocationUserData"
        @setDialogStatus="setAllocationDialogStatus"
        @submitAllocation="submitAllocation"
        :allocationDialog="AllocationDialog"></AllocationDialog>
    </div>
</template>

<script type="text/javascript">
import Dialog from '../../components/Dialog'
import AllocationDialog from '../../components/AllocationDialog'
export default {
  data() {
    return {
      userList: [],
      pagenum: 1,
      pagesize: 10,
      query: '',
      total: 0,
      currSelectUserId: '',
      allocationUserData: {},
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      AllocationDialog: false,
      isEdit: false,
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      userFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ]
      },
      editUserForm: {
        id: '',
        email: '',
        mobile: '',
        username: ''
      },
      editUserFormRules: {
        email: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Dialog,
    AllocationDialog
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      console.log('调用了getUserList函数')
      const params = {
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        query: this.query
      }
      console.log('params: ', params)
      const { data: res } = await this.$http.get('/users', { params })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    submitUser() {
      console.log('submitUser1: ', this.isEdit)
      if (this.isEdit) {
        this.submitEditUser()
        return
      }
      console.log('submitUser2: ', this.isEdit)
      this.submitAddUser()
    },
    async editUser(id) {
      const { data: res } = await this.$http.get(`/users/${id}`)
      this.editUserForm = res.data
      console.log('editUserForm: ', this.editUserForm)
      this.isEdit = true
      this.editDialogFormVisible = true
    },
    async submitDelUser(id) {
      const { data: res } = await this.$http.delete(`/users/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return false
      }
      this.getUserList()
      return true
    },
    delUser(id) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const delStatus = this.submitDelUser(id)
        if (!delStatus) return this.$message.error('数据删除报错')
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
    submitAddUser() {
      console.log('调用了submitAddUser')
      console.log(this.$refs)
      this.$refs.userFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/users', this.userForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getUserList()
        this.$refs.userFormRef.resetFields()
        this.addDialogFormVisible = false
      })
    },
    submitEditUser() {
      console.log('调用了submitEditUser')
      console.log(this.$refs)
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`/users/${this.editUserForm.id}`, this.editUserForm)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getUserList()
        this.$refs.editUserFormRef.resetFields()
        this.editDialogFormVisible = false
        this.isEdit = false
      })
    },
    allocationUser(user) {
      this.allocationUserData = user
      this.AllocationDialog = true
      console.log('AllocationDialog: ', this.AllocationDialog)
    },
    setAllocationDialogStatus() {
      this.AllocationDialog = false
    },
    async submitAllocation(roleId) {
      const { data: res } = await this.$http.put(`/users/${this.allocationUserData.id}/role`, { rid: roleId })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.AllocationDialog = false
      this.getUserList()
    },
    async statusChange(id, state) {
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`)
      console.log(res)
    },
    handleClose() {
      console.log('close')
    },
    // 修改组件中的显示状态
    setAddDialogStatus() {
      this.addDialogFormVisible = false
      this.$refs.userFormRef.resetFields()
    },
    // 修改组件中的显示状态
    setEditDialogStatus() {
      this.editDialogFormVisible = false
      this.$refs.editUserFormRef.resetFields()
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
</style>
