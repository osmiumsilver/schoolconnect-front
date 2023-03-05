<template>

  <view class="container">
    <cu-custom bgColor="bg-blue-11" :isBack="true">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        信息公告板
      </view>
    </cu-custom>
    <view class="header">
      <view :class="( current == 'all' ? 'active' : '' )" @tap="switchTab('all')">所有公告</view>
      <view :class="( current == 'my' ? 'active' : '' )" @tap="switchTab('my')">我的公告</view>
    </view>

    <view class="content" v-if=" messages.length > 0 " style="padding-top:85rpx">
      <view class="item" v-for="(tweet, index) in messages" :key="index">
        <view class="row" @tap="goDetail(index, tweet)">
          <view class="user-info">
            <view class="icon">
              <image :src="tweet.user.avatar"></image>
            </view>
            <view class="title">{{ tweet.user.name }}</view>
          </view>
          <view class="information">
            <view class="st-title" style="justify-content: flex-start;">
              <view
                  :style="'display:' + (tweet.isRead == 0?'flex':'flex') + ';font-size: 20rpx;color: #428bca;padding-right: 30rpx;'">
                ●
              </view>
              <view class="title" :style="'color:#' + (tweet.isRead == 0?'999':'212121')">{{ tweet.content }}</view>
            </view>
          </view>
          <view class="information">
            <view class="st-bottom">
              <view class="description">
                <i-icon type="time" size="18" color="#80848f"></i-icon>
                <view style="margin-top:3rpx;">{{ tweet.pubDate }}</view>
              </view>
              <view class="description" style="display:none">
                <i-icon type="message" size="18" color="#80848f"></i-icon>
                <view style="margin-top:3rpx;">{{ tweet.commentCount }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <i-load-more v-if=" bottomLoading "></i-load-more>
      <i-load-more v-if=" searchNone " tip="没有更多数据" loading="false"></i-load-more>
    </view>
    <view class="scrollBox img-center" :style="'bottom: 8%;right:12%;' + (userRole > 4?'display:none':'')" @tap="add">
      <image src="../../static/images/add.png" mode="aspectFit" style="width: 34rpx;height: 34rpx;"></image>
    </view>
    <view class="scrollBox img-center" v-if="showBackTopBtn" style="bottom: 18%;right:12%;" @tap="backTop">
      <image src="../../static/images/stick.png" mode="aspectFit" style="width: 34rpx;height: 34rpx;"></image>
      <!-- <view style="margin-top: -22rpx;font-size: 24rpx;">置顶</view> -->
    </view>

  </view>

</template>

<script>
import wxRequest from '@/utils/wxRequest';
import tip from '@/utils/tip';
import Session from '@/utils/session';
import util from '/src/utils/util1';

export default {
  data() {
    return {

      emptyTitle: '暂未查询到相关数据',
      showEmpty: false,
      scrollTop: 0,
      current: 'all',
      page: 1,
      messages: [],
      tweetList: []
    };
  },

  onReachBottom() {
    this.page += 1;
    this.getData();
  },
  mounted() {
    this.getData();
  },
  onLoad() {
    // 这是为了返回时初始化数据
    this.page = 1;

    this.userRole = Session.get("userRole");
  },

  onShow() {
    let refresh = Session.get('refresh');
    if (refresh) {
      Session.set('refresh', false);
      this.$scope.onLoad();
    }
  },

  onPullDownRefresh() {
    this.$scope.onLoad();
  },

  methods: {
    backTop() {
      this.showBackTopBtn = false;
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 400
      });
    },

    switchTab(type) {
      this.current = type;
      this.$scope.onLoad();
    },

    add() {
      if (!uni.getStorageSync("role") == 0, 1, 2) {
        tip.confirm("您无法进行此操作！");
        return;
      }

      uni.navigateTo({
        url: `/pages/home/messageboard/messageboard_publish`
      });
    },

    goDetail(idx, item) {
      Session.set('publish-for-modify', item);

      if (this.current === "my") {
        uni.navigateTo({
          url: `/pages/publish/publish_form?id=${item.id}`
        });
      } else {
        uni.navigateTo({
          url: `/pages/publish/publish_detail?id=${item.id}&isRead=${this.tweetList[idx].isRead}`
        });
      }

      this.tweetList[idx].isRead = 0;
    },

    onPageScroll(res) {
      let top = res.scrollTop;
      this.showBackTopBtn = top > 380 ? true : false;
    },

    getData() {

      if (this.page == 1) {
        this.result = [];
      }

      let params = {
        pageNo: this.page
      };

      if (this.current == "my") {
        let userId = Session.get('user_load_cache').id;
        params = {
          type: '7',
          userId: userId,
          pageNo: this.page
        };
      }

      this.$reqs(':8081/messageboard', 'GET', {}, res => {
        if (res.code == 200) {
          this.messages = res.data;
        }
      })
      let count = this.messages == undefined || this.messages.items == undefined ? 0 : this.messages.length;
      for (var i = 0; i < count; i++) {
        let tweet = this.messages.items[i];
        tweet.pubDate = util.getDateDiff(tweet.pubDate);
        tweet.content = tweet.content.length > 200 ? tweet.content.substring(0, 200) + ' ...' : tweet.content;
        this.tweetList.push(tweet);
      }

    }
  }
}
</script>
<style lang="scss" src="@/static/styles/audit.scss">


</style>
