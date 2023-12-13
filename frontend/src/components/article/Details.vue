<template>
  <div class="home">
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/article' }">文章列表</el-breadcrumb-item>
      <el-breadcrumb-item>文章详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always" :body-style="{ padding: '20px' } " :data="articleDetails">
      <!-- <div slot="header" > -->
        <h1>{{articleDetails.title}}</h1>
        <div class="articleInfo">
         <span>作者：{{articleDetails.author}}</span>
        <!-- <span>{{articleDetails._id}}</span> -->
        <span>发表时间：{{articleDetails.publishTime | dateFormat()}}</span>
        </div>
        <p style="white-space: pre-line" v-html="articleDetails.content" ></p>
      <!-- </div> -->
      <!-- card body -->
    </el-card>
  </div>
</template>

<script>
import dateFormat from "../../assets/js/UTCtimeFormat.js"
export default {
  filters: {
    dateFormat
  },
  data () {
    return {
      articleDetails: {}
    }
  },
  beforeCreate() {
    // debugger
  },
  created () {
    // debugger
    this.initarticle()
  },
  methods: {
    async initarticle () {
      // debugger
      // console.log(this.$route.query.userId);
      const currentId = this.$route.query.userId
      // debugger
      const res = await this.$http.get('/article/' + currentId)
      // debugger
      if (res.status !== 200) return this.$message.error('文章详情获取失败')
      // debugger
      console.log(res)
      this.articleDetails = res.data[0]
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-top: 20px;
  }
  .articleInfo{
    width: 300px;
    margin:10px auto;
    display:flex;
    justify-content:space-between;
    align-items:center;
    opacity: 0.5;
    font-size:10px;
  }
</style>
