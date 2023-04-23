<template>
  <view class="container">
    <cu-custom :isBack="true" bgColor="bg-orange-1">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        超级管理员-信息查询
      </view>
    </cu-custom>
    <uni-all-tabs :list="tabList" :justifyContent="'space-around'" @change="changeTab"></uni-all-tabs>
    <u-search bgColor="white" inputAlign="center" height="50" placeholder="请输入" v-model='search' @search='listInfo(search)' @custom='listInfo(search)'></u-search>

    <!-- 主体展示页面 -->
    <view class="animation-slide-bottom margin list-container">
      <view class="list-head bg-blue-1">
        <view class="">
          学籍查看详情
        </view>
        <view class="">
          选中
        </view>
      </view>

      <view v-for='(item, index) in infoList' :key='index' :class="index%2?'bg-gray':'bg-white'"
            class="list-item text-black">
        <view class="list-subitem">
          <text class="text-bold">{{ item.name }}</text>
          <switch class="cyan sm" @click="choChange(index)" :checked='choFlag[index]'></switch>
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
    <view v-if="uni.getStorageSync('user_info').role!=2">

      <u-button v-if="showButtons==true" class="section_3 uButton_CSr" @click="setToBeRevision(true)"> 等待审核
      </u-button>
      <u-button v-if="showButtons==true" class="section_3 uButton_CSr" @click="reviewApproveOrDiscard(true)"> 审核通过
      </u-button>
      <u-button v-if="showButtons==true" class="section_3 uButton_CSr" @click="reviewApproveOrDiscard(false)"> 信息退回
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

export default {
  mixins: [mixin], // 引入可复用的代码
  data() {
    return {
      currentIndex: 0,
      tabList: [{
        name: '学号查询',
        page: 0
      }, {
        name: '班级查询',
        page: 1
      }],
      search: '',
      infoList: [],
      choFlag: [],
      showButtons: false
    }
  },
  methods: {
    changeTab(evt) {
      this.currentIndex = evt.index
      console.log(evt)
    },
    choChange: function (index) {
      this.choFlag[index] = !this.choFlag[index]
    },
setToBeRevision(){
  let postData = [];
  for (const items in this.infoList) {
    if (this.choFlag[items]) {
      let myStuff = {
      id : this.infoList[items].id,
      requiredChanging : 2
      }

      postData.push(myStuff)
    }
  }
  console.log(postData);
  uni.showModal({
    title: '提示',
    content: '是否进行设置审核状态操作？',
    showCancel: true,
    cancelText: '否',
    confirmText: '是',
    complete: (res) => {
      if (res.confirm) {
        this.$reqs(":8081/admin/user/info/review/set_to_be_review", "PUT", postData, res => {
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
    reviewApproveOrDiscard: function (ApproveOrDiscard) {

      let postData = [];
      for (const items in this.infoList) {
        if (this.choFlag[items]) {
          let myStuff = {}
          myStuff['id'] = this.infoList[items].id
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
            this.$reqs(":8081/admin/user/info/review", "PUT", postData, res => {
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
    detailInfo: function (userId) {

      this.$reqs(':8081/admin/user/info/detail', 'GET', {userId: userId}
          , res => {
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
    listInfo: function (e) {
      this.infoList = []
      if (this.currentIndex == 0) {
        this.$reqs(":8081/admin/user/info", "GET", {userId: e}, res => {
          if (res.code == 200) {
            this.infoList = res.data
            this.showButtons = true

          }
        })
      }
      if (this.currentIndex == 1) {

        this.$reqs(":8081/admin/user/info/by_class", "GET", {clazzId: e}, res => {
          if (res.code == 200) {
            this.infoList = res.data

          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
