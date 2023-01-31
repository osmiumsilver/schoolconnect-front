<template>
    <view>
<!--        <course v-show="PageCur=='course'" ref="course"></course> -->
        <home v-show="PageCur=='home'" ref="home"></home>
        <my v-show="PageCur=='my'" ref="my"></my>
        <view class="cu-bar tabbar bg-white shadow foot">
<!--           <view class="action" @click="NavChange" data-cur="course">
                <view class='cuIcon-cu-image' :class="PageCur=='course'?'animation-scale-up':''">
                    <image :src="'/static/tabbar/course' + [PageCur=='course'?'_cur':''] + '.png'"></image>
                </view>
                <view :class="PageCur=='course'?'text-black':'text-gray'">课表</view>
            </view> -->
            <view class="action" @click="NavChange" data-cur="home">
                <view class='cuIcon-cu-image' :class="PageCur=='home'?'animation-scale-up':''">
                    <image :src="'/static/tabbar/home' + [PageCur == 'home'?'_cur':''] + '.png'"></image>
                </view>
                <view :class="PageCur=='home'?'text-black':'text-gray'">主页</view>
            </view>
            <view class="action" @click="NavChange" data-cur="my">
                <view class='cuIcon-cu-image' :class="PageCur=='my'?'animation-scale-up':''">
                    <image :src="'/static/tabbar/my' + [PageCur == 'my'?'_cur':''] + '.png'"></image>
                </view>
                <view :class="PageCur=='my'?'text-black':'text-gray'">我的</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                PageCur: 'home'
            }
        },
        methods: {
            NavChange: function(e) {
                this.PageCur = e.currentTarget.dataset.cur
                this.indexInit()
            },
            indexInit: function() {
                switch (this.PageCur) {
                    case "home":
                        this.$refs.home.init();
                        break;
                    case "my":
                        this.$refs.my.init();
                        break;

                }
            }
        },
        onLoad(options) {
            if (options.PageCur) {
                this.PageCur = options.PageCur
            }
        },
        onShow: function() {
            this.indexInit()
        },
        onShareAppMessage: function(res) {
            return {
                title: '校园服务台',
                path: '/pages/index/index?PageCur=' + this.PageCur
            }
        }
    }
</script>

<style>

</style>
