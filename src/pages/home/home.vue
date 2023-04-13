<!--suppress ALL -->
<template>
  <view>
    <!--占位橙色顶部-->
    <view class="cu-carousel-bg shadow bg-orange-1"></view>

    <!-- 轮播 -->
    <view style="margin: 100rpx 20rpx 80rpx 20rpx"><u-swiper :list="swiperList"></u-swiper></view>

    <!-- 功能列表大Div-->
    <view class="margin-left-sm margin-right-sm margin-bottom-sm text-df">

      <!-- 上部分大Div  成绩、学籍管理、课程查询、活动区域   从左到右进入 flex排版 -->
      <view class="flex animation-slide-left margin-top-xs">
        <!-- 学习方块小div -->
        <view class="margin-xs">
          <view class='padding-sm bg-blue-1 nav-li shadow' style='height: 200rpx;width: 200rpx;'>
            <view class="nav-title">学业</view>
            <view class="nav-name">School</view>
            <image class="nav-bg" src="@/static/bg_img/class_study.png"></image>
          </view>
        </view>


        <!-- 四个功能大div -->
        <view class="grid">
          <button
              class="margin-xs cu-btn bg-blueLight blue-1 justify-between border12 margin-bottom-sm shadow"
              style="height:80rpx;" @click="gradeServiceNavigate()">
            <image class='round fun-icon' src='@/static/fun_ico/grade.png'></image>
            成绩绩点
          </button>
          <button v-if="role==3"
                  class="margin-xs cu-btn bg-blueLight blue-1 justify-between border12 margin-bottom-sm shadow"
                  style="height:80rpx;" @click="campusServiceNavigate('course',false)">
            <image class='round fun-icon' src='@/static/fun_ico/exam.png'></image>
            课程查询
          </button>
          <button
              class="margin-xs cu-btn bg-blueLight blue-1 justify-between border12 margin-bottom-sm shadow"
              style="height:80rpx;" @click="personalInfoServiceNavigate()">
            <image class='round fun-icon' src='@/static/fun_ico/study.png'></image>
            学籍管理
          </button>
          <button v-if="role==0"
                  class="margin-xs cu-btn bg-blueLight blue-1 justify-between border12 margin-bottom-sm shadow"
                  style="height:80rpx;" @click="goToAdminService">
            <image class='round fun-icon' src='@/static/fun_ico/study.png'></image>
            学籍审核
          </button>
          <button
              class="margin-xs cu-btn bg-blueLight blue-1 justify-between border12 margin-bottom-sm shadow"
              style="height:80rpx;" @click="campusServiceNavigate('campaign',false)">
            <image class='round fun-icon' src='@/static/fun_ico/library.png'></image>
            活动区域
          </button>
          <button
              class="margin-xs cu-btn bg-blueLight blue-1 justify-between border12 margin-bottom-sm shadow"
              style="height:80rpx;" @click="campusServiceNavigate('messageboard',false)">
            <image class='round fun-icon' src='@/static/fun_ico/electric.png'></image>
            公告区域
          </button>
        </view>

      </view>


      <!-- 下方大Div -->
      <view class="flex animation-slide-right margin-top-xs">
        <!-- 生活方块小div -->
        <view class="margin-xs">
          <view class='padding-sm bg-blue-1 nav-li shadow' style='height: 200rpx;width: 200rpx;'>
            <view class="nav-title">生活</view>
            <view class="nav-name">Life</view>
            <image class="nav-bg" src="@/static/bg_img/class_live.png"></image>
          </view>
        </view>


        <view class="grid">
          <button
              class="margin-xs cu-btn bg-blueLight blue-1 justify-between border12 margin-bottom-sm shadow"
              style="height:80rpx;" @click="expressEnquiry">
            <image class='round fun-icon' src='@/static/fun_ico/qc.png'></image>
            快递查询
          </button>
          <button
              class="margin-xs cu-btn bg-blueLight blue-1 justify-between border12 margin-bottom-sm shadow"
              style="height:80rpx;" @click="gotoPrint()">
            <image class='round fun-icon' src='@/static/fun_ico/apply.png'></image>
            打印服务
          </button>
          <button
              class="margin-xs cu-btn bg-blueLight blue-1 justify-between border12 margin-bottom-sm shadow"
              style="height:80rpx;" @click="campusServiceNavigate('repair',false)">
            <image class='round fun-icon' src='@/static/fun_ico/found.png'></image>
            报修区域
          </button>
          <button
              class="margin-xs cu-btn bg-blueLight blue-1 justify-between border12 margin-bottom-sm shadow"
              style="height:80rpx;"
              @click="goToDelivery">


            <image class='round fun-icon' src='@/static/fun_ico/more.png'></image>
            外卖送货
          </button>
        </view>

      </view>
      <view class="cu-tabbar-height"></view>
    </view>
  </view>

</template>

<script>
import {
  rootUrl, wechatLogin
} from "@/utils/util.js"

export default {
  name: "home",
  data() {
    return {
      StatusBar: this.StatusBar,
      CustomBar: this.CustomBar,
      swiperList: [],
      yearArray: getApp().globalData.yearArray,
      role: uni.getStorageSync("user_info").role
    }
  },
  created() {
    this.init()
  },
  methods: {
    init: function () { // 获取轮播图信息
      this.role = uni.getStorageSync("user_info").role
      if (!this.swiperList.length) {
        uni.request({
          url: rootUrl + ':8081/ui/carousel',
          method: 'GET',
          success: (res) => {
            if (res.statusCode == 200)
              this.swiperList = res.data.data
          }
        })
      }
    },
    goToAdminService() {
      uni.navigateTo({url: '/pages/home/info/info_review'})
    },
    personalInfoServiceNavigate() {
      this.loginCheck(res => {
        if (res != 1) {
          switch (this.role) {
            case(0):
              uni.navigateTo({
                url: "/pages/home/info/info_lookup",
                fail: res => {
                  console.log(res)
                }
              })
              return;
            case(1):
              uni.navigateTo({
                url: "/pages/home/info/info_review",
                fail: res => {
                  console.log(res)
                }
              })
              return;
            case(2):
              uni.showModal({
                title: '提示',
                content: '您没有权限查看学生学籍信息！',
                showCancel: false,
                cancelText: '好',
                confirmText: '好',
              });
              return;
            case(3):
              uni.navigateTo({
                url: "/pages/home/info/info",
                fail: res => {
                  console.log(res)
                }
              })
              return;

          }

        }

      })


    },

    gradeServiceNavigate() {
      this.loginCheck(res => {
        if (res != 1) {
          switch (this.role) {
            case(0):
              uni.navigateTo({
                url: "/pages/home/grade/grade_lookup",
                fail: res => {
                  console.log(res)
                }
              })
              return;
            case(1):
              uni.navigateTo({
                url: "/pages/home/grade/grade_review/grade_review",
                fail: res => {
                  console.log(res)
                }
              })
              return;
            case(2):
              uni.navigateTo({
                url: "/pages/home/grade/grade_teacher/grade_teacher",
                fail: res => {
                  console.log(res)
                }
              })
              return;
            case(3):
              uni.navigateTo({
                url: "/pages/home/grade/grade",
                fail: res => {
                  console.log(res)
                }
              })
              return;
            case(4):
             this.$noaccess();

          }
        }
      })

    },
    campusServiceNavigate(nav, multipleRoles) {
      this.loginCheck(res => {
        if (res != 1) {
          if (multipleRoles == true) {
            switch (this.role) {
              case (3):

                uni.navigateTo({
                  url: "/pages/home/" + nav + "/" + nav,
                  fail: res => {
                    console.log(res)
                  }
                })
                return
              case(0):
              case(1):
              case(2):
                uni.navigateTo({
                  url: "/pages/home/" + nav + "/manage/manage",
                  fail: err => {
                    console.log(err)
                  }
                })
                return

            }

          }
          uni.navigateTo({
            url: "/pages/home/" + nav + "/" + nav,
            fail: res => {
              console.log(res)
            }
          })
        }
      })


    },
    loginCheck(callback) {
      if (!uni.getStorageSync('wx_info')) {
        uni.showModal({
          content: '您还未登录，点击确定进行登录',
          showCancel: false,
          complete: (res) => {
            if (res.confirm) {
              uni.getUserProfile({
                desc: '校园服务台',
                success: (res) => {
                  wechatLogin();
                  uni.setStorageSync("wx_info", res.userInfo)

                  console.log("UserProfile Res : ", res)
                },
                fail: (err) => {
                  console.log("获取UserProfile错误 ： ", err)
                }
              });
            }
          }
        })
        return callback(1)
      }
      if (!uni.getStorageSync('user_info')) {
        uni.showModal({
          content: '您不是本校人员，如需使用请前往个人页面绑定本校账户！',
          showCancel: false,
          confirmText: '好',
        })
        return callback(1)
      }
      return callback(0)
    },
    publicServiceNavigate(nav) {
      this.loginCheck(res => {
        if (res != 1) {
          uni.navigateTo({
            url: "/pages/home/" + nav + "/" + nav,
            fail: res => {
              console.log(res)
            }
          })
        }
      })
    },


    comingSoon() {
      uni.showModal({
        title: '提示',
        content: '敬请期待~~',
        showCancel: false,
      })
    },
    goToDelivery(){
        uni.navigateToMiniProgram({
            appId:'wx7e42bbce04b9f46b'
            }
        )
    }
    ,
    gotoPrint() {
      uni.navigateToMiniProgram({
        appId: 'wx5b6393cd6fe4911d',
      })
    },
    expressEnquiry() { //快递
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: "/pages/home/delivery_enquiry/delivery_enquiry",
        fail: res => {
          console.log(res)
        }
      })

      // #endif

      // #ifdef MP-QQ
      wx.showModal({
        title: '提示',
        content: '请前往微信端使用~~',
        showCancel: false,
      })
      // #endif
    },
  },
  computed: {
    style() {
      let CustomBar = this.CustomBar;
      let style = `padding-top:${CustomBar}px;`;
      return style
    }
  },
}
</script>

<style lang="scss">
.cu-carousel-bg {
  top: 0;
  width: 100vw;
  height: 250rpx;
  // background-color: #1798D9;
}

.border12 {
  border-radius: 12rpx;
}

.nav-li {
  border-radius: 12rpx;
  position: relative;
  z-index: 1;

  &:after {
    content: "";
    position: absolute;
    z-index: -1;
    background-color: bisque;
    width: 95%;
    height: 95%;

    right: 0;
    bottom: 0;
    border-radius: 10rpx;
    opacity: 0.2;
    /* transform: scale(0.9, 0.9); */
  }

  .nav-title {
    position: absolute;
    top: 20rpx;
    font-size: 36rpx;
    z-index: 1;
  }

  .nav-name {
    font-size: 28rpx;
    text-transform: Capitalize;
    position: absolute;
    bottom: 40rpx;
    z-index: 1;
  }

  .nav-bg {
    position: absolute;
    right: 10rpx;
    top: 30rpx;
    width: 140rpx;
    height: 140rpx;
    z-index: -1;
  }
}

.fun-icon {
  width: 40rpx;
  height: 40rpx;
}

.grid {
  flex-shrink: 1;
}
</style>
