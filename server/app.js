var createError = require("http-errors");
var express = require("express");
var path = require("path");
var connect = require("./connect.js");
var indexRouter = require("./routes/index");
// 修改
var ejs = require("ejs");

var app = express();
const morgan = require('morgan');
if (process.env.NODE_ENV === 'development') {
  console.log('当前环境是开发环境')
  app.use(morgan('dev'))
} else {
  console.log('当前环境是生产环境')
}
// view engine setup
app.engine(".html", ejs.__express);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

// 设置跨域
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// app.listen(3000, function(){
//   console.log('服务器已经在端口3456启动，查看请前往 http://localhost:3000')
// })

// 此时在server.js目录下命令行运行node server.js
// http://localhost:3456 渲染出Hello world

module.exports = app;
