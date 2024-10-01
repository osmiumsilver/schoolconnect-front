<template>

    <view>

        <view class="container">
            <cu-custom :isBack="true" bgColor="bg-orange-1">
                <view slot="backText">
                    返回
                </view>
                <view slot="content">
                    公告详情
                </view>
            </cu-custom>
            <view class="u-page">
                <view class="u-content u-demo-block__content">
                    <u-parse :content="content"></u-parse>
                </view>
            </view>
        </view>
    </view>

</template>

<script>


export default {
    data() {
        return {

            content: `
					<p>露从今夜白，月是故乡明</p>
					<img src="https://cdn.uviewui.com/uview/swiper/2.jpg" alt="default"/>
				`

        };
    },

    onLoad(options) {
        if (options.detail)
            this.$reqs("/messageboard/detail", "GET", {id: JSON.parse(options.detail)}, res => {
                if (res.code == 200 && res.data) {
                    this.content = res.data.body
                }
            })
    },

    methods: {},
};
</script>
<style lang="scss" src="@/static/styles/common_form.scss">

.u-content {
  padding: 24rpx;
}

</style>
