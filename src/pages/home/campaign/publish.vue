<template>
    <view class="container">
        <cu-custom :isBack="true" bgColor="bg-orange-1">
            <view slot="backText">
                返回
            </view>
            <view slot="content">
                发布活动
            </view>
        </cu-custom>
        <view class="u-page">
            <view class="u-demo-block">
                <view class="u-demo-block__content">
                    <!--                    如果做校验 model prop ref缺一不可-->

                    <u--form
                            ref="form1"
                            :model="newCampaignData"
                            labelPosition="left"
                    >
                        <u-form-item
                                ref="item1"
                                borderBottom
                                label="发起者姓名"
                                prop="campaignLauncher"
                        >
                            <u-input
                                    v-model="myUserInfo.name"
                                    border="surround"
                                    disabled="disabled"
                                    placeholder="姓名,只能为中文"
                            ></u-input>
                        </u-form-item>
                        <u-form-item
                                ref="item2"
                                borderBottom
                                label="活动标题"
                                prop="campaignName"
                        >
                            <u-input
                                    v-model="newCampaignData.campaignName"
                                    border="surround"
                                    customStyle="background-color:#ffffff"
                                    placeholder="请输入标题"
                            ></u-input>
                        </u-form-item>

                        <u-form-item
                                ref="item3"
                                borderBottom
                                label="活动位置"
                                prop="campaignLocation"
                        >
                            <u-input
                                    v-model="newCampaignData.campaignLocation"
                                    border="surround"
                                    customStyle="background-color:#ffffff"
                                    placeholder="请输入位置"
                            ></u-input>
                        </u-form-item>


                        <u-form-item
                                ref="item4"
                                borderBottom
                                label="活动简介"
                                prop="campaignDescription"
                        >
                            <u-textarea
                                    v-model="newCampaignData.campaignDescription"
                                    count
                                    placeholder="不低于20个字"
                            ></u-textarea>
                        </u-form-item>

                        <u-form-item
                                ref="item5"
                                borderBottom
                                label="联系方式"
                                prop="contactPhone"
                        >
                            <u-input
                                    v-model="newCampaignData.contactPhone"
                                    border="surround"
                                    customStyle="background-color:#ffffff"
                                    placeholder="请输入联系方式"
                            ></u-input>
                        </u-form-item>
                        <u-form-item
                                borderBottom
                                label="活动日期"
                                labelWidth="80"
                                prop="campaignTime"
                                @click="showDateTimePicker = true; hideKeyboard()"
                        >
                            <u-input
                                    v-model="formattedTime"
                                    border="surround"
                                    disabled="disabled"
                                    disabledColor="#ffffff"
                                    placeholder="请挑选一个日期"
                                    @click="showDateTimePicker = true; hideKeyboard()"
                            ></u-input>
                            <u-icon
                                    slot="right"
                                    name="arrow-right"
                            ></u-icon>
                        </u-form-item>
                        <u-upload
                                :fileList="fileList1"
                                :maxCount="10"
                                multiple
                                name="1"
                                @afterRead="afterRead"
                                @delete="deletePic"
                        ></u-upload>
                    </u--form>
                    <u-button
                            customStyle="margin-top: 50px"
                            text="提交"
                            type="primary"
                            @click="submit"
                    ></u-button>
                    <u-button
                            customStyle="margin-top: 10px"
                            text="重置"
                            type="error"
                            @click="reset"
                    ></u-button>

                    <u-datetime-picker
                            ref="datetimePicker"
                            v-model="newCampaignData.campaignTime"
                            :formatter="formatter"
                            :minDate="Number(new Date())"
                            :show="showDateTimePicker"
                            closeOnClickOverlay
                            mode="datetime"
                            @cancel="DateTimePickerClose"
                            @close="DateTimePickerClose"
                            @confirm="DateTimePickerConfirm"
                    ></u-datetime-picker>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import {
    rootUrl,uuid
} from "@/utils/util.js"
import {timePicker, formatTime} from '@/utils/util1.js'

export default {
    name: "publish",

    data() {
        return {
            editing: 'false',
            formattedTime: '',
            myUserInfo: uni.getStorageSync('user_info'),
            showDateTimePicker: false,
            newCampaignData: {
                id:'',
                campaignName: '',
                campaignLauncher: uni.getStorageSync("user_info").employeeId,
                campaignDescription: '',
                campaignLocation: '',
                campaignTime: Number(new Date()),
                contactPhone: uni.getStorageSync("user_info").phone,
                campaignUrl: ''
            },
            fileList1: [],
            rules: {
                'campaignName': [{
                    type: 'string',
                    required: true,
                    message: '请填写标题',
                    trigger: ['blur', 'change']
                },
                    {
                        min: 2,
                        message: '不低于2个字'
                    }],
                'campaignLocation': {
                    type: 'string',
                    required: true,
                    message: '请填写地点',
                    trigger: ['blur', 'change']
                },
                'campaignDescription': [{
                    type: 'string',
                    required: true,
                    message: '请填写介绍',
                    trigger: ['blur', 'change']
                },
                    {
                        min: 2,
                        message: '不低于20个字'
                    }],

            },
            switchVal: false
        };

    },
    onShow() {
        this.formatTime()
    },
    onLoad(options) {
        if(this.newCampaignData.id=='' || this.newCampaignData.id==null)
        {
            this.newCampaignData.id=uuid();
        }
        if (options.detail) {
            this.newCampaignData = JSON.parse(options.detail)

        }
        if (options.isAdmin) {
            this.isAdmin = JSON.parse(options.isAdmin)
        }
        if (options.edit) {
            this.editing = JSON.parse(options.edit)
        }
    },
    onReady() {
        // 微信小程序需要用此写法

        this.$refs.datetimePicker.setFormatter(this.formatter)
        this.$refs.form1.setRules(this.rules)
    },
    methods: {
        deletePic(event) {
            this.$reqs(":8081/campaign/info/pics", "DELETE", {}, res => {
                      if (res.code == 200) {
                        this.swiperList = res.data
                      }
                    })
            this[`fileList${event.name}`].splice(event.index, 1)
        },
        // 新增图片
        async afterRead(event) {
            console.log(event)
            // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
            let lists = [].concat(event.file)
            let fileListLen = this[`fileList${event.name}`].length
            lists.map((item) => {
                this[`fileList${event.name}`].push({
                    ...item,
                    status: 'uploading',
                    message: '上传中'
                })
            })
            for (const element of lists) {
                const result = await this.uploadFilePromise(element.url)
                let item = this[`fileList${event.name}`][fileListLen]
                this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
                    status: 'success',
                    message: '',
                    url: result
                }))
                fileListLen++
            }
        },
        uploadFilePromise(url) {
            return new Promise((resolve, reject) => {
                let token = uni.getStorageSync("token");
                let a = uni.uploadFile({
                    url: rootUrl + ':8081/upload',
                    filePath: url,
                    name: 'file',
                    formData:{
                        campaignId: this.newCampaignData.id,
                        userId: uni.getStorageSync("user_info").employeeId
                    },
                    header: {
                        'Authorization': 'Bearer ' + token,
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    success: (res) => {
                        console.log(res)
                        setTimeout(() => {
                            resolve(res.data.data)
                        }, 1000)
                    }
                });
            })
        },
        formatTime() {
            this.formattedTime = timePicker(this.newCampaignData.campaignTime, 'datetime')
        },
        publishCampaign() {
            uni.showModal({
                title: '提示',
                content: '确认提交吗？',
                showCancel: true,
                success: res => {

                    if (res.confirm) {

                        this.newCampaignData.campaignTime = formatTime(this.newCampaignData.campaignTime)
                        if (this.editing == true) {
                            this.$reqs(":8081/campaign", "PATCH", this.newCampaignData, res => {
                                if (res.code == 200 && res.data == true) {

                                    wx.showToast({
                                        title: '发布成功',
                                        duration: 1000
                                    })
                                    setTimeout(() => {
                                        uni.navigateBack(-1)
                                    }, 1200)
                                } else
                                    wx.showToast({
                                        title: '提交失败',
                                        icon: 'error',
                                        duration: 1000
                                    })
                            })
                        }
                        this.$reqs(":8081/campaign", "POST", this.newCampaignData, res => {
                            if (res.code == 200 && res.data == true) {

                                wx.showToast({
                                    title: '发布成功',
                                    duration: 1000
                                })
                                setTimeout(() => {
                                    uni.navigateBack(-1)
                                }, 1200)
                            } else
                                wx.showToast({
                                    title: '提交失败',
                                    icon: 'error',
                                    duration: 1000
                                })
                        })
                    }
                },

            });
        },
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`
            }
            if (type === 'month') {
                return `${value}月`
            }
            if (type === 'hour') {
                return `${value}时`
            }
            if (type === 'minute') {
                return `${value}分`
            }
            return value
        },
        DateTimePickerClose() {
            this.showDateTimePicker = false
            this.$refs.form1.validateField('campaignTime')
        },
        DateTimePickerConfirm(e) {

            this.newCampaignData.campaignTime = e.value
            this.formatTime()
            this.showDateTimePicker = false
            this.formModel = uni.$u.timeFormat(e.value, 'yyyy-mm-dd')
            this.$refs.form1.validateField('campaignTime')
        },
        updatePics() {
            this.$reqs(":8081/ui/banner", "POST", {}, res => {
                if (res.code == 200) {
                    this.swiperList = res.data
                }
            })
        },
        submit() {
            // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
            this.$refs.form1.validate().then(res => {
                if (res == true)
                    this.publishCampaign()
            }).catch(err => {
                console.log(err)
                uni.$u.toast('校验失败')
            })
        },
        reset() {
            this.newCampaignData.campaignDescription = ''
            this.newCampaignData.campaignLocation = ''
            this.newCampaignData.campaignName = ''
        },
        hideKeyboard() {
            uni.hideKeyboard()
        }
    }

}
</script>
<style lang="scss" scoped src="@/static/styles/common_form.scss">

</style>
