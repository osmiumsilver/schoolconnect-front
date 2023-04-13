<template>
  <view class="container">

    <cu-custom :isBack="true">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        快递查询
      </view>
    </cu-custom>

    <view class="flex-col page">
      <view class="flex-col flex-auto group">
        <text class="self-start text_2">请输入您的订单号：</text>
        <view>
          <!--          <u&#45;&#45;input     prefixIcon="search"-->
          <!--                        prefixIconStyle="font-size: 22px;color: #909399" class="lowered noflex text-wrapper" v-model="value" :type="type"   border="surround"  @click="show = true" :style="style"/>-->

          <uni-combox v-model="value" :candidates="historyList" class="noflex text-wrapper"
                      placeholder="请输入订单号"></uni-combox>
          <view class="padding flex flex-direction" style="padding: 60rpx !important;">
            <button class="cu-btn bg-orange-1 round shadow-blur lg"
                    @click="enquiry(value)">查询
            </button>
            <button class="cu-btn bg-orange-1 round shadow-blur lg margin-top-xs"
                    @click="removeAllHistory">清除所有历史
            </button>
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
      value: '',
      type: 'select',
      show: false,
      border: true,
      historyList: []
    }
  },
  created() {
    this.init();
  }
  ,
  computed:
      {
        style() {
          return `flex: 0 !important;`
        },
      },
  methods: {
    init(){
      let historyList = uni.getStorageSync("express_enquiry_history")
      for (let i = 0; i < historyList.length; i++) {
        this.historyList[i]=historyList[i]
      }

    },
    removeAllHistory: function () {
      this.historyList=[]
      uni.removeStorageSync("express_enquiry_history")

    }
    ,
    enquiry(sus) {
      this.historyList.push(this.value);
      uni.setStorageSync("express_enquiry_history", this.historyList)
      uni.navigateTo({
        url: 'plugin://kdPlugin/index?num=' + sus + '&appName=校园服务台&return=0',
      });
    }
  }
}
</script>

<style scoped>
.lowered {
  height: 85vh;
  flex-direction: column;
  align-content: center;
  align-items: center;
  display: flex;
  justify-content: center;
  padding-top: 10rpx;
}

.noflex {
  flex: 0 !important;
}

.page {
  background-color: #ffffff;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}

.group {
  padding: 341.86rpx 45.35rpx 838.95rpx;
  overflow-y: auto;
}

.text_2 {
  color: #000000;
  font-size: 62.79rpx;
  font-family: '.PingFang SC';
  line-height: 90.7rpx;
}

.text-wrapper {
  margin: 190.12rpx 41.86rpx 0;
  padding: 19.19rpx 0;
  border-radius: 3.49rpx;
  background-image: url('https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/63e87beb5a7e3f031005a4bd/63e87c1842b69d0011f604e4/16796346542660343103.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.text_3 {
  margin-left: 20.93rpx;
  color: #00000040;
  font-size: 27.91rpx;
  font-family: '.AppleSystemUIFont';
  line-height: 31.4rpx;
}
</style>
