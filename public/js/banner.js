(function () {
  /**
   * 定义这个文件操作的构造函数
   */
  var Banner = function () {
    //定义这个页面需要的一些数据
    this.pageNum = 1;//当前的页码数
    this.pageSize = 2;//每页显示的条数
    this.totalPage = 0;//总页数
    this.bannerList = [];//banner数据

    //需要用到的 dom 对象 性能优化 - dom 缓存
    this.dom = {
      table: $('#banner-table tbody'),// table的tbody
      pagination: $('#pagination'),// 分页的ul
      nameInput: $('#inputEmail3'),// 名字的输入框
      urlInput: $('#inputPassword3'),// 图片URL的输入框
      addModal: $('#addModal'),//新增的模态框
      submitAdd: $('#bannerAdd'),//确认新增的按钮
    }
  }
  // 新增的方法
  Banner.prototype.add = function () {
    var that = this;
    console.log(1);
    $.post('/banner/add', {
      bannerName: this.dom.nameInput.val(),
      bannerUrl: this.dom.urlInput.val()
    }, function (res) {
      if (res.code === 0) {
        // 成功
        layer.msg('添加成功');
        
        //请求一下数据
        that.search();//也可以用localtion.href,不过比较low,会重新刷新整个页面
      } else {
        // PS:很多时候,真正的错误信息不回给到用户去看
        layer.msg('网络有误,请稍后重试');
      }

      //手动调用关闭的方法
      that.dom.addModal.modal('hide');
      //手动清空数据框的内容
      that.dom.nameInput.val('');
      that.dom.urlInput.val('');
    });
  }
  //查询的方法
  Banner.prototype.search = function () {
    var that = this;
    $.get('/banner/search', {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }, function (result) {
      if (result.code === 0) {
        layer.msg('查询成功');

        // 将 result.data 写入到 实例的 bannerList
        that.bannerList = result.data;
        // 将 result.totalPage 写入到 实例的 totalPage
        that.totalPage = result.totalPage;

        // 调用渲染 table
        that.renderTable();
        // 调用渲染 分页
        that.renderPage();

      } else {
        console.log(result.msg);
        layer.msg('网络异常,请稍后重试');
      }
    })
  }

  /**
   * 渲染table
   */
  Banner.prototype.renderTable = function(){
    this.dom.table.html('');
    for (var i = 0; i < this.bannerList.length; i++) {
      var item = this.bannerList[i];
      this.dom.table.append(
        `
          <tr>
            <td>${item._id}</td>
            <td>${item.name}</td>
            <td>
              <img  src="${item.imgUrl}" alt="" class="banner-img">
            </td>
            <td>
              <a href="javascript:;" class="delete" data-id="${item._id}">删除</a>
              <a href="javascript:;" class="update" data-id="${item._id}">修改</a>
            </td>
          </tr>
        `
      )
    }
  }
  /**
   * 渲染分页
   */
  Banner.prototype.renderPage = function(){
    var prevClassName = this.pageNum === 1 ? 'disabled' : '';
    var nextClassName = this.pageNum === this.totalPage ? 'disabled' : '';
    // 0 清空
    this.dom.pagination.html('');
    //添加上一页
    this.dom.pagination.append(
      `
      <li data-num="${this.pageNum - 1}" class="${prevClassName}">
        <a href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      `
    )
    //根据 this.totalPage 循环渲染多少个 li
    for (var i = 1; i <= this.totalPage; i++) {
      var className = this.pageNum === i ? 'active' : '';
      this.dom.pagination.append(
        `
        <li class="${className}" data-num="${i}"><a href="#">${i}</a></li>
        `
      )
    }
    //添加下一页
    this.dom.pagination.append(
      `
      <li data-num="${this.pageNum + 1}" class="${nextClassName}">
        <a href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
      `
    )
  }

  // 将所有 dom 事件的操作放在这里
  Banner.prototype.bindDOM = function(){
    var that = this;
    //点击确认新增按钮需要调用 add
    this.dom.submitAdd.click(function(){
      that.add();
    })

    //分页按钮点击事件
    this.dom.pagination.on('click','li',function(){
      // 1. 得到页码
      //console.log($(this).attr('data-num')); === console.log($(this).data('num'))
      // attr 获取属性, 如果是自定义属性并且用data-开头,我们可以更简单的使用 data
      var num = parseInt($(this).data('num'));

      // 1.1 判断是否点击的是相同页, 或者 < 1 或者 > 总页数
      if (that.pageNum === num || num < 1 || num > that.totalPage){
        return;
      }

      // 2. 设置给 this.pageNum
      that.pageNum = num;

      // 3. 再次调用一下 this.search
      that.search();

    })
    
    //删除按钮点击事件
    this.dom.table.on('click','.delete',function(){
      
      // 1. 得到id
      var id = $(this).data('id');
      // 2. 二次确认框
      layer.confirm('确认删除么',function(){
        $.post('./banner/delete',{
          id
        },function(res){
          if(res.code == 0){
            // 成功
            that.search();
            layer.msg('删除成功');
          }else{
            layer.msg('网络有误,请稍后重试');
          }
        })
      },function(){
        console.log('取消');
      })
    })
  }


  //最后
  $(function(){
    var banner = new Banner();
    banner.bindDOM();
    banner.search(); // 默认渲染第一页
  })

})()













// $(function () {
//   // alert(1);

//   var pageNum = 1;
//   var pageSize = 2;

//   //默认调用一次 search
//   search(pageNum, pageSize);

//   $('#bannerAdd').click(function () {

//     $.post('/banner/add', {
//       bannerName: $('#inputEmail3').val(),
//       bannerUrl: $('#inputPassword3').val()
//     }, function (res) {
//       console.log(res);
//       if (res.code === 0) {
//         layer.msg('添加成功');
//         // 成功
//       } else {
//         // PS:很多时候,真正的错误信息不回给到用户去看
//         console.log(res.msg);
//         layer.msg('网络有误,请稍后重试');
//       }

//       //手动调用关闭的方法
//       $('#myModal').modal('hide');
//       //手动清空数据框的内容
//       $('#inputEmail3').val('');
//       $('#inputPassword3').val('');
//     });
//     // alert('发送一个ajax请求');

//   })

//   /**
//    * 查询banner数据的方法
//    * @param {Number} pageNum 当前的页数
//    * @param {Number} pageSize 每页显示的条数
//    */
//   function search(pageNum, pageSize) {
//     $.get('/banner/search', {
//       pageNum: pageNum,
//       pageSize: pageSize
//     }, function (result) {
//       if (result.code === 0) {
//         layer.msg('查询成功');

//         for (var i = 0; i < result.data.length; i++) {
//           var item = result.data[i];
//           $('#banner-table tbody').append(
//             `
//               <tr>
//                 <td>${item._id}</td>
//                 <td>${item.name}</td>
//                 <td>
//                   <img  src="${item.imgUrl}" alt="" class="banner-img">
//                 </td>
//                 <td>
//                   <a href="javascript:;">删除</a>
//                   <a href="javascript:;">修改</a>
//                 </td>
//               </tr>
//             `
//           )
//         }

//       } else {
//         console.log(result.msg);
//         layer.msg('网络异常,请稍后重试');
//       }
//     })
//   }

// })