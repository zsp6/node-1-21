(function () {
  var User = function(){
    this.btnLock = false; // 登录按钮的锁
    // this.userName = '';
    // this.password = '';
    this.dom = {
      submitBtn: $('#btn'),
      userNameInput: $('input[type=text]'),
      passwordInput: $('input[type=password]')
    }
  }

  User.prototype.bindDOM = function(){
    var that = this;
    this.dom.submitBtn.click(function(){
      // 发送ajax 请求之前, 先判断是否有锁
      if(!that.btnLock){
        // 没锁的时候, 加吧锁 并发送请求
        that.btnLock = true;
        that.handleLogin();
      }
      
    })
  }

  /**
   * 登录方法 调取ajax
   */
  User.prototype.handleLogin = function(){
    var taht = this;
    $.post('/user/login',{
      userName:this.dom.userNameInput.val(),
      password: this.dom.passwordInput.val()
    },function(res) {
      if(res.code === 0){
        //登录成功
        layer.msg('登录成功');
        console.log(res.data);

        setTimeout(function(){
          // 跳转到首页
          window.location.href = '/';
        },1000)
        
      } else{
        //登录失败
        layer.msg(res.msg);
      }

      // 记得解锁 
      that.btnLock = false;
    })
  }


  // 最后
  new User().bindDOM();
})()