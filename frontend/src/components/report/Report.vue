<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      <el-breadcrumb-item>数据可视化</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div id="myChart" :style="{ width: '1200px', height: '500px' }"></div>
      <!-- card body -->
    </el-card>
  </div>
</template>
<script>
export default {
  name: "hello",
  data() {
    return {
      echartsData: [],
      articleSum: [],
      queryInfo: {
        query: '',
        pagenum: '',
        pagesize: ''
      }
    };
  },
  created() {
  },
  mounted() {
    this.getArticle()
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        // backgroundColor: 'pink', // 背景色
        title: { text: "文章数量", x: 'center' },
        tooltip: {},
        axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
          show: true,
          textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: '#333'
          },
          text: '熊'
        },
        xAxis: {
          data: this.echartsData
        },
        yAxis: {},
        series: [
          {
            name: "作品数量",
            type: "bar",
            label: { // 柱状图上的文字设置
              show: true, // 是否显示
              rotate: 0, // 旋转角度
              position: 'top' // 显示位置inside默认显示柱子内部，
            },
            data: this.articleSum,
            markPoint: { // 标记点
              data: [{
                type: 'max',
                name: '最大值'
              }, {
                type: 'min',
                name: '最小值'
              }]
            },
            markLine: { // 标记线
              data: [{
                type: 'average',
                name: '平均值'
              }]
            },
            barWidth: '30%'
          }
        ]
      });
    },
    // 获取文章信息
    async getArticle() {
      const res = await this.$http.get('/article', {
        params: this.queryInfo
      })
      // console.log(res.data.result);
      // 循环数组找到作者的总数
      res.data.result.forEach(item => {
        // 判断数组中是否含有相同作者
        if (this.echartsData.indexOf(item.author) === -1) {
          // 确定没有该作者，便加上
          this.echartsData.push(item.author)
          console.log(res.data.result);
        }
      })
      // 循环出个人文章数
      for (var i = 0; i < this.echartsData.length; i++) {
        var num = 0
        res.data.result.forEach(item => {
          if (this.echartsData[i] === item.author) {
            num += 1
          }
        })
        this.articleSum.push(num)
      }
      this.drawLine();
    }
  }
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
</style>
