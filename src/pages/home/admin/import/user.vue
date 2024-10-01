<template>
    <view>
        <cu-custom :isBack="true" bgColor="bg-orange-1">
            <view slot="backText">
                返回
            </view>
            <view slot="content">
                导入新身份
            </view>
        </cu-custom>
        <view style="padding: 20px;">
            <u-button text="下载模版" type="primary" @click="download('/admin/user/info/export/blank')"></u-button>

            <u-button text="导入" type="primary" @click="chooseUpload('/admin/user/info/import')"></u-button>
        </view>
    </view>
</template>

<script>
import mixin from "@/mixins/upload_mixin";

export default {
    mixins: [mixin],
    data() {
        return {}

    },
    methods: {

    }


}
</script>

<style scoped>

</style>
