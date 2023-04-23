export let rootUrl = 'http://100.100.17.107';
export let fileUrl = 'http://100.100.17.107:8080/api/images/';
export const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/*
获取微信code
 */
export function wechatLogin(callback) {
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
                    }
                    // if (res.data.data.userId !== undefined) {
                    //     uni.setStorageSync('user_id', res.data.data.user_id)
                    // }
                    uni.setStorageSync('openid', res.data.data.openid)
                },
                fail: (err) => {
                    uni.showToast({
                        title: '获取OpenID失败',
                        icon: 'error',
                        duration: 1500
                    });
                    console.log("【Error】request.openid ： ",err)
                }
            });
        },
        fail: (err) => {
            console.log("【Error】 wx.login : ", err)
        },
    })
}

export function getToken(callback){
    uni.request({
        url: rootUrl + '/auth/token',
        method: 'POST',
        header: {
            Authorization: "Basic " + BasicAuth,
            'X-Requested-With': "XMLHttpRequest"
        },
        data: {
            postData
        },
        success: res => {
            if (res) {
                if (res.data.code == 200) {
                    return typeof successres == "function" && successres(res);
                } else {
                    console.log("【SError】request.token : ", res)
                    return typeof failres == "function" && failres(res)
                }
            }

        },
        fail: (res) => {
            console.log("【Error】request.token : ", res)
            return typeof failres == "function" && failres(res)

        },
        complete() {
        }
    })
}
export function noaccess() {
    uni.showModal({
        title: '提示',
        content: '您无权进行此操作',
        showCancel: false,
        confirmText: '好',
    });
}

/*
通用请求方法封装，高度完成
 */
export function reqs(url, method, data, successres, failres) {
    console.log( "[reqs] Request data : ", data)
    uni.showLoading({
        title: '加载中',success: (res)=>{
            let token = uni.getStorageSync("token");
            uni.request({
                url: rootUrl + url,
                data: data,
                method: method,
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                success: (res) => {
                    if (res.statusCode === 401) {
                        uni.showToast({
                            title: '授权已过期，请尝试再次操作一下来自动授权。',
                            icon: 'none',
                            duration: 1500,
                            complete: function(res){
                                getSchoolToken('', uni.getStorageSync("userpass"),res=>{
                                    uni.setStorageSync("token",res.data.data)
                                },err=>{
                                    uni.showToast({
                                        title: '授权服务器不可用，请联系管理员维修。',
                                        icon: 'none',
                                        duration: 1500
                                    });
                                })
                            }
                        });

                    }
                    if (res.statusCode < 399 && res.data.data.length) {
                        this.emptyType = "success"
                        this.emptyMsg = "加载完成"

                        return typeof successres == "function" && successres(res.data);
                    }
                    if (res.statusCode < 399 && !(res.data.data.length)) {
                        this.emptyType = "success"
                        this.emptyMsg = "未查询到信息"
                        return typeof successres == "function" && successres(res.data);
                    }
                    else {
                        return typeof failres == "function" && failres(res.data)
                    }

                },
                fail: (err) => {
                    console.log("【ERROR】Request ： ")
                    this.emptyType = "error"
                    this.emptyMsg = err.data.msg
                    return typeof failres == "function" && failres(err)

                },
                complete() {
                    uni.hideLoading()
                }
            })
        }
    })

}

/*
获取Jwt Token
 */
export function getSchoolToken(postData, BasicAuth, successres, failres) {

    uni.request({
        url: rootUrl + '/auth/token',
        method: 'POST',
        header: {
            Authorization: "Basic " + BasicAuth,
            'X-Requested-With': "XMLHttpRequest"
        },
        data: {
            postData
        },
        success: res => {
            if (res) {
                if (res.data.code == 200) {
                    return typeof successres == "function" && successres(res);
                } else {
                    console.log("【SError】request.token : ", res)
                    return typeof failres == "function" && failres(res)
                }
            }

        },
        fail: (res) => {
            console.log("【Error】request.token : ", res)
            return typeof failres == "function" && failres(res)

        },
        complete() {
        }
    })
}

export function uuid() {
    return Math.random().toString(16).slice(2);
}
