<template>
    <div class="login-container">
      <div class="login-box">
        <div class="logo">
          <img src="../../assets/logo.png" alt="">
        </div>
        <div class="login-form">
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username">
                <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" show-password>
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <el-form-item class="login-btn">
              <el-button type="primary" @click="loginFormSubmit">登录</el-button>
              <el-button @click="loginFormReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
</template>

<script type="text/javascript">
import storage from '../../util/storage'
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginFormSubmit() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/login', this.loginForm)
        if (res.meta.status !== 200) {
          this.$message.error('账号与密码不匹配!')
          return
        }
        console.log(res)
        this.$message.success('登录成功')
        storage.set('token', res.data.token)
        this.$router.push('/home')
      })
    },
    loginFormReset() {
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  div.login-container{
    height: 100%;
    background-color: #2b4b6b;
    .login-box{
      width: 450px;
      height: 300px;
      background-color: #fff;
      border-radius: 5px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .logo{
        width: 130px;
        height: 130px;
        padding: 10px;
        border-radius: 50%;
        border: 1px solid #fff;
        position: relative;
        top: -25%;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }
    }
    .login-form{
      box-sizing: border-box;
      transform: translate(0, -25%);
      width: 100%;
      padding: 0 20px;
      .login-btn{
        display: flex;
        flex-direction: row;
        justify-content: right;
      }
    }
  }
</style>
