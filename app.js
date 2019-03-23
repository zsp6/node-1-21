// 项目入口文件
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();

//引入的路由中间的文件
const indexRouter = require('./routes/indexRouter');
const bannerRouter = require('./routes/bannerRouter');
const userRouter = require('./routes/userRouter');

//设置静态文件托管
app.use(express.static(path.resolve(__dirname,'./public')));


//使用中间件 -cookie
app.use(cookieParser());
//使用中间件 post请求的中间件
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//{extended:true}这个是表示nodejs有个queryString 第三方有个qs 使用这个true就是使用第三方的qs

//设置模板文件的路径与使用的什么模板引擎
app.set('views',path.resolve(__dirname,'./views'));
app.set('view engine','ejs');

// 处理跨域的一个中间件
app.use(function(req,res,next){
  res.set('Access-Control-Allow-Origin','*');
  res.set('Access-Control-Allow-Headers','Content-Type');
  next();
})

//路由中间件的使用
app.use('/',indexRouter);
app.use('/banner',bannerRouter);
app.use('/user', userRouter);

app.listen(3000);