var express = require("express");
var router = express.Router();
var db = require("../conf/conf.js");
var formaDate = require("../utils/date.js");
var multer = require("multer");
//统一返回格式
var responseData;
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ""
  };
  next();
});
// 字段说明
//  isShow：0 表示展示      1 表示物理删除即隐藏

//首页报名数据
router.post("/baoming", function (req, res) {
  let studentName = req.body.studentName;
  let phone = req.body.phone;
  let wantCountry = req.body.wantCountry;
  let wantSchool = req.body.wantSchool;
  let QQ = req.body.QQ;
  let email = req.body.email;
  let major = req.body.major;
  let xueli = req.body.xueli;
  let isShow = 0;
  if (studentName == '' || phone == '' || wantCountry == '' || wantCountry == '' || wantSchool == "" || QQ == "" || email == "" || major == "" || xueli == '') {
    res.json({
      msg: "提交失败,请完善表单",
      status: "0"
    });
    return false;
  }
  let sql =
    "insert  into  reportList(studentName,phone,wantCountry,wantSchool,QQ,email,major,xueli,isShow) values(?,?,?,?,?,?,?,?,?)";
  var params = [
    studentName,
    phone,
    wantCountry,
    wantSchool,
    QQ,
    email,
    major,
    xueli,
    isShow
  ];
  db.query(sql, params, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});

//留言表单
router.post("/liuyan", function (req, res) {
  let username = req.body.username;
  let phone = req.body.phone;
  let QQ = req.body.QQ;
  let email = req.body.email;
  let content = req.body.content;
  let isShow = 0;
  if (username == '' || phone == '' || QQ == "" || email == "" || content == "") {
    res.json({
      msg: "提交失败,请完善表单",
      status: "0"
    });
    return false;
  }
  let sql =
    "insert  into  MessageBoard(username,phone,QQ,email,content,isShow) values(?,?,?,?,?,?)";
  var param = [username, phone, QQ, email, content, isShow];
  db.query(sql, param, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200"
      });
    }
  });
});
// 留言列表
router.post("/liuyan/list", function (req, res) {
  let sql = "SELECT * FROM MessageBoard where isShow=0 and status=1";
  db.query(sql, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results
      });
    }
  });
});

// 公司简介
router.post("/companyprofile", function (req, res) {
  let type = req.query.type;
  let isShow = 0;
  let sql = `SELECT * FROM Companyprofile where isShow=0 and type=${type}`;
  db.query(sql, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results
      });
    }
  });
});

// 头部导航国家的获取
router.post("/getcountry", function (req, res) {
  let sql = `SELECT * FROM countryconfig   where isShow=0  group by  typeid`;
  db.query(sql, function (err, results) {
    if (err) {
      res.json({
        msg: "失败",
        status: "0",
        msg: err
      });
    } else {
      let arr = [];
      let arrStr = "";
      var getData1 = new Promise(function (resolve, reject) {
        results.map((item, index) => {
          let sql = `SELECT * FROM countryconfig   where isShow=0  and  typeid='${
            item.typeid
          }'`;
          db.query(sql, function (err, respon) {
            if (err) {
              reject(err);
            } else {
              arrStr = {
                typeid: item.typeid,
                countrylist: respon
              };
              arr.push(arrStr);
              if (index == results.length - 1) {
                resolve(arr);
              }
            }
          });
        });
      });
      getData1.then(function (respon) {
        res.json({
          msg: "成功",
          status: 200,
          data: respon
        });
      });
    }
  });
});


// -------------------------------------------------------------------------------------------------------------------------
// 首页各所学校信息
router.post("/indexSchool", function (req, res) {
  let isShow = 0;
  let sql = `SELECT * FROM  famousSchools   where isShow=0  group by  country`;
  db.query(sql, function (err, results) {
    if (err) {
      res.json({
        msg: "失败",
        status: "0",
        msg: err
      });
    } else {
      let arr = [];
      let arrStr = "";
      var getData1 = new Promise(function (resolve, reject) {
        results.map((item, index) => {
          let sql = `SELECT * FROM famousSchools   where isShow=0  and  country='${
            item.country
          }'`;
          db.query(sql, function (err, respon) {
            if (err) {
              reject(err);
            } else {
              arrStr = {
                country: item.country,
                amount: item.amount,
                schoolList: respon
              };
              arr.push(arrStr);
              if (index == results.length - 1) {
                resolve(arr);
              }
            }
          });
        });
      });
      getData1.then(function (respon) {
        res.json({
          msg: "成功",
          status: 200,
          data: respon
        });
      });
    }
  });
});

// -----------------------------------------------------------------------------------------------------------------
//一个学校的详情
router.get("/school/detail", function (req, res) {
  // let id = 1;
  let id = req.query.id;
  let sql = "SELECT * FROM famousSchools where Id=" + id;
  db.query(sql, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results
      });
    }
  });
});
// 一篇文章详情
router.get("/news/detail", function (req, res) {
  let id = 1;
  // let id = req.query.id;
  let sql = "SELECT * FROM news where id=" + id;
  db.query(sql, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results
      });
    }
  });
});

//获取套餐
router.get("/price/detail", function (req, res) {
  let id = 1;
  // let id = req.query.id;
  let sql = "SELECT * FROM pricemeal where Id=" + id;
  db.query(sql, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results
      });
    }
  });
});

// 获取首页的热点文章
router.post("/liuxueInformation", function (req, res) {
  let isShow = 0;
  let sql = `SELECT * FROM  news   where isShow=0  group by  country`;
  db.query(sql, function (err, results) {
    if (err) {
      res.json({
        msg: "失败",
        status: "0",
        msg: err
      });
    } else {
      let arr = [];
      let arrStr = "";
      var getData1 = new Promise(function (resolve, reject) {
        results.map((item, index) => {
          let sql = `SELECT * FROM  news   where isShow=0  and  country='${
            item.country
          }'`;
          db.query(sql, function (err, respon) {
            if (err) {
              reject(err);
            } else {
              arrStr = {
                country: item.country,
                newsList: respon
              };
              arr.push(arrStr);
              if (index == results.length - 1) {
                resolve(arr);
              }
            }
          });
        });
      });
      getData1.then(function (respon) {
        res.json({
          msg: "成功",
          status: 200,
          data: respon
        });
      });
    }
  });
});
// 拿到国家的轮播图
router.get("/banner", function (req, res) {
  // let id = 19;
  let id = req.query.id;
  let sql = `SELECT * FROM countryconfig where isShow=0 and Id=${id}`;
  db.query(sql, function (err, results) {
    if (err) {} else {
      res.json({
        msg: "操作成功",
        status: "200",
        data: results
      });
    }
  });
});
// -----------------------------------------------------------------------------------------------------------------






















//获取当前时间
function formatDate() {
  //把时间戳转化为日期对象
  let date = new Date();
  //调用封装，参数为日期对象和时间格式
  return formaDate.formaDate(date, "yyyy-MM-dd hh:mm");
}
//------------------------------图片上传------------------------------------------
//获取时间
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate =
    date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate.toString();
}
var datatime = "public/images/" + getNowFormatDate();
//将图片放到服务器
var storage = multer.diskStorage({
  // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
  destination: datatime,
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage
});
router.post("/upload", upload.single("picUrl"), function (req, res) {
  res.json({
    state: 200,
    ret_code: req.file.path
  });
});
module.exports = router;
