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
        <view class="u-page">
            <view class="u-demo-block">
                <text class="u-demo-block__title">您的身份：</text>
                <input v-model="userId" class="u-demo-block__content" disabled="true"></input>
            </view>
            <input v-model="title" class="in-5"
                   placeholder="请写入标题" placeholder-style="color:#ccc;font-size:14px;"></input>
        </view>

        <view class="padding flex flex-direction">
            <button class="cu-btn bg-orange-1 shadow-blur round" type="success" @click="publish">发布</button>
        </view>
        <view class='wrapper'>
            <view class='toolbar' style="height: 120px;overflow-y: auto;" @tap="format">
                <view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold"></view>
                <view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti"
                      data-name="italic"></view>
                <view :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian"
                      data-name="underline"></view>
                <view :class="formats.strike ? 'ql-active' : ''" class="iconfont icon-zitishanchuxian"
                      data-name="strike"></view>
                <!-- #ifndef MP-BAIDU -->
                <view :class="formats.align === 'left' ? 'ql-active' : ''" class="iconfont icon-zuoduiqi"
                      data-name="align" data-value="left"></view>
                <!-- #endif -->
                <view :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-juzhongduiqi"
                      data-name="align" data-value="center"></view>
                <view :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi"
                      data-name="align" data-value="right"></view>
                <view :class="formats.align === 'justify' ? 'ql-active' : ''" class="iconfont icon-zuoyouduiqi"
                      data-name="align" data-value="justify"></view>
                <!-- #ifndef MP-BAIDU -->
                <view :class="formats.lineHeight ? 'ql-active' : ''" class="iconfont icon-line-height"
                      data-name="lineHeight" data-value="2"></view>
                <view :class="formats.letterSpacing ? 'ql-active' : ''" class="iconfont icon-Character-Spacing"
                      data-name="letterSpacing" data-value="2em"></view>
                <view :class="formats.marginTop ? 'ql-active' : ''" class="iconfont icon-722bianjiqi_duanqianju"
                      data-name="marginTop" data-value="20px"></view>
                <view :class="formats.marginBottom ? 'ql-active' : ''" class="iconfont icon-723bianjiqi_duanhouju"
                      data-name="marginBottom" data-value="20px"></view>
                <!-- #endif -->

                <view class="iconfont icon-clearedformat" @tap="removeFormat"></view>

                <!-- #ifndef MP-BAIDU -->
                <view :class="formats.fontFamily ? 'ql-active' : ''" class="iconfont icon-font" data-name="fontFamily"
                      data-value="Pacifico"></view>
                <view :class="formats.fontSize === '24px' ? 'ql-active' : ''" class="iconfont icon-fontsize"
                      data-name="fontSize" data-value="24px"></view>
                <!-- #endif -->
                <view :class="formats.color === '#0000ff' ? 'ql-active' : ''" class="iconfont icon-text_color"
                      data-name="color" data-value="#0000ff"></view>
                <view :class="formats.backgroundColor === '#00ff00' ? 'ql-active' : ''"
                      class="iconfont icon-fontbgcolor" data-name="backgroundColor" data-value="#00ff00"></view>
                <view class="iconfont icon-date" @tap="insertDate"></view>
                <view class="iconfont icon--checklist" data-name="list" data-value="check"></view>
                <view :class="formats.list === 'ordered' ? 'ql-active' : ''" class="iconfont icon-youxupailie"
                      data-name="list" data-value="ordered"></view>
                <view :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont icon-wuxupailie"
                      data-name="list" data-value="bullet"></view>

                <view class="iconfont icon-undo" @tap="undo"></view>
                <view class="iconfont icon-redo" @tap="redo"></view>

                <view class="iconfont icon-outdent" data-name="indent" data-value="-1"></view>
                <view class="iconfont icon-indent" data-name="indent" data-value="+1"></view>
                <view class="iconfont icon-fengexian" @tap="insertDivider"></view>
                <view class="iconfont icon-charutupian" @tap="insertImage"></view>
                <view :class="formats.header === 1 ? 'ql-active' : ''" :data-value="1"
                      class="iconfont icon-format-header-1" data-name="header"></view>
                <view :class="formats.script === 'sub' ? 'ql-active' : ''" class="iconfont icon-zitixiabiao"
                      data-name="script" data-value="sub"></view>
                <view :class="formats.script === 'super' ? 'ql-active' : ''" class="iconfont icon-zitishangbiao"
                      data-name="script" data-value="super"></view>

                <view class="iconfont icon-shanchu" @tap="clear"></view>

                <view :class="formats.direction === 'rtl' ? 'ql-active' : ''" class="iconfont icon-direction-rtl"
                      data-name="direction" data-value="rtl"></view>
            </view>

            <view class="editor-wrapper">
                <editor id="editor" :read-only="readOnly" class="ql-container" placeholder="开始输入..." show-img-resize
                        show-img-size show-img-toolbar @ready="onEditorReady" @statuschange="onStatusChange">
                </editor>
            </view>
        </view>


        <!--      <cu-editor  class="card-list-view__item container" ref="editor" :url="rootUrl()+':8081/upload'" :formData="formData" :content="content" @update="onUpdate" @save="onSave"></cu-editor>-->

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
            readOnly: false,
            formats: {},
            content: '',
            placeholder: '开始输入。。。',
            title: '',
            disabled: true,
            userId: uni.getStorageSync("user_info").employeeId
        };
    },
    onLoad() {
        // #ifndef MP-BAIDU
        uni.loadFontFace({
            family: 'Pacifico',
            source: 'url("https://sungd.github.io/Pacifico.ttf")'
        })
        // #endif
    },

    methods: {
        readOnlyChange() {
            this.readOnly = !this.readOnly
        },

        redo() {
            this.editorCtx.redo()
        },
        format(e) {
            let {
                name,
                value
            } = e.target.dataset
            if (!name) return
            // console.log('format', name, value)
            this.editorCtx.format(name, value)
        },
        onStatusChange(e) {
            const formats = e.detail
            this.formats = formats
        },
        insertDivider() {
            this.editorCtx.insertDivider({
                success: function () {
                    console.log('insert divider success')
                }
            })
        },
        clear() {
            uni.showModal({
                title: '清空编辑器',
                content: '确定清空编辑器全部内容？',
                success: res => {
                    if (res.confirm) {
                        this.editorCtx.clear({
                            success: function (res) {
                                console.log("clear success")
                            }
                        })
                    }
                }
            })
        },
        removeFormat() {
            this.editorCtx.removeFormat()
        },
        insertDate() {
            const date = new Date()
            const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
            this.editorCtx.insertText({
                text: formatDate
            })
        },
        insertImage() {
            uni.chooseImage({
                count: 1,
                success: (res) => {
                    this.editorCtx.insertImage({
                        src: res.tempFilePaths[0],
                        alt: '图像',
                        success: function () {
                            console.log('insert image success')
                        }
                    })
                }
            })
        },
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
        publish() {
            var that = this;
            this.editorCtx.getContents({

                complete: function (res) {
                    console.log(res)
                    this.content = res.html
                    that.$reqs("/messageboard", "POST", {title: that.title, body: this.content, sender: that.userId}, res => {
                        if (res.code == 200 && res.data==true) {
                            uni.showToast({
                                title: '发布成功',
                                icon: "success",
                                duration: 500
                            });
                            setTimeout(() => {
                                uni.navigateBack(-1)
                            }, 1000);

                        }

                    }
                    ,
                    fail=>{
                        uni.showToast({
                            title: '发布失败',
                            mask: false,
                            duration: 1500
                        });

                    })

                }
            })

        }
    },

};
</script>
<style lang="scss">
@import '@/common/repair.scss';
@import '@/static/publish.scss';
@import '@/common/editor-icon.css';
</style>
<style>
.container {
    padding: 10px;
}

#editor {
    width: 100%;
    height: 300px;
    background-color: #CCCCCC;
}

.page-body {
    height: calc(100vh - var(--window-top) - var(--status-bar-height));
}

.wrapper {
    height: 100%;
}

.editor-wrapper {
    height: calc(100vh - var(--window-top) - var(--status-bar-height) - 140px);
    background: #fff;
}

.iconfont {
    display: inline-block;
    padding: 8px 8px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    font-size: 20px;
}

.toolbar {
    box-sizing: border-box;
    border-bottom: 0;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
}

.ql-container {
    box-sizing: border-box;
    padding: 12px 15px;
    width: 100%;
    min-height: 30vh;
    height: 100%;
    margin-top: 20px;
    font-size: 16px;
    line-height: 1.5;
}

.ql-active {
    color: #06c;
}

</style>
