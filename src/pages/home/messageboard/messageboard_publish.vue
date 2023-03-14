<template>

  <view class="container">
    <cu-custom bgColor="bg-orange-1" :isBack="true">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        发布公告
      </view>
    </cu-custom>
    <view class="grid">
      <input hidden name="id" v-model="entry.id"></input>
      <view style="display:flex;justify-content: space-between;">
        <view style="padding: 30rpx 30rpx 10rpx 34rpx;">公告内容：</view>

      </view>
      <i-input id="content" v-model="entry.content" type="textarea2" myStyle="height:500rpx;border: 1px solid #eee;padding: 10rpx;" title placeholder="请输入公告内容" maxlength="1500" @change="bindChange" :errorMessage="errMsgs.contentErrMsg"></i-input>
    </view>
    <view class="btn-box">
      <view class="biz-btn save" v-if="(isSuperAdmin || entry.user.id == this.userId) && entry.id != 0" @tap="del">删除</view>
      <view class="biz-btn save" :style="(entry.id == 0 || entry.id == undefined?'':'display:none')" @tap="submit">{{entry.id == 0 || entry.id == undefined?"发布":"发布"}}</view>
    </view>
    <i-message id="message"></i-message>
  </view>

</template>

<script>
import tip from '@/utils/tip';

export default {
  data() {
    return {
        entry: {
          id: 0,
          content: ''
        },
        checkRules: {
          required: ["content"]
        },
        errMsgs: {},
        //是否是审核状态
        isSuperAdmin: false,
        userId: uni.getStorageSync("user_info").employeeId,
        notifyAll: true

    };
  },

  onLoad(options) {
    if (options.id == undefined) {} else {
      let entry = Session.get("publish-for-modify");
      Session.clear("publish-for-modify");
      this.entry = entry;
    }

    let user = Session.get('user_load_cache');
    this.userId = user.id;

    if (user.roles.indexOf(2) > -1) {
      this.isSuperAdmin = true;
    }
  },

  methods: {
    bindChange(e) {
      this.entry[e.currentTarget.id] = e.detail.detail == undefined ? e.detail.value : e.detail.detail.value;
    },

    notifyChange(e) {
      this.notifyAll = !this.notifyAll;
    },

    goBack(e) {
      uni.navigateBack({
        delta: 1
      });
    },

    async del() {
      await tip.confirm('确认要删除此条数据吗?', {}, '提示');
      const data = await wxRequest.Get(`tweet/delete`, {
        id: this.entry.id
      });

      if (data != undefined && data.code >= 1) {
        if (data.message != undefined && data.message != '') {
          tip.error(data.message);
        }

        Session.set('refresh', true);
        uni.navigateBack({
          delta: 1
        });
      } else {
        tip.error(data.message);
      }
    },

    async submit() {
      //检查必填
      let checked = true;

      for (var i = 0; i < this.checkRules.required.length; i++) {
        let item = this.checkRules.required[i];

        if (this.entry[item] == '' || this.entry[item] == undefined) {
          this.errMsgs[item + 'ErrMsg'] = '本项为必填项';
          checked = false;
        }
      }

      if (!checked) {
        return;
      }

      let url = 'tweet/pubMessage';
      let data = await wxRequest.Get(url, {
        content: this.entry.content,
        type: 7,
        notifyAll: this.notifyAll
      });

      if (data != undefined && data.code >= 1) {
        if (data.message != undefined && data.message != '') {
          tip.error(data.message);
        }

        Session.set('refresh', true);
        uni.navigateBack({
          delta: 1
        });
      } else {
        tip.error(data.message);
      }
    }

  },

};
</script>
<style lang="scss" src="@/static/styles/common_form.scss">

</style>
