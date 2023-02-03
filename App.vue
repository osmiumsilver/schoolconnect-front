<script>
    import Vue from 'vue'
import { login, rootUrl,wechatLogin } from './utils/util';
    export default {
        onLaunch: function() {
            console.log('App Launch')
            // #ifdef MP-WEIXIN
            uni.getSystemInfo({
                success: function(e) {
                    Vue.prototype.StatusBar = e.statusBarHeight;
                    let custom = uni.getMenuButtonBoundingClientRect();
                    Vue.prototype.Custom = custom;
                    Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
                    console.log(Vue.prototype.StatusBar)
                    console.log(Vue.prototype.Custom)
                    console.log(Vue.prototype.CustomBar)
                }
            })
            // #endif

            // #ifdef MP-QQ
            uni.getSystemInfo({
                success: e => {
                    Vue.prototype.StatusBar = e.statusBarHeight;
                    let custom = {
                        width: 80,
                        height: 30,
                        left: e.windowWidth - 12 - 80,
                        right: e.windowWidth - 12,
                        top: e.statusBarHeight + 10,
                        bottom: e.statusBarHeight + 10 + 30
                    };
                    Vue.prototype.Custom = custom;
                    Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
                }
            })
            // #endif
			
wechatLogin();
            // this.globalData = {
            //     thisDay: this.getDay(),
            //     yearArray: this.getYearArray(),
            //     yearArrayIndex: [4, 2],
            // }
            // console.log(this.globalData)

        },
        onShow: function() {
            console.log('App Show')
        },
        onHide: function() {
            console.log('App Hide')
        },
        globalData: {
        }
    }
</script>

<style lang="scss">
    @import "colorui/main.css";
    @import "colorui/icon.css";
    /* 引入动画 */
    @import "colorui/animation.css";
    @import "custom/color.css";

    /* 列表展示 */
    .list-container {
        border-radius: 20rpx;
        overflow: hidden;
        box-shadow: 0rpx 0rpx 10rpx rgba(26, 26, 26, 0.2);

        .list-head,
        .list-subitem {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        .list-head,
        .list-item {
            padding: 10rpx;
        }
    }
</style>
