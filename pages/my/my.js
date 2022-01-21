//my.js
var util = require('../../utils/util.js')
var app = getApp();
Page({
  data: { //初始化
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    name: '',
    userType:'1',
    
  },

  submitInfo: function(e) {
    console.log(e.detail.formId);
    wx.request({
      url: app.serverUrl + '/wx/login/send',
      data: {
        formId: e.detail.formId
      }
    })
  },

  login: function() {   // 用户登录示例
    if (this.data.logged) return

    util.showBusy('正在登录')
    var that = this

    // 调用登录接口
    wx.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功')
          that.setData({
            userInfo: result,
            logged: true
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          wx.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')
              that.setData({
                userInfo: result.data.data,
                logged: true
              })
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },

  onShow: function() {
    console.log(app.globalData.openid)
    var that = this
    wx.getStorage({
      key: 'refreshMe',
      success: function(res) {
        console.log(res.data);
        var data = res.data;
        if (data) {
          if (data == 1) {
            wx.setStorage({
              key: "refreshMe",
              data: "0"
            });
            that.onLoad();
          }
        }
      }
    })
  },

  auth:function(){
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面
      url: "/pages/bindPhoneNum/bindPhoneNum?openid=" + app.globalData.openid + "&unionid=" + app.globalData.unionid
    })
  }
})