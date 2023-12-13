<template>
  <div>
    <el-form
      :model="addArticleForm"
      ref="form"
      :rules="addArticleFormRules"
      label-width="60px"
      :inline="false"
      size="normal"
    >
      <el-form-item width="100px" label="标题" prop="title">
        <el-input
          v-model="addArticleForm.title"
          prefix-icon="el-icon-tickets"
        ></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input
          v-model="username"
          disabled
          prefix-icon="el-icon-edit"
          style="width:90px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div>
      <quill-editor v-model="addArticleForm.content"></quill-editor>
    </div>
    <el-button type="primary" size="default" @click="publish">发布</el-button>
    <!-- <el-button type="cancel" size="default" class="publish" >发布</el-button> -->
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor"
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"
export default {
  // 接收父组件传递过来的值
  props: ["username"],
  components: {
    quillEditor
  },
  data () {
    return {
      // 当前用户的id
      currentId: "",
      // 添加成功后文章的id
      newArticleId: "",
      addArticleForm: {
        title: "",
        author: "",
        content: "",
        publishTime: ""
      },
      addArticleFormRules: {
        title: [{ required: true, message: "标题不可为空" }],
        content: [{ required: true, message: "内容不可为空" }]
      },
      logData: {
        operationType: '发布文章'
      }
    }
  },
  created () {
    // 当前用户的id，在sessionStorage里面的token值
    this.currentId = window.sessionStorage.getItem("token")
    // console.log(this.currentId)
  },
  methods: {
    async publish () {
      // 文章作者为当前登录的人
      this.addArticleForm.author = this.username
      // 文章添加时间为当前时间
      this.addArticleForm.publishTime = Date.now()
      // 发起文章添加请求
      const res = await this.$http.post("/article/add", this.addArticleForm)
      // 添加文章成功后，将返回的文章id值赋值给 data 里生命的那个新文章id
      this.newArticleId = res.data._id
      // console.log(res.data._id)
      if (res.status !== 200) {
        return this.$message.error("发布文章失败")
      }
      // 将文章信息赋值给log 以便记录操作日志
      // 操作描述
      this.logData.operation = `发布了文章《${this.addArticleForm.title}》`
      // 操作者
      this.logData.handler = this.username
      // 操作时间
      this.logData.operationTime = this.addArticleForm.publishTime
      // console.log(this.logData);
      // 发起记录操作日志请求
      const resLog = await this.$http.post('/log', this.logData)
      if (resLog.status !== 200) {
        // console.log(resLog);
        console.log('编辑操作记录保存失败');
      }
      // 调用提示用户选择去想的函数并传入 文章添加后返回的 文章id
      this.whereToGo(this.newArticleId)
    },
    // 修改成功后弹窗提示用户选择回到首页还是详情页 并拿到文章id
    whereToGo (id) {
      this.$confirm("文章发布成功！", {
        confirmButtonText: "查看文章",
        cancelButtonText: "回到列表",
        type: "success",
        closeOnClickModal: false,
        showClose: false,
        center: true
      })
        .then(() => {
          // console.log('即将跳转到文章详情')
          this.$router.push({
            path: "/article/details",
            query: {
              userId: id
            }
          })
        })
        .catch(() => {
          // console.log('即将跳转到文章列表')
          this.$router.push("/article")
        })
    }
  }
}
</script>
<style scoped>
.el-form {
  display: flex;
  justify-content: space-between;
}
.quill-editor {
  height: 450px;
}
.el-button {
  margin-top: 50px;
}
</style>
