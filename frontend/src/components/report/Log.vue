<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      <el-breadcrumb-item>操作日志</el-breadcrumb-item>
    </el-breadcrumb>
        <el-row :gutter="20">
      <el-col :span="5">
            <!-- 添加了@input事件后 clearable就失效了 -->
        <el-input placeholder="输入进行搜索..." v-model="queryInfo.query" @input="getLogData">
          <!-- <el-button icon="el-icon-search" slot="append" @click="getArticleList" ></el-button> -->
        </el-input>
      </el-col>
      <!-- <el-col :span="7">
        <el-button type="primary" @click="goToAddArticle" >添加文章</el-button>
      </el-col> -->
    </el-row>
    <el-card>
     <!-- <div slot="header"> -->
    <el-table :data="logDataList" border stripe height="450">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column sortable width="200" label="操作时间" align="center" prop="operationTime">
        <template slot-scope="scope">
          <span>{{ scope.row.operationTime | dateFormat() }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作类型" align="center" width="100" prop="operationType">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.operationType === '删除用户' || scope.row.operationType === '删除文章'  || scope.row.operationType === '退出系统'" effect="dark"  type="danger" size="small">{{scope.row.operationType}}</el-tag>
          <el-tag v-else-if="scope.row.operationType === '添加用户' || scope.row.operationType === '发布文章' ||  scope.row.operationType === '登陆系统'" size="small" effect="dark">{{scope.row.operationType}}</el-tag>
          <el-tag v-else effect="dark" type="success" size="small">{{scope.row.operationType}}</el-tag>
          <!-- <el-tag :type="scope.row.operationType === '删除用户' || '删除文章' ? 'danger' : 'info'">{{scope.row.operationType}}</el-tag> -->
          <!-- <el-tag :type="scope.row.operationType === '删除用户' || '删除文章' ? 'danger' : 'info'">{{scope.row.operationType}}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="操作内容" width="550" align="center" prop="operation">
        <template slot-scope="scope">
          <span v-html="scope.row.operation"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作者" align="center" prop="handler" >
        <template slot-scope="scope">
          <el-tag>{{scope.row.handler}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- </div> -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
import dateFormat from "../../assets/js/UTCtimeFormat.js";
export default {
  filters: {
    dateFormat
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      logDataList: []
    };
  },
  created() {
    this.getLogData();
  },
  methods: {
    async getLogData() {
      const res = await this.$http.get("/log", {
        params: this.queryInfo
      });
      console.log(res.data.result);
      this.total = res.data.total
      this.logDataList = res.data.result.reverse();
    },
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getLogData()
      console.log(newsize);
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getLogData()
      console.log(newpage);
    }
  }
};
</script>
<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-card {
  margin-top: 20px;
}
</style>
