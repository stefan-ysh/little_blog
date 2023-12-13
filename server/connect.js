// 连接数据库


// 引入 mongoose
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/myBlog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    // 监听数据库服务启动成功并给出提示
    console.log("数据库服务开启成功！");
  })
  // 监听数据库服务启动失败并给出提示
  .catch((err) => {
    console.log("数据库服务开启失败！" + err);
  });
