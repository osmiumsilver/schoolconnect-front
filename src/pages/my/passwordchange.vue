<template>
<view>
    <cu-custom bgColor="bg-orange-1" :isBack="true">
        <view slot="backText">返回</view>
        <view slot="content">修改个人密码</view>
    </cu-custom>
    <view class="margin padding-sm bg-white" style="border-radius:20rpx;">
        <view class="cu-card case no-card">
            <view class="cu-item shadow">
                <view class="image" style='padding:30rpx 30rpx;'>
                    <image mode="widthFix" src="@/static/bg_img/bg.png"></image>

                </view>
            </view>
        </view>
        <view class="margin padding-sm">
            <view class="cu-form-group text-right">
                <view class="title">您正在修改的账号</view>
                <input v-model="username" disabled="disabled"></input>
                <text class="cuIcon-myfill text-blue"></text>
            </view>
            <view class="cu-form-group text-right">
                <view class="title">旧密码</view>
                <u-input v-model="form.oldPassword" placeholder="请输入旧密码" clearable type='password'></u-input>
                <text class="cuIcon-unlock text-blue"></text>
            </view>
            <view class="cu-form-group text-right">
                <view class="title">新密码</view>
                <u-input  v-model="form.newPassword" placeholder="请输入新密码" clearable type='password'></u-input>
                <text class="cuIcon-lock text-orange"></text>
            </view>
        </view>
        <view class="padding flex flex-direction">
            <button class="cu-btn bg-orange-1 round shadow-blur lg" open-type="getUserInfo"
                    @click="setNewPassword">修改
            </button>
        </view>
    </view>
</view>
</template>

<script>
export default {
    name: "passwordchange",
    data() {
        return {
            username: uni.getStorageSync("user_info").employeeId,
            form: {
                oldPassword: '',
                newPassword: ''
            },

        }
    },
    methods:{
        setNewPassword(){
            if (!this.form.oldPassword || !this.form.newPassword) {
                uni.showModal({
                    content: "请输入旧密码与新密码！",
                    showCancel: false
                })
                return
            }
            uni.showModal({
                    title: '温馨提示',
                    content: '确认修改?',
                    success: async (res) => {
                        if (res.confirm) {
                            this.$reqs(":8081/user/info/change", "POST", {
                                employeeId: this.username,
                                oldPass: this.form.oldPassword,
                                newPass: this.form.newPassword
                            }, res => {
                                if (res.code == 200 && res.data == true) {
                                    uni.showToast({
                                        title: '修改成功，请重新登录！',
                                        icon: "success",
                                        duration: 500
                                    });
                                    setTimeout(() => {
                                        uni.removeStorageSync("token")
                                        uni.removeStorageSync("userpass")
                                        uni.removeStorageSync("user_info")
                                        uni.navigateBack(-1)
                                    }, 1000);


                                }
                            }, fail => {
                                {
                                    if (fail.code == 1204)
                                        uni.showToast({
                                            title: '您没有权限',
                                            icon: "error",
                                            duration: 1000
                                        });
                                    if (fail.code == 1215)
                                        uni.showToast({
                                            title: '旧密码不匹配',
                                            icon: "error",
                                            duration: 1000
                                        });
                                }
                            })
                        }
                    }
                }
            )

        }
}


}
</script>

<style scoped>

</style>
