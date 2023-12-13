<template>
  <div>
   <el-form :model="articleDetails" ref="form" :rules="articleDetailsRules" label-width="60px" :inline="false" size="normal">
       <el-form-item label="标题" prop="title">
           <el-input v-model="articleDetails.title"></el-input>
       </el-form-item>
       <el-form-item label="作者">
           <el-input disabled style="width:105px" v-model="articleDetails.author"></el-input>
        </el-form-item>
    </el-form>
    <quill-editor v-model="articleDetails.content"></quill-editor>
    <div>
        <el-button type="primary" @click="clickToSave">保存修改</el-button>
        <el-button @click="cacelEdit">取消修改</el-button>
    </div>

  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor"
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"
// import { saveOperationLog } from '../../assets/js/saveOperationLog.js'
export default {
  components: {
    quillEditor
  },
  props: ['username'],
  data () {
    return {
      currentId: '',
      articleDetails: {},
      articleDetailsRules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ]
      },
      logData: {
        operationType: '编辑文章'
      }
    }
  },
  created () {
    this.initarticle()
  },
  mounted() {
  },
  methods: {
    // 获取文章信息初始化
    async initarticle () {
      this.currentId = this.$route.query.id
      const res = await this.$http.get('/article/' + this.currentId)
      if (res.status !== 200) return this.$message.error('文章详情获取失败')
      console.log(res.data[0])
      this.articleDetails = res.data[0]
    },
    // 保存修改
    async clickToSave () {
      this.articleDetails.publishTime = Date.now()
      console.log(this.articleDetails.publishTime);
      const res = await this.$http.put('/article/' + this.currentId, this.articleDetails)
      if (res.data.ok !== 1) {
        return this.$message.error('文章修改失败！')
      }
      console.log(res)
      // 将文章信息赋值给log 以便记录操作日志
      // 操作描述
      this.logData.operation = `修改了由${this.articleDetails.author}发布的文章：《${this.articleDetails.title}》`
      // 操作者
      this.logData.handler = this.username
      // 操作时间
      this.logData.operationTime = this.articleDetails.publishTime
      // console.log(this.logData);
      // 发起记录操作日志请求
      const resLog = await this.$http.post('/log', this.logData)
      if (resLog.status !== 200) {
        // console.log(resLog);
        console.log('编辑操作记录保存失败');
      }
      // this.saveOperationLog(this.logData)
      // 调用 wheretogo 函数来提示用户选择修改成功后的去向
      this.whereToGo(this.currentId)
    },
    // 修改成功后弹窗提示用户选择回到首页还是详情页
    whereToGo (id) {
      this.$confirm('文章修改成功！', {
        confirmButtonText: '查看文章',
        cancelButtonText: '回到列表',
        type: 'success',
        closeOnClickModal: false,
        showClose: false,
        center: true
      }).then(() => {
        console.log('即将跳转到文章详情');
        this.$router.push({
          path: '/article/details',
          query: {
            userId: id
          }
        })
      }).catch(() => {
        console.log('即将跳转到文章列表');
        this.$router.push('/article')
      })
    },
    // 监听取消修改按钮
    cacelEdit () {
      // 取消编辑跳转到前一夜
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
.el-form{
    display:flex;
    justify-content:space-between;
}
.quill-editor{
    display:block;
    /* height: 450px; */
    margin-bottom:50px
}
   .ql-editor{
         height:450px;
     }
</style>
