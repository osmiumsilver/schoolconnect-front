
<template>
  <view>
    <cu-custom bgColor="bg-orange-1" :isBack="true">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        成绩修改审核
      </view>
    </cu-custom>
    <view class="head">

      <view class="header-wrap">

        <view class="index-header">

          <text class="address" v-if="leftWords">{{leftWords}}</text>

          <view class="input-wrap" v-if="input">

            <input type="text"

                   placeholder="请输入搜索"

                   v-model="value"

                   @change="inputChange"/>

            <text class="iconfont iconfangdajing"></text>

          </view>

          <view class="map-wrap"

                v-if="rightWords||rightIcon"

                @click="rightClick">

            <text class="iconfont" :class="rightIcon"></text>

            <text>{{rightWords}}</text>

          </view>

        </view>

      </view>

      <view class="blank"></view>

    </view>
    <!-- 主体展示页面 -->
    <view class="animation-slide-bottom margin list-container" v-if="reviewList.length">
      <view class="list-head bg-blue-1">
        <view class="">
          学籍查看详情
        </view>
        <view class="">
          选中
        </view>
      </view>
      <view class="list-item text-black" v-for='(item, index) in reviewList' :key='index'
            :class="index%2?'bg-gray':'bg-white'">
        <view class="list-subitem">
          <text class="text-bold">{{ item.name }}</text>
          <switch class="cyan sm" @click="choChange(index)"></switch>
        </view>
        <view class="list-subitem margin-top-sm">
          <view class="flex-sub text-left">
            学号：{{ item.employeeId }}
          </view>
          <view class="flex-sub text-center">
            班级：{{ item.classNo }}
          </view>
          <view class="flex-sub text-right">
            <button class="cu-btn bg-orange-1 round shadow sm"
                    @click="detailInfo(item.employeeId)">点击查看详情
            </button>
          </view>
        </view>
      </view>
      <view class="list-head bg-blue-1">
      </view>
    </view>
    <view>


      <u-button class="section_3 uButton_CSr" v-if="showButtons==true" @click="reviewApproveOrDiscard(true)"> 审核通过
      </u-button>
      <u-button class="section_3 uButton_CSr" v-if="showButtons==true" @click="reviewApproveOrDiscard(false)"> 信息退回
      </u-button>

    </view>
    <!-- 提示区域 -->
    <cu-empty :type="emptyType">
      <view slot="text" class="">
        <view class="margin-bottom-sm">{{ emptyMsg }}</view>
        <button v-if="emptyType=='search'" class="cu-btn bg-orange-1 round shadow-blur"
                @click="getInfoReadyToBeReviewed">刷新
        </button>
      </view>
    </cu-empty>
  </view>
</template>

<script>

export default {
  data() {
    return {
      name: "grade_review.vue",
      showButtons: false,
      reviewList: [],
      choFlag: [],
      emptyType: "search",
      emptyMsg: "您暂时没有需要审核的信息",
    }
  },

  created() {
    this.getInfoReadyToBeReviewed()
  },
  methods: {

    getInfoReadyToBeReviewed() {

      this.$reqs(":8081/grade/review", "GET", {   userId: uni.getStorageSync("user_info").employeeId}, res => {

        if (res.code == 200) {
          const itemLength = res.data.length

          if (itemLength) {
            this.showButtons = true
            this.reviewList = res.data
            this.choFlag = new Array(itemLength).fill(false)
          }
        }
      })
    },
    // 查看详情
    detailInfo: function (userId) {

      this.$reqs(':8081/user/info', 'GET', {userId: userId}
          ,res => {
            if (res.code == 200) {
              let str = ''
              for (let i in res.data) {
                str += res.data[i] + '\r\n'
              }
              uni.showModal({
                title: res.data.name,
                content: str.substring(0, str.length - 1),
                showCancel: false,
              })
            } else {
              uni.showModal({
                title: '提示',
                content: res.msg,
                showCancel: false,
              })
            }
          })
    },
    // 是否选中
    choChange: function (index) {
      this.choFlag[index] = !this.choFlag[index]
    },

    reviewApproveOrDiscard: function (ApproveOrDiscard) {

      let postData = [];
      for (const items in this.reviewList) {
        if (this.choFlag[items]) {
          let myStuff = {}
          myStuff['id'] = this.reviewList[items].id
          if (!ApproveOrDiscard)
            myStuff['requiredChanging'] = 1
          else
            myStuff['requiredChanging'] = 0

          postData.push(myStuff)
        }
      }
      console.log(postData);
      uni.showModal({
        title: '提示',
        content: '是否进行审核通过操作？',
        showCancel: true,
        cancelText: '否',
        confirmText: '是',
        complete: (res) => {
          if (res.confirm) {
            this.$reqs(":8081/user/info/review", "PUT", postData, res => {
              if (res.code == 200) {
                uni.showToast({
                  title: '保存成功',
                  mask: false,
                  duration: 1500
                });
                this.getInfoReadyToBeReviewed()
              }

            })
          }


        }

      });

    },
  }
}
</script>

<style lang="scss" scoped>
$color-base: #00c16f;
$words-color-base: #333333;
$words-color-light: #999999;
.header-wrap {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 999;

  .index-header {
    height: 88upx;
    line-height: 88upx;
    padding: 0 30upx;
    padding-top: 40upx;
    background-color: $color-base;
    font-size: 28upx;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .address {
      font-size: 26upx;
    }

    .input-wrap {
      width: 500upx;
      height: 70upx;
      padding: 10upx 30upx 10upx 100upx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 50upx;
      color: $words-color-base;
      position: relative;

      text {
        position: absolute;
        left: 40upx;
        top: -8upx;
        color: $words-color-light;
        font-size: 30upx;
      }
    }

    .map-wrap {
      .iconfont {
        font-size: 32upx;
        margin-right: 5upx;
      }
      text {
        font-size: 26upx;
      }
    }
  }
}
.blank {
  height: 126upx;
}
</style>
