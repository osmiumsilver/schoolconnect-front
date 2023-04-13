<template>

  <view class="container">
    <cu-custom :isBack="true" bgColor="bg-orange-1">
      <view slot="backText">
        返回
      </view>
      <view slot="content">
        发布公告
      </view>

    </cu-custom>
    <view class="main-form-list">
    <view>
      <text>您的身份：</text>
      <input v-model="userId" class="in-1" disabled="true"></input>
    </view>
    <input v-model="title" class="in-5"
              placeholder="请写入标题" placeholder-style="color:#ccc;font-size:14px;"></input>
    </view>

    <view class="padding flex flex-direction">
      <button class="cu-btn bg-orange-1 shadow-blur round" @click="publish" type="success">发布</button>
    </view>
      <cu-editor  class="card-list-view__item container" ref="editor" :url="rootUrl()+':8081/upload'" :formData="formData" :content="content" @update="onUpdate" @save="onSave"></cu-editor>

  </view>

</template>

<script>

import cuEditor from '@/components/cu-editor/cu-editor'
import {rootUrl} from "@/utils/util";
export default {
  components: {
    cuEditor
  }
  ,
  data() {
    return {
      title:'',
      disabled: true,
      userId: uni.getStorageSync("user_info").employeeId
    };
  },


  methods: {
    rootUrl() {
      return rootUrl
    },
    onEditorReady() {
      // #ifdef APP-PLUS || H5 ||MP-WEIXIN
      uni.createSelectorQuery().select('#editor').context((res) => {
        this.editorCtx = res.context
      }).exec()
      // #endif
    },
    undo() {
      this.editorCtx.undo()
    },
    publish(){

      this.$reqs(":8081/messageboard", "POST", {title:this.title,body: this.editorCtx,sender: this.userId}, res => {
                if (res.code == 200 && res.data.length) {
                  uni.showToast({
                    title: '发布成功',
                    mask: false,
                    duration: 1500
                  });

                  uni.navigateBack(-1);
                }
              })
    }
  },

};
</script>
<style lang="scss">
@import '@/common/repair.scss';
@import '@/static/publish.scss';
</style>
<style>


#editor {
  width: 100%;
  height: 300px;
  background-color: #CCCCCC;
}

button {
  margin-top: 10px;
}
</style>
