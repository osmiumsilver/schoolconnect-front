<template>
    <view>
		
		<!-- Hidden Bind -->
        <home v-show="PageCur=='home'" ref="home"></home>
        <my v-show="PageCur=='my'" ref="my"></my>
		
		<!-- 下方菜单栏 -->
		
		<!-- 主页部分 -->
        <view class="cu-bar tabbar bg-white shadow foot">
            <view class="action" @click="NavChange" data-cur="home">
                <view class='cuIcon-cu-image' :class="PageCur=='home'?'animation-scale-up':''">
                    <image :src="'/static/tabbar/home' + [PageCur == 'home'?'_cur':''] + '.png'"></image>
                </view>
                <view :class="PageCur=='home'?'text-black':'text-gray'">主页</view>
				
		<!-- 我的部分 -->
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
				// 默认Page为主页
                PageCur: 'home' 
            }
        },
        methods: {
            NavChange: function(e) {
                this.PageCur = e.currentTarget.dataset.cur
                this.indexInit()   //加载Page
            },
			
		
			// 点击后重新加载Page
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
		
		
		
        onLoad(options) { //启动后初始化PageCur
            if (options.PageCur) {
                this.PageCur = options.PageCur
            }
        },
        onShow: function() {
            this.indexInit() //小程度渲染画面即开始加载Page
        },
		
		
        onShareAppMessage: function(res) { //分享小程序 的配置
            return {
                title: '校园服务台',
                path: '/pages/index/index?PageCur=' + this.PageCur
            }
        }
    }
</script>

<style>

</style>
