<script>
import Vue from 'vue'
import {
  wechatLogin
} from './utils/util';

export default {
  onLaunch: function () {
    console.log('App Launch')
    // #ifdef MP-WEIXIN
    // colorui默认
    uni.getSystemInfo({
      success: function (e) {
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
    this.globalData = {
      thisDay: this.getDay(),
      yearArray: this.getYearArray(),
      yearArrayIndex: [4, 2],
    }

  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    token: null,
    openId: null

  }
}
</script>

<style>
/************************************************************
** 请将全局样式拷贝到项目的全局 CSS 文件或者当前页面的顶部 **
** 否则页面将无法正常显示                                  **
************************************************************/

html {
  font-size: 16px;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
  'Droid Sans', 'Helvetica Neue', 'Microsoft Yahei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

view,
image,
text {
  box-sizing: border-box;
  flex-shrink: 0;
}

#app {
  width: 100vw;
  height: 100vh;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-around {
  justify-content: space-around;
}

.justify-evenly {
  justify-content: space-evenly;
}

.items-start {
  align-items: flex-start;
}

.items-end {
  align-items: flex-end;
}

.items-center {
  align-items: center;
}

.items-baseline {
  align-items: baseline;
}

.items-stretch {
  align-items: stretch;
}

.self-start {
  align-self: flex-start;
}

.self-end {
  align-self: flex-end;
}

.self-center {
  align-self: center;
}

.self-baseline {
  align-self: baseline;
}

.self-stretch {
  align-self: stretch;
}

.flex-1 {
  flex: 1 1 0%;
}

.flex-auto {
  flex: 1 1 auto;
}

.grow {
  flex-grow: 1;
}

.grow-0 {
  flex-grow: 0;
}

.shrink {
  flex-shrink: 1;
}

.shrink-0 {
  flex-shrink: 0;
}

.relative {
  position: relative;
}
</style>
<!-- uview我也得用 -->
<style lang="scss">
@import "uview-ui/index.scss";
</style>

<style lang="scss">
 //colorui三个css
@import "colorui/main.css";
@import "colorui/icon.css";
/* 引入动画 */
@import "colorui/animation.css";
@import "common/color.css";

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
