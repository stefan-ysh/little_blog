<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--搜索与添加区域-->
    <el-row :gutter="20">
      <el-col :span="5">
      <!-- 添加了@input事件后 clearable就失效了 -->
        <!-- <el-input placeholder="输入进行搜索..." v-model="queryInfo.query" @input="getUserList" clearable @clear="getUserList"> -->
        <el-input placeholder="输入进行搜索..." v-model="queryInfo.query" @input="getUserList">
        </el-input>
                  <!-- <el-button icon="el-icon-search" slot="append" @click="getUserList" ></el-button> -->
      </el-col>
      <el-col :span="7">
        <el-button type="primary" @click="showAddUserDialog()"
          >添加用户</el-button
        >
      </el-col>
    </el-row>
    <!-- 卡片视图区域 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <!-- <div slot="header"> -->
      <!-- 用户列表区域 -->
        <el-table :data="datalist" style="width: 100%" border  height="450" highlight-current-row  @cell-click="handle">
          <el-table-column type="index" width="50"  align="center"  label="#"> </el-table-column>
          <el-table-column prop="username" align="center" label="姓名"> </el-table-column>
          <el-table-column prop="gender" align="center" label="性别"> </el-table-column>
          <el-table-column prop="age" align="center" label="年龄"> </el-table-column>
          <el-table-column prop="mobile" align="center" label="电话" width="120px"> </el-table-column>
          <el-table-column prop="email" align="center" label="邮箱" width="200px"> </el-table-column>
          <el-table-column label="操作" align="center" width="250px">
            <!-- eslint-disable-next-line -->
            <template slot-scope="scope">
              <!-- 修改按钮-->
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row._id)"
                ></el-button>
              </el-tooltip>
              <!-- 删除按钮-->
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeUserById(scope.row._id)"
                ></el-button>
              </el-tooltip>
              <!-- 分配角色按钮-->
              <el-tooltip
                class="item"
                effect="dark"
                content="开发中..."
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  disabled
                  @click="setRole(scope.row)"
                  >开发中...</el-button
                >
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      <!-- </div> -->
      <!-- 分页 -->
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 6, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      <!-- card body -->
    </el-card>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editUserDialogVisible"
      width="30%"
      @close="editUserDialogClose"
    >
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="editFormRules"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="id：">
          <el-input v-model="editForm._id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="gender">
          <el-input v-model="editForm.gender"></el-input>
        </el-form-item>
        <el-form-item label="年龄：" prop="age">
          <el-input v-model="editForm.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
         <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close="addUserDialogClose">
     <el-form :model="addUserForm"  ref="addUserFormRef" :rules="addUserFormRules" label-width="80px" :inline="false"  size="normal">
            <el-form-item label="上传头像" >
         <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"  :show-file-list="true" :on-success="handleAvatarSuccess"  :before-upload="beforeAvatarUpload"> <img v-if="imageUrl" :src="imageUrl" class="avatar"> <i v-else class="el-icon-plus avatar-uploader-icon"></i></el-upload>
       </el-form-item>
       <el-form-item label="用户名：" prop="username">
         <el-input v-model="addUserForm.username"></el-input>
       </el-form-item>
        <el-form-item label="年龄：" prop="age">
         <el-input v-model="addUserForm.age"></el-input>
       </el-form-item>
       <el-form-item label="性别：" prop="gender">
         <el-select v-model="addUserForm.gender" placeholder="请选择" width="200px">
          <el-option v-for="item in genderOpt" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
         <!-- <el-input v-model="addUserForm.gender"></el-input> -->
       </el-form-item>
       <el-form-item label="密码" prop="password">
         <el-input type="password" v-model="addUserForm.password"></el-input>
       </el-form-item>
       <el-form-item label="电话" prop="mobile">
         <el-input v-model="addUserForm.mobile"></el-input>
       </el-form-item>

       <el-form-item label="邮箱：" prop="email">
         <el-input v-model="addUserForm.email"></el-input>
       </el-form-item>
     </el-form>
     <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['username'],
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
    // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱地址'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
    // 验证手机的正则表达式
      const regMobile = /^1[3-9]\d{9}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {

      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      datalist: [],
      editUserDialogVisible: false,
      editForm: {},
      imageUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      editFormRules: {
        username: [
          { required: true, message: 'Username is required!', trigger: 'blur' },
          {
            max: 12,
            min: 2,
            message: 'username must be between 5 and 12 characters',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制添加用户对话框显示与否的变量
      addDialogVisible: false,
      // 添加用户表单
      addUserForm: {
        username: '',
        password: '',
        gender: '',
        email: '',
        age: ''
      },
      genderOpt: [
        {
          label: '男',
          value: '男'
        },
        {
          label: '女',
          value: '女'
        }
      ],
      // 添加用户表单规则
      addUserFormRules: {
        username: [
          { required: true, message: 'Username is required!', trigger: 'blur' },
          {
            max: 12,
            min: 2,
            message: 'username must be between 5 and 12 characters',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: 'Password is required!', trigger: 'blur' },
          {
            max: 12,
            min: 2,
            message: 'Password must be between 5 and 12 characters',
            trigger: 'blur'
          }
        ],
        gender: [
          { enum: ['男', '女'], trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 操作日志数据
      logData: {
        operationType: ''
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取所有列表数据
    async getUserList () {
      const res = await this.$http.get('/user', {
        params: this.queryInfo
      })
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error('获取用户数据列表失败！')
      }
      // console.log(res.data.result)
      this.total = res.data.total
      // console.log(res.data.total)
      this.datalist = res.data.result
    },
    // 显示编辑对话框
    async showEditDialog (id) {
      const res = await this.$http.get('/user/' + id)
      console.log(res)
      if (res.status !== 200) {
        return this.$message.error('信息读取失败！')
      }
      this.editForm = res.data[0]
      console.log(this.editForm)
      this.editUserDialogVisible = true
      // 根据id查询
      // 把查询结果赋值给数据
      // 把数据渲染到编辑dialog中的表单
      console.log(id)
    },
    // 提交修改用户信息
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        console.log('预验证开始...')
        if (!valid) {
          return this.$message.error('预验证失败!!!')
        }
        // // 添加用户日志数据  ↓↓↓↓↓↓↓↓
        this.logData.operationType = '编辑用户'
        this.logData.handler = this.username
        this.logData.operation = `对用户 ${this.editForm.username} 的信息进行了修改`
        this.logData.operationTime = Date.now()
        console.log(this.logData);
        console.log('预验证通过!!!')
        const res = await this.$http.put(
          '/user/' + this.editForm._id,
          this.editForm
        )
        console.log(res.status)
        if (res.status !== 200) {
          return this.$message.error('信息修改失败！')
        }
        // 重新获取数据
        this.getUserList()
        // 提交编辑用户信息操作日志
        this.saveOperationLog(this.logData)
        // 隐藏修改用户对话框
        this.editUserDialogVisible = false
        // 修改用户信息成功的提示
        this.$message.success('修改用户信息成功！')
      })
    },
    // 根据id删除用户
    async removeUserById (id) {
      const currentId = window.sessionStorage.getItem('token')
      // console.log('当前登陆中的用户id为:' + currentId)
      // console.log('当前要删除的用户id为:' + id)
      // 判断是否为当前用户，是则不能删除
      if (id === currentId) return this.$message.error('不能删除当前用户')
      // 判断用户是否确认删除
      await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async (result) => {
        // 用户点击确认按钮将执行then 里的代码
        // console.log(id)
        // 发起删除请求
        const res = await this.$http.delete('/user/delete/' + id)
        // 添加操作日志
        this.saveOperationLog(this.logData)
        // console.log(res.data.ok)
        // 判断后端返回的删除成功与否状态码
        if (res.data.ok !== 1) {
          // 提示用户删除失败
          return this.$message.error('删除失败！')
        }
        // 提示用户删除成功
        this.$message.success('用户删除成功！')
        // 重新获取数据刷新列表
        this.getUserList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
      // 用户点击取消按钮将执行 catch 里的代码
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 监听页面显示数量
    handleSizeChange (newsize) {
      console.log(newsize);
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    // 监听该页面切换
    handleCurrentChange (newpage) {
      console.log(newpage);
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    // 关闭编辑对话框的时候清空表单内容
    editUserDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 显示添加用户对话框
    showAddUserDialog () {
      console.log(this.username);
      this.addDialogVisible = true
      console.log('显示添加用户对话框');
    },
    // 监听添加用户对话框关闭
    addUserDialogClose () {
      this.$refs.addUserFormRef.resetFields()
      console.log('关闭添加用户对话框，清空表单');
    },
    // 添加用户请求提交
    addUserSubmit () {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('添加信息验证失败，请按规则填写')
        }
        // 添加用户日志数据  ↓↓↓↓↓↓↓↓
        this.logData.operationType = '添加用户'
        this.logData.handler = this.username
        this.logData.operation = `添加了新用户 &nbsp; ${this.addUserForm.username} `
        this.logData.operationTime = Date.now()
        // 添加用户日志数据  ↑↑↑↑↑↑↑
        // 发起添加用户请求↓↓↓↓↓↓↓↓↓↓↓↓
        await this.$http.post('/add', this.addUserForm)
          .then(res => {
            this.$message.success('用户添加成功！')
            this.getUserList()
            this.addDialogVisible = false
            this.saveOperationLog(this.logData)
          })
          .catch(err => {
            console.log(err)
          })
        // console.log(res);
        // if (res.status !== 200) {
        //   return this.$message.error('添加失败，请稍后重试')
        // }
      })
    },
    // 保存操作日志函数
    saveOperationLog (log) {
      this.$http.post('/log', log)
      // console.log(res);
      // console.log(this.logData);
    },
    // 点击单元格处罚
    handle (row, column, event, cell) {
      console.log(`删除了用户：${row.username}`);
      // 添加用户日志数据  ↓↓↓↓↓↓↓↓
      this.logData.operationType = '删除用户'
      this.logData.handler = this.username
      this.logData.operation = `删除了用户：${row.username}`
      this.logData.operationTime = Date.now()
      console.log(this.logData);
      this.saveOperationLog(this.logData)
      console.log(row);
      console.log(column);
      console.log(event);
      console.log(cell);
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      console.log(file);
      // 文件名开始到最后一个点的长度
      const fileName = file.name.lastIndexOf('.')
      // 文件名长度
      const fileNameLength = file.name.length
      const fileName0 = file.name.substr(0, fileName)
      // 文件格式
      const fileFormat = file.name.substring(fileName + 1, fileNameLength);
      const fileType = fileFormat === 'jpg' || fileFormat === 'jpeg' || fileFormat === 'png' || fileFormat === 'JPG' || fileFormat === 'JPEG' || fileFormat === 'PNG';
      if (!fileType) {
        this.$message.error('上传格式为jpg, jpeg, png, JPG, JPEG, PNG');
      }
      console.log(fileName0, fileFormat);
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px
}
.el-card {
  margin-top: 20px
}
.el-select{
  width: 90px;
}
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
