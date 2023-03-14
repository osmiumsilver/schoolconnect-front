<template>
  <view class="container">
    <cu-custom bgColor="bg-blue-1" :isBack="true">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        报修管理员
      </view>
    </cu-custom>
    <view class="header-view">

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
              <text class="location">{{ item.location }}栋{{ item.dorm }}</text>
              <text class="desc">{{ item.description }}</text>
              <uni-tag size="mini" :text="applyStatus(item.status)" :type="tagType(item.status)"/>
              <text class="date">{{ item.createTime }}</text>
            </view>
          </view>
          <view class="card__footer">
            <text style="color: #1989fa;" @click="navToDetailPage(item)">查看详情</text>
            <text v-if="item.status === 0" style="color: #f3a73f;" @click="completeRepair(item)">完成维修</text>
            <text v-if="item.status === 1" style="color: #18bc37;" @click="deleteRepair(item)">处理完成</text>
            <!--						<text v-if="item.status === 2" style="color: #e43d33;" @click="deleteOrder(item)">删除</text>-->
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
import mixin from '/src/mixins/mixin.js'

const db = uniCloud.database()
const http = uniCloud.importObject('feedbackSubscribeMsg')
const limit = 20
let tabsIndex = 0
let floorIndex = 0
export default {
  mixins: [mixin],
  data() {
    return {
      isAdminPage: true
    }
  },
  onLoad(options) {
    this.getApplyData()
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
      uni.showLoading({
        title: '加载中...',
        mask: true
      })
      this.$reqs(":8081/repair", "GET", {status: status}, res => {
        console.log(res);
        if (res.code == 200) {
          this.applyData = res.data
        }
      })
      // const res = await db.collection('dorm_apply').where({
      // 	status: this.tabList[tabsIndex].status,
      // 	floor: floorIndex === 0 ? {} : floorIndex
      // }).skip(this.applyData.length).orderBy('createTime', 'desc').get()
      // this.applyData = [...this.applyData, ...res.result.data]
      // this.isEndOfList = res.result.data.length < limit ? true : false
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
     * @description 切换楼层获取申报数据
     * */
    changePicker(evt) {
      floorIndex = evt.index
      // if (floorIndex === 0) {
      this.applyData = []
      this.getApplyData()
      // } else {
      // 	this.getApplyDataItem(floorIndex);
      // }
    },
    // /**
    //  * @description 接收订单
    //  * */
    // async confirmOrder (event) {
    // 	if (!this.isAdminValidate()) return
    // 	uni.showModal({
    // 	    title: '温馨提示',
    // 	    content: '是否接收处理该订单?',
    // 	    success: async (res) => {
    // 			if (res.confirm) {
    //
    // 			}
    // 		}
    // 	})
    // },
    /**
     * @description 完成订单
     * */
    completeRepair(event) {
      if (!this.isAdminValidate()) return
      uni.showModal({
        title: '温馨提示',
        content: '是否处理完成该订单?',
        success: async (res) => {
          let form = []
          form[status] = 1
          form[id] = event.id;
          if (res.confirm) {
            this.$reqs(":8081/repair", "PUT", form, res => {
              console.log(res);
              if (res.code == 200) {
              }
            })
          }
        }
      })
    },
    /**
     * @description 删除订单
     * */
    deleteRepair(event) {
      if (!this.isAdminValidate()) return
      uni.showModal({
        title: '温馨提示',
        content: '是否删除该订单?',
        success: async (res) => {
          if (res.confirm) {

          }
        }
      })
    },
    /**
     * @description 管理员验证
     * */
    isAdminValidate() {
      const isAdmin = uni.getStorageSync('user_info').role = !!4
      if (!isAdmin) {
        uni.showToast({
          title: '暂无权限',
          icon: 'error'
        })
      }
      return isAdmin
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
</style>
