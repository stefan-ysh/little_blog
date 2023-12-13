// 引入mongoose 文件
const mongoose = require("mongoose");
// // 引入数据库连接文件并执行
// const connect = require("../connect");
// User模型
const ArticleSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "请输入标题"], // 必传
    minlength: [3, "文章标题长度不能小于3"], // 字符串最小长度
    maxlength: [50, "文章标题长度不能大于50"], // 字符串最大长度
    trim: true, // 去除字符串首尾空格
  },
  author: {
    type: String
  },
  content: {
    type: String,
  },
  publishTime: {
      type: Date
  }
});
const Article = mongoose.model("Article", ArticleSchema);
// Article.create({
//   title: "测试文章3",
//   author: '测试人3',
//   content: "测试文章内容3",
//   publishTime: '2022-10-20'
// })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// export
module.exports = Article;
