<template>
  <view>
    <view class="top-container" @click='loginFromBanner'>
      <image src="../../static/bg_img/bg.png" mode="scaleToFill" class="top-bg"></image>
      <view class="info-container animation-slide-left" :style="style">
        <image :src="wxInfo?wxInfo.avatarUrl:'../../static/logo.png'" class="wxavatar round solids"
               mode="scaleToFill"></image>
        <view class="info">
          <view>
            <text class="text-lg">{{ wxInfo ? wxInfo.nickName : '欢迎使用校园服务台！请登录！' }}</text>
            <!-- <text class="margin-left-sm">{{ userInfo?userInfo.username:'来宾模式' }}</text> -->
          </view>
          <view class="margin-top-xs">
            {{ userInfo ? userInfo.employeeId : '' }}
          </view>
        </view>
      </view>
      <image
          src="https://cdn.nlark.com/yuque/0/2019/gif/280373/1570670848649-assets/web-upload/3dbaa72a-062b-470f-9b9d-058ff8f85ab8.gif"
          mode="scaleToFill" class="gif-wave"></image>
    </view>
    <view class="margin-top-sm">
      <view class="cu-list menu card-menu sm-border">
        <view class="cu-item">
          <view class="content">
            <text class="cuIcon-myfill orange-1" style='font-size:20px;'></text>
            <text class="text-black">班级</text>
          </view>
          <view class="action">
            <text class="text-grey text-sm">{{ userInfo ? userInfo.classNo : '来宾模式' }}</text>
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="cuIcon-emojifill orange-1" style='font-size:20px;'></text>
            <text class="text-black">姓名</text>
          </view>
          <view class="action">
            <text class="text-grey text-sm">{{ userInfo ? userInfo.name : '来宾模式' }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="margin-top-sm">
      <view class="cu-list menu card-menu sm-border">
        <view class="cu-item arrow" @click='about'>
          <view class="content">
            <text class="cuIcon-infofill orange-1" style='font-size:20px;'></text>
            <text class="text-black">关于/反馈</text>
          </view>
        </view>
        <!--                <view class="cu-item arrow" @click='update'>
                    <view class="content">
                        <text class="cuIcon-formfill orange-1" style='font-size:20px;'></text>
                        <text class="text-black">更新日志</text>
                    </view>
                </view> -->
        <view class="cu-item arrow" @click='switchAccount'>
          <view class="content">
            <text class="cuIcon-settingsfill orange-1" style='font-size:20px;'></text>
            <text class="text-black">登录/切换账号</text>
          </view>
        </view>
      </view>
    </view>
    <view class="text-center text-grey padding-sm text-sm margin-top-sm">
      <view> © {{ year }} 校园服务台</view>
    </view>
  </view>
</template>

<script>
import {wechatLogin} from "@/utils/util";

export default {
  name: "my",
  data() {
    return {
      userInfo: {},
      wxInfo: {},
      StatusBar: this.StatusBar,
      CustomBar: this.CustomBar,
      year: new Date().getFullYear()
    }
  },
  computed: {
    style() {
      let StatusBar = this.StatusBar;
      let CustomBar = this.CustomBar;
      return `padding-top:${CustomBar}px;`
    }
  },
  created() {
    // this.init()
  },
  methods: {
    init: function () {
      this.userInfo = uni.getStorageSync("user_info")
      this.wxInfo = uni.getStorageSync("wx_info")
    },
    about() {
      uni.navigateTo({
        url: "../my/about/about",
        fail: res => {
          console.log(res)
        }
      })
    },
    // update() {
    //     uni.navigateTo({
    //         url: "../mine/update/update",
    //         fail: res => {
    //             console.log(res)
    //         }
    //     })
    // },
    question: function () {

    },

    loginFromBanner() {
      if (!uni.getStorageSync('openid')) {
        this.gotoLogin();
      }
    },
    gotoLogin() {
      uni.navigateTo({
        url: '/pages/bind/bind',
        fail: (err) => {
          console.log(err)
        },
        complete: () => {
        }
      });
    },
    switchAccount() {
      if (!uni.getStorageSync("wx_info")) {
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
                },
                fail: (err) => {
                  console.log("获取UserProfile错误 ： ", err)
                }
              });
            }
          }
        })
        return
      }

      if (!uni.getStorageSync('user_info')) {
        this.gotoLogin();
      } else {
        uni.showModal({
          content: "是否切换账号？",
          success: res => {
            if (res.confirm) {
              uni.removeStorageSync("user_info")
              getApp().globalData.token = '';

              // uni.clearStorageSync()
              uni.navigateTo({
                url: "/pages/index/index"
              })
            }
          }
        })
      }
    },
  }
}
</script>

<style lang="scss">
.top-container {
  height: 350rpx;
  width: 100vw;
  position: relative;

  .top-bg {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    // mix-blend-mode: screen;
    height: 350rpx;
  }

  .info-container {
    width: 100vw;
    height: 350rpx;
    color: #fff;
    margin-left: 50rpx;
    margin-right: 50rpx;
    display: flex;
    flex-direction: row;
    // justify-content: center;
    align-items: center;

    z-index: 10;

    // 头像部分
    .wxavatar {
      width: 150rpx;
      height: 150rpx;
      // margin-left: 100rpx;
      z-index: 10;
      object-fit: cover;
      flex-shrink: 0;
    }

    .info {
      margin-left: 50rpx;
      white-space: pre-wrap;
    }
  }

  // 波浪
  .gif-wave {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 99;
    mix-blend-mode: screen;
    height: 100rpx;
  }

}
</style>
