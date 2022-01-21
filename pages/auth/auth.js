// auth/auth.js
var app = getApp();
Page({
  data: { //初始化
  },
  getUserInfo: function (e) { //获取用户信息
    app.globalData.userInfo = e.detail.userInfo;
    wx.request({
      url: app.serverUrl + 'api/v1/wx/saveUserInfo',
      data: {
        openid: app.globalData.openid,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.statusCode==200){
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '授权失败，请重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  }
})