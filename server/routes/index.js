var express = require("express");
var router = express.Router();
const User = require("../models/User");
const Article = require("../models/Article");
const Log = require("../models/Log");
// 登录
router.post("/login", function (req, res, next) {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  // console.log("当前申请登录的账号是：" + username);
  // console.log("当前申请登录的密码是：" + password);
  User.find({
    username,
    password,
  })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
// 获取所有用户信息
router.get("/user", function (req, res, next) {
  // 生命当前需要模糊查询的数据变量
  let queryInfo;
  // 判断当前请求是否带有模糊请求所需数据
  if (req.query.query === "") {
    // 如果没有模糊请求数据则吧查询条件作为空对象
    queryInfo = {};
  } else {
    // 如果有查询数据，则将数据添加到查询条件中
    queryInfo = { username: { $regex: req.query.query, $options: "i" } };
  }
  // 获取当前请求的页码
  const pagenum = Number(req.query.pagenum);
  // 获取当前请求的页码显示数量
  const pagesize = Number(req.query.pagesize);
  // 通过计算得出 需要跳过的条目
  const sk = (pagenum - 1) * pagesize;
  // 开始查询
  User.find(queryInfo)
    .then((firstFind) => {
      let total = firstFind.length;
      console.log(total);
      User.find(queryInfo)
        .skip(sk)
        .limit(pagesize)
        .then((result) => {
          res.send({ result, total });
          // console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
// 根据id 查询用户
router.get("/user/:id", function (req, res, next) {
  const id = req.params.id;
  User.find({
    _id: id,
  })
    .then((result) => {
      // console.log("查询成功，结果如下：");
      // console.log(result);
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
  // console.log(req.params.id);
});
// 添加用户
router.post("/add", function (req, res, next) {
  console.log(req.body);
  User.create(req.body)
    .then((result) => {
      // console.log(result);
      res.end();
    })
    .catch((err) => {
      console.log(err);
    });
});
// 修改用户信息根据ID
router.put("/user/:id", function (req, res, next) {
  console.log(req.body);
  User.updateOne({ _id: req.body._id }, req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
// 根据id删除用户
router.delete("/user/delete/:id", function (req, res, next) {
  const _id = req.params.id;
  console.log(_id);
  User.deleteOne({
    _id,
  })
    .then((result) => {
      res.send(result);
      // console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// 获取所有文章信息
router.get("/article", function (req, res, next) {
  let queryInfo;
  // console.log(req);
  if (req.query.query === "") {
    queryInfo = {};
  } else {
    queryInfo = { title: { $regex: req.query.query, $options: "i" } };
  }
  const pagenum = Number(req.query.pagenum);
  const pagesize = Number(req.query.pagesize);
  const sk = (pagenum - 1) * pagesize;
  // console.log(req.query);
  Article.find(queryInfo)
    .then((firstFind) => {
      let total = firstFind.length;
      // console.log(total);
      Article.find(queryInfo)
        .skip(sk)
        .limit(pagesize)
        .then((result) => {
          res.send({ result, total });
          // console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

// 根据id获取文章信息
router.get("/article/:id", function (req, res, next) {
  const _id = req.params.id;
  console.log(_id);
  Article.find(
    {
      _id,
    },
    (err, doc) => {
      console.log(doc);
      res.send(doc);
    }
  );
});

// 添加文章
router.post("/article/add", async function (req, res, next) {
  const newArticle = req.body;
  console.log(newArticle);
  const result = await Article.create(newArticle);
  // console.log(result);
  res.json(result);
});

router.put("/article/:id", function (req, res, next) {
  console.log(req.body._id);
  Article.updateOne({ _id: req.body._id }, req.body)
    .then((result) => {
      res.send(result);
      // console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/article/delete/:id", function (req, res, next) {
  const id = req.params.id;
  Article.deleteOne({
    _id: id,
  })
    .then((result) => {
      res.send(result);
      // console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/log", function (req, res, next) {
  let queryInfo;
  if (req.query.query === "") {
    queryInfo = {};
  } else {
    queryInfo = { operation: { $regex: req.query.query, $options: "i" } };
  }
  console.log(req.query);
  const pagenum = Number(req.query.pagenum);
  const pagesize = Number(req.query.pagesize);
  const sk = (pagenum - 1) * pagesize;
  Log.find(queryInfo)
    .then((firstFind) => {
      let total = firstFind.length;
      // console.log(firstFind)
      Log.find(queryInfo)
        .skip(sk)
        .limit(pagesize)
        .then((result) => {
          // console.log(result);
          res.send({ result, total });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/log", async function (req, res, next) {
  const newLog = req.body;
  // console.log(newLog);
  const result = await Log.create(newLog);
  // console.log(result);
  res.send(result);
});
// 模糊查询实例一
// function findLike1 () {
//   // User.find({username: /ad/}).then(result=>{
//   //   console.log(result);
//   // })
// }

// 模糊查询实例二
// function findLike2 () {
//   User.find({ username: { $regex: "苑帅", $options: "i" } }).then((result) => {
//     console.log(result)
//   })
// }

// findLike1()
// findLike2()

module.exports = router;
