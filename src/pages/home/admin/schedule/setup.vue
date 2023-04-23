<template>
    <view>
        <cu-custom :isBack="true" bgColor="bg-blue-11">
            <view slot="backText">
                返回
            </view>
            <view slot="content">
                安排课程
            </view>
        </cu-custom>
        <view>
            <u-search v-model='searchModel' :clearabled="true" :showAction="false" bgColor="white" height="50"
                      inputAlign="center" placeholder="请输入课程名称'"></u-search>
            <view v-if="searchList.length" class="animation-slide-bottom margin list-container">
                <view class="list-head bg-blue-1">
                    <view class="">
                        课程名
                    </view>
                    <view class="">
                        选中
                    </view>
                </view>
                <radio-group style="display:block" @change="radioChange">
                    <view v-for='(item, index) in searchList' :key='index' :class="index%2?'bg-gray':'bg-white'"
                          class="list-item text-black">
                        <view class="list-subitem">
                            <text class="text-bold">{{ item.courseName }}</text>
                            <radio :checked="index===current" :value="item.courseName" class="cyan sm"></radio>
                        </view>

                        <view class="list-subitem margin-top-sm">
                            <view class="flex-sub text-left">
                                课程号：{{ item.courseNo }}
                            </view>
                            <view class="flex-sub text-center">
                                教师姓名：{{ item.courseTeacherName }}
                            </view>
                            <view class="flex-sub text-right">
                                <button class="cu-btn bg-orange-1 round shadow sm"
                                        @click="detailGrade(item)">点击查看详情
                                </button>
                            </view>
                        </view>
                    </view>
                </radio-group>
                <view class="list-head bg-blue-1">
                </view>
            </view>
        </view>

        <view class="cu-list menu sm-border">
            <view class="cu-bar bg-white margin-top-sm">
                <view class="action">
                    <text class="cuIcon-titles text-green"></text>
                    <text class="text-xl text-bold">课程时间</text>
                </view>
            </view>
            <view class="cu-item">
                <view class="content">
                    <text class="text-black">周次</text>
                </view>
                <view class="action">
                    <button class="cu-btn bg-green shadow" @click="modalName='ZcModal'">{{ courseItem.zcdd }}</button>
                </view>
            </view>
            <view class="cu-item">
                <view class="content">
                    <text class="text-black">节次</text>
                </view>
                <view class="action">
                    <picker :range="jcList"
                            :value="[courseItem.dayOfWeek,courseItem.startingPeriod,courseItem.lastingPeriods]"
                            mode="multiSelector"
                            @change="jcChange">
                        <button class="cu-btn bg-green shadow">
                            星期{{ xqList[courseItem.dayOfWeek] }}
                            {{ courseItem.startingPeriod }}-{{
                            (courseItem.startingPeriod + courseItem.lastingPeriods)
                            }}节
                        </button>
                    </picker>
                </view>
            </view>
            <view class="cu-bar bg-white solid-bottom">
                <view class="action">
                    <text class="cuIcon-title text-orange"></text>
                    选择学期
                </view>
                <view class="action">
                    <term-picker @confirm="confirmClick" @semester="semesterClick" @year="yearClick" @disableall='true'></term-picker>
                </view>
            </view>

        </view>
        <view class="margin padding bg-white" style="border-radius:20rpx;">
            <view>
                <u--input
                        v-model="courseItem.classNo"
                        border="surround"
                        placeholder="请输入班级号"

                ></u--input>
            </view>
            <view class="flex flex-direction">
                <button class="cu-btn bg-orange-1 round shadow-blur lg" @click="add">添加</button>
            </view>
        </view>
        <view :class="modalName=='ZcModal'?'show':''" class="cu-modal bottom-modal">
            <view class="cu-dialog">
                <view class="cu-bar bg-white">
                    <view class="action text-blue" @click="modalName = null">单选</view>
                    <view class="action text-green" @click="modalName = null">确定</view>
                </view>
                <view class="grid col-4 padding-sm bg-gray">
                    <view v-for="(item, index) in 20" :key="index" class="padding-xs" wx:key="week">
                        <button :class="getZcd(index+1)?'bg-blue':'line-blue'" class="cu-btn blue block"
                                @click="weekChange(index+1)">
                            第{{ index + 1 }}周
                        </button>
                    </view>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
import mixin from "@/mixins/grade_mixin";
import search_empty_message_mixin from "@/mixins/search_empty_message_mixin";
import termPicker from '@/components/term-picker/term-picker'

export default {
    mixins: [mixin, search_empty_message_mixin], // 引入可复用的代码
    components: {
       termPicker
    },
    data() {
        return {
            yearArray: [],
            termArray: [],
            current: 0,
            modalName: '',
            searchModel: "",
            searchList: [],
            courseItem: {
                classNo: '',
                courseNo: '',
                startingPeriod: 3, // 开始节次
                lastingPeriods: 2, // 持续节次
                weeks: [2, 3, 4, 6], // 周次
                zcdd: "2-3,6周", // 周次简称
                dayOfWeek: 2,
                semester:2022,
                year:1,
            },
            xqList: ['', '一', '二', '三', '四', '五', '六', '日'],
            jcList: [
                ["星期数", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日",],
                ["开始节次", "开始于第1节", "开始于第2节", "开始于第3节", "开始于第4节", "开始于第5节", "开始于第6节", "开始于第7节", "开始于第8节",
                    "开始于第9节", "开始于第10节",
                ],
                ["持续节次", "持续1节", "持续2节", "持续3节", "持续4节", "持续5节", "持续6节", "持续7节", "持续8节",],
            ],
        };
    },
    watch: {
        searchModel(newValue) {
            if (newValue) {
                this.searchData(true);
            } else {
                this.searchData(false);
            }
        },
    },
    onLoad() {
        this.getCourse()
    },
    methods: {
        semesterClick(e) {
            console.log(e)
            this.courseItem.semester = e
        },
        yearClick(e) {
            console.log(e)
            this.courseItem.year = e
        },

        detailGrade(e) {
            uni.showModal({

                title: e.courseName,
                content: '课程ID:' + e.id + "\n"
                    + '课程英文：' + e.courseNameEn + "\n"
                    + '课程时长:' + e.courseDuration + " 节" + "\n"
                    + '课程介绍:' + e.courseDesc + "\n"
                    + '课程地点:' + e.coursePlace + "\n"
                    + '课程学分:' + e.courseCredits + "\n"
                    + '课程教师工号:' + e.courseTeacher + "\n"
                    + '课程教师姓名:' + e.courseTeacherName + "\n"


                ,
                showCancel: false,
            })

        },
        radioChange: function (evt) {
            console.log(evt)
            for (let i = 0; i < this.searchList.length; i++) {
                if (this.searchList[i].courseName === evt.detail.value) {
                    this.current = i;
                    this.courseItem.courseNo = this.searchList[i].courseNo
                    break;
                }
            }
        },
        getCourse() {
            this.$reqs(":8081/admin/course/", "GET", {}, res => {
                if (res.code == 200) {
                    this.searchList = res.data
                   this.courseItem.courseNo= this.searchList[0].courseNo
                }
            })

        },
        searchData(bool) {
            if (bool) {
                // 前端实现模糊查询--不用对接口
                let newListData = []; // 用于存放搜索出来数据的新数组
                if (this.searchModel) {
                    this.searchList.filter((item) => {
                        if (item.courseName.indexOf(this.searchModel) !== -1) {
                            newListData.push(item);
                        }
                    });
                }
                this.searchList = newListData;
            } else {
                this.getCourse()
            }
        },
        getZcd: function (index) {
            if (this.courseItem.weeks.indexOf(index) != -1) {
                return true;
            } else {
                return false;
            }
        },
        // 改变节次
        jcChange: function (e) {
            console.log(e.detail.value)
            const value = e.detail.value
            this.courseItem.dayOfWeek = value[0] ? value[0] : 1
            this.courseItem.startingPeriod = value[1] ? value[1] : 1
            this.courseItem.lastingPeriods = value[2] ? value[2] : 1
        },
        // 周次数组转字符串
        zcLToS: function (weeks) {
            let s = [];
            let flag = false
            for (let i = 0; i < weeks.length; i++) {
                if (i == 0) {
                    s.push(weeks[i])
                } else if (weeks[i - 1] + 1 == weeks[i]) {
                    flag = true
                } else if (weeks[i - 1] + 1 != weeks[i]) {
                    let t = s.pop()
                    if (flag) {
                        s.push(t + "-" + weeks[i - 1])
                    } else {
                        s.push(t.toString())
                    }
                    flag = false
                    s.push(weeks[i])
                } else {
                    s.push(weeks[i])
                }
            }
            let t = s.pop()
            if (flag) {
                s.push(t + "-" + weeks[weeks.length - 1])
            } else {
                s.push(t.toString())
            }
            return s.join(",") + '周'
        },
        // 周次改变
        weekChange: function (index) {
            let weeks = this.courseItem.weeks
            const zxdIndex = weeks.indexOf(index)
            if (zxdIndex != -1) {
                weeks.splice(zxdIndex, 1);
            } else {
                weeks.push(index);
                weeks.sort(function (x, y) {
                    if (x < y) {
                        return -1;
                    } else if (x > y) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
            }
            this.courseItem.zcdd = this.zcLToS(weeks)
            this.courseItem.weeks = weeks
        },
        // 添加课程
        add: function () {

            if (this.courseItem.classNo == '' || this.courseItem.classNo == null) {
                uni.showModal({

                    content: '请输入班级号！',
                    showCancel: false,

                });
                return;
            }
            uni.showModal({
                title: '提示',
                content: '是否添加课程？',
                showCancel: true,
                success: res => {
                    if (res.confirm) {
                        this.$reqs(":8081/schedule/class", "POST", this.courseItem, res => {
                            if (res.code == 200 && res.data == true) {
                                uni.showModal({
                                    content: "添加成功",
                                    showCancel: false
                                })
                            }
                        }, err => {
                          console.log(err)
                            uni.showModal({
                                content: "添加失败，请确保课程不冲突",
                                showCancel: false
                            })
                        })
                    }
                },

            });


        }
    }

}
</script>

<style lang="scss">

</style>
