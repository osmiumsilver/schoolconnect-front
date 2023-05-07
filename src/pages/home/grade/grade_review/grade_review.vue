
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
    <!-- 主体展示页面 -->
    <view class="animation-slide-bottom margin list-container" v-if="gradeList.length">
      <view class="list-head bg-blue-1">
        <view class="">
          成绩审核
        </view>
        <view class="">
          选中
        </view>
      </view>
        <view v-for='(item, index) in gradeList' :key='index' :class="index%2?'bg-gray':'bg-white'"
              class="list-item text-black">
            <view class="list-subitem">
                <text class="text-bold"> 姓名：{{ item.name }}</text>
                <switch :checked='choFlag[index]' class="cyan sm" @click="choChange(index)"></switch>
            </view>
            <view class="list-subitem margin-top-sm">
                <view class="flex-sub text-left">
                    <text class="text-bold"> 课程：{{item.courseName}}\n</text>
                    学分：{{ item.courseCredits }}
                </view>
                <view class="flex-sub text-center">
                    绩点：{{ item.points }}
                </view>

                <view class="flex-sub text-right">
                    <button class="cu-btn bg-orange-1 round shadow sm"
                            @click="detailGrade(item)">成绩：{{ item.grade }}
                    </button>

                </view>
            </view>
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

import mixin from "@/mixins/grade_mixin";
import search_empty_message_mixin from "@/mixins/search_empty_message_mixin";

export default {
    mixins: [mixin, search_empty_message_mixin], // 引入可复用的代码
  data() {
    return {
      name: "grade_review.vue",
      showButtons: false,
      gradeList: [],
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
        this.gradeList =''
      this.$reqs("/grade/review", "GET", {   userId: uni.getStorageSync("user_info").employeeId}, res => {
        if (res.code == 200 && res.data) {
          const itemLength = res.data.length

          if (itemLength) {
            this.showButtons = true
            this.gradeList = res.data
            this.choFlag = new Array(itemLength).fill(false)
          }
        }
      })
    },
    // 查看详情
    detailInfo: function (userId) {
      this.$reqs('/user/info', 'GET', {userId: userId}
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
      for (const items in this.gradeList) {
        if (this.choFlag[items]) {
          let myStuff = {}
          myStuff['id'] = this.gradeList[items].id
          if (!ApproveOrDiscard)
            myStuff['awaitingRevision'] = 1
          else
            myStuff['awaitingRevision'] = 0

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
            this.$reqs("/grade/review", "PATCH", postData, res => {
              if (res.code == 200) {
                uni.showToast({
                  title: '保存成功',
                  duration: 500
                });
                  setTimeout(() => {
                      this.getInfoReadyToBeReviewed()
                  }, 1100)

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
