$(function () {
  // alert(1);

  var pageNum = 1;
  var pageSize = 2;

  //默认调用一次 search
  search(pageNum, pageSize);

  $('#bannerAdd').click(function () {

    $.post('/banner/add', {
      bannerName: $('#inputEmail3').val(),
      bannerUrl: $('#inputPassword3').val()
    }, function (res) {
      console.log(res);
      if (res.code === 0) {
        layer.msg('添加成功');
        // 成功
      } else {
        // PS:很多时候,真正的错误信息不回给到用户去看
        console.log(res.msg);
        layer.msg('网络有误,请稍后重试');
      }

      //手动调用关闭的方法
      $('#myModal').modal('hide');
      //手动清空数据框的内容
      $('#inputEmail3').val('');
      $('#inputPassword3').val('');
    });
    // alert('发送一个ajax请求');

  })

  /**
   * 查询banner数据的方法
   * @param {Number} pageNum 当前的页数
   * @param {Number} pageSize 每页显示的条数
   */
  function search(pageNum, pageSize) {
    $.get('/banner/search', {
      pageNum: pageNum,
      pageSize: pageSize
    }, function (result) {
      if (result.code === 0) {
        layer.msg('查询成功');

        for (var i = 0; i < result.data.length; i++) {
          var item = result.data[i];
          $('#banner-table tbody').append(
            `
              <tr>
                <td>${item._id}</td>
                <td>${item.name}</td>
                <td>
                  <img  src="${item.imgUrl}" alt="" class="banner-img">
                </td>
                <td>
                  <a href="javascript:;">删除</a>
                  <a href="javascript:;">修改</a>
                </td>
              </tr>
            `
          )
        }

      } else {
        console.log(result.msg);
        layer.msg('网络异常,请稍后重试');
      }
    })
  }

})