


export default {
    data () {
        return {
            emptyMsg:'',
            choFlag:[],
          emptyType: "search"
        }
    },
    methods: {
        // 是否选中
        choChange: function (index) {
            this.choFlag[index] = !this.choFlag[index]
        },
    }
}

