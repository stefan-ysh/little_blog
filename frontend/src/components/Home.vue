<template>
  <div>
    <el-container>
      <el-header>
        <div>
          <a class="webName" href="welcome">欢迎来到博客系统</a>
        </div>
        <div class="userInfo">
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="info" >
              <div>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <span>{{ username }}</span>
              </div>
              </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="个人中心">个人中心</el-dropdown-item>
              <el-dropdown-item command="退出登录">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth">
        <span class="collapse" @click="collapse">|||</span>
          <el-menu :width="asideWidth" :collapse="isCollapse" mode="vertical" :collapse-transition="false" :default-active="activeIndex" class="el-menu-vertical-demo" unique-opened background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <!-- <template slot="title">分组一</template> -->
                <el-menu-item index="/user">用户列表</el-menu-item>
                <!-- <el-menu-item disabled="">待扩展...</el-menu-item> -->
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-reading"></i>
                <span>文章管理</span>
              </template>
              <el-menu-item-group>
                <!-- <template slot="title">分组一</template> -->
                <el-menu-item index="/article">文章列表</el-menu-item>
                <!-- <el-menu-item disabled="">待扩展...</el-menu-item> -->
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-s-data"></i>
                <span>数据报表</span>
              </template>
              <el-menu-item-group>
                <!-- <template slot="title">分组一</template> -->
                <el-menu-item index="/log">操作日志</el-menu-item>
                <el-menu-item index="/report">数据可视</el-menu-item>
                <el-menu-item index="/persona">用户画像</el-menu-item>
                <!-- <el-menu-item disabled="">待扩展...</el-menu-item> -->
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-loading"></i>
                <span>用户视角</span>
              </template>
              <el-menu-item-group>
                <!-- <template slot="title">分组一</template> -->
                <el-menu-item index="/index">主页</el-menu-item>
                <!-- <el-menu-item disabled="">待扩展...</el-menu-item> -->
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
        <!-- 向子组件传递值 -->
          <router-view :username="username"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '',
      username: '',
      logData: {},
      isCollapse: false,
      asideWidth: '200px'
    }
  },
  created () {
    const id = window.sessionStorage.getItem('token')
    this.$http.get('/user/' + id).then(res => {
      this.username = res.data[0].username
    })
  },
  methods: {
    // 右上角用户操作
    handleCommand (command) {
      if (command === '个人中心') {
        console.log('查看个人中心')
        // 执行查看个人中心的函数
      } else {
        this.$confirm(
          '退出登陆后您将无法继续浏览本页内容，是否确认？',
          '退出登录',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            roundButton: true
          }
        )
          .then(() => {
            // 将操作日志中的操作类型进行赋值
            this.logData.operationType = '退出系统'
            // 对操作者进行赋值
            this.logData.handler = this.username
            // 对当前操作时间进行记录
            this.logData.operationTime = Date.now()
            // 对操作内容进行赋值
            this.logData.operation = `${this.username}退出了系统`
            // console.log(this.logData);
            // 调用保存操作日志事件
            this.saveOperationLog(this.logData)
            // 清空token
            window.sessionStorage.clear()
            // 跳转到登录首页
            this.$message({
              type: 'success',
              message: '退出成功!'
            })
            this.$router.push('/login')
            // 执行退出登录的函数
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消退出！'
            })
          })
      }
    },
    // 保存操作日志函数
    async saveOperationLog (log) {
      // console.log(log);
      // 发起保存登录操作日志请求
      const res = await this.$http.post('/log', log)
      console.log(res);
      // console.log(this.logData);
    },
    collapse () {
      if (this.isCollapse === false) {
        this.isCollapse = true
        this.asideWidth = '65px'
      } else {
        this.isCollapse = false
        this.asideWidth = '200px'
      }
    }
  },
  watch:{
    $route: {
      handler() {
        this.activeIndex = this.$route.path
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.webName{
  color:white;
  text-decoration:none;
  font-size:20px;
  transition:all 1s;
}
.webName:hover{
  color:lightblue;
}
.el-container {
  width: 100%;
  height: 100vh;
}
.el-header {
  background-color: rgb(84, 92, 100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}
h3 {
  color: white;
}
.el-aside {
  background-color: rgb(84, 92, 100);

}
.collapse{
    display:block;
    text-align: center;
    width: 100%;
    height: 20px;
    line-height:20px;
    padding:5px 0;
    cursor: pointer;
    letter-spacing:2px;
    color:white;
    background-color: grey;
    opacity: 0.3;
  }
.el-menu{
  border-right:1px solid  rgb(84, 92, 100);
}
.userInfo .el-button{
  display:block;
  border:none;
  border-radius:5px;
  background-color: rgb(84, 92, 100);
}
.userInfo .el-button div{
  width: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
