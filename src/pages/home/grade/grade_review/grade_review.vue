
<template>
  <view>
    <cu-custom bgColor="bg-blue-11" :isBack="true">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        学籍信息审核
      </view>
    </cu-custom>

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
      let getData = {
        userId: uni.getStorageSync("user_info").employeeId
      }
      this.$reqs(":8081/grade/review", "GET", getData, res => {

        if (res.code === "200") {
          const itemLength = res.data.length
          this.showButtons = true
          if (itemLength) {
            this.reviewList = res.data
            this.choFlag = new Array(itemLength).fill(false)
            this.emptyType = "success"
            this.emptyMsg = "加载完成"
          } else {
            this.emptyType = "success"
            this.emptyMsg = "未查询到信息"
            this.reviewList = []
          }
        } else {
          this.emptyType = "error"
          this.emptyMsg = res.msg
          this.reviewList = []
        }
      })
    },
    // 查看详情
    detailInfo: function (userId) {

      this.$reqs(':8081/user/info', 'GET', {userId: userId}
          , res => {
            if (res.code === "200") {
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
              if (res.code === "200") {
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

</style>
