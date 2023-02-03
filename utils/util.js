import {
	hex_hmac_md5
} from "@/utils/md5.js"

let rootUrl = 'http://127.0.0.1/';

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
const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

function getToken() {
	var date = new Date()
	var timestamp = date.getTime().toString()
	var token = hex_hmac_md5('xxxxxx', timestamp)
	return {
		'timestamp': timestamp,
		'token': token,
	}
}



function wechatLogin() {
	uni.login({
		provider: 'weixin',
		success: async (loginRes) => {
			console.log("loginres"+  loginRes);
			// this.Toast({title: '登录成功'});
			uni.request({
				url: rootUrl + 'auth/wxcode',
				method: 'GET',
				data: {
					code: loginRes.code
				},
				success: res => {
					console.log("OpenID : " + res.data.openid);
					if (res.data.openid == undefined) {
						console.log('获取openid失败', res.data.errMsg);
						return
					}
					uni.setStorageSync('openid', res.data.openid)
				},
				fail: (wxcoderequesterr) => {console.log("Code request : " + wxcoderequesterr);
				}
				// complete: () => {}
			});
		},
		fail: (wxloginerr) => {
			console.log("Login err : " + wxloginerr)
		},
	});

	// var that=this
	// // 获取用户名  获取性别 获取头像 获取js_code去换取后台返回的openID
	// uni.login({
	//   provider: 'weixin',
	//   success: function (loginRes) {
	// 	let js_code=loginRes.code;//js_code可以给后台获取unionID或openID作为用户标识
	// 	// 获取用户信息
	// 	uni.getUserInfo({
	// 	  provider: 'weixin',
	// 	  success: function (infoRes) {
	// 		//infoRes里面有用户信息需要的话可以取一下
	// 		let username=infoRes.userInfo.nickName;//用户名
	// 		let gender=infoRes.userInfo.gender;//用户性别
	// 	    let avatarUrl=infoRes.userInfo.avatarUrl;//头像
	// 	 //判断是否授权
	// 	  uni.getSetting({
	// 	   success(res) {
	// 	  	console.log("授权：",res);
	// 	     if (!res.authSetting['scope.userInfo']) {
	// 	  		//这里调用授权
	// 	  		console.log("当前未授权");
	// 	     } else {
	// 	  		//用户已经授权过了
	// 	  		console.log("当前已授权");
	// 	  		// 弹出正在登录的弹框
	// 	  		uni.showLoading({
	// 	  			mask:true,
	// 	  			title: '正在登录···',
	// 	  			complete:()=>{}
	// 	  		});
	// 	  		// 判断已授权调取接口并获取openId
	// 	  		that.$apiReq.req({ // 创建对象
	// 	  			url: '/ui/wxutil/loginByWx', // 示例请求路径
	// 	  		    method:"post",
	// 	  			data : {
	// 	  				'code':js_code,
	// 	  			},
	// 	  			success: (res) => {
	// 	  			 //需要openId 可以在这里打印出来
	// 	  				if(res.data.code==202){
	// 	  					// 登录成功后判断是否是第一次注册  如果是弹出选择身份页面
	// 	  					 uni.navigateTo({
	// 	  						url: './registeredIdentity/registeredIdentity'
	// 	  						success: res => {},
	// 	  						fail: () => {},
	// 	  						complete: () => {}
	// 	  						});
	// 	  				    }else if(res.data.code==201){
	// 	  						 uni.switchTab({
	// 	  								url: '../homePage/homePage',
	// 	  								success: res => {},
	// 	  								fail: () => {},
	// 	  								complete: () => {}
	// 	  						 });
	// 	  				}
	// 	  			},
	// 	  		 })

	// 	     }
	// 	   }
	// 	  })
	// 	  },
	// 	  fail:function(res){}
	// 	})
	//   },
	//   fail:function(res){}
	// })
}




function login() {
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
					let img_path = rootUrl + 'media/captcha/' + this.form.username +
						'.png?v=' + new Date().getTime()
					this.captcha_path = img_path
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

function req(url, method, data, su, fa) {
	uni.showLoading({
		title: '请稍后',
	})
	var tokens = getToken()
	data['timestamp'] = tokens.timestamp
	uni.request({
		url: rootUrl + url,
		data: data,
		method: method,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'token': tokens.token,
		},
		success: function(res) {
			console.log(res.data)
			if (res.statusCode < 399)
				return typeof su == "function" && su(res.data);
			else {
				return typeof fa == "function" && fa(res.data)
			}
		},
		fail: function(error) {
			return typeof fa == "function" && fa(error)
		},
		complete() {
			uni.hideLoading()
		}
	})
}
export {
	req,
	rootUrl,
	// formatTime,
	// formatTime1,
	// formatTime2,
	// formatTime22,
	formatNumber,
	login,
	wechatLogin,
}
