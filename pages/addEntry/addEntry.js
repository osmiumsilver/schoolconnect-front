// AddEntry/js 
var app = getApp();
Page({
  data: { //初始化
    setInterval: '',
    num: 1,
    hideAlert: true,
    loading: false,
    disabled: false,
    isNewAudio: true,
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
    applicantName: "",
    address: "",
    description: "",
    mobile: "",
    status:"1",
  },

  getMobile: function(e) {
    var val = e.detail.value
    this.setData({
      mobile: val,
      hideAlert: true
    });
  },

  getDescription: function(e) {
    var val = e.detail.value
    this.setData({
      description: val,
      hideAlert: true
    });
  },

  getApplicantName: function(e) {
    console.log(e)
    var val = e.detail.value
    this.setData({
      applicantName: val,
      hideAlert: true
    });
  },

  getAddress: function(e) {
    var val = e.detail.value
    console.log(val)
    this.setData({
      address: val,
      hideAlert: true
    });
  },

  handleClick: function(e) {
    if (this.data.applicantName == '') {
      this.setData({
        hideAlert: false,
        message: "请输入申请人姓名"
      })
      return
    }
    if (this.data.mobile == '') {
      this.setData({
        hideAlert: false,
        message: "请输入联系电话"
      })
      return
    }
    if (this.data.address == '') {
      this.setData({
        hideAlert: false,
        message: "输入故障地点"
      })
      return
    }
    if (this.data.description == '') {
      this.setData({
        hideAlert: false,
        message: "请输入问题描述"
      })
      return
    }
    var that = this;
    var imgUrlsArr = that.data.imgUrls;
    var imgUrls = "";

    for (var i = 0; i < imgUrlsArr.length; i++) {     //     'content': 
      imgUrls += "," + imgUrlsArr[i];
    }
    if (imgUrls != '') {
      imgUrls = imgUrls.substr(1)
      that.setData({
        imageUrl: imgUrls
      })
    }

    var times = 0
    that.setData({
      disabled: true
    })
    setInterval(function() {
      times++
      if (times >= 3) {
        that.setData({
          disabled: false
        })
        clearInterval(i)
      }
    }, 1000)
    if (this.tempFilePath && this.data.isNewAudio) {
      //存在音频，上传音频获取到音频地址后提交数据
      console.log(" 执行  uploadsumit")
      that.upload()
    } else {
      console.log(" 执行  submitData")
      //不存音频直接提交数据
      that.submitData()
    }

  },

  submitData: function(e) {
    let that = this
    wx.request({
      url: app.serverUrl + 'api/v1/repair/add',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },    
      data: {
        "address": that.data.address,
        "description": that.data.description,
        "applicantName": that.data.applicantName,
        "mobile": that.data.mobile,
        "imageUrl": that.data.imageUrl,
        "openid": app.globalData.openid,

      },
      success: function(res) {
        console.log(res.data)
        wx.hideLoading()
        if (res.data.status == 200) {
          wx.showToast({
            title: '提交成功',
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

        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'error',
            duration: 1000
          })
        }

      },
      error: function() {
        wx.hideLoading()
        wx.showToast({
          title: '保存失败',
          icon: 'error',
          duration: 1000
        })
      }
    })


  },

  onLoad: function(options) { //监听页面加载
    var userInfo = app.globalData.userInfo 
    this.setData({
      mobile:userInfo.mobile,
      applicantName:userInfo.realName
    })
  },

  addImage: function() {
    var that = this;
    that.setData({
      isuploaderror: 0
    });
    var nowLen = that.data.src.length;
    var remain = 9 - nowLen;
    wx.chooseImage({
      count: remain,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var i = 0; //第几个
        var length = res.tempFilePaths.length;
        that.uploadDIY(res.tempFilePaths, successUp, failUp, i, length);
      }
    });
  },
  

  uploadDIY(filePaths, successUp, failUp, i, length) {
  /* 函数描述：作为上传文件时递归上传的函数体体；
   * 参数描述： 
   * filePaths是文件路径数组
   * successUp是成功上传的个数
   * failUp是上传失败的个数
   * i是文件路径数组的指标
   * length是文件路径数组的长度
   */
    var that = this;
    wx.showToast({
      title: '上传中...',
      icon: 'loading',
      duration: 2000000
    })
    wx.uploadFile({
      url: app.serverUrl + 'api/v1/upload',
      filePath: filePaths[i],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: (res) => {
        successUp++;
        var srcArr = that.data.src;
        srcArr.push(filePaths[i]),
          that.setData({
            src: srcArr
          });
        var data = JSON.parse(res.data);
        console.log(res.data);
        var newpicKeys = that.data.imgUrls;
        newpicKeys.push(data.url);
        that.setData({
          imgUrls: newpicKeys
        });

        var newpicKeysT = that.data.thumbnailsImgs;
        newpicKeysT.push(data.thumbnails);
        that.setData({
          thumbnailsImgs: newpicKeysT
        });

      },
      fail: (res) => {
        that.setData({
          isuploaderror: 1
        });
        failUp++;
      },
      complete: () => {
        i++;
        if (i == length) {
          wx.hideToast();
          var txt = '总共' + successUp + '张上传成功,' + failUp + '张上传失败！';
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1000
          })
          // app.toastShow(0, txt, 2000, 1);
          // wx.hideLoading();

        } else { //递归调用uploadDIY函数
          if (that.data.isuploaderror) {
            // app.toastShow(0, '图片上传失败，请重新选择上传', 2000, 1);
            wx.showToast({
              title: '上传失败，请重新选择上传',
              icon: 'success',
              duration: 1000
            })
          } else {
            this.uploadDIY(filePaths, successUp, failUp, i, length);
          }
        }
      }
    });
  },
  
  deleteImage: function(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    console.log(index);
    var srcArr = this.data.src;
    srcArr.splice(index, 1);
    this.setData({
      src: srcArr
    })
  },
  })