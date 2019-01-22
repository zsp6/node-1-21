//提供给前端 ajax 调用的接口地址 url
const express = require('express');
const BannerModel = require('../models/banner');
const router = express.Router();

//添加banner -http://localhost:3000/banner/add
router.post('/add',(req,res) => {
  //获取前端传递过来的参数
  //res.render('index');
  var banner = new BannerModel({
    name: req.body.bannerName,
    imgUrl: req.body.bannerUrl
  });

  banner.save(function(err){
    if(err){
      res.json({
        code:-1,
        msg:err.message
      })
    }else{
      //成功
      res.json({
        code:0,
        msg:'ok'
      })
    }
  })
});
module.exports = router;