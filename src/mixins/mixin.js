
let floor = ['全部宿舍', '1栋', '2栋', '3栋', '4栋', '5栋', '6栋', '7栋', '8栋', '9栋', '10栋', '11栋', '12栋', '13栋', '14栋', '15栋',
	'16栋', '17栋', '18栋', '19栋', '20栋', '21栋', '22栋', '23栋', '24栋', '25栋', '26栋', '27栋', '28栋', '29栋', '30栋'
]
export default {
	data () {
		return {
			tabList: [{
				name: '处理中',
				status: 0
			}, {
				name: '已完成',
				status: 1
			}],
			emptyState: ['/static/images/nodata-1.png', '/static/images/nodata-2.png', '/static/images/nodata-3.png'],
			floorList: [floor],
			applyData: [],
			isEndOfList: null,
			currentIndex: 0
		}
	},
	computed: {
		applyStatus () {
			return (status) => {
				return Number(status) === 0 ? '未处理'
				: Number(status) === 1 ? '处理中' : '已完成'
			}
		},
		tagType () {
			return (status) => {
				return Number(status) === 0 ? 'error'
				: Number(status) === 1 ? 'warning' : 'success'
			}
		}
	},
	methods: {
		// 查看详情
		navToDetailPage(item) {
			const isAdmin = uni.getStorageSync("user_info").role ==4 ? true : false
			uni.navigateTo({
				url: '/pages/home/repair/detail/detail?detail=' + JSON.stringify(item)+'&isAdmin='+isAdmin
			})
		}
	}
}
