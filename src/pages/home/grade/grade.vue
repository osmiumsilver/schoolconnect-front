<template>
  <view>
    <cu-custom :isBack="true" bgColor="bg-orange-1">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        总获学分:{{ totalCredits }}-平均绩点:{{ averagePoints }}
      </view>
    </cu-custom>
    <view class="bg-blue-1">
      <view class="cu-bar bg-white solid-bottom">
        <view class="action">
          <text class="cuIcon-title text-orange"></text>
          选择学期
        </view>
        <view class="action">
          <term-picker @semester="semesterClick" @year="yearClick"></term-picker>
        </view>
      </view>
    </view>
    <!-- 主体展示页面 -->
    <view v-if="gradeList.length" class="animation-slide-bottom margin list-container">
      <view class="list-head bg-blue-1">
        <view class="">
          课程名（点击查看详情分数）
        </view>
        <view class="">
          选中/总评
        </view>
      </view>
      <view v-for='(item, index) in gradeList' :key='index' :class="index%2?'bg-gray':'bg-white'"
            class="list-item text-black">
        <view class="list-subitem">
          <text class="text-bold">{{ item.courseName }}</text>
          <switch :checked='choFlag[index]' class="cyan sm" @click="choChange(index)"></switch>
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
                    @click="detailGrade(item)">成绩：{{ item.grade }}
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
                @click="getGrade">查询
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
      semester: "",
      year: "",
     totalCredits:'',
     averagePoints:'',
      gradeList: [],
      choFlag: [],
    }
  },

  mounted() {
    this.getGrade()
  },
  methods: {
    getGrade: function () {
      this.gradeList = [];
      this.$reqs(":8081/grade/get_my_grade", "GET", {
        year: this.year,
        semester: this.semester,
        userId: uni.getStorageSync("user_info").employeeId
      }, res => {
        if (res.code == 200) {
          if (res.data.length) {
            this.gradeList = res.data
            this.choFlag = new Array(res.data.length).fill(true)
            this.calcu()
          }
        }
      })

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
    choChange: function (index) { //是否选中
      this.choFlag[index] = !this.choFlag[index]
      this.calcu()
    },
    calcu: function () {
      let sumCredits = 0;
      let count = 0;
      let sumPoints=0;
      for (let i = 0; i < this.gradeList.length; i++) {
        this.calcPoints(i);
        if (this.choFlag[i]) {
          count++;
          sumCredits += parseFloat(this.gradeList[i].credits);

          sumPoints += parseFloat(this.gradeList[i].points);
        }
      }

      if (count) {
        this.totalCredits = sumCredits
        this.averagePoints = (sumPoints / this.gradeList.length).toFixed(1)
      } else {
        this.totalCredits = 'NaN'
        this.averagePoints = 'NaN'
      }
    },

    // 查看详情
    calcPoints: function (index) { //计算绩点
      const grade = this.gradeList[index].grade;
      if (grade >= 90 && grade <= 100) { //JavaScript的switch语句不怎么好用 我暂时只能这么写
        this.gradeList[index]['points'] = 3.5
      } else if (grade >= 80 && grade < 90) {
        this.gradeList[index]['points'] = 3
      } else if (grade >= 70 && grade < 80) {
        this.gradeList[index]['points'] = 2.5
      } else if (grade < 70) {
        this.gradeList[index]['points'] = 2
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
