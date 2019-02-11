// 这个文件 是用来做用户验证的一个中间件函数

module.exports = function(req,res,next) {
  // 得到 nickName
  let nickName = req.cookies.nickName;
  if(nickName){
    // 存在 想去哪去哪
    next();
  }else{
    res.redirect('/login.html');
  }
}