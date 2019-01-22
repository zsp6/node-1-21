//提供给前端 ajax 调用的接口地址 url
const express = require('express');
const async = require('async');
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

//搜索or查询banner -http://localhost:3000/banner/search
router.get('/search',(req,res) => {
  //分页
  //1.得到前端传递过来的参数
  let pageNum = Number(req.query.pageNum) || 1;// 当前的页数
  let pageSize = Number(req.query.pageSize) || 2; //当前显示的条数
  //let totalSize = 0; //总的条数
  //采用并行无关联
  async.parallel([
    function(cb){
      BannerModel.find().count().then(num => {
        // totalSize = num;
        cb(null,num);
      }).catch(err => {
        cb(err);
      })
    },
    function(cb){
      BannerModel.find().skip(pageNum * pageSize - pageSize).limit(pageSize).then(data => {
        cb(null,data);
      }).catch(err => {
        cb(err);
      })
    }
  ],function(err,result){
    console.log(result);
    if(err){
      res.json({
        code:-1,
        msg:err.message
      })
    }else{
      res.json({
        code: 0,
        msg:"ok",
        data:result[1],
        totalPage:Math.ceil(result[0] / pageSize)//总页数
        //总条数
        //totalSize:result[0]
      })
    }
  })


  //查看数据的总条数
  // BannerModel.find().count().then(num => {
  //   totalSize = num;
  //   console.log(num);
  // })
  // .catch(err => {
  //   console.log(err.message);
  // })
  //分页
  // BannerModel.find().skip(pageNum * pageSize - pageSize).limit(pageSize).then(result => {
  //   console.log(result);
  //   res.json({
  //     code: 0,
  //     msg :'ok',
  //     data:result,
  //     totalSize:totalSize
  //   })
  // })
  // .catch(err => {
  //   //出错了
  //   console.log(err.message);
  //   res.json({
  //     code : -1,
  //     msg : err.message
  //   })
  // })
  // BannerModel.find(function(err,data){
  //   if(err){
  //     console.log('查询失败');
  //     res.json({
  //       code: -1,
  //       msg: err.message
  //     })
  //   }else{
  //     console.log('查询成功');
  //     res.json({
  //       code: 0,
  //       msg:'ok',
  //       data:data
  //     })
  //   }
  // })
})

module.exports = router;