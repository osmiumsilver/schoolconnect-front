<template>
  <view class="container">
    <cu-custom :isBack="true" bgColor="bg-blue-1">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        申请报修
      </view>
    </cu-custom>
    <!-- 通告栏 -->
    <view class="header-notice-bar">
      <u-notice-bar scrollable show-icon text="请同学们如实填写信息,方便维修人员对应进行维修。谢谢！"/>
    </view>
    <view class="main-form-list">
      <view class="apply-item">
        <text>申报人：</text>
        <input v-model="formData.initiator" class="in-1" disabled="true"></input>
      </view>

      <view class="apply-item">
        <text>申报地点：</text>

        <input v-model="formData.location" class="in-3" maxlength="6" type="text" placeholder="请输入"></input>
      </view>

      <view class="apply-item">
        <text>联系电话：</text>
        <input v-model="formData.phone" class="in-4" type="number"></input>
      </view>

      <view class="apply-item apply-desc">
        <text>申报描述：</text>
        <textarea v-model="formData.description" class="in-5" maxlength="50"
                  placeholder="请说明要维修的情况" placeholder-style="color:#ccc;font-size:14px;"
                  type="string"></textarea>
      </view>
    </view>

    <view class="radio-list">
      <radio-group style="display: flex !important;" @change="changeLevel">
        <block v-for="(item, index) in levelList" :key="index">
          <label class="radio-list__item">
            <view>{{ item.name }}</view>
            <view>
              <radio :checked="index === (formData.level - 1)" :value="item.value"/>
            </view>
          </label>
        </block>
      </radio-group>
    </view>

    <view class="apply-btn">
      <button type="primary" @click="submitApplyData">提交</button>
    </view>
    <view style="height: 160px;"></view>
  </view>
</template>

<script>
import {
  moment
} from '@/utils/moment.js'

export default {
  data() {
    return {
      levelList: [{
        value: 1,
        name: '普通维修',
        icon: 'https://mp-e93e0c5f-05cf-4713-9d34-a6449768f5b0.cdn.bspapp.com/cloudstorage/f5246692-e2fb-4b90-bfe7-4c3dd058d4b3.png'
      }, {
        value: 2,
        name: '紧急维修',
        icon: 'https://mp-e93e0c5f-05cf-4713-9d34-a6449768f5b0.cdn.bspapp.com/cloudstorage/a7e07473-e6d2-4146-b549-bf8846d5e4c3.png'
      }],
      formData: {
        initiator: uni.getStorageSync("user_info").employeeId,
        description: '',
        location: '',
        level: 1, // 1普通维修、2紧急维修
        phone: uni.getStorageSync("user_info").phone,
        status: 0
      }
    };
  },
  onLoad(options) {
    if (options.detail) {
      const data = JSON.parse(options.detail)
      this.formData.name = data.name
      this.formData.dorm = data.dorm
      this.formData.floor = data.floor
      this.formData.phone = data.phone
    }
  },
  methods: {
    // 选择维修等级
    changeLevel(evt) {
      for (let i = 0; i < this.levelList.length; i++) {
        if (this.levelList[i].value === Number(evt.detail.value)) {
          this.formData.level = this.levelList[i].value
          this.formData.levelIcon = this.levelList[i].icon
          break
        }
      }
    },
    // 提交申报
    submitApplyData() {
      if (this.validateForm()) {
        // 订阅报修反馈通知
        // #ifdef MP-WEIXIN
        wx.requestSubscribeMessage({
          tmplIds: ['xdcaBq1COut3fsO_YvmrvQKYrgDrKmMaR-EwbmvH-VU'],
        })
        // #endif
        uni.showLoading({
          title: '正在提交...',
          mask: true
        })
        this.$reqs(":8081/repair", "POST", [this.formData], res => {
          console.log(res);
          if (res.data == true) {
            wx.showToast({
              title: '提交成功',
              duration: 1000
            })
            setTimeout(() => {
              uni.reLaunch({
                url: '../../repair/repair?id=success',
              })
            }, 1200)
          } else
            wx.showToast({
              title: '提交失败',
              icon: 'error',
              duration: 1000
            })
        })
      }
    },
    // 申报表单验证
    validateForm() {
      let cp = /[1][3,4,5,7,8][0-9]{9}$/;
      if (this.formData.initiator === '' || !this.formData.initiator) {
        wx.showToast({
          title: '请填写申报人',
          icon: 'error',
          duration: 500
        })
        return false;
      }
      if (this.formData.phone === '' || !this.formData.phone) {
        wx.showToast({
          title: '请填写手机号码',
          icon: 'error',
          duration: 500
        })
        return false;
      }
      if (!cp.test(this.formData.phone)) {
        wx.showToast({
          title: '请填写正确手机号',
          icon: 'error',
          duration: 500
        })
        return false;
      }
      if (this.formData.description === '' || !this.formData.description) {
        wx.showToast({
          title: '请说明情况',
          icon: 'error',
          duration: 500
        })
        return false;
      }
      return true;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/static/publish.scss';
</style>
