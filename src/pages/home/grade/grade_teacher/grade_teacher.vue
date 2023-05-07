<template>

    <view>
        <cu-custom :isBack="true" bgColor="bg-orange-1">
            <view slot="backText">
                返回
            </view>
            <view slot="content">
                平均成绩:{{ averageGrade }}
            </view>
        </cu-custom>
        <view class="cu-bar bg-white solid-bottom">
            <view class="action">
                <text class="cuIcon-title text-orange"></text>
                选择学期
            </view>
            <view class="action">
                <term-picker @confirm="confirmClick" @semester="semesterClick" @year="yearClick"></term-picker>
            </view>
        </view>
        <uni-combox v-model="value1" :candidates="classList" class="noflex text-wrapper"></uni-combox>
        <uni-combox v-model="value2" :candidates="courseList" class="noflex text-wrapper"></uni-combox>


        <!-- 主体展示页面 -->
        <view v-if="gradeList.length" class="animation-slide-bottom margin list-container">
            <view class="list-head bg-blue-1">
                <view class="">
                    {{this.courseName}}
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
                        <text class="text-bold" v-if="item.awaitingRevision==1">正在等待审核\n</text>
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
import moment from "@/utils/moment";

export default {
    mixins: [mixin, search_empty_message_mixin], // 引入可复用的代码
    name: "grade_teacher.vue",
    data() {
        return {
            value1: '',
            courseName:'',
            value2: '',
            classList: [],
            courseList: [],
            gradeList: [],
            semester: '',
            year: '',
            averageGrade:'',
        };
    },
    onLoad() {
        this.$reqs("/teacher/class", "GET", {}, res => {
            if (res.code == 200 && res.data) {
                this.classList = res.data
            }
        })
        this.$reqs("/course/by_teacher", "GET", {}, res => {
            if (res.code == 200 && res.data) {
                this.courseList = res.data
            }
        })
    },
    methods:
        {
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
            getGrade() {
                this.$reqs("/grade/by_class", "GET", {
                    courseId: this.value2,
                    clazzId: this.value1,
                    year: this.year,
                    semester: this.semester
                }, res => {
                    if (res.code == 200 && res.data) {
                        this.gradeList = res.data
                        this.choFlag = new Array(res.data.length).fill(true)
                        this.calcu();
                    }
                })
                this.$reqs("/course/get-name", "GET", {courseId:this.value2}, res => {
                          if (res.code == 200) {
                            this.courseName = res.data
                          }
                        })

            },
            detailGrade: function (e) {


                uni.showModal({

                    title: e.courseName,
                    content: '分数ID:' + e.id + "\n"
                        + '课程ID：' + e.id + "\n"
                        + '课程名称:' + e.courseName + "\n"
                        + '课程名称:' + e.courseName + "\n"
                        + '课程成绩:' + e.grade + "\n"
                        + '课程绩点:' + e.points + "\n"
                        + '课程学分:' + e.courseCredits + "\n"
                        + '课程导入日期:' + moment(e.importDate).format('LLL') + "\n"
                        + '学年:' + e.year + "\n"
                        + '学期:' + e.semester + "\n"


                    ,
                    showCancel: true,
                    cancelText:'确定',
                    confirmText:'修改成绩',
                    complete: (res) => {
                        if (res.confirm) {

                            wx.showModal({
                                editable: true,//显示输入框
                                placeholderText: '请留下您的联系方式',//显示输入框提示信息
                                success: res => {
                                    if (res.confirm) { //点击了确认
                                        if (!res.content) {
                                            uni.showModal({
                                                title: '提示',
                                                content: '请输入新成绩！',
                                                showCancel: false,
                                            })
                                            return
                                        }
                                       this.$reqs("/grade", "PATCH", {id:e.id,grade:res.content,awaitingRevision:1}, res => {
                                                 if (res.code == 200&&res.data==true) {
                                                   this.getGrade = res.data
                                                 }
                                               })
                                    }

                                }
                            })

                        }


                    }
                })
            },
            calcu(){
                let sumGrade=0;
                let count=0;
                for (let i = 0; i < this.gradeList.length; i++) {
                    if (this.choFlag[i]) {
                        count++;
                        sumGrade += parseFloat(this.gradeList[i].grade);
                    }
                }
                this.averageGrade = sumGrade / this.gradeList.length
            }
        },
}

</script>

<style scoped>

</style>
