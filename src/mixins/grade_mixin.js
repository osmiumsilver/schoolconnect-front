import termPicker from '@/components/term-picker/term-picker'
import moment from '@/utils/moment'
export default {
    data() {
        return {
            yearArray: [],
            termArray: [],
            semester: "",
            year: "",
        }
    },
    components: {
        termPicker
    },
    methods: {
        // 查看详情分数
        detailGrade: function (e) {


            uni.showModal({

                title: e.courseName,
                content:'分数ID:'+e.id+"\n"
                    +'课程ID：'+e.id+"\n"
                    +'课程名称:'+e.courseName+"\n"
                    +'课程名称:'+e.courseName+"\n"
                    +'课程成绩:'+e.grade+"\n"
                    +'课程绩点:'+e.points+"\n"
                    +'课程学分:'+e.credits+"\n"
                    +'课程导入日期:'+moment(e.importDate).format('LLL')+"\n"
                    +'学年:'+e.year+"\n"
                    +'学期:'+e.semester+"\n"



                ,
                showCancel: false,
            })
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
    changeTab(evt) {
        this.currentIndex = evt.index
        console.log(evt)
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
    choChange: function (index) { //是否选中
        this.choFlag[index] = !this.choFlag[index]
        this.calcu()
    }
}
