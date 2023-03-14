<template>
  <view>
    <cu-custom bgColor="bg-blue-1" :isBack="true">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        快递查询
      </view>
    </cu-custom>
  </view>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
enquiry(sus){
  uni.navigateTo({
    url: 'plugin://kdPlugin/index?num=' + sus + '&appName=校园服务台&return=0',
  });
}
  }
}
</script>

<style scoped>

</style>
