<template>
  <view class="container">
    <cu-custom :isBack="true" bgColor="bg-blue-1" style="color: whitesmoke">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        报修管理员
      </view>
    </cu-custom>
    <view class="header-view">

      <uni-all-tabs :justifyContent="'space-around'" :list="tabList" @change="changeTab"></uni-all-tabs>
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
              <uni-tag :text="applyStatus(item.status)" :type="tagType(item.status)" size="mini"/>
              <text class="date">{{ item.createTime }}</text>
            </view>
          </view>
          <view class="card__footer">
            <text style="color: #1989fa;" @click="navToDetailPage(item)">查看详情</text>
            <text v-if="item.status === 0" style="color: #f3a73f;" @click="completeRepair(item)">完成维修</text>
            <text v-if="item.status === 0" style="color: #f3a73f;" @click="deleteRepair(item)">删除订单</text>
            <text v-if="item.status === 1" style="color: #18bc37;" @click="deleteRepair(item)">删除已完成</text>
            <!--						<text v-if="item.status === 2" style="color: #e43d33;" @click="deleteOrder(item)">删除</text>-->
          </view>
          <view :style="{backgroundColor: item.level === 1 ? '#07c160' : '#ee0a24'}" class="level-tag">
            {{ item.level === 1 ? '普通维修' : '紧急维修' }}
          </view>
        </view>
      </block>
      <!-- 提示区域 -->

    </view>
    <cu-empty :type="emptyType">
      <view slot="text" class="">
        <view class="margin-bottom-sm">{{ emptyMsg }}</view>
        <button v-if="emptyType=='search'" class="cu-btn bg-orange-1 round shadow-blur"
                @click="this.getApplyData()">刷新
        </button>
      </view>
    </cu-empty>
  </view>
</template>

<script>
import mixin from '@/mixins/mixin.js'
import search_empty_message_mixin from "@/mixins/search_empty_message_mixin";

export default {
  mixins: [mixin, search_empty_message_mixin],
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
      this.applyData = []
      this.$reqs(":8081/repair", "GET", {status: status}, res => {
        console.log(res);
        if (res.code == 200) {
          this.applyData = res.data
        }
      })
    },
    /**
     * @description 切换tab获取申报数据、投放插屏广告
     * */
    changeTab(evt) {
      this.tabsIndex = evt.index
      this.currentIndex = evt.index
      this.applyData = []
      this.getApplyData(evt.status)
    },

    /**
     * @description 切换楼层获取申报数据
     * */
    changePicker(evt) {
      this.floorIndex = evt.index
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
          if (res.confirm) {
            this.$reqs(":8081/repair", "PUT", [{status: 1, id: event.id}], res => {
              console.log(res);
              if (res.code == 200 && res.data == true) {
                this.getApplyData(this.tabsIndex)

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
            this.$reqs(":8081/repair", "PUT", [{status:2,id:event.id}], res => {
              console.log(res);
              if (res.code == 200 && res.data == true) {
                this.getApplyData(this.tabsIndex)
              }
            })
          }
        }
      })
    },
    /**
     * @description 管理员验证
     * */
    isAdminValidate() {
      const isAdmin = this.role == 4 || this.role == 0
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
@import '@/common/repair.scss';
</style>
