<template>
  <div class="login" >
    <el-form
      style="width:400px"
      :model="loginForm"
      ref="loginFormRef"
      :rules="loginFormRules"
      label-width="70px"
      size="normal"
    >
      <el-form-item prop="username" label="账号:">
        <el-input
          v-model="loginForm.username"
          prefix-icon="el-icon-user"
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码:">
        <el-input
          type="password"
          v-model="loginForm.password"
          prefix-icon="el-icon-lock"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="login">Log In</el-button>
        <el-button @click="reset">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: 'Username is required!', trigger: 'blur' },
          {
            max: 12,
            min: 2,
            message: 'username must be between 2 and 12 characters',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: 'password is required!', trigger: 'blur' },
          {
            max: 15,
            min: 6,
            message: 'password must be between 6 and 15 characters',
            trigger: 'blur'
          }
        ]
      },
      logData: {
        operationType: '登陆系统'
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error(
            'Pre-validation failed please try again later!'
          )
        }
        const res = await this.$http.post('/login', this.loginForm)
        if (res.status !== 200) {
          return this.$message.error('登陆失败！')
        }
        const token = res.data[0]._id
        // 1. 将登陆成功之后的token保存到客户端的 sessionStorage中
        // 1.1 项目中除了登录之外的其他api接口，必须在登录之后才能访问
        // 1.2 token 只应在当前网站打开期间生效，所以将token保存在 sessionStorage中
        window.sessionStorage.setItem('token', token)
        // console.log(res)
        // 提示登陆成功
        this.$message.info('登陆成功')
        // 根据当前登录ID来查找用户名
        const resUsername = await this.$http.get('/user/' + token)
        // console.log(resUsername);
        // 将查找到的用户名赋值给操作日志对象中的操作者 handler
        this.logData.handler = resUsername.data[0].username
        // 将登陆时间赋值给操作日志对象中的操作时间
        this.logData.operationTime = Date.now()
        // 给操作内容赋值
        this.logData.operation = `${this.logData.handler}登录了系统`
        // 发起保存登录操作日志请求，并吧准备好的操作日志对象作为参数传过去
        this.saveOperationLog(this.logData)
        // console.log(this.operation)
        this.$router.push('/home')
        // 跳转到主页
      })
    },
    reset () {
      this.$refs.loginFormRef.resetFields()
    },
    // 保存操作日志函数
    async saveOperationLog (log) {
      // console.log(log);
      // 发起保存登录操作日志请求
      const res = await this.$http.post('/log', log)
      console.log(res);
      // console.log(this.logData);
    }
  }
}
</script>

<style scoped>
.login {
  width: 500px;
  height: 300px;
  border: 1px solid red;
  margin: 200px auto;
  background: lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  transition: all 1s;
}
.login:hover {
  box-shadow: 5px 5px 3px #888888;
}
.btns {
  float: right;
}
</style>
