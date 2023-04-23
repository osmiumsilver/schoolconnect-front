export default {
    data() {
        return {
            searchModel: '',
        }
    }, watch: {
        searchModel(newValue) {
            if (newValue) {
                this.searchData(true);
            } else {
                this.searchData(false);
            }
        },
        methods: {
            searchData(bool) {
                if (bool) {
                    // 前端实现模糊查询--不用对接口
                    let newListData = []; // 用于存放搜索出来数据的新数组
                    if (this.searchModel) {

                        this.searchList.filter((item) => {
                            if (item.campaignName.indexOf(this.searchModel) !== -1) {
                                newListData.push(item);
                            }
                        });
                    }
                    this.campaignList = newListData;
                } else {
                    this.getData(this.currentIndex)
                }
            },
        }
    },

}
