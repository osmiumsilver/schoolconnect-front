<template>

    <view class="container">
        <cu-custom :isBack="true" bgColor="bg-orange-1">
            <view slot="backText">
                返回
            </view>
            <view slot="content">
                信息公告板
            </view>
        </cu-custom>
        <view v-if="role==0" class="header">
            <u-sticky bgColor="#fff">
                <u-tabs :inactiveStyle="white" :list="tabList" itemStyle="padding: 13px 22px"
                        style="'background-color: whitesmoke'" @change="tabChange"></u-tabs>
            </u-sticky>
        </view>

        <view v-if=" messages.length > 0 " class="content" style="padding-top:85rpx">
            <view v-if="messages.length" class="animation-slide-bottom margin list-container">
                <view class="list-head bg-blue-1">
                </view>
                <view v-for='(item, index) in messages' :key='index' :class="index%2?'bg-gray':'bg-white'"
                      class="list-item text-black">
                    <view class="list-subitem">
                        <text class="text-bold">{{ item.title }}</text>
                    </view>
                    <view class="list-subitem margin-top-sm">
                        <view class="flex-sub">
                            发送来源：{{ item.sender }}
                        </view>

                        <view>
                            时间：{{ item.submittedDate }}
                        </view>
                        <view class="flex-sub text-right">
                            <button v-if="item.sender==employeeId" class="cu-btn bg-orange-1 round shadow sm"
                                   style="margin-bottom: 2px" @click="deleteMessage(item)">
                                点击删除
                            </button>
                            <button class="cu-btn bg-orange-1 round shadow sm"
                                    @click="goDetail(item.id)">点击进入详情
                            </button>
                        </view>
                    </view>
                </view>
                <view class="list-head bg-blue-1">
                </view>
            </view>
            <i-load-more v-if=" bottomLoading "></i-load-more>
            <i-load-more v-if=" searchNone " loading="false" tip="没有更多数据"></i-load-more>
        </view>
        <view :style="'bottom: 8%;right:12%;' + (role > 3 ?'display:none':'')" class="scrollBox img-center"
              @tap="goAddMessages">
            <image mode="aspectFit" src="@/static/plus.png" style="width: 34rpx;height: 34rpx;"></image>
        </view>
        <view v-if="showBackTopBtn" class="scrollBox img-center" style="bottom: 18%;right:12%;" @tap="backTop">
            <image mode="aspectFit" src="@/static/menu.png" style="width: 34rpx;height: 34rpx;"></image>
            <!-- <view style="margin-top: -22rpx;font-size: 24rpx;">置顶</view> -->
        </view>

    </view>

</template>

<script>

export default {
    data() {
        return {
            tabList: [{
                name: '所有公告',
                status: 0
            }, {
                name: '我的公告',
                status: 1
            }],
            employeeId: uni.getStorageSync('user_info').employeeId,
            currentIndex: 0,
            role: uni.getStorageSync("user_info").role,
            emptyMsg: '暂未查询到相关数据',
            page: 1,
            messages: []
        };
    },

    onReachBottom() {
        this.page += 1;
        this.getData(page);
    },
    onShow() {
        this.getData();
    },

    methods: {
        deleteMessage(message) {

            console.log(message)




            uni.showModal({
                title: '提示',
                content: '是否删除？',
                showCancel: true,
                success: res => {
                    if (res.confirm) {
                        this.$reqs("/messageboard", "DELETE", message, res => {
                            if (res.code == 200) {
                                this.getData();
                            }
                        },err=>{
                            console.log(err)
                            uni.showToast({
                                title: '删除失败！',
                                icon: "error",
                                duration: 500
                            });
                        })
                    }
                },

            });


        },
        backTop() {
            this.showBackTopBtn = false;
            uni.pageScrollTo({
                scrollTop: 0,
                duration: 400
            });
        },

        tabChange(evt) {
            this.currentIndex = evt.index
            switch (evt.index) {
                case 0: {
                    this.getData()
                    return
                }
                case 1: {
                    this.getMyData()
                    return
                }

            }
            this.getData(evt.status)
        },

        goAddMessages() {
            uni.navigateTo({
                url: `/pages/home/messageboard/messageboard_publish`
            });
        },

        goDetail(id) {

            uni.navigateTo({
                url: '/pages/home/messageboard/messageboard_detail?detail=' + JSON.stringify(id)
            });

        },

        getData(page) {
            this.$reqs('/messageboard', 'GET', {}, res => {
                if (res.code == 200 && res.data) {
                    this.messages = res.data;
                }
            })
        },
        getMyData() {
            this.$reqs("/messageboard/my", "GET", {}, res => {
                if (res.code == 200 && res.data) {
                    this.messages = res.data
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/static/styles/message.scss';
@import '@/static/styles/audit.scss';
</style>
