<template>

  <view class="container">
    <cu-custom :isBack="true" bgColor="bg-orange-1">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        信息公告板
      </view>
    </cu-custom>
    <view v-if="role==0" class="header">
      <view :class="( current == 'all' ? 'active' : '' )" @tap="switchTab('all')">所有公告</view>
      <view :class="( current == 'my' ? 'active' : '' )" @tap="switchTab('my')">我的公告</view>
    </view>

    <view v-if=" messages.length > 0 " class="content" style="padding-top:85rpx">
      <view v-if="messages.length" class="animation-slide-bottom margin list-container">
        <view class="list-head bg-blue-1">
        </view>
        <view v-for='(item, index) in messages' :key='index' :class="index%2?'bg-gray':'bg-white'"
              class="list-item text-black">
          <view class="list-subitem">
            <text class="text-bold">{{ item.title }}</text>
          </view>
          <view class="list-subitem margin-top-sm">
            <view class="flex-sub">
              发送来源：{{ item.sender }}
            </view>
            <view>
              时间：{{ item.submittedDate }}
            </view>
            <view class="flex-sub text-right">
              <button class="cu-btn bg-orange-1 round shadow sm"
                      @click="goDetail(item.body)">点击进入详情
              </button>
            </view>
          </view>
        </view>
        <view class="list-head bg-blue-1">
        </view>
      </view>
      <i-load-more v-if=" bottomLoading "></i-load-more>
      <i-load-more v-if=" searchNone " loading="false" tip="没有更多数据"></i-load-more>
    </view>
    <view :style="'bottom: 8%;right:12%;' + (role > 3 ?'display:none':'')" class="scrollBox img-center"
          @tap="goAddMessages">
      <image mode="aspectFit" src="@/static/plus.png" style="width: 34rpx;height: 34rpx;"></image>
    </view>
    <view v-if="showBackTopBtn" class="scrollBox img-center" style="bottom: 18%;right:12%;" @tap="backTop">
      <image mode="aspectFit" src="@/static/menu.png" style="width: 34rpx;height: 34rpx;"></image>
      <!-- <view style="margin-top: -22rpx;font-size: 24rpx;">置顶</view> -->
    </view>

  </view>

</template>

<script>

export default {
  data() {
    return {
      role: uni.getStorageSync("user_info").role,
      emptyTitle: '暂未查询到相关数据',
      showEmpty: false,
      scrollTop: 0,
      current: 'all',
      page: 1,
      messages: []
    };
  },

  onReachBottom() {
    this.page += 1;
    this.getData();
  },
  created() {
    this.getData();
  },

  methods: {
    backTop() {
      this.showBackTopBtn = false;
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 400
      });
    },

    switchTab(type) {
      this.current = type;
      this.$scope.onLoad();
    },

    goAddMessages() {
      `uni.navigateTo({
        url: `/pages/home/messageboard/messageboard_publish`
      });`
    },

    goDetail(body) {
      uni.showModal({
        title: '内容',
        content: body,
        showCancel: false,
        confirmText: '好',

      });
    },

    getData() {

      if (this.page == 1) {
        this.result = [];
      }

      let params = {
        pageNo: this.page
      };

      if (this.current == "my") {
        params = {
          type: '7',
          userId: uni.getStorageSync("user_info").employeeId,
          pageNo: this.page
        };
      }

      this.$reqs(':8081/messageboard', 'GET', {}, res => {
        if (res.code == 200) {
          this.messages = res.data;
        }
      })


    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/static/styles/message.scss';
@import '@/static/styles/audit.scss';
</style>
