export let rootUrl = 'http://127.0.0.1';

// const formatTime = date => {
//     const year = date.getFullYear()
//     const month = date.getMonth() + 1
//     const day = date.getDate()
//     const hour = date.getHours()
//     const minute = date.getMinutes()
//     const second = date.getSeconds()

//     return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }
// const formatTime1 = date => {
//     const hour = date.getHours()
//     const minute = date.getMinutes()

//     return [hour, minute].map(formatNumber).join(':')
// }
// const formatTime2 = date => {
//     const year = date.getFullYear()
//     const month = date.getMonth() + 1
//     const day = date.getDate()

//     return [year, month, day].map(formatNumber).join('-')
// }

// const formatTime22 = date => {
//     const year = date.getFullYear()
//     const month = date.getMonth() + 1
//     const day = date.getDate()

//     return [year, month, day].map(formatNumber).join('/')
// }
export const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

export function wechatLogin() {
    uni.login({
        provider: 'weixin',
        success: async (loginRes) => {
            uni.request({
                url: rootUrl + '/auth/wxlogin',
                method: 'POST',
                data: {
                    code: loginRes.code
                },
                success: res => {
                    if (res.data.data.openid === undefined) {
                        console.log('获取openid失败: ', res.data.data.errMsg);
                        return
                    }
                    // if (res.data.data.userId !== undefined) {
                    //     uni.setStorageSync('user_id', res.data.data.user_id)
                    // }
                    uni.setStorageSync('openid', res.data.data.openid)

                },
                fail: (err) => {
                    console.log("WxCode Request Err : ", err)
                }
            });
        },
        fail: (err) => {
            console.log("WxLogin Err : ", err)
        },
    })
}

export function login() {
    if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        uni.getUserInfo({
            success: res => {
                console.log(res.userInfo)
                //性别 0：未知、1：男、2：女
                uni.setStorageSync('wx_info', res.userInfo)
            }
        })
        let postData = this.form
        if (this.cookies) {
            postData['cookies'] = this.cookies
            postData['captcha'] = this.captcha
        }
        this.$req("api/login/", "post", postData, res => {
            if (res.code !== 10000) {
                if (res.data['cookie']) {
                    this.captcha_path = rootUrl + 'media/captcha/' + this.form.username +
                        '.png?v=' + new Date().getTime()
                    this.cookies = res.data['cookie']
                }
                uni.showModal({
                    content: res.msg,
                    showCancel: false
                })
            } else {
                let user_info = res.data
                user_info['password'] = this.form.password
                uni.setStorageSync('user_info', user_info)
                uni.navigateBack(-1)
            }
        })
    } else {
        uni.showModal({
            content: "请允许获得您的公开信息",
            showCancel: true
        })
    }
}

export function reqs(url, method, data, successres, failres) {
    uni.showLoading({
        title: '请稍后',
    })
    let token = uni.getStorageSync("token");
    uni.request({
        url: rootUrl + url,
        data: data,
        method: method,
        header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        success: function (res) {

            if (res.statusCode < 399)
                return typeof successres == "function" && successres(res.data);
            else if (res.statusCode === 401)
                getSchoolToken('', uni.getStorageSync("userpass"))
            else {
                return typeof failres == "function" && failres(res.data)
            }
        },
        fail: function (error) {
            return typeof failres == "function" && failres(error)
        },
        complete() {
            uni.hideLoading()
        }
    })
}



export function getSchoolToken(postData, BasicAuth,successres,failres) {
    uni.request({
        url: rootUrl + '/auth/token',
        method: 'POST',
        header: {
            Authorization: "Basic " + BasicAuth
        },
        data: {
            postData
        },
        success: res => {
            uni.setStorageSync("token", res.data.data)
            return typeof successres == "function" && successres(res.data);
        },
        fail: (res) => {
            console.log("获取签发JWT失败：", res)
            return typeof failres == "function" && failres(res.data)

        }
    })
}
