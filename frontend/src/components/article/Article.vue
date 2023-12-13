<template>
  <div class="home">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索与添加区域 -->
    <el-row :gutter="20">
      <el-col :span="5">
            <!-- 添加了@input事件后 clearable就失效了 -->
        <el-input placeholder="请输入内容" v-model="queryInfo.query" @input="getArticleList">
          <!-- <el-button icon="el-icon-search" slot="append" @click="getArticleList" ></el-button> -->
        </el-input>
      </el-col>
      <el-col :span="7">
        <el-button type="primary" @click="goToAddArticle" >添加文章</el-button>
      </el-col>
    </el-row>
    <!-- 卡片视图 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <!-- <div slot="header"> -->
      <!-- 文章列表 -->
      <el-table  :data="articleList" border stripe style="width: 100%" highlight-current-row height="calc(100vh - 270px)" @cell-click="handle">
          <el-table-column fit align="center" type="index" width="50" label="#"> </el-table-column>
          <el-table-column  align="center" height="20"  min-width="400" prop="title" label="标题">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="单击查看详情" placement="top" :enterable="false" >
                <span>{{scope.row.title}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center"  width="150" prop="author" label="作者" > </el-table-column>
          <!-- <el-table-column  prop="content" label="内容" min-width="200" :show-overflow-tooltip="true" >
          </el-table-column> -->
          <el-table-column align="center" sortable  width="200"  prop="publishTime"  label="发布时间">
            <template slot-scope="scope">
            <!-- 因为发布时间是字符串，所以转成数字类型在格式化 -->
              <span>{{scope.row.publishTime | dateFormat()}}</span>
            </template>
          </el-table-column>
          <!-- 操作栏 -->
          <el-table-column align="center" label="操作" width="235"  >
            <!-- eslint-disable-next-line -->
            <template slot-scope="scope">
              <!-- 修改按钮-->
              <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false" >
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="goToEdit(scope.row._id)" ></el-button>
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
                  @click="removeArticleById(scope.row._id)"
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
      <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
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
  props: ['username'],
  data () {
    return {
      articleList: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      logData: {}
    }
  },
  created () {
    // 调用获取文章信息函数
    this.getArticleList()
  },
  methods: {
    // 获取文章列表信息
    async getArticleList () {
      const res = await this.$http.get('/article', {
        params: this.queryInfo
      })
      console.log(res.data)
      this.articleList = res.data.result
      this.total = res.data.total
    },
    // 点击单元格触发
    handle (row, column, event, cell) {
      this.logData.operationTime = Date.now()
      this.logData.handler = this.username
      this.logData.operationType = '删除文章'
      this.logData.operation = `删除了由${row.author}在${row.publishTime}发布的文章：《${row.title}》`
      // console.log(this.logData)
      // console.log(row);
      // console.log(column);
      // console.log(event);
      // console.log(cell);

      // 判断当前点击的是否为标题栏
      if (column.label === '标题') {
        // 如果是标题栏，跳转到详情页并传递对应id ,以便详情页查询相应文章详情进行展示
        this.$router.push({
          path: '/article/details',
          query: {
            userId: row._id
          }
        })
      }
    },
    // 跳转到文章添加页
    goToAddArticle () {
      // 跳转到详情页并传递对应id ,一边详情页查询相应文章详情进行展示
      this.$router.push('/article/add')
    },
    // 携带文章id跳转到标记文章页
    goToEdit (id) {
      // 跳转到详情页并传递对应id ,一边详情页查询相应文章详情进行展示
      this.$router.push({
        path: '/article/edit',
        query: {
          id
        }
      })
    },
    // 根据id删除文章
    async removeArticleById (id) {
      // console.log('准备删除' + id)
      await this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async (result) => {
        const res = await this.$http.delete('/article/delete/' + id)
        if (res.data.ok !== 1) {
          return this.$message.error('删除失败')
        }
        this.getArticleList()
        // 发起记录操作日志请求
        const resLog = await this.$http.post('/log', this.logData)
        if (resLog.status !== 200) {
        // console.log(resLog);
          console.log('编辑操作记录保存失败');
        }
        // console.log(res)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 本页显示数量改变时候触发
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getArticleList()
      console.log(newsize)
    },
    // 当前页码改变时候触发
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getArticleList()
      console.log(newpage)
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-card {
  margin-top: 20px;
}

</style>
