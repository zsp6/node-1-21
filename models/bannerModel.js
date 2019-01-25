const db = require('../config/db');

const schema = new db.Schema({
  name: String,
  imgUrl: String
});

module.exports = db.model('banner',schema);
//这个banner 取名要为单数 然后数据库里面出现的表名就是banners