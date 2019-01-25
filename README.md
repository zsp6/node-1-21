# 文件上传

1. 选择文件

input type file

2. 上传的操作

form enctype = ''

3. 第三方模块 multer

# multer 的使用步骤

1. 安装

npm install multer --save

2. 在哪个地方要用到文件上传 就引用

const multer = require('multer');

// 指定文件上传之后的一个存放目录
const upload = multer({
  dest: 'c:/tmp'
})

// abcefg 是你上传的字段名 就是 input type=file 的 name 的值
app.post('/upload',upload.single('abcefg'),(req,res) => {
  // 之后在这里会得到 req.file 属性
})

app.post('/uploadMany',upload.array('abcefg',3),(req,res) => {
  //这里就得到 req.files
})