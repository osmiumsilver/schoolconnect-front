<template>
    <view class="container">
        <cu-custom :isBack="true" bgColor="bg-blue-1" style="color: whitesmoke">
            <view slot="backText">
                返回
            </view>
            <view slot="content">
                活动详情
            </view>
        </cu-custom>
        <view class="header-status-card">
            <text :style="[{background: applyStatusColor}]" class="dot"></text>
            <text>活动
                <text v-if="applyStatusText">{{ applyStatusText }}</text>
            </text>
        </view>
        <view class="main-detail-list">
            <view class="content-view border-bottom">
                <view class="label-item">
                    <text class="title">发起人：</text>
                    <text>{{ campaignDetail.campaignLauncherUsername }}</text>
                </view>
                <view class="label-item">
                    <text class="title">活动地点：</text>
                    <text>{{ campaignDetail.campaignLocation }}</text>
                </view>
                <view class="label-item">
                    <text class="title">活动描述：</text>
                    <text>{{ campaignDetail.campaignDescription }}</text>
                </view>
                <view class="label-item">
                    <text class="title">联系电话：</text>
                    <text>{{ campaignDetail.contactPhone }}</text>
                    <text class="copy-btn" @click="copyApplyPhone">复制</text>
                </view>
                <view class="label-item">
                    <text class="title">活动日期：</text>
                    <text>{{ campaignDetail.campaignTime }}</text>
                </view>
            </view>
            <view class="footer-view">
                <view v-if="!(campaignDetail.campaignStatus === 2)" class="actions-item" @click="callApplyPhone">
                    <text>一键联系</text>
                </view>
                <!--                已参加 未签到 活动已经开始-->
                <view v-if="(participated && !checkedIn && campaignDetail.campaignStatus === 1)"
                      class="actions-item item-1"
                      @click="checkInOrCheckOut(true)">
                    <text>签到</text>
                </view>
                <view v-if="(participated && checkedIn && campaignDetail.campaignStatus === 1)"
                      class="actions-item item-2"
                      @click="checkInOrCheckOut(false)">
                    <text>签退</text>
                </view>
                <!--                已报名 活动未开始-->
                <view v-if="(!participated && campaignDetail.campaignStatus === 0)"
                      class="actions-item item-1"
                      @click="signUp(campaignDetail.campaignId)">
                    <text>报名参加</text>
                </view>
                <view v-if="(participated
                 && campaignDetail.campaignStatus === 0)"
                      class="actions-item item-2"
                      @click="signOut()">
                    <text>撤销报名</text>
                </view>


                <view v-if="(campaignDetail.campaignStatus === 2)" class="actions-item item-2">
                    <text>活动已结束</text>
                </view>
            </view>
            <view class="footer-view">
                <view v-if="(isAdmin && campaignDetail.campaignStatus === 0)" class="actions-item item-1"
                      @click="setCampaignStatus(1)">
                    <text>开始活动（启动签到）</text>
                </view>
                <view v-if="(isAdmin && campaignDetail.campaignStatus === 1)" class="actions-item item-2"
                      @click="setCampaignStatus(2)">
                    <text>设置活动结束</text>
                </view>
                <view v-if="(isAdmin && campaignDetail.campaignStatus === 0)" class="actions-item item-2"
                      @click="cancelCampaign">
                    <text>删除该活动</text>
                </view>
            </view>
        </view>
        <view>
            <view>
                <span v-if="!(campaignDetail.campaignStatus === 2)">目前</span>共有 {{ this.participants.length }} 人报名参加
            </view>
            <view class="flex-wrap flex margin-left-lg margin-top-lg">
                <view v-for="(item,index) in participants" :key="index" class="margin-left-lg">
                    <view @click="showParticipantsInfo(item)">
                        <u-avatar
                                :src="item.pictureUrl ? item.pictureUrl : 'https://iknow-pic.cdn.bcebos.com/32fa828ba61ea8d37b2e67bc910a304e251f587d?x-bce-process=image%2Fresize%2Cm_lfit%2Cw_600%2Ch_800%2Climit_1%2Fquality%2Cq_85%2Fformat%2Cf_auto'"
                                class="u-avatar-item"></u-avatar>
                        <u-text v-if="item.name" :text='item.name'></u-text>
                        <u-tag v-if="item.checkInStatus==1" text="已签到" plain size="mini" plainFill></u-tag>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

export default {
    data() {
        return {
            campaignDetail: null,
            yourContactPhone: '',
            participated: false,
            checkedIn: false,
            isAdmin: false,
            applyStatusText: null,
            applyStatusColor: '#e43d33',
            participants: [],
            myStatus: '',
        }
    },
    onLoad(options) {
        if (options.detail) {
            this.campaignDetail = JSON.parse(options.detail)
            this.applyStatus(this.campaignDetail.campaignStatus)

        }
        if (options.isAdmin) {
            this.isAdmin = JSON.parse(options.isAdmin)
        }

        this.$reqs(":8081/campaign/attendee/campaign_status", "GET", {campaignId: this.campaignDetail.id}, res => {
            if (res.code == 200 && res.data) {
                this.myStatus = res.data
                this.participated = res.data.amISignedUp
                this.checkedIn = res.data.amICheckedIn


            }
        })
        this.getParticipantsList()
        this.getCampaignInfo()


    },
    methods: {
        getCampaignInfo() {
            this.$reqs(":8081/campaign/" + this.campaignDetail.id, "GET", {}, res => {
                if (res.code == 200) {
                    this.campaignDetail = res.data
                }
            })
        },
        getParticipantsList() {
            this.$reqs(":8081/campaign/attendee/list_attendees", "GET", {campaignId: this.campaignDetail.id}, res => {
                if (res.code == 200) {
                    this.participants = res.data
                }
            })
        }
        ,
        signUp() {
            wx.showModal({
                editable: true,//显示输入框
                placeholderText: '请留下您的联系方式',//显示输入框提示信息
                success: res => {
                    if (res.confirm) { //点击了确认
                        if (!res.content) {
                            uni.showModal({
                                title: '提示',
                                content: '请输入您的电话号码',
                                showCancel: false,
                            })
                            return
                        }
                        this.$reqs(":8081/campaign/attendee", "POST", {
                            campaignId: this.campaignDetail.id,
                            attendeeId: uni.getStorageSync("user_info").employeeId,
                            contactPhone: res.content
                        }, res => {
                            if (res.code == 200 && res.data == true) {

                                wx.showToast({
                                    title: '报名成功',
                                    duration: 1000
                                })
                                setTimeout(() => {
                                    this.$reqs(":8081/campaign/" + this.campaignDetail.id, "GET", {}, res => {
                                        if (res.code == 200) {
                                            this.participated = true;
                                            this.campaignDetail = res.data
                                        }
                                    })
                                    this.getParticipantsList()
                                }, 1200)
                            } else
                                wx.showToast({
                                    title: '提交失败',
                                    icon: 'error',
                                    duration: 1000
                                })
                        })
                    }

                }
            })
        },
        signOut() {
            uni.showModal({
                    title: '温馨提示',
                    content: '是否取消报名?',
                    success: async (res) => {
                        if (res.confirm) {
                            this.$reqs(":8081/campaign/attendee" + "?userId=" + uni.getStorageSync("user_info").employeeId, "DELETE", this.myStatus.attendantId, res => {
                                if (res.data == true) {
                                    uni.showToast({
                                        title: '已退出报名',
                                        icon: 'success',
                                        duration: 1000
                                    })

                                    setTimeout(() => {

                                        this.participated = false;
                                        this.getParticipantsList()
                                    }, 1200)
                                } else {
                                    uni.showToast({
                                        title: '修改失败',
                                        icon: 'error',
                                        duration: 1000
                                    })
                                }
                            })


                        }
                    }
                }
            )
        }
        ,
        setCampaignStatus(status) {

            switch (status) {
                case 1:
                    uni.showModal({
                            title: '温馨提示',
                            content: '是否开始该活动?',
                            success: async (res) => {
                                if (res.confirm) {
                                    this.campaignDetail.campaignStatus = status
                                    this.$reqs(":8081/campaign", "PATCH", this.campaignDetail, res => {
                                        console.log(res);
                                        if (res.data == true) {
                                            uni.showToast({
                                                title: '已修改为开始状态',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            setTimeout(() => {
                                                this.campaignDetail.campaignStatus = 1
                                                this.getParticipantsList()
                                            }, 1100)
                                        } else {
                                            uni.showToast({
                                                title: '修改失败',
                                                icon: 'error',
                                                duration: 1000
                                            })
                                        }
                                    })


                                }

                            }

                        }
                    )
                    return
                case 2:
                    uni.showModal({
                            title: '温馨提示',
                            content: '是否结束该活动?',
                            success: async (res) => {
                                if (res.confirm) {
                                    this.campaignDetail.campaignStatus = status
                                    this.$reqs(":8081/campaign", "PATCH", this.campaignDetail, res => {

                                        if (res.data == true) {
                                            uni.showToast({
                                                title: '已设为结束',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            setTimeout(() => {
                                                this.campaignDetail.campaignStatus = 2
                                                this.getParticipantsList()
                                            }, 1200)
                                        } else {
                                            uni.showToast({
                                                title: '修改失败',
                                                icon: 'error',
                                                duration: 1000
                                            })
                                        }
                                    })


                                }
                            }
                        }
                    )
            }
        }
        ,
        showParticipantsInfo(info) {
            if(this.isAdmin===true) {
                let str = "姓名：" + info.name + "\n" +
                    "工号：" + info.attendeeId + "\n" +
                    "联系方式：" + info.contactPhone + "\n" +
                    "报名ID：" + info.id + "\n"
                uni.showModal({
                    title: '信息',
                    content: str,
                    cancelText: '返回',
                    confirmText: '拨打电话',
                    showCancel: true,
                    success: async (res) => {
                        if (res.confirm) {
                            uni.makePhoneCall({
                                phoneNumber: info.contactPhone
                            })
                        }
                    }
                });
            }
        }
        ,
        applyStatus(status) {
            this.applyStatusText = Number(status) === 0 ? '现正开放报名' : Number(status) === 1 ? '正在进行中' : '已经结束'
            this.applyStatusColor = Number(status) === 0 ? '#18bc37' : Number(status) === 1 ? '#f3a73f' : '#e43d33'
        }
        ,
// 撤销申请
        cancelCampaign() {
            uni.showModal({
                    title: '温馨提示',
                    content: '是否删除该活动?',
                    success: async (res) => {
                        if (res.confirm) {
                            this.$reqs(":8081/campaign", "DELETE", this.campaignDetail, res => {
                                console.log(res);
                                if (res.data == true) {
                                    uni.showToast({
                                        title: '删除成功',
                                        icon: 'success',
                                        duration: 1000
                                    })
                                    setTimeout(() => {
                                        uni.navigateBack(-1)
                                    }, 1100)
                                } else {
                                    uni.showToast({
                                        title: '删除失败',
                                        icon: 'error',
                                        duration: 1000
                                    })
                                }
                            })


                        }
                    }
                }
            )
        }
        ,
// 一键联系
        callApplyPhone() {
            uni.makePhoneCall({
                phoneNumber: this.campaignDetail.contactPhone
            })
        }
        ,
// 一键复制
        copyApplyPhone() {
            uni.setClipboardData({
                data: this.campaignDetail.campaignPhone,
            })
        },
        checkInOrCheckOut(bool) { //TRUE FOR SignIn FALSE FOR SignOut
            switch (bool) {
                case true:
                    uni.showModal({
                            title: '温馨提示',
                            content: '确认签到?',
                            success: async (res) => {

                                if (res.confirm) {
                                    this.$reqs(":8081/campaign/attendee/check?" + "inOrOut=in&attendantId=" + this.myStatus.attendantId, "PATCH", {}, res => {
                                        if (res.data == true) {
                                            uni.showToast({
                                                title: '签到成功！',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            setTimeout(() => {
                                                this.checkedIn = true
                                                this.getParticipantsList()
                                            }, 1100)
                                        } else {
                                            uni.showToast({
                                                title: '修改失败',
                                                icon: 'error',
                                                duration: 1000
                                            })
                                        }
                                    })


                                }
                            }
                        }
                    )
                    return
                case false:
                    uni.showModal({
                            title: '温馨提示',
                            content: '确认签退?',
                            success: async (res) => {
                                if (res.confirm) {
                                    this.$reqs(":8081/campaign/attendee/check?" + "inOrOut=out&attendantId=" + this.myStatus.attendantId, "PATCH", {}, res => {
                                        console.log(res);
                                        if (res.data == true) {
                                            uni.showToast({
                                                title: '签退成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            setTimeout(() => {
                                                this.checkedIn = false;
                                                this.getParticipantsList()
                                            }, 1100)
                                        } else {
                                            uni.showToast({
                                                title: '修改失败',
                                                icon: 'error',
                                                duration: 1000
                                            })
                                        }
                                    })


                                }
                            }
                        }
                    )
            }
        }
    }
}
</script>
<style>
page {
    background-color: #fff;
}
</style>
<style lang="scss" scoped>
.u-avatar-item {
  margin-right: 30px;
}

.container {
  .header-status-card {
    height: 80rpx;
    line-height: 80rpx;
    background-color: #fff;
    box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);
    padding: 0 30rpx;

    .dot {
      display: inline-block;
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      margin-right: 10rpx;
    }
  }

  .main-detail-list {
    background-color: #fff;
    box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);

    .content-view {
      padding: 30rpx;
      position: relative;

      .label-item {
        padding: 10rpx 0;

        .title {
          color: #999;
        }

        .copy-btn {
          font-size: 26rpx;
          color: #1989fa;
          padding: 0 20rpx;
        }
      }
    }

    .footer-view {
      display: flex;
      font-size: 28rpx;
      padding: 30rpx 0;

      .actions-item {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
      }

      .item-1 {
        color: #07c160;
      }

      .item-2 {
        color: #e43d33;
      }

      .item-3 {
        color: rgba(134, 59, 57, 0.38);
      }
    }
  }

  .ad-banner {
    margin: -30rpx;

    view {
      width: 100%;
      position: fixed;
      bottom: 0;
    }
  }
}
</style>
