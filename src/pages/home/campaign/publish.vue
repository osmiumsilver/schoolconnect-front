<template>
    <view class="container">
        <cu-custom :isBack="true" bgColor="bg-orange-1">
            <view slot="backText">
                返回
            </view>
            <view slot="content">
                发布活动
            </view>
        </cu-custom>
        <view class="container">
            <view class="">
                <view class="">
                    <u-form
                            ref="form1"
                            :model="model1"
                            labelPosition="left"
                    >
                        <u-form-item
                                ref="item1"
                                borderBottom
                                label="姓名"
                                prop="userInfo.name"
                        >
                            <u-input
                                    v-model="model1.userInfo.name"
                                    border="none"
                                    placeholder="姓名,只能为中文"
                            ></u-input>
                        </u-form-item>
                        <u-form-item
                                ref="item1"
                                borderBottom
                                label="性别"
                                prop="userInfo.sex"
                                @click="showSex = true; hideKeyboard()"
                        >
                            <u-input
                                    v-model="model1.userInfo.sex"
                                    border="none"
                                    disabled
                                    disabledColor="#ffffff"
                                    placeholder="请选择性别"
                            ></u-input>
                            <u-icon
                                    slot="right"
                                    name="arrow-right"
                            ></u-icon>
                        </u-form-item>
                        <u-form-item
                                ref="item2"
                                borderBottom
                                label="水果"
                                prop="radiovalue1"
                        >
                            <u-radio-group v-model="model1.radiovalue1">
                                <u-radio
                                        v-for="(item, index) in radiolist1"
                                        :key="index"
                                        :customStyle="{marginRight: '16px'}"
                                        :label="item.name"
                                        :name="item.name"
                                >
                                </u-radio>
                            </u-radio-group>
                        </u-form-item>
                        <u-form-item
                                ref="item3"
                                borderBottom
                                label="兴趣爱好"
                                labelWidth="80"
                                prop="checkboxValue1"
                        >
                            <u-checkbox-group
                                    v-model="model1.checkboxValue1"
                                    shape="square"
                                    @change="change"
                            >
                                <u-checkbox
                                        v-for="(item, index) in checkboxList1"
                                        :key="index"
                                        :customStyle="{marginRight: '16px'}"
                                        :label="item.name"
                                        :name="item.name"
                                >
                                </u-checkbox>
                            </u-checkbox-group>
                        </u-form-item>
                        <u-form-item
                                ref="item3"
                                borderBottom
                                label="简介"
                                prop="intro"
                        >
                            <u-textarea
                                    v-model="model1.intro"
                                    count
                                    placeholder="不低于3个字"
                            ></u-textarea>
                        </u-form-item>
                        <u-form-item
                                borderBottom
                                label="住店时间"
                                labelWidth="80"
                                prop="hotel"
                                @click="showCalendar = true; hideKeyboard()"
                        >
                            <u-input
                                    v-model="model1.hotel"
                                    border="none"
                                    disabled
                                    disabledColor="#ffffff"
                                    placeholder="请选择住店和离店时间"
                            ></u-input>
                            <u-icon
                                    slot="right"
                                    name="arrow-right"
                            ></u-icon>
                        </u-form-item>
                        <u-form-item
                                borderBottom
                                label="验证码"
                                labelWidth="80"
                                prop="code"
                        >
                            <u-input
                                    v-model="model1.code"
                                    border="none"
                                    placeholder="请填写验证码"
                            ></u-input>
                            <u-button
                                    slot="right"
                                    :disabled="disabled1"
                                    :text="tips"
                                    size="mini"
                                    type="success"
                                    @tap="getCode"
                            ></u-button>
                        </u-form-item>
                        <u-form-item
                                ref="item1"
                                borderBottom
                                label="生日"
                                prop="userInfo.birthday"
                                @click="showBirthday = true; hideKeyboard()"
                        >
                            <u-input
                                    v-model="model1.userInfo.birthday"
                                    border="none"
                                    disabled
                                    disabledColor="#ffffff"
                                    placeholder="请选择生日"
                            ></u-input>
                            <u-icon
                                    slot="right"
                                    name="arrow-right"
                            ></u-icon>
                        </u-form-item>
                    </u-form>
                    <u-button
                            customStyle="margin-top: 50px"
                            text="提交"
                            type="primary"
                            @click="submit"
                    ></u-button>
                    <u-button
                            customStyle="margin-top: 10px"
                            text="重置"
                            type="error"
                            @click="reset"
                    ></u-button>
                    <u-action-sheet
                            :actions="actions"
                            :show="showSex"
                            description="如果选择保密会报错"
                            title="请选择性别"
                            @close="showSex = false"
                            @select="sexSelect"
                    >
                    </u-action-sheet>
                    <u-calendar
                            :formatter="formatter"
                            :show="showCalendar"
                            confirmDisabledText="请选择离店日期"
                            endText="离店"
                            mode="range"
                            startText="住店"
                            @close="calendarClose"
                            @confirm="calendarConfirm"
                    ></u-calendar>
                    <u-code
                            ref="uCode"
                            seconds="20"
                            @change="codeChange"
                            @end="disabled1 = false"
                            @start="disabled1 = true"
                    ></u-code>
                    <u-datetime-picker
                            :show="showBirthday"
                            :value="birthday"
                            closeOnClickOverlay
                            mode="date"
                            @cancel="birthdayClose"
                            @close="birthdayClose"
                            @confirm="birthdayConfirm"
                    ></u-datetime-picker>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "publish",
    data() {
        return {
            showSex: false,
            model1: {
                userInfo: {
                    name: 'uView UI',
                    sex: '',
                },
            },
            actions: [{
                name: '男',
            },
                {
                    name: '女',
                },
                {
                    name: '保密',
                },
            ],
            rules: {
                'userInfo.name': {
                    type: 'string',
                    required: true,
                    message: '请填写姓名',
                    trigger: ['blur', 'change']
                },
                'userInfo.sex': {
                    type: 'string',
                    max: 1,
                    required: true,
                    message: '请选择男或女',
                    trigger: ['blur', 'change']
                },
            },
            radio: '',
            switchVal: false
        };
    },
    methods: {
        sexSelect(e) {
            this.model1.userInfo.sex = e.name
            this.$refs.uForm.validateField('userInfo.sex')
        },
    }

}
</script>
<style lang="scss" src="@/static/styles/common_form.scss" scoped>

</style>
