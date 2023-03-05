<template>
  <view>
    <cu-custom bgColor="bg-blue-11" :isBack="true">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        加权:{{ vWeights }}-绩点:{{ vCredits }}
      </view>
    </cu-custom>
    <view class="bg-blue-1">
      <view class="cu-bar bg-white solid-bottom">
        <view class="action">
          <text class="cuIcon-title text-orange"></text>
          选择学期
        </view>
        <view class="action">
          <term-picker @year="yearClick" @semester="semesterClick" @confirm="confirmClick"></term-picker>
        </view>
      </view>
    </view>
    <!-- 主体展示页面 -->
    <view class="animation-slide-bottom margin list-container" v-if="gradeList.length">
      <view class="list-head bg-blue-1">
        <view class="">
          课程名（点击查看详情分数）
        </view>
        <view class="">
          选中/总评
        </view>
      </view>
      <view class="list-item text-black" v-for='(item, index) in gradeList' :key='index'
            :class="index%2?'bg-gray':'bg-white'">
        <view class="list-subitem">
          <text class="text-bold">{{ item.courseName }}</text>
          <switch class="cyan sm" @click="choChange(index)" :checked='choFlag[index]'></switch>
        </view>
        <view class="list-subitem margin-top-sm">
          <view class="flex-sub text-left">
            学分：{{ item.credits }}
          </view>
          <view class="flex-sub text-center">
            绩点：{{ item.point }}
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
                @click="getGrade">查询
        </button>
      </view>
    </cu-empty>
  </view>
</template>

<script>
import termPicker from '@/components/term-picker/term-picker'
import {getSchoolToken} from '../../../utils/util'

export default {
  data() {
    return {
      semester: "",
      year: "",
      vWeights: 'NaN',
      vCredits: 'NaN',
      gradeList: [],
      choFlag: [],
      emptyType: "search",
      emptyMsg: "点击最上方按钮切换学期，或点击下方按钮直接查询。",
    }
  },
  components: {
    termPicker
  },
  mounted() {
    this.getGrade()
  },
  methods: {
    semesterClick(e) {
      this.semester = e
    },
    yearClick(e) {
      this.year = e
    },
    confirmClick: function () {
      this.getGrade()
    },
    getGrade: function () {
      let getData = {
        year: this.year,
        semester: this.semester,
        userId: uni.getStorageSync("user_info").employeeId
      }
      this.$reqs(":8081/grade", "GET", getData, res => {
        if (res.code == 200) {
          const gradeLength = res.data.length
          if (gradeLength) {
            this.gradeList = res.data
            this.choFlag = new Array(gradeLength).fill(true)
            this.emptyType = "success"
            this.emptyMsg = "加载完成"
            this.calcu()
          } else {
            this.emptyType = "search"
            this.emptyMsg = "未查询到信息"
            this.gradeList = []
          }
        } else {
          this.emptyType = "error"
          this.emptyMsg = res.msg
          this.gradeList = []
        }
      })

    },
    // 查看详情分数
    detailGrade: function (id, year, semester, courseName) {

      this.$req(':8081/grade/detail_grade/', 'post', {
        id: jxb_id,
        year: year,
        semester: semester === '3' ? '1' : '2',
      }, function (res) {
        if (res.code == 200) {
          let str = ''
          for (let i in res.data.detail_grade) {
            str += res.data.detail_grade[i].xmblmc + '：' + res.data.detail_grade[i].xmcj +
                '\n'
          }
          uni.showModal({
            title: courseName,
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
    // 是否选中课程
    choChange: function (index) {
      this.choFlag[index] = !this.choFlag[index]
      this.calcu()
    },
    calcPoints: function (index) {
      for (let i = 0; i < this.gradeList.length; i++) {

        var grade = this.gradeList[i].grade
        if (grade >= 90 && grade <= 100) {
          this.gradeList[index]['points'] = 3.5
        } else if (grade >= 80 && grade < 90) {
          this.gradeList[index]['points'] = 3
        } else if (grade >= 70 && grade < 80) {
          this.gradeList[index]['points'] = 2.5
        } else if (grade < 70) {
          this.gradeList[index]['points'] = 2
        }

      }
    },
    // 计算加权与绩点
    calcu: function () {
      let sumCredits = 0;
      let vWeights = 0;
      let vCredits = 0;
      let count = 0;
      for (let i = 0; i < this.gradeList.length; i++) {
        this.calcPoints(i);
        if (this.choFlag[i]) {
          count++;
          sumCredits += parseFloat(this.gradeList[i].credits);
          switch (this.gradeList[i].grade) {
            case '优秀':
              vWeights += 90 * parseFloat(this.gradeList[i].credits);
              break;
            case '良好':
              vWeights += 85 * parseFloat(this.gradeList[i].credits);
              break;
            case '中等':
              vWeights += 75 * parseFloat(this.gradeList[i].credits);
              break;
            case '合格':
              vWeights += 80 * parseFloat(this.gradeList[i].credits);
              break;
            case '及格':
              vWeights += 60 * parseFloat(this.gradeList[i].credits);
              break;
            case '不及格':
            case '不合格':
              vWeights += 50 * parseFloat(this.gradeList[i].credits);
              break;
            default:
              vWeights += parseFloat(this.gradeList[i].grade) * parseFloat(this.gradeList[i]
                  .credits);
          }

          vCredits += parseFloat(this.gradeList[i].points) * parseFloat(this.gradeList[i].points);
        }
      }
      // console.log(sumCredits, vWeights, vCredits)

      if (count) {
        this.vWeights = (vWeights / sumCredits).toFixed(2)
        this.vCredits = (vCredits / sumCredits).toFixed(2)
      } else {
        this.vWeights = 'NaN'
        this.vCredits = 'NaN'
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
