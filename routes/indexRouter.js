//页面渲染的路由
const express = require('express');
const router = express.Router();
const userCheck = require('../middlewares/userCheck');

//首页 - http://localhost:3000/
router.get('/',userCheck,(req,res) => {
  // 要获取用户登录的用户名
  //console.log(req.cookies);
  // let nickName = req.cookies.nickName;
  // let isAdmin = req.cookies.isAdmin ? true : false;
  res.render('index',{
    nickName: req.cookies.nickName,
    isAdmin: parseInt(req.cookies.isAdmin)
  });
  // if(nickName){
  //   // 存在就去想去的页面 这里是首页
    
  // }else {
  //   // 不存在 说明没有登录, 就让他去登录页面.
  //   res.redirect('/login.html');
  // }
  
});

//banner 页面
router.get('/banner.html',(req,res) => {
  // 要获取用户登录的用户名
  // let nickName = req.cookies.nickName;
  // let isAdmin = req.cookies.isAdmin ? true : false;

  // if(nickName) {
  //   res.render('banner',{
  //     nickName,
  //     isAdmin
  //   });
  // }else{
  //   res.redirect('/login.html');
  // }
  res.render('banner',{
    nickName: req.cookies.nickName,
    isAdmin: parseInt(req.cookies.isAdmin)
  });
})

// 登录 页面
router.get('/login.html',(req,res) => {
  res.render('login');
})


module.exports = router;