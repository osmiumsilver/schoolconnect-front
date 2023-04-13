<template>
  <view>
    <!-- 默认学期设置组件 -->
    <button v-if="pickerType==='default'" class="cu-btn bg-orange-1 shadow" @click="modalName = 'model'">
      {{ yearText }}@{{ termText }}
      <text class="cuIcon-right"></text>
    </button>
    <view class="cu-modal" :class="modalName=='model'?'show':''">
      <view class="cu-dialog">
        <view class="bg-white margin-sm">
          <view class="text-left text-bold text-xl padding-sm">
            学年选择
          </view>
          <view class="grid col-3 bg-white">
            <view v-for="(item, index) in yearArray" :key="index" class="padding-xs">
              <button class="cu-btn blue block" :class="item.value==year?'bg-blue':'line-blue'" @click="yearClick(index)">
                {{item.title}}
              </button>
            </view>
          </view>
          <view class="text-left text-bold text-xl padding-sm">
            学期选择
          </view>
          <view class="grid col-3 bg-white">
            <view class="padding-xs" v-for="(item, index) in termArray" :key="index">
              <button class="cu-btn blue block" :class="item.value==semester?'bg-blue':'line-blue'" @click="termClick(index)">
                {{item.title}}
              </button>
            </view>
          </view>
        </view>
        <view class="cu-bar bg-white">
          <view class="action margin-0 flex-sub text-black solid-left" @click="cancel">取消</view>
          <view class="action margin-0 flex-sub text-green solid-left" @click="confirm">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "course-picker",
  data() {
    return {
      modalName: "",

      courseArray: [],
    };
  },
  props: {
    pickerType: {
      type: String,
      default: "default"
    }
  },
  created() {
    this.$emit("courseArray", this.courseArray);
  },
  methods: {

    yearClick(index) {
      this.year = this.yearArray[index].value.toString()
      this.yearText = this.yearArray[index].title
      this.$emit("year", this.year);
    },
    termClick(index) {
      this.semester = this.termArray[index].value.toString()
      this.termText = this.termArray[index].title
      this.$emit("semester", this.semester);
    },
    cancel() {
      this.modalName = null
      this.$emit("cancel");
    },
    confirm() {
      this.modalName = null
      this.$emit("confirm");
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
