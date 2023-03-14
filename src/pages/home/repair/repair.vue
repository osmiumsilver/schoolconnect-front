<template>
  <view class="container">
    <cu-custom bgColor="bg-blue-1" :isBack="true">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        报修区域
      </view>
    </cu-custom>
    <view class="header-view">
      <view class="navbar-view">
        <text @click="navToPublishPage">报修申报</text>
        <text @click="navToAdminPage">管理员区域</text>
      </view>
      <uni-all-tabs :list="tabList" :justifyContent="'space-around'" @change="changeTab"></uni-all-tabs>
    </view>
    <view class="card-list-view">
      <block v-for="(item, index) in applyData" :key="index">
        <view class="card-list-view__item">
          <view class="content border-bottom">
            <view class="content__left">
              <image :src="item.levelIcon" mode="aspectFill"></image>
            </view>
            <view class="content__right">
              <text class="location">{{ item.location }}</text>
              <text class="desc">{{ item.description }}</text>
              <uni-tag size="mini" :text="applyStatus(item.status)" :type="tagType(item.status)"/>
              <text class="date">{{ item.createTime }}</text>
            </view>
          </view>
          <view class="card__footer">
            <text style="color: #1989fa;" @click="navToDetailPage(item)">查看详情</text>
          </view>
          <view class="level-tag" :style="{backgroundColor: item.level === 1 ? '#07c160' : '#ee0a24'}">
            {{ item.level === 1 ? '普通维修' : '紧急维修' }}
          </view>
        </view>
      </block>
    </view>
    <uni-all-empty-state v-if="!applyData.length" :imgUrl="emptyState[currentIndex]"></uni-all-empty-state>

  </view>
</template>

<script>
import mixin from '../../../mixins/mixin.js'

const db = uniCloud.database()
const limit = 20 // 每次最多获取20条数据
let tabsIndex = 0 // 默认tabs下标
let floorIndex = 0 // 默认楼层下标
export default {
  mixins: [mixin], // 引入可复用的代码
  data() {
    return {}
  },
  onLoad() {
    this.getApplyData(0)

  },
  // 触底刷新
  onReachBottom() {
    !this.isEndOfList && this.getApplyData()
  },

  methods: {

    /**
     * @description 根据申报状态、楼层、获取申报数据
     * */
    async getApplyData(status) {
      this.$reqs(":8081/repair", "GET", {status: status}, res => {
        console.log(res);
        if (res.code == 200) {
          this.applyData = res.data
        }
      })
      // 	const res = await db.collection('dorm_apply').where({
      // 		status: this.tabList[tabsIndex].status,
      // 		floor: floorIndex === 0 ? {} : floorIndex,
      // 		openid: uni.getStorageSync('openid')
      // 	}).skip(this.applyData.length).orderBy('createTime', 'desc').get()
      // 	this.applyData = [...this.applyData, ...res.result.data]
      // 	this.isEndOfList = res.result.data.length < limit ? true : false
      uni.hideLoading()
    },
    /**
     * @description 切换tab获取申报数据、投放插屏广告
     * */
    changeTab(evt) {
      tabsIndex = evt.index
      this.currentIndex = evt.index
      this.applyData = []
      this.getApplyData(evt.status)
    },
    /**
     * @description 选择楼栋、根据申报状态、楼层、获取申报数据
     * */
    // async getApplyDataItem(floor) {
    // 	uni.showLoading({
    // 		title: '加载中...',
    // 		mask: true
    // 	})
    // 	const res = await db.collection('dorm_apply').where({
    // 		floor: floor,
    // 		status: this.tabList[tabsIndex].status,
    // 		openid: uni.getStorageSync('openid')
    // 	}).orderBy('createTime', 'desc').get()
    // 	if (res.success) {
    // 		this.applyData = res.result.data
    // 	}
    // 	uni.hideLoading()
    // },
    /**
     * @description 切换楼层获取申报数据
     * */
    changePicker(evt) {
      floorIndex = evt.index
      // if (floorIndex === 0) {
      this.applyData = []
      this.getApplyData()
      // } else {
      // 	this.getApplyDataItem(floorIndex)
      // }
    },
    /**
     * @description 报修申报跳转
     * */
    navToPublishPage() {
      uni.navigateTo({
        url: '/pages/home/repair/publish/publish'
      })
    },
    /**
     * @description 管理员跳转
     * */
    navToAdminPage() {
      if (uni.getStorageSync("user_info").role != 0 && uni.getStorageSync("user_info").role !=4 ) {
        uni.showModal({
          title: '提示',
          content: '您无权操作！',
          showCancel: false,
          confirmText: '好',
        });
        return;
      }
      uni.navigateTo({
        url: "/pages/home/repair/admin/admin",
        fail: res => {
          console.log(res)
        }
      })
      if (this.isAdmin) {
        // 订阅报修订单提醒
        // #ifdef MP-WEIXIN
        wx.requestSubscribeMessage({
          tmplIds: ['4Lnbo47VBu7woS0m0O8UjZ-7TBozETC4Mr5tdkwJ4v4'],
        })
        // #endif
      }
    }
  }
}
</script>

<style>
page {
  background-color: #fff;
}
</style>
<style lang="scss" scoped>
@import '/src/common/repair.scss';

.ad-banner {
  view {
    width: 100%;
    position: fixed;
    bottom: 0;
  }
}
</style>
