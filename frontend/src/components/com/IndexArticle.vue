<template>
  <div>
        <el-table :data="articleList" border stripe>
          <el-table-column type="index" label="#" ></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="author"  label="作者"></el-table-column>
          <el-table-column prop="publishTime"  label="时间">
            <template slot-scope="scope">
                <span>{{scope.row.publishTime | dateFormat}}</span>
            </template>
          </el-table-column>
        </el-table>
          <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
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
      articleList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    };
  },
  created() {
    this.getArticleList()
  },
  methods: {
    async getArticleList() {
      const res = await this.$http.get("/article", {
        params: this.queryInfo
      });
      console.log(res.data.result);
      this.articleList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getArticleList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getArticleList()
    }
  }
};
</script>

<style scoped>
</style>
