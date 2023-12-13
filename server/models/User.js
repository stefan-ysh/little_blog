// 引入mongoose 文件
const mongoose = require("mongoose");
// // 引入数据库连接文件并执行
// const connect = require("../connect");
// User模型
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "请传入姓名"], // 必传
    minlength: [2, "姓名长度不能小于2"], // 字符串最小长度
    maxlength: [10, "姓名长度不能大于10"], // 字符串最大长度
    trim: true, // 去除字符串首尾空格
  },
  password: {
    type: String,
    required: [true, "请传入密码"], // 必传
    minlength: [5, "姓名长度不能小于5"], // 字符串最小长度
    maxlength: [15, "姓名长度不能大于15"], // 字符串最大长度
    trim: true, // 去除字符串首尾空格
  },
  age: {
    type: Number,
    min: 1,
    max: 126,
  },
  mobile:Number,
  email:  String,
  gender: {
    type: String,
    enum: ["男", "女"]
  }
});

const User = mongoose.model("User", UserSchema);

// User.create({
//   username: "admin",
//   password:'123456',
//   age: 18,
//   email: "admin@qq.com",
//   gender: '女'
// })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// export
module.exports = User;
