import {rootUrl} from "@/utils/util";

export default {
    data() {
        return {}
    },
    methods: {
        download(url) {
            uni.showLoading({
                title: "正在导出",
                success(res) {
                    uni.downloadFile({
                        url: rootUrl + url, //仅为示例，并非真实的资源
                        filePath: wx.env.USER_DATA_PATH + '/template.xls',
                        header: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + wx.getStorageSync('token'),
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        success: (res) => {
                            if (res.statusCode === 200) {
                                let filePath = res.filePath
                                uni.openDocument({
                                    filePath: filePath,
                                    success: (res) => {
                                        console.log('下载成功');
                                        uni.hideLoading()
                                    }
                                })

                            } else {
                                uni.showToast({
                                    title: '下载失败',
                                    mask: false,
                                    duration: 1500
                                });
                                uni.hideLoading()
                            }
                        }
                    });
                }
            })

        },
        chooseUpload(url) {
            wx.chooseMessageFile({
                count: 10,
                type: 'file',
                extension: ['.xlsx', '.xls', '.XLSX', '.XLS', 'xlsx', 'xls', 'XLSX', 'XLS'],
                success(res) {
                    uni.showLoading({
                        title: "上传中",
                        success() {
                            console.log(res)
                            const tempFilePaths = res.tempFiles
                            for (let i in tempFilePaths) {
                                wx.uploadFile({
                                    url: rootUrl + url, //上传的服务器地址
                                    filePath: tempFilePaths[i].path,
                                    name: 'file',
                                    formData: {
                                        'file': tempFilePaths[i].path
                                    },
                                    header: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + wx.getStorageSync('token'),
                                        'X-Requested-With': 'XMLHttpRequest',
                                    },
                                    success: function (res) {
                                        let data = JSON.parse(res.data)
                                        console.log(data)
                                        if (res.statusCode == 200 && data.code == 200 && data.data == true) {

                                            uni.showToast({
                                                title: '上传成功',
                                                icon: 'success',
                                                duration: 1300
                                            })
                                        } else {
                                            uni.hideLoading()

                                            uni.showModal({
                                                title: '提示',
                                                content: data.msg,
                                                showCancel: false,
                                                confirmText: '好',
                                            });
                                        }
                                    },
                                    fail: function (err) {
                                        console.log(err)
                                        uni.showModal({
                                            title: '提示',

                                            content: err.msg,
                                            showCancel: false,
                                            confirmText: '好',
                                        });
                                    }, complete: function () {
                                        uni.hideLoading()

                                    }
                                })
                            }
                        }
                    })

                }
            })
        },
    }


}
