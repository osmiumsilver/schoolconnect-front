<!--suppress ALL -->
<template>
    <view class="container">
        <cu-custom :isBack="true" bgColor="bg-orange-1">
            <view slot="backText">
                返回
            </view>
            <view slot="content" style="display: unset !important;">
                活动区域
            </view>
        </cu-custom>
        <view>
            <view class="search">
                <view class="search-wrapper">
                    <u-search v-model='searchModel' :clearabled="true" :showAction="false" bgColor="white" height="50"
                              inputAlign="center"
                              placeholder="搜索活动"></u-search>


                </view>
            </view>
            <scroll-view scroll-y style="height: 100%">

                <!-- 活动详情界面 -->
                <view>
                    <u-swiper :list="banner"></u-swiper>
                    <!--            <view class="tag recommend">最热活动</view>-->

                </view>

                <view class="activities">
                    <u-sticky bgColor="#fff">
                        <u-tabs :inactiveStyle="white" :list="tabList" itemStyle="padding: 13px 22px"
                                style="'background-color: whitesmoke'" @change="tabChange"></u-tabs>
                        <u-tabs :inactiveStyle="white" :list="tabListForCampaignsISignedUp" itemStyle="padding: 13px 22px"
                                style="'background-color: whitesmoke'" @change="secondaryTabChange" v-if="currentIndex==3"></u-tabs>
                        <!--          <view class="activity" v-for="(item, index) in campaignList" :key="index">-->
                        <!--            <view class="list_header">-->
                        <!--              <view class="list_header_left">-->
                        <!--                <image mode="aspectFill" :src="item.publisherPic" v-if="'publisherPic'"></image>-->
                        <!--                <view>{{ item.campaignName }}</view>-->
                        <!--              </view>-->
                        <!--              <view class="content-date list_header_right">-->
                        <!--                <image src="static/icons/datetime-picker.png"></image>-->
                        <!--                <text>{{ item.campaignTime }}</text>-->
                        <!--                <image src="static/app-plus/location@3x.png"></image>-->
                        <!--                <text class="">{{ item.campaignLocation }}</text>-->
                        <!--  -->
                    </u-sticky>
                    <view class="card-list-view">
                        <block v-for="(item, index) in campaignList" :key="index">
                            <view class="card-list-view__item">
                                <view class="content border-bottom">
                                    <view class="content__left">
                                        <image v-if="item.campaignPic" :src="item.campaignPic"
                                               mode="aspectFill"></image>
                                    </view>
                                    <view class="content__right">
                                        <text class="location">{{ item.campaignName }}</text>
                                        <text class="desc">{{ item.campaignDescription }}</text>
                                        <text class="date">{{ item.campaignTime }}</text>
                                    </view>
                                </view>
                                <view class="card__footer">
                                    <text style="color: #1989fa;" @click="navToDetailPage(item)">查看详情</text>
                                </view>

                            </view>
                        </block>
                    </view>
                </view>
                <!-- 提示区域 -->
                <cu-empty :type="emptyType">
                    <view slot="text" class="">
                        <view class="margin-bottom-sm">{{ emptyMsg }}</view>
                        <button v-if="emptyType=='search'" class="cu-btn bg-orange-1 round shadow-blur"
                                @click="loadMore">刷新
                        </button>
                    </view>
                </cu-empty>
                <tab-shadow/>
                <view :style="'bottom: 8%;right:12%;'" class="scrollBox img-center"
                      @tap="goPublishCampaign">
                    <image mode="aspectFit" src="@/static/plus.png" style="width: 34rpx;height: 34rpx;"></image>
                </view>
            </scroll-view>
        </view>
    </view>


</template>
<script>

export default {
    data() {
        return {
            secondaryTabIndex:0,
            currentIndex: 0,
            searchModel: '',
            emptyType: '',
            emptyMsg: '',
            tabList: [{
                name: '报名中',
                status: 0
            }, {
                name: '进行中',
                status: 1
            }, {
                name: '已结束',
                status: 2
            }, {
                name: '我参加的',
                status: 3
            }, {
                name: '我发起的',
                status: 4
            }],
            tabListForCampaignsISignedUp: [
                {
                    name: '报名中',
                    status: 0
                }, {
                    name: '进行中',
                    status: 1
                }, {
                    name: '已结束',
                    status: 2
                }],
            userInfo: uni.getStorageSync("user_info"),
            campaignList: [],
            banner: [],
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
        this.getBanner();
    },
    onShow() {

        this.getData(this.currentIndex)
    },
    methods: {
        goPublishCampaign(){
            uni.navigateTo({
                url: `/pages/home/campaign/publish`
            });
        }
        ,
// 右上角搜索框--模糊查询
        searchData(bool) {
            if (bool) {
                // 前端实现模糊查询--不用对接口
                let newListData = []; // 用于存放搜索出来数据的新数组
                if (this.searchModel) {

                    this.campaignList.filter((item) => {
                        if (item.campaignName.indexOf(this.searchModel) !== -1) {
                            newListData.push(item);
                        }
                    });
                }
                this.campaignList = newListData;
            } else {
                this.getData(this.currentIndex)
            }
        },
        getBanner() {
            this.$reqs(":8081/campaign/banner", "GET", {}, res => {
                if (res.code == 200) {
                    this.banner = res.data
                }
            });
        },
        getData(status, callback) {
            this.$reqs(":8081/campaign", "GET", {status: status}, res => {
                if (res.code == 200) {
                    this.campaignList = res.data
                }
            }, err => {
            })
        },
        tabChange(evt) {
            this.secondaryTabIndex=0
            this.currentIndex = evt.index
            switch (evt.index) {
                case 3: {
                    this.fetchCampaignsISignedUp(this.secondaryTabIndex)
                    return
                }
                case 4: {
                    this.fetchCampaignsILaunched(this.secondaryTabIndex)
                    return
                }

            }
            this.getData(evt.status)
        },
        secondaryTabChange(evt) {
            this.secondaryTabIndex = evt.index
            this.fetchCampaignsISignedUp(evt.index)

        },
        fetchCampaignsISignedUp(status) {
            this.campaignList = []
            this.$reqs(":8081/campaign/isigned", "GET", {status: status}, res => {
                if (res.code == 200) {

                    this.campaignList = res.data
                }
            })
        },

        // 点击活动进入活动详情页面x
        navToDetailPage(e) {
            const isAdmin = uni.getStorageSync("user_info").role === 0 ? true :  uni.getStorageSync("user_info").employeeId == e.campaignLauncher ? true : false;
            uni.navigateTo({
                url: '/pages/home/campaign/detail?detail=' + JSON.stringify(e) + '&isAdmin=' + isAdmin
            })
        },

        //点击搜索
        click_search: function (search) {
            this.$reqs(":8081/campaign/search", "GET", {name: search}, res => {
                if (res.code == 200) {
                    this.campaignList = []
                    this.campaignList = res.data
                }
            })
        },
        fetchCampaignsILaunched() {
            this.$reqs(":8081/campaign/my", "GET", {}, res => {
                if (res.code == 200) {
                    this.campaignList = []
                    this.campaignList = res.data
                }
            })
        },
    }
}

</script>
<style lang="scss">
@import '@/common/repair.scss';

</style>

<style scoped>
@import '@/components/font.css';

page,
input,
textarea {
    font-family: 'Microsoft YaHei UI', 'PingFang SC', -apple-system-font, serif;
}

page {
    margin: 0;
    padding: 0;
    background: #fff;
    text-align: center;
    overflow-x: hidden;
}

.mpage {
    z-index: 10;
    position: fixed;
    bottom: 0;
    top: 0;
    background-color: #fff;
}



.item {
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    padding: 60rpx;
    border-bottom: 20rpx solid #dbdbdb;
}

.item image {
    height: 150rpx;
    width: 150rpx;
    border-radius: 50%;
    margin-right: 40rpx;
}

/*搜索*/

.search-wrapper {
    top: 0;
    left: 40px;

    width: 100%;
    z-index: 1;
    background-color: white;
}


.search-wrapper-blue {
    background-color: #1296db;
}

/*活动详情界面CSS*/

.list_header_left image {
    width: 60rpx;
    height: 60rpx;
    margin-right: 10rpx;
    float: left;
    border-radius: 40rpx;
    overflow: hidden;
}

.list_header view {
    float: left;
    line-height: 80rpx;
    color: #1e1e1e;
    font-size: 15px;
}

.list_header .list_header_right {
    float: right;
}

.list_header {
    overflow: hidden;
    border-bottom: 1rpx solid #f4f4f4;
}

/**/

swiper {
    height: 380rpx;
    margin-bottom: 20rpx;
}

swiper-item,
swiper-item image {
    width: 100%;
    height: 300rpx;
    border-radius: 15rpx;
    overflow: hidden;
}

.activities .subtitle {
    padding: 20rpx 35rpx;
    border-top: 20rpx solid #f4f4f4;
    background: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    top: 0;
    z-index: 999;
}

.activities .subtitle image {
    width: 42rpx;
    height: 42rpx;
    margin-right: 30rpx;
    flex-shrink: 0;
}

.activities .subtitle text {
    font-size: 28rpx;
    color: #666;
}

.activities .subtitle button {
    border-radius: 50rpx;
    border: 3rpx solid #3688ff;
    background: transparent;
    color: #3688ff;
    font-size: 26rpx;
    margin-left: 20rpx;
    margin-right: 0;
    padding: 6rpx 20rpx;
    line-height: 1rem;
}

.activity {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0 0 35rpx;
    margin: 0 40rpx;
    border-bottom: 10rpx solid #f4f4f4;
}


.tag {
    display: inline-block;
    background: #eee;
    color: #666;
    font-size: 28rpx;
    padding: 2rpx 10rpx;
    border-radius: 6rpx;
    margin-right: 10rpx;
}

.recommend {
    border-radius: 10rpx;
    border: 3rpx solid #3688ff;
    background: #118fff;
    color: #fff;
    font-size: 23rpx;
    margin-left: 10rpx;
    margin-right: 20rpx;
    padding: 3rpx 10rpx;
    line-height: 1rem;
}

.tag_1 {
    background: #fe6c01;
    color: #fff;
}

.tag_2 {
    background: #00cdab;
    color: #fff;
}

.tag_3 {
    background: #0e53a6;
    color: #fff;
}

.tag_4 {
    background: #1dd201;
    color: #fff;
}

.tag_5 {
    background: #fec401;
    color: #fff;
}

.tag_6 {
    background: #fe0701;
    color: #fff;
}

.tag_7 {
    background: #0c5da5;
    color: #fff;
}

.tag_8 {
    background: #e20149;
    color: #fff;
}

.tag_9 {
    background: #a54a00;
    color: #fff;
}

.title {
    font-size: 30rpx;
    color: #333;
    text-align: left;
}

.activity .photo {
    width: 100%; /* 670rpx */
    height: 320rpx;
    box-shadow: 0 10rpx 15rpx rgba(0, 0, 0, 0.1);
    border-radius: 12rpx;
    overflow: hidden;
    margin: 10rpx 0;
}

.activity .intro {
    font-size: 28rpx;
    color: #666;
    padding: 10rpx 0;
    text-align: justify;
}

.activity .time {
    font-size: 28rpx;
    color: #999;
    text-align: justify;
    padding-top: 10rpx;
}

.activity .location {
    font-size: 28rpx;
    color: #999;
    text-align: justify;
}

.bottom-tip {
    display: block;
    padding: 40rpx 0;
    font-size: 28rpx;
    color: #999;
    text-align: center;
}

/*第二个侧滑页cSS*/

li {
    list-style: none;
}

html,
body {
    width: 100%;
    min-height: 100%;
    background: #f0f0f0;
}

.h10 {
    background: #f0f0f0;
}

.h1 {
    height: 1px;
    margin-left: 50px;
    background: #f0f0f0;
    position: fixed;
}

.fr {
    float: right;
}

.hint {
    color: #666;
    font-size: 11px;
    margin-right: 5px;
}

.firstblock,
.secondblock,
.thirdblock {
    background-color: #fff;
    font-size: 16px;
}

/* 头部登陆 */

.loginbg {
    width: 100%;
    height: 416rpx;
    -webkit-filter: blur(2px);
    filter: blur(2px);
    position: relative;
}

/* 设置条目 */

.itemself {
    padding-bottom: 7.5px;
    padding-top: 7.5px;
    background-color: #fff;
    border-bottom: 1rpx solid rgb(230, 230, 230);
    margin-left: 25%;
    margin-right: 12.5%;
}

.itemself_ico {
    float: left;
    width: 20px;
    height: 20px;
}

.itemself_arrow {
    float: right;
    height: 26px;
    width: 26px;
    margin: 11px 20px;
}

.presshover {
    background-color: #fafafa;
}

.font_size {
    font-size: 16px;
    color: #333;
}

.bottom-box {
    width: 100%;
    text-align: center;
}

.list-box {
    width: 25%;
    float: left;
    border-bottom: 10rpx solid rgb(230, 230, 230);
    margin-left: 50px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.icon-text {
    height: 20px;
    line-height: 20px;
    font-size: 18px;
}

.user {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    border-right: 1px solid #dbdbdb;
    box-sizing: border-box;
}

.user .user-box {
    position: absolute;
    top: 0;
    bottom: 0;
}

.user .user-box .user-face-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0 20rpx 0;
}

.user .user-box .user-face {
    width: 150rpx;
    height: 150rpx;
    position: fixed;
    border-radius: 50%;
    -moz-box-shadow: 0px 3px 20px #333;
    -webkit-box-shadow: 0px 3px 20px #333;
    box-shadow: 0px 3px 20px #333;
}

.user .user-box .user-info {
    height: 30px;
    position: fixed;
    margin-top: 60px;
}

.user .user-box .user-info text {
    width: 200rpx;
    height: 28px;
    float: left;
}

.user .user-box .user-info image {
    height: 20px;
    width: 20px;
    float: left;
}

.user .user-box .one-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx;
    margin-bottom: 20rpx;
    color: white;
    font-size: 38rpx;
}
.scrollBox{
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: #1296db;
    border: 4rpx solid #eeeeee;
    box-shadow: 1rpx 1rpx 18rpx #cbcbcb;
    position: fixed;
    bottom: 12%;
    right: 8%;
    z-index: 9999;
    text-align: center !important;
}

.img-center{
    display: flex;
    align-items: center;
    vertical-align: center;
    justify-content: center;
    flex-direction: row;
}


/*---------------------------*/

.dialog {
    /*透明蒙层*/
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.2;
    z-index: 1000;
    color: #fff;
}
</style>
