<template>
  <view class="flex-col page">
    <cu-custom bgColor="bg-blue-11" :isBack="true">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        个人信息
      </view>
    </cu-custom>
    <view class="flex-col flex-auto group_2">
      <view class="flex-col items-center section">
        <u-avatar :src="userAvatarData"></u-avatar>
        <text class="font_1 text_2">{{ userNameData }}</text>
      </view>
      <view class="flex-col view_1">
        <view class="flex-row justify-between items-baseline group_3 view_2">
          <text class="font_1">学号</text>
          <text class="font_2 text_3">{{ userIdData }}</text>
        </view>
        <view class="flex-row justify-between group_4">
          <text class="font_1">所在班级</text>
          <text class="self-center font_3 text_1">{{ studentClassData }}</text>
        </view>
        <view class="flex-row justify-between group_5">
          <text class="font_1">性别</text>
          <text class="font_4 text_14" v-if="genderData == '0'">男</text>
          <text class="font_4 text_14" v-if="genderData == '1'">女</text>
        </view>
        <view class="flex-row justify-between items-baseline group_6">
          <text class="font_1 text_6">身份证</text>
          <input type="text" v-model="residenceIdData" :disabled="isNotEditable" class="font_2">
          </input>
        </view>
        <view class="flex-row justify-between items-baseline group_3">
          <text class="font_1">手机号</text>
          <input type="text" v-model="phoneNumberData" :disabled="isNotEditable" class="font_2 text_7">
          </input>
        </view>
        <view class="flex-row justify-between group_3">
          <text class="font_1 text_8">地址</text>
          <input type="text" v-model="addressData" :disabled="isNotEditable" class="font_4 text_9">
          </input>
        </view>
        <view class="flex-row justify-between items-center group_7">
          <text class="font_1 text_10">第二联系方式</text>
          <input type="text" v-model="secondContactData" :disabled="isNotEditable"
                 class="font_3 text_11"></input>
        </view>
        <view class="flex-row justify-between items-center view_3">
          <text class="font_1">录入时间</text>
          <text class="font_2">{{ importDateData }}</text>
        </view>
        <view>
          <u-button class="section_3 uButton_CSr" v-if="requiredChangeStatus == 0">您的信息无需修改</u-button>
          <u-button class="section_3 uButton_CSr" v-if="requiredChangeStatus == 1" @click="makeEditable">
            修改
          </u-button>
          <u-button class="section_3 uButton_CSr" v-if="requiredChangeStatus == 2"
                    @click="makeEditableWhileCheckPending">审核中
          </u-button>
          <u-button class="section_3 uButton_CSr" v-if="isNotEditable==false" @click="editCompleted"> 保存
          </u-button>
          <u-button class="section_3 uButton_CSr" v-if="isNotEditable==false" @click="cancelEdit"> 取消
          </u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      isNotEditable: true,
      userAvatarData: '',
      userNameData: '',
      userIdData: '',
      studentClassData: '',
      genderData: '',
      residenceIdData: '',
      phoneNumberData: '',
      addressData: '',
      secondContactData: '',
      importDateData: '',
      requiredChangeStatus: ''
    }
  },
  created() {

    this.$reqs(":8081/user/info", "GET", {userId: uni.getStorageSync('user_info').employeeId}, res => {
      if (res.data != null) {
        uni.setStorageSync('user_info', res.data)
      }
    })
    this.setUser()
  },
  methods: {
    setUser() {
      const studentInfo = uni.getStorageSync("user_info");
      this.userAvatarData = studentInfo.pictureURL
      this.userNameData = studentInfo.name
      this.userIdData = studentInfo.employeeId
      this.studentClassData = studentInfo.classNo
      this.genderData = studentInfo.sex
      this.residenceIdData = studentInfo.residenceId
      this.phoneNumberData = studentInfo.phone
      this.addressData = studentInfo.address
      this.secondContactData = studentInfo.secondContact
      this.importDateData = studentInfo.createTime
      this.requiredChangeStatus = studentInfo.requiredChanging
    },
    makeEditable() {
      this.isNotEditable = false;
      let inputs = uni.createSelectorQuery('input');
      inputs.forEach(input => {
        input.style.color = '#000000';
      });
    },
    cancelEdit() {
 uni.showModal({
 	title: '提示',
 	content: '是否取消？',
 	showCancel: true,
 	cancelText: '否',
 	confirmText: '是',
 	complete: () => {     this.isNotEditable = true;
    this.setUser();}
 });
    }
    ,
    editCompleted() {
      uni.showModal({
        title: '提示',
        content: '确认保存？',
        showCancel: true,
        cancelText: '否',
        confirmText: '是',
        complete: () => {
          this.isNotEditable = true;
          let putData = {};
          putData['employeeId'] = uni.getStorageSync("user_info").employeeId
          putData['phone'] = this.phoneNumberData
          putData['address'] = this.addressData
          putData['secondContact'] = this.secondContactData
          putData['requiredChanging'] = 2
          this.$reqs(":8081/user/info", "PUT", putData, res => {
            console.log(res);
            if (res.code === "200") {
              uni.showToast({
                title: '保存成功',
                mask: false,
                duration: 1500
              });
            }
          })
        }
      });

    }
    ,
    makeEditableWhileCheckPending() {
      uni.showModal({
        title: '提示',
        content: '您的信息正在等待审核中，是否重新更改？',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',

        complete: (res) => {
          if (res.confirm) {
            this.makeEditable();

          }
        }
      });
    }
  },
  // computed: {
  // 	textInput() {
  // 		return this.isNotEditable ? true : true;
  // 	},
  // },
}
</script>

<style scoped lang="css">
.page {
  background-color: #f0f2f5;
  overflow: hidden;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}

.font_1 {
  font-size: 31.4rpx;
  font-family: SourceHanSansCN;
  line-height: 28.78rpx;
  color: #000000;
}

.group_2 {
  padding-bottom: 54.07rpx;
  overflow-y: auto;
}

.section {
  padding: 59.3rpx 0 73.26rpx;
  background-color: #ffffff;
  border-radius: 0px 0px 41.86rpx 41.86rpx;
  box-shadow: 3.49rpx 8.72rpx 22.67rpx #15161f0f;
}

.text_2 {
  margin-top: 48.84rpx;
  color: #030303;
  font-weight: 700;
  line-height: 29.65rpx;
  opacity: 0.8;
}

.view_1 {
  margin: 38.37rpx 45.35rpx 0;
  padding: 62.79rpx 17.44rpx 92.44rpx 48.84rpx;
  background-color: #ffffff;
  border-radius: 50.58rpx;
}

.group_3 {
  margin-top: 80.23rpx;
  padding: 0 3.49rpx;
}

.view_2 {
  margin-top: 0;
}

.font_2 {
  font-size: 31.4rpx;
  font-family: SourceHanSansCN;
  line-height: 23.55rpx;
  color: #949494;
  text-align: right;
}

.text_3 {
  margin-right: 3.49rpx;
}

.group_4 {
  margin-top: 76.74rpx;
}

.font_3 {
  font-size: 24.42rpx;
  font-family: SourceHanSansCN;
  line-height: 23.55rpx;
  color: #949494;
  text-align: right;
}

.text_1 {
  line-height: 22.67rpx;
}

.group_5 {
  margin-top: 76.74rpx;
}

.font_4 {
  font-size: 31.4rpx;
  font-family: SourceHanSansCN;
  line-height: 28.78rpx;
  color: #949494;
}

.text_14 {
  margin-right: 17.44rpx;
  line-height: 27.03rpx;
}

.group_6 {
  margin-top: 76.74rpx;
}

.text_6 {
  line-height: 29.65rpx;
}

.text_7 {
  margin-right: 6.98rpx;
}

.text_8 {
  line-height: 27.91rpx;
}

.text_9 {
  margin-right: 10.47rpx;
}

.group_7 {
  margin-top: 76.74rpx;
}

.text_10 {
  line-height: 29.65rpx;
}

.text_11 {
  line-height: 25.29rpx;
}

.view_3 {
  margin: 76.74rpx 10.47rpx 0 3.49rpx;
}

.section_3 {
  align-self: center;
  margin-top: 62.79rpx;
}

.uButton_CSr {
  padding: 0px 0px;
  margin-left: unset;
  margin-right: unset;
  border-radius: 8.72rpx;
  background-color: #0000004d !important;
  margin-top: 62.79rpx;
  width: auto;
  height: 55.81rpx;
  border: unset;
}

.uButton_CSr:after {
  border-radius: 17.44rpx;
  display: none;
}
</style>
