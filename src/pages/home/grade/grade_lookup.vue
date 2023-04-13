<template>
  <view class="container">
    <cu-custom :isBack="true" bgColor="bg-orange-1">
      <view slot="backText" style="color: white">
        返回
      </view>
      <view slot="content">
        超级管理员-成绩查询
      </view>
    </cu-custom>
    <uni-all-tabs :justifyContent="'space-around'" :list="tabList" @change="changeTab"></uni-all-tabs>
    <view class="bg-blue-1">
      <view class="cu-bar bg-white solid-bottom">
        <view class="action">
          <text class="cuIcon-title text-orange"></text>
          选择学期
        </view>
        <view class="action">
          <term-picker @confirm="confirmClick" @semester="semesterClick" @year="yearClick"></term-picker>
        </view>
      </view>
      <view>

      </view>
    </view>
    <u-search v-model='search' bgColor="white" height="50" inputAlign="center" placeholder="请输入"
              @custom='searchGrade(search)' @search='searchGrade(search)'></u-search>
 <u-search v-if="this.currentIndex == 1 && this.gradeList.length"  placeholder="可输入姓名查询" bgColor="white" height="50" inputAlign="center"></u-search>

    <!-- 主体展示页面 -->
    <view v-if="gradeList.length" v-for='(item,index) in gradeList' :key='index' class="animation-slide-bottom margin list-container">
      <view class="list-head bg-blue-1">
        <view class="">
         {{ item.name}}
        </view>
      </view>
      <view :class="index%2?'bg-gray':'bg-white'"
            class="list-item text-black">
        <view class="list-subitem">
          <text class="text-bold">{{ item.courseName }}</text>
        </view>
        <view class="list-subitem margin-top-sm">
          <view class="flex-sub text-left">
            学分：{{ item.credits }}
          </view>
          <view class="flex-sub text-center">
            绩点：{{ item.points }}
          </view>
          <view class="flex-sub text-right">
            <button class="cu-btn bg-orange-1 round shadow sm"
                    @click="detailGrade(item.id,item.year,item.semester,item.courseName)">成绩：{{ item.grade }}
            </button>
          </view>
        </view>
      </view>
      <view class="list-head bg-blue-1">
      </view>
    </view>
    <!-- 提示区域 -->
    <cu-empty :type="emptyType">
      <view slot="text" class="">
        <view class="margin-bottom-sm">{{ emptyMsg }}</view>
        <button v-if="emptyType=='search'" class="cu-btn bg-orange-1 round shadow-blur"
                @click="searchGrade(search)">查询
        </button>
      </view>
    </cu-empty>
  </view>
</template>

<script>

import mixin from '@/mixins/grade_mixin.js'
import search_empty_message_mixin from "@/mixins/search_empty_message_mixin";
export default {
  mixins: [mixin,search_empty_message_mixin], // 引入可复用的代码
  data() {
    return {
      currentIndex: 0,
      year: 2023,
      semester: 1,
      tabList: [{
        name: '学号查询',
        page: 0
      }, {
        name: '班级查询',
        page: 1
      }],
      search: '',
      gradeList: [],
      choFlag: [],

    }
  },
  methods: {
    changeTab(evt) {
      this.currentIndex = evt.index
      console.log(evt)
    },
    searchGrade: function (e) {
      this.gradeList = []
      if (this.currentIndex == 0) {
        this.$reqs(":8081/grade/by_id", "GET", {userId: e, year: this.year, semester: this.semester}, res => {
          if (res.code == 200 && res.data.length) {
            this.gradeList = res.data
            for (let i = 0; i < this.gradeList.length; i++) {
              this.calcPoints(i);
            }

          }
        })
      }
      if (this.currentIndex == 1) {
        this.$reqs(":8081/grade/by_class", "GET", {clazzId: e, year: this.year, semester: this.semester}, res => {
          if (res.code == 200 && res.data.length) {
            this.gradeList = res.data
            for (let i = 0; i < this.gradeList.length; i++) {
              this.calcPoints(i);
            }
          }
        })
      }
    },
    semesterClick(e) {
      this.semester = e
    },
    yearClick(e) {
      this.year = e
    },
    confirmClick: function () {
      this.getGrade()
    },
  },

}
</script>

<style scoped>

</style>
