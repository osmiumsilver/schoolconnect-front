<template>
  <view>
    <cu-custom bgColor="bg-blue-11" :isBack="true">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        登录
      </view>
    </cu-custom>
    <view class="margin padding-sm bg-white" style="border-radius:20rpx;">
      <view class="cu-card case no-card">
        <view class="cu-item shadow">
          <view class="image" style='padding:30rpx 30rpx;'>
            <image src="../../static/bg_img/bg.png" mode="widthFix"></image>

          </view>
        </view>
      </view>
      <view class="margin padding-sm">
        <view class="cu-form-group text-right">
          <view class="title">账号</view>
          <input placeholder="学号/工号" v-model="form.username"></input>
          <text class="cuIcon-myfill text-blue"></text>
        </view>
        <view class="cu-form-group text-right">
          <view class="title">密码</view>
          <input placeholder="统一认证密码" type='password' v-model="form.password"></input>
          <text class="cuIcon-emojifill text-orange"></text>
        </view>
      </view>
      <view v-if="captcha_path" class="margin padding-sm">
        <view class="cu-form-group text-right">
          <image :src="captcha_path" style="width:72px;height:32px;" mode='aspectFit'></image>
          <input placeholder="验证码" v-model='captcha'></input>
        </view>
      </view>
      <view class="padding flex flex-direction">
        <button class="cu-btn bg-orange-1 round shadow-blur lg" open-type="getUserInfo"
                @click="login">统一认证登录
        </button>
      </view>
      <view class="margin padding solids" style="border-radius:20rpx;">
        <view>
          账号为学号，
          <text class="text-red">密码为统一身份认证密码</text>
          ，初始密码为身份证后六位。
        </view>

      </view>
    </view>
  </view>
</template>

<script>
import Base64 from 'base-64';
import {getSchoolToken} from "../../utils/util";
// var Base64 = require('js-base64').Base64; //必须这么导入不然不行啊我不
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      cookies: "",
      captcha_path: "",
      captcha: '',
      showDialog: false,
      res: {}
    }
  },
  methods: {
    login() {
      if (!this.form.username || !this.form.password) {
        uni.showModal({
          content: "请输入账号或密码！",
          showCancel: false
        })
        return
      }
      let postData = this.form //Form放入Postdata

      // if (this.cookies) { //选择性地添加这些数据 Demo
      //   postData['cookies'] = this.cookies
      //   postData['captcha'] = this.captcha
      // }
      getSchoolToken(postData, this._BasicAuthEncode(), res => {
        if (res.code === "1206")
          uni.showModal({
            title: '提示',
            content: '用户名或密码不正确，请重新输入',
            showCancel: false,
            cancelText: '',
            confirmText: '好',
          })
        return;
      });

      let getData = {};
      getData['userId'] = this.form.username;
      this.$reqs(":8081/user/info", "GET", getData, res => {
        if (res.code != 200) {
          // if (res.data['cookies']) {
          //   this.captcha_path = rootUrl + 'media/captcha/' + this.form
          //           .username +
          //       '.png?v=' + new Date().getTime()
          //   this.cookies = res.data['cookie']
          // }
          uni.showModal({
            content: res.msg,
            showCancel: false
          })
        }
        uni.setStorageSync('user_info', res.data)
        uni.navigateBack(-1)


      })


    },
    _BasicAuthEncode() {
      const userpass = Base64.encode(this.form.username + ":" + this.form.password)
      uni.setStorageSync("userpass", userpass)
      return userpass;
    }
  }
}
</script>

<style>

</style>
