const express = require('express');
const UserModel = require('../models/userModel');
const router = express.Router();

// 注册  -http:localhost/user/register
router.post('/register',(req,res) => {
  // 1. 得到数据,前端传递过来的参数跟表中的字段名相同.
  // 2. 实例化用户对象
  // let user = new UserModel({
  //   userName: req.body.userName,
  //   password: req.body.password
  // })
  let user = new UserModel(req.body);
  // 3. save 方法
  user.save().then(() => {
    res.json({
      code: 0,
      msg: '注册成功'
    })
  }).catch(error => {
    res.json({
      code: -1,
      msg: error.message
    })
  })
})

// 登录 - http:localhost/user/login
router.post('/login',(req,res) => {
  // 1. 得到前端传递的用户名和密码
  let userName = req.body.userName;
  let password = req.body.password;

  // 2. 数据库查询用户
  UserModel.findOne({
    userName,
    password
  }).then(data => {
    console.log(data);
    // 判断, 如果存在 data 有值得, 不存在 data 为null
    if(!data){
      res.json({
        code:-1,
        msg: '用户名或者密码错误'
      })
    } else {
      // 先设置cookie
      res.cookie('nickName',data.nickName,{
        maxAge: 1000 * 60 * 10
      });
      res.cookie('isAdmin',data.isAdmin,{
        maxAge: 1000 * 60 * 10
      })
      
      // 返回数据
      res.json({
        code: 0,
        msg: '登录成功',
        data: {
          id: data._id,
          nickName: data.nickName,
          isAdmin: data.isAdmin
        }
      })
    }
  }).catch(error => {
    res.json({
      code: -1,
      msg: error.message
    })
  })
})

module.exports = router;