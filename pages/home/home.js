// home/home.js
var app = getApp();
Page({
  data: { //初始化
    url: app.serverUrl,
    tabs: ['信息中心'],
    current:0,
    repairList:[],
    page:1,
    pageSize:10,
    status:1,
  },

  onLoad: function () { //加载页面
    this.login() //检查登录态
  },


  addButton:function(){
    wx.navigateTo({
      url: '../../pages/addEntry/addEntry',
    })
    },

  getrepairList:function(e){ //获取内容
    let that = this
    wx.request({
      url: app.serverUrl + 'api/v1/repair/list/' + that.data.page + "/" + that.data.pageSize,
      data: {
        openid: app.globalData.openid,
        status:that.data.status
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (that.data.page == 1) {
          that.setData({
            repairList: [],
          })
        }
        var repairList = that.data.repairList
        for (var i = 0; i < res.data.list.length; i++) {
          repairList.push(res.data.list[i])
        }
        that.setData({
          repairList: repairList
        });
        if (res.data.list.length >=that.data.pageSize) {
          that.data.page++;
          that.setData({
            hasNextPage: true,
            loadMoreText: "加载中..."
          })
        } else {
          that.setData({
            hasNextPage: false,
            loadMoreText: "到底了，赶快去添加一些信息吧"
          })
        }
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  onPullDownRefresh: function () { //监听用户下拉动作
    this.setData({
      page: 1
    })
    this.getrepairList()
  },

  onShow: function(){ //界面启动执行
    this.onPullDownRefresh()
  },

  onReachBottom: function () { //上拉触底
    if (this.data.hasNextPage == true) { //页面到底获取更多数据
      this.getrepairList()
    }
  },

  login:function(){ // 检测登录
    var that = this 
    wx.login({
      success: function (res) {
        if (res.code) {

        console.log(res.code)
          wx.request({
            url: app.serverUrl + 'api/v1/wx/login',
            data: {
              code: res.code
            },
            success: function (res) {
              if(typeof(res.data.id)=='undefined'){
                wx.showModal({
                  title: '警告',
                  content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({url: '../auth/auth',})
                    }
                  }
                });
              }
              app.globalData.openid = res.data.openid
              app.globalData.userInfo=res.data
              console.log(res.data.openid)
              that.getrepairList()
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  
  goDetail:function(e){ //点击查看详情
    var repair = JSON.stringify(e.currentTarget.dataset.repair);
    wx.navigateTo({
      url: '../entryDetail/entryDetail?repair=' + repair,
    })
    console.log(repair)
  },

})