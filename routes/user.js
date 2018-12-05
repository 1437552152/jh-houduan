var express = require('express');
var router = express.Router();
var db = require('../conf/conf.js');
var formaDate = require('../utils/date.js');
var multer = require('multer');
//统一返回格式
var responseData;
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next();
});
// 字段说明
//  isShow：0 表示展示      1 表示物理删除即隐藏

//----------------------------------------案例开始------------------
// 获得案例
router.post('/team', function (req, res) {
  let allCount;
  let pageNo = parseInt(req.body.pageNo);
  let pageSize = parseInt(req.body.pageSize);
  let sql = "SELECT COUNT(*) FROM student where isShow=0";
  let sql2 = "SELECT*FROM student where isShow=0 limit" + " " + (pageNo - 1) * pageSize + "," + (pageNo * pageSize);
  db.query(sql, function (err, results) {
    if (err) { } else {
      allCount = results[0]['COUNT(*)'];
      back(allCount)
    }
  });

  function back(allCount) {
    db.query(sql2, function (err, results) {
      if (err) { } else {
        var allPage = allCount / pageSize;
        var pageStr = allPage.toString();
        // 不能整除
        if (pageStr.indexOf('.') > 0) {
          allPage = parseInt(pageStr.split('.')[0]) + 1;
        }
        res.json({
          msg: '操作成功',
          status: '200',
          totalPages: allPage,
          data: results,
          total: allCount,
          currentPage: parseInt(pageNo)
        })
      }
    });
  }
});


//首页数据
router.post('/baoming', function (req, res) {
  let studentName = req.body.studentName;
  let phone = req.body.phone;
  let wantCountry = req.body.wantCountry;
  let wantSchool = req.body.wantSchool;
  let QQ = req.body.QQ;
  let email = req.body.email;
  let major = req.body.major;
  let xueli = req.body.xueli;
  let isShow = 0;
  let sql = 'insert  into  reportList(studentName,phone,wantCountry,wantSchool,QQ,email,major,xueli,isShow) values(?,?,?,?,?,?,?,?,?)'
  var params = [studentName, phone, wantCountry, wantSchool, QQ, email, major, xueli, isShow];
  db.query(sql, params, function (err, results) {
    if (err) { } else {
      res.json({
        msg: '操作成功',
        status: '200',
      })
    }
  });
});


//留言表单
router.post('/liuyan', function (req, res) {
  let username = req.body.username;
  let phone = req.body.phone;
  let QQ = req.body.QQ;
  let email = req.body.email;
  let content = req.body.content;
  let isShow = 0;
  let sql = 'insert  into  MessageBoard(username,phone,QQ,email,content,isShow) values(?,?,?,?,?,?)'
  var param = [username, phone, QQ, email, content, isShow];
  db.query(sql, param, function (err, results) {
    if (err) { } else {
      res.json({
        msg: '操作成功',
        status: '200',
      })
    }
  });
});
// 留言列表
router.post('/liuyan/list', function (req, res) {
  let sql = "SELECT * FROM MessageBoard where isShow=0 and status=1";
  db.query(sql, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        msg: '操作成功',
        status: '200',
        data: results
      })
    }
  });
});

// 公司简介
router.post('/companyprofile', function (req, res) {
  let type = req.query.type;
  let isShow = 0;
  let sql = `SELECT * FROM Companyprofile where isShow=0 and type=${type}`;
  db.query(sql, function (err, results) {
    if (err) { } else {
      res.json({
        msg: '操作成功',
        status: '200',
        data: results
      })
    }
  });
});

// 头部导航国家的获取
router.post('/getcountry', function (req, res) {
  let sql = `SELECT * FROM countryconfig   where isShow=0  group by  typeid`;
  db.query(sql, function (err, results) {
    if (err) {
      res.json({
        msg: '失败',
        status: '0',
        msg: err
      })
    } else {
      let arr = [];
      let arrStr = "";
      var getData1 = new Promise(function (resolve, reject) {
        results.map((item, index) => {
          let sql = `SELECT * FROM countryconfig   where isShow=0  and  typeid='${item.typeid}'`;
          db.query(sql, function (err, respon) {
            if (err) {
              reject(err);
            } else {             
              arrStr = { typeid: item.typeid, countrylist: respon };
              arr.push(arrStr);
              if(index==(results.length-1)){
                resolve(arr)
              }
              
            }
          })
        })
      })
      getData1.then(function (respon) {
        res.json({
          msg: '成功',
          status: 200,
          data: respon
        })
      })

    }
  });
});



// 首页信息
router.post('/index', function (req, res) {
  let isShow = 0;
  let sql = "SELECT * FROM Companyprofile where isShow=0;SELECT * FROM MessageBoard where isShow=0 and status=1";
  db.query(sql, {}, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        msg: '操作成功',
        status: '200',
        data: results[0],
        data1: results[1],
      })
    }
  });
});


































//获取当前时间
function formatDate() {
  //把时间戳转化为日期对象
  let date = new Date()
  //调用封装，参数为日期对象和时间格式
  return formaDate.formaDate(date, 'yyyy-MM-dd hh:mm')
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
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate.toString();
}
var datatime = 'public/images/' + getNowFormatDate();
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
router.post('/upload', upload.single('picUrl'), function (req, res) {
  res.json({
    state: 200,
    ret_code: req.file.path
  });
})
module.exports = router;
