<template>
  <view>
    <cu-custom :isBack="true" bgColor="bg-orange-11">
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
            <image mode="widthFix" src="@/static/bg_img/bg.png"></image>

          </view>
        </view>
      </view>
      <view class="margin padding-sm">
        <view class="cu-form-group text-right">
          <view class="title">账号</view>
          <input v-model="form.username" placeholder="学号/工号"></input>
          <text class="cuIcon-myfill text-blue"></text>
        </view>
        <view class="cu-form-group text-right">
          <view class="title">密码</view>
          <input v-model="form.password" placeholder="统一认证密码" type='password'></input>
          <text class="cuIcon-lock text-orange"></text>
        </view>
      </view>
      <view v-if="captcha_path" class="margin padding-sm">
        <view class="cu-form-group text-right">
          <image :src="captcha_path" mode='aspectFit' style="width:72px;height:32px;"></image>
          <input v-model='captcha' placeholder="验证码"></input>
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
import {getSchoolToken} from "@/utils/util";

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
          // if (this.cookies) { //选择性地添加这些数据 Demo
          //   postData['cookies'] = this.cookies
          //   postData['captcha'] = this.captcha
          // }
        getSchoolToken(this.form, this._BasicAuthEncode(), res => {
          uni.setStorageSync("token", res.data.data)
          if (uni.getStorageSync("token")) {
            this.$reqs(":8081/user/info", "GET", {},
                res => {
                  if (res.code == 200)
                    uni.setStorageSync('user_info', res.data)
                  {
                    uni.showToast({
                      title: '登录成功',
                      mask: false,
                      duration: 1500
                    });

                    uni.navigateBack(-1);
                  }
                }, res => {
                  uni.showModal({
                    title: '登录失败',
                    content: res.msg,
                    showCancel: false
                  })
                })

          } else {
            uni.showToast({
              title: '登录失败',
              icon: 'error',
              mask: false,
              duration: 1500
            });
          }
        },fail=>{
          if (fail.statusCode == 401)
            uni.showModal({
              title: '提示',
              content: '用户名或密码不正确，请重新输入',
              showCancel: false,
              confirmText: '好',
            })
          return;
        });


    },
    _BasicAuthEncode() {
      const userpass = Base64.encode(this.form.username + ":" + this.form.password)
      uni.setStorageSync("userpass", userpass)
      return userpass;
    }
  }
}
</script>
