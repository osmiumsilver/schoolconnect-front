// entryDetail/entryDetail.js
var app = getApp();
Page({
  data: { //初始化
    url: app.serverUrl,
    imageArr: [],
    userInfo: {},
    openid: '',
    userid: '',
    nickName: '',
    mobile: '',
    address:'',
    description:'',
    applicantName:'',
    mobile:'',
    type:'',
    userType:'',
    imageUrl:'',
    unid:'',
    ifOwner: false

  },
  imageShow: function(e) {
    var index = e.target.dataset.id;
    var imgArr = this.data.imageArr;
    var tempImgArr = [];
    for (var i = 0; i < imgArr.length; i++) {
      var urlPrex = imgArr[i];
      tempImgArr.push(app.serverUrl + urlPrex);
    }
    console.log(tempImgArr);
    wx.previewImage({
      current: tempImgArr[index], //当前图片地址
      urls: tempImgArr, //所有要预览的图片的地址集合 数组形式
      success: function(res) {

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  
  onLoad: function(options) {  //监听页面加载
    var repair = JSON.parse(options.repair);
    console.log(repair)
    if (options.repair == null) {
      wx.showToast({
        title: '数据异常',
      })
      return;
    }
    if (repair.imageUrl != '' && repair.imageUrl != null) {
      var arr = repair.imageUrl.split(",")
      this.setData({
        imageArr: arr
      })
      console.log(arr)
    }



    this.setData({
      repair: repair,
      userInfo: app.globalData.userInfo,
      openid:repair.openid,
    })
    if(app.globalData.openid == this.data.openid){
      this.setData(
        {
          ifOwner:true
        }
      )
    }

  },


  goDetele: function(e){
    let that = this
    var OwnerData = e.current.dataset
    wx.request({
      url: app.serverUrl + 'api/v1/repair/delete',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },    
      data: {
        "unid": that.data.unid,
      },
      success: function(res) {
        console.log(res.data)
        wx.hideLoading()
        if (res.data.status == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            imgUrls: [],
            imageUrl: '',
            src: [],
            content: "",
            imgUrls: [],
            thumbnailsImgs: [],
            videoUrlShow: "",
            videoUrl: "",
            type: "",
            message: '',
            address: "",
            description: "",
            remarks: "",
            typeId: "1",
            tempFilePath: "",
            isNewAudio: false
          })
          wx.setStorage({
            key: "refreshRepair",
            data: "1"
          });
          setTimeout(function(){
            wx.navigateBack({
              delta: 0,
            })
          },1500)
        wx.startPullDownRefresh({
        })
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'error',
            duration: 1000
          })
        }

      },
      error: function() {
        wx.hideLoading()
        wx.showToast({
          title: '失败',
          icon: 'error',
          duration: 1000
        })
      }
    })
  }
})