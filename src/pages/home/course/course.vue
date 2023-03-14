<!--suppress ALL -->
<template>
  <view>
    <cu-custom bgColor="bg-orange-1" :isBack="true">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        课程表
      </view>
    </cu-custom>
    <!-- 头部 -->
    <view style="top:0;z-index: 99;" class="bg-white shadow">
      <!-- 自定义顶部 -->
      <view class="cu-custom bg-blue-1" :style="style">
        <!-- 顶部左侧打开抽屉 -->
        <view class="cu-left">
          <view class="bg-orange-1 left-rectangle"></view>
          <button class="cu-btn cuIcon bg-orange-2 shadow left-round" @click="modalName = 'DrawerModal'">
            {{ trueWeek }}
          </button>
        </view>
        <!-- 顶部切换周数 -->
        <view class="cu-center">
          <button class="cu-btn round bg-green shadow week-btn" @click="modalName = 'WeekSelectorModal'">
            第{{ weekIndex + 1 }}周-周{{ dayOfWeek[thisDay - 1] }}
          </button>
        </view>
        <view class="cu-right">

        </view>
      </view>
      <!-- 课程上方星期 -->
      <view class="flex text-xs blue-1">
        <view style='width:10.4vw;' class="flex justify-center align-center">{{ month }}</view>
        <view style='width:89.6vw;height:35rpx;' class="flex">
          <view v-for="(item, index) in dayOfWeek" :key='index' class="flex justify-center align-center flex-sub"
                :class="index==thisDay-1?'bg-gray orange-1':''">
            周{{ item }}
          </view>
        </view>
      </view>
      <!-- 课程上方日期 -->
      <view class="flex text-xs blue-1">
        <view style='width:10.4vw;' class="flex justify-center align-center">月</view>
        <view style='width:89.6vw;height:35rpx' class="flex">
          <view v-for="(item, index) in dayArray" :key='index' class="flex justify-center align-center flex-sub"
                :class="index==thisDay-1?'bg-gray orange-1':''">
            {{ item }}日
          </view>
        </view>
      </view>
    </view>
    <!-- 课程区域 -->
    <scroll-view scroll-y="true" :style="marginHeight" style="width: 100vw;">
      <view :style="'background-image: url('+bacimg+');width: 100vw;filter: opacity(50%)'"
            class="padding-top-xs padding-bottom-sm flex course-bg"
            :class="bacimg?'':'bg-white'">
        <!-- 课程左侧时间 -->
        <view class='text-xs blue-1'>
          <view v-for="(item, index) in timeSlice" :key='index' class='flex justify-center align-center'
                style='height:120rpx;flex-direction:column;width:10.4vw;'>
            <view>{{ index + 1 }}</view>
            <view class="text-grey">{{ item.s }}</view>
            <view class="text-grey">{{ item.e }}</view>
          </view>
        </view>
        <!-- 课程水平分割线 -->
        <view v-for="(item, index) in 11" :key='index'>
          <view style="width:89.6vw;position:absolute;border-bottom:1rpx solid lightgray;z-index: 0;"
                :style="'margin-top:'+(index+1)*120+'rpx;'">
          </view>
        </view>
        <!-- 课程主体区域 -->
        <view v-for="(item, index) in courseList" :key='index'>
          <view v-for="(subitem, subindex) in item.weeks" :key="subindex">
            <view v-if='subitem===weekIndex+1'>
              <view class="schedule-item radius" @click="showDetail(index)"
                    :style="'margin-left:'+((item.dayOfWeek-1)*12.8+0.4)+'vw;margin-right:0.4vw;margin-top:'+((item.startingPeriod-1)*120+5)+'rpx;height:'+(item.lastingPeriods*120-5)+'rpx;background-color:'+'red'+';width:12vw;z-index: 9;'">
                <view class="text-white padding-xs schedule-text" style="font-size:22rpx;">
                  <view style="line-height:24rpx;max-height:150rpx;overflow:hidden;">
                    {{ item.courseName }}
                  </view>
                  <view>@{{ item.coursePlace }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 侧边栏设置 -->
    <view class="cu-modal drawer-modal justify-start" :class="modalName=='DrawerModal'?'show':''"
          @click="modalName = null">
      <view class="cu-dialog basis-lg bg-gradual-blue text-black" @tap.stop=""
            :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
        <view class="margin-top-xl margin-bottom-xl shadow-lg">
          <view class="text-center text-white text-xl padding-bottom solids-bottom margin-bottom">
            <view>开学第
              <text class="text-sl padding-left-sm padding-right-sm">{{ trueWeek }}</text>
              周
            </view>
          </view>
          <view class="cu-list menu sm-border card-menu margin-top margin-bottom">
            <view class="cu-item arrow">
              <view class="content" @click="addCourse">
                <view>
                  <text class="cuIcon-add text-green padding-right-sm"></text>
                  添加课程
                </view>
              </view>
            </view>
            <view class="cu-item arrow" @click="modalName = 'SemesterModal'">
              <view class="content">
                <view>
                  <text class="cuIcon-refresh text-cyan padding-right-sm"></text>
                  导入课表
                </view>
              </view>
            </view>
            <view class="cu-item arrow" @click="bacChange">
              <view class="content">
                <view>
                  <text class="cuIcon-pic text-brown padding-right-sm"></text>
                  自定义背景
                </view>
              </view>
            </view>
            <view class="cu-item arrow" @click="cancelImg">
              <view class="content">
                <view>
                  <text class="cuIcon-close text-red padding-right-sm"></text>
                  恢复默认背景
                </view>
              </view>
            </view>
            <view class="cu-item arrow" @click="deleteAllSchedule">
              <view class="content">
                <view>
                  <text class="cuIcon-close text-red padding-right-sm"></text>
                  删除所有课程
                </view>
              </view>
            </view>
          </view>
          <view class="cu-list menu sm-border card-menu margin-top margin-bottom">
            <view class="cu-item arrow" @click="setStartDay">
              <view class="content flex">
                <text class="cuIcon-settings text-grey"></text>
                设置开学日期
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 周次model -->
    <view class="cu-modal bottom-modal" :class="modalName=='WeekSelectorModal'?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white">
          <view class="action text-green" @click="modalName = null">确定</view>
        </view>
        <view class="grid col-4 padding-sm bg-gray">
          <view v-for="(item, index) in 20" :key="index" class="padding-xs" wx:key="week">
            <button class="cu-btn blue block" :class="weekIndex==index?'bg-blue':'line-blue'"
                    @click="weekSelector(index)">
              第{{ index + 1 }}周
            </button>
          </view>
        </view>
      </view>
    </view>
    <!-- 学期选择 -->
    <term-picker @year="chooseYear" @semester="chooseSemester" @yearArray="coYearClick"
                 pickerType="course"></term-picker>
    <view class="cu-modal" :class="modalName=='SemesterModal'?'show':''">
      <view class="cu-dialog">
        <view class="bg-white margin-sm">
          <view class="text-left text-bold text-xl padding-sm">
            学年选择
          </view>
          <view class="grid col-3 bg-white">
            <view v-for="(item, index) in yearArray" :key="index" class="padding-xs">
              <button class="cu-btn blue block" :class="item.value==year?'bg-blue':'line-blue'"
                      @click="year = item.value">
                {{ item.title }}
              </button>
            </view>
          </view>
          <view class="text-left text-bold text-xl padding-sm">
            学期选择
          </view>
          <view class="grid col-3 bg-white">
            <view class="padding-xs" v-for="(item, index) in termArray" :key="index">
              <button class="cu-btn blue block" :class="item.value==semester?'bg-blue':'line-blue'"
                      @click="semester = item.value">
                {{ item.title }}
              </button>
            </view>
          </view>
        </view>
        <view class="cu-bar bg-white">
          <view class="action margin-0 flex-sub text-gray solid-left" @click="modalName = null">取消</view>
          <view class="action margin-0 flex-sub text-green solid-left" @click="getCourse">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import termPicker from '@/components/term-picker/term-picker'

export default {
  data() {
    return {
      yearArray: [],
      termArray: [],
      semester: "",
      year: "",
      CustomBar: this.CustomBar,
      StatusBar: this.StatusBar,
      modalName: "",
      weekIndex: 0, // 周数索引
      trueWeek: 0, // 真实周数
      dayArray: [], // 存放本周日期
      month: 1, //存放当前月
      dayOfWeek: ['一', '二', '三', '四', '五', '六', '日'],
      thisDay: 1, //今天周几
      bacimg: "",
      baseImg:"",
      timeSlice: [
        {
          's': '08:00',
          'e': '08:50'
        }, {
          's': '08:55',
          'e': '09:45'
        }, {
          's': '10:15',
          'e': '11:05'
        }, {
          's': '11:10',
          'e': '12:00'
        }, {
          's': '14:00',
          'e': '14:50'
        }, {
          's': '14:55',
          'e': '15:45'
        }, {
          's': '16:15',
          'e': '17:05'
        }, {
          's': '17:10',
          'e': '18:00'
        }, {
          's': '19:00',
          'e': '19:50'
        }, {
          's': '19:55',
          'e': '20:45'
        }, {
          's': '20:50',
          'e': '21:40'
        },
      ],
      courseList: [],
      // 存放开学日期
      startDayList: [],
    };
  },
  components: {
    termPicker
  },
  created() {
    this.init()
  },
  methods: {
    init: function () {
      this.$reqs(":8081/startdate", "GET", {}, res => {

        if (res.code == 200) {
          this.startDayList = res.data;
        }
      })
      this.bacimg = uni.getStorageSync('bacimg') ? uni.getStorageSync('bacimg') : this.baseImg
      const courseList = uni.getStorageSync('course_list')
      // this.$reqs(":8081/schedule/class", 'GET', {
      //   'classNo': uni.getStorageSync('user_info').classNo,
      //   'year': this.year,
      //   'semester': this.semester
      // }, res => {
      //   if (res.code == 200) {
      //     this.courseList = res.data;
      //   }
      // })
      if (courseList) {
        this.courseList = courseList
      }
      // 设置开学时间
      let value = wx.getStorageSync('start_day')

      if (!value) {
        let tempDay = this.startDayList[0].replace("-", "/").replace("-", "/")
        // console.log(temp_day)
        uni.setStorageSync('start_day', tempDay + ' 00:00:00')
        value = tempDay + ' 00:00:00'
      }
      // 计算相差天数判断周数
      // console.log('相差天数：' + this.dateMinus(value))
      let subWeek = parseInt(this.dateMinus(value) / 7) + 1;
      console.log('第' + subWeek + '周')
      // 计算周数
      if (subWeek > 0 && subWeek < 21) {
        this.trueWeek = subWeek
        this.weekSelector(subWeek - 1)
      } else {
        this.trueWeek = "学期不在其区间"
        this.weekSelector(0)
      }
      // 设置今天周几
      this.getDay()

    },
    dateMinus: function (whichDay) {
      const sdate = new Date(whichDay);
      const now = new Date();
      const days = now.getTime() - sdate.getTime();
      const day = parseInt(days / (1000 * 60 * 60 * 24));
      return day;
    },
    getYearArray: function () {
      let year_array = []
      let this_year = new Date().getFullYear()
      for (let i = this_year - 3; i < this_year + 1; i++) {
        let temp_year = parseInt(i) + '-' + parseInt(i + 1)
        year_array.push(temp_year)
      }
      year_array.push('全部学年')
      return year_array.reverse()
    },

    chooseSemester: function (e) {
      this.semester = e
    },
    chooseYear: function (e) {
      this.year = e
    },
    coYearClick: function (yearArray, termArray) {
      this.yearArray = yearArray
      this.termArray = termArray
    },
    // 获取今天周几
    getDay: function () {
      let date = new Date();
      let day = date.getDay()
      if (day) {
        this.thisDay = day
      } else {
        this.thisDay = 7
      }
    },
    // 获取今天距离某天相差天数

    // 周数变化,设置本周日期
    weekSelector: function (index) {
      let value = uni.getStorageSync("start_day")
      let myDate = new Date(value)
      myDate.setDate(myDate.getDate() + index * 7);

      let dayArray = []
      let mon = myDate.getMonth() + 1
      dayArray.push(this.$formatNumber(myDate.getDate()))
      for (let i = 0; i < 6; i++) {
        myDate.setDate(myDate.getDate() + 1)
        dayArray.push(this.$formatNumber(myDate.getDate()))
      }

      // console.log(mon, weekday)
      this.weekIndex = index //设置周数
      this.dayArray = dayArray //设置
      this.month = mon
      this.modalName = null
    },
    // 获取课表
    getCourse: function () {
      this.modalName = null
      this.$reqs(":8081/schedule/class", "GET", {
        year: this.year,
        semester: this.semester,
        classNo: uni.getStorageSync('user_info').classNo
      }, res => {
        if (res.code == 200)
          uni.setStorageSync('course_list', res.data)
        // const customCourse = uni.getStorageSync('CUSTOM-COURSE')
        // if (customCourse) {
        //     res.data.course_list.push(...customCourse)
        // }
        this.courseList = res.data
      })

    },
    // 添加课程
    addCourse: function () {
      uni.navigateTo({
        url: "../course/manage/manage",
        fail: res => {
          console.log(res)
        }
      })
    },
    // 背景图片设置
    bacChange: function (res) {
      uni.chooseImage({
        count: 1,
        success: res => {
          uni.getFileSystemManager().readFile({
            filePath: res.tempFiwlePaths[0], //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              // console.log('data:image/png;base64,' + res.data)
              let len = ('data:image/png;base64,' + res.data).length
              // console.log(len)
              if (len < 1048576) {
                this.bacimg = 'data:image/png;base64,' + res.data
                this.modalName = null
                uni.setStorageSync('bacimg', 'data:image/png;base64,' +
                    res.data)
              } else {
                uni.showModal({
                  content: '选择的图片大小超过限制!',
                  showCancel: false,
                })
              }
            }
          })
        }
      })
    },
    deleteAllSchedule() {
      uni.removeStorageSync("course_list")
     this.courseList = ''
      this.modalName = null
    },
    cancelImg() {
      uni.setStorageSync('bacimg', '')
      this.bacimg = this.baseImg
      this.modalName = null
    },
    setStartDay: function () {
      uni.showActionSheet({
        itemList: this.startDayList,
        success: res => {

          let value = this.startDayList[res.tapIndex]
          value = value.replace('-', '/').replace('-', '/')
          uni.setStorageSync('start_day', value + ' 00:00:00')
          this.init()

        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 显示课程点击详情
    showDetail: function (index) {
      const str = '地点：' + this.courseList[index].coursePlace + '\n' +
          '教师：' + this.courseList[index].courseTeacher + '\n' +
          '周次：' + this.courseList[index].weeks + '\n' +
          '学分：' + (this.courseList[index].courseCredits ? this.courseList[index].courseCredits : '空')
      uni.showModal({
        title: this.courseList[index].courseName,
        content: str,
        showCancel: true,
        confirmText: '删除',
        success: res => {
          if (res.confirm) {
            uni.showModal({
              content: '是否确认删除？',
              success: res => {
                if (res.confirm) {
                  let value = uni.getStorageSync('course_list')
                  value.splice(index, 1)
                  this.courseList = value
                  uni.setStorageSync('course_list', value)
                }
              }
            })
          }
        }
      })
    },
  },
  computed: {
    style() {
      return `height:calc(${this.CustomBar}px / 2);`
    },
    marginHeight() {
      let StatusBar = this.StatusBar;
      let CustomBar = this.CustomBar;
      return `height:calc(100vh - 100rpx - env(safe-area-inset-bottom) / 2 - ${CustomBar}px - 70rpx);`
    }
  },
}
</script>

<style lang="scss">
.cu-custom {
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  // align-items: ;

  // 顶部左侧打开抽屉
  .cu-left {
    width: 25vw;
    display: flex;
    flex-direction: row;

    position: relative;

    .left-rectangle {
      height: 50rpx;
      width: 80rpx;

      position: absolute;
      bottom: 14rpx;
    }

    .left-round {
      width: 66rpx;
      height: 66rpx;
      border-radius: 50%;

      box-shadow: 0 0 1rpx;

      position: absolute;
      left: 50rpx;
      bottom: 6rpx;

      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }

  .cu-center {
    width: 50vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    position: relative;

    .week-btn {
      position: absolute;
      bottom: 10rpx;
    }
  }

  .cu-right {
    width: 25vw;
  }
}

.course-bg {
  background-size: cover;
  background-position: center center;
}

.schedule-item {
  position: absolute;
  justify-content: center;
  align-items: center;
}

.schedule-text {
  top: 25%;
  position: relative;
}
</style>
