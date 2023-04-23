<template>
    <view>
        <cu-custom :isBack="true" bgColor="bg-orange-1">
            <view slot="backText">
                返回
            </view>
            <view slot="content">
                初始化密码
            </view>
        </cu-custom>
        <view class="u-block">

            <view class="search">
                <view class="search-wrapper">
                    <u-search v-model='searchModel' :clearabled="true" :showAction="false" bgColor="white" height="50"
                              inputAlign="center"
                              placeholder="搜索用户"></u-search>


                </view>
            </view>


            <view v-if="userList.length" class="animation-slide-bottom margin list-container">
                <view class="list-head bg-blue-1">
                    <view class="">
                        用户列表
                    </view>
                    <view class="">
                        选中
                    </view>
                </view>
                <view v-for='(item, index) in userList' :key='index' :class="index%2?'bg-gray':'bg-white'"
                      class="list-item text-black">

                    <view class="list-subitem margin-top-sm">
                        <view class="flex-sub text-left">
                            姓名：{{ item.name }}
                        </view>
                        <view class="flex-sub text-center">
                            工号：{{ item.employeeId }}
                        </view>
                        <view class="flex-sub text-right">
                            <switch :checked='choFlag[index]' class="cyan sm" @click="choChange(index)"></switch>
                        </view>
                    </view>
                </view>
                <view class="list-head bg-blue-1">
                </view>
            </view>
            <view style="padding: 20px;">
                <u-button v-if="userList.length" text="一键重置" type="primary"
                          @click="setDefaultPassword(userList)"></u-button>

            </view>
            <cu-empty :type="emptyType">
                <view slot="text" class="">

                    <button v-if="!userList.length" class="cu-btn bg-orange-1 round shadow-blur u-margin-left-auto"
                            @click="getUserWithNoPassword">刷新无密码人员
                    </button>
                    <button v-if="!userList.length" class="cu-btn bg-orange-1 round shadow-blur"
                            @click="getUser()">搜索搜索框中输入信息
                    </button>
                </view>
            </cu-empty>
        </view>
    </view>
</template>

<script>
import mixin from '@/mixins/checkbox_menu'
import search_empty_message_mixin from "@/mixins/search_empty_message_mixin";
import Tips from '@/utils/tip'

export default {
    mixins: [mixin, search_empty_message_mixin], // 引入可复用的代码
    name: "setpass",
    data() {
        return {
            searchModel: '',
            choFlag: [],
            userList: [],
            emptyType: "search",
            emptyMsg: "目前没有无密码的用户，点击即可刷新"
        }
    },
    created() {

    },
    methods: {
        getUser() {
            this.$reqs(':8081/admin/user/info', 'GET', {userId: this.searchModel}
                , res => {
                    if (res.code == 200 && res.data)
                        this.userList = res.data
                })
        },
    getUserWithNoPassword() {
        this.userList = []
        this.$reqs(":8081/admin/user/info/nopassword", "GET", {}, res => {
            if (res.code == 200 && res.data) {
                this.userList = res.data
                this.choFlag = new Array(res.data.length).fill(true)
            }

        })
    },
    setDefaultPassword(evt) {
        let newList = [];
        if (typeof evt === 'string')
            newList.push(evt)
        else
            for (const element of evt) {
                console.log(element)
                newList.push(element.employeeId)
            }
        uni.showModal({
            title: '提示',
            content: '您要修改的账号为：\n' + newList
                + '\n' +
                '是否进行修改？',
            showCancel: true,
            cancelText: '否',
            confirmText: '是',
            complete: (res) => {
                if (res.confirm) {
                    this.$reqs(":8081/admin/user/info/setdefaultpass", "POST", newList, res => {
                        if (res.code == 200 && res.data) {
                            Tips.success("成功", 1000)
                            this.getUserWithNoPassword();
                        }

                    })
                }


            }

        });

    }
}}
</script>

<style scoped>

</style>
