// bindPhoneNum/js
var app = getApp();
Page({
  data: {   //初始化
    mobile: '',
    openid: '',
    realName: '',
    buttonText: '完成认证'
  },

  inputRealName: function (e) {   //监听姓名的输入
    var realName = e.detail.value
    this.setData({
      realName: realName
    })
  },

  inputMobile: function (e) {  //监听手机号码的输入
    var mobile = e.detail.value
    this.setData({
      mobile: mobile
    })
  },

  onLoad: function (options) {   //监听页面加载
       //获取用户信息，若存在则初始化填充页面中的姓名和手机号
       var userInfo = app.globalData.userInfo 
       console.log(userInfo)
       if(userInfo){
         this.setData({
           mobile:userInfo.mobile,
           realName:userInfo.realName
         })
       }
  },

  bindingAdd: function () { // 提交信息到api接口
    var that = this
    wx.request({  //调用后台接口，提交用户id、真实姓名、手机号 
      url: app.serverUrl + "api/v1/user/binding",
      method: "POST",
      data: {
        mobile: that.data.mobile,
        realName: that.data.realName,
        userId: app.globalData.userInfo.id//传递用户id、根据id去绑定真实姓名和手机

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data) //若 res.data.status==200 表示保存成功、更新 app.globalData.userInfo 的信息供其他页面使用
        if(res.data.status==200){
          app.globalData.userInfo.mobile=that.data.mobile
          app.globalData.userInfo.realName=that.data.realName
          app.globalData.userInfo.isBindingMobile=1
          wx.showModal({
            title:'提醒',
            content:'身份认证成功',
            confirmText: '去首页',
            success:function(res){
              if(res.confirm){
                  wx.switchTab({
                    url: '/pages/home/home',
                  })
              }
            }
          })
        }
        else{
          wx.showToast({
            title: '绑定失败，请重试！',
            icon:'none'
          })
        }
      }
    })
  },

})