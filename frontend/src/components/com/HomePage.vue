<template>
  <div>
    <el-container>
      <el-header>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-submenu index="1">
            <template slot="title">主页</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">文章</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">相册</template>
            <el-menu-item index="3-1">选项1</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <!-- <el-aside width="200px">Aside</el-aside> -->
      <el-main>
      <router-view/>
      </el-main>
      <el-footer
        >设为首页 关于百度About Baidu 百度营销 使用百度前必读 意见反馈 帮助中心
        ©2021 Baidu
        (京)-经营性-2017-0020京公网安备11000002000001号京ICP证030173号</el-footer
      >
    </el-container>
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
      activeIndex
    };
  },
  created() {
  },
  methods: {
  },
  watch:{
    $route: {
      handler() {
        this.activeIndex = this.$route.path
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.el-header {
  /* background-color: pink; */
  /* overflow: hidden; */
  /* width: 500px; */
  /* margin: 0 auto; */
  padding: 0;
}

/* .el-aside{
    background-color: yellow;
} */
.el-main {
  /* background-color: blue; */
  height: 600px;
}
.el-footer {
  height: 50px;
  line-height: 50px;
  /* background-color: red; */
  text-align: center;
  color:grey;
}
</style>
