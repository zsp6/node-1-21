//提供给前端 ajax 调用的接口地址 url
const express = require('express');
const async = require('async');
const BannerModel = require('../models/bannerModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
  dest: 'c:/tmp'
})
const router = express.Router();

//添加banner -http://localhost:3000/banner/add
router.post('/add',upload.single('bannerImg'),(req,res) => {
  console.log(req.file);
  // 1. 操作文件
  let newFileName = new Date().getTime() + '_' + req.file.originalname;
  let newFilePath = path.resolve(__dirname,'../public/uploads/banners/',newFileName);

  // 2. 移动文件
  try {
    let data = fs.readFileSync(req.file.path);
    fs.writeFileSync(newFilePath,data);
    fs.unlinkSync(req.file.path);

    // 文件的名字 + banner 图的名字给写入到数据库
    let banner = new BannerModel({
      name: req.body.bannerName,
      imgUrl: 'http://localhost:3000/uploads/banners/' + 'newFileName'
    })

    banner.save().then(() => {
      res.json({
        code: 0,
        msg: 'ok'
      })
    }).catch(error => {
      res.json({
        code: -1,
        msg: error.message
      })
    })
  } catch (error) {
    req.json({
      code: -1,
      msg: error.message
    })
  }

  //获取前端传递过来的参数
  //res.render('index');
  // var banner = new BannerModel({
  //   name: req.body.bannerName,
  //   imgUrl: req.body.bannerUrl
  // });

  // banner.save(function(err){
  //   if(err){
  //     res.json({
  //       code:-1,
  //       msg:err.message
  //     })
  //   }else{
  //     //成功
  //     res.json({
  //       code:0,
  //       msg:'ok'
  //     })
  //   }
  // })
});

//搜索or查询banner -http://localhost:3000/banner/search
router.get('/search',(req,res) => {
	
	// 解决跨域
	//res.set('Access-Control-Allow-Origin','*');
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
    //console.log(result);
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

// 删除 - http://localhost:3000/banner/delete
router.post('/delete',(req,res) => {
  // 得到要删除的id字段
  let id = req.body.id;

  // 操作 BannerModel 删除方法
  // BannerModel.deleteOne({
  //   _id: id
  // }).then((data) => {
  //   console.log(data);
  //   if(data.deletedCount > 0){
  //     res.json({
  //       code: 0,
  //       msg: 'ok'
  //     })
  //   }else{
  //     return Promise.reject(new Error('未找到相关数据'));
  //     // res.json({
  //     //   code: -1,
  //     //   msg: '未找到相关数据'
  //     // })
  //   }
    
  // }).catch(error => {
  //   console.log(error);
  //   res.json({
  //     code: -1,
  //     msg: error.message
  //   })
  // })
 
  // 操作 BannerModel 删除方法 方法二
  BannerModel.findByIdAndDelete({
    _id: id,
  }).then(data => {
    if(data){
      res.json({
        code: 0,
        msg: 'ok'
      })
    }else{
      res.json({
        code: -1,
        msg: '未找到相关数据'
      })
    }
    console.log(data);
    
  }).catch(error => {
    res.json({
      code: -1,
      msg: error.message
    })
  })

})

module.exports = router;