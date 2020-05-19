<template>
    <div class='temporaryParkingPage'>
        <el-form ref="form" id="form" :model="form" label-width="100px">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="车牌号:">
                        <el-input style="width:350px" v-model="form.plateNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="所属园区:">
                        <el-select clearable v-model="selectPark" placeholder="请选择">
                            <el-option v-for="item in parkList" :key="item.parking_id" :label="item.name" :value="item.parking_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="创建时间:" class="createTime">
                        <el-date-picker style="width:350px;" v-model="form.orderTime" type="daterange" range-separator="   至  " start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-button type="primary" @click="submit" style="margin-left:100px">搜索</el-button>
                </el-col>
            </el-row>
        </el-form>
        <div class="recordTable">
            <el-radio-group v-model="typeRadio" class="radioGroup">
                <el-radio-button v-for="item in typeRadioRadioArr" :label="item" :key="Math.random() +100"></el-radio-button>
            </el-radio-group>
            <el-table id="table" :data="currentShowTableDataArr" border fit highlight-current-row style="width: 100%">
                <el-table-column prop="id" label="序号"  ></el-table-column>
                <el-table-column prop="plateno" label="车牌号"  ></el-table-column>
                <el-table-column prop="parkOwner" label="所属园区"  ></el-table-column>
                <el-table-column prop="entryTime" label="进场时间"  ></el-table-column>
                <el-table-column prop="payTime" label="出场时间"  ></el-table-column>
                <el-table-column prop="elapsedTime" label="停车时长(分钟)"  ></el-table-column>
                <el-table-column prop="payable" label="应付金额(元)">
                    <template scope="scope">
                           {{scope.row.payable | cent2yuan}}
                    </template>
                </el-table-column>
                <el-table-column prop="money" label="实付金额(元)" >
                    <template scope="scope">
                           {{scope.row.money | cent2yuan}}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="支付状态">
                    <template scope="scope">
                           {{scope.row.status |  formatStatus}}
                        </template>
                </el-table-column>
                <el-table-column prop="operation" label="操作" width="180">
                    <template scope="scope">
                            <el-button size="small" v-if="scope.row.status == '0'" @click="operationHandle(scope)" v-waves>销账</el-button>
                            <el-button size="small" v-if="scope.row.status == '1' && scope.row.invoice_status != 1" @click="getInvoiceHandle(scope.row)" v-waves>取发票</el-button>
                            <span v-if="scope.row.status == '1' && scope.row.invoice_status == 1" >已领取发票</span>
                    </template>
                </el-table-column>
            </el-table>
            <div style="float:right;margin-top:10px">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: '',
    components: {},
    data() {
        return {
            form: {
                plateNo:'',
                orderTime: '',
            },
            selectPark:'',  
            parkList: [],
            tableHeaderArr: [
                { prop: 'id', align: 'center', label: '序号', width: 100 },
                { prop: 'plateno', align: 'center', label: '车牌号', width: 100 },
                { prop: 'parkOwner', align: 'center', label: '所属园区', width: 100 },
                { prop: 'entryTime', align: 'center', label: '进场时间', width: 100 },
                { prop: 'payTime', align: 'center', label: '出场时间', width: 100 },
                { prop: 'elapsedTime', align: 'center', label: '停车时长(分钟)', width: 100 },
                { prop: 'payable', align: 'center', label: '应付金额(元)', width: 100, },
                { prop: 'money', align: 'center', label: '实付金额(元)', width: 250, },
                { prop: 'status', align: 'center', label: '支付状态', width: 250, },
                { prop: 'operation', align: 'center', label: '操作', width: 250, },
            ],
            listQuery: {
                page: 1,
                limit: 10,
            },
            total: 0,
            currentShowTableDataArr: [],
            typeRadio:'未支付',
            typeRadioRadioArr:['未支付','已支付']
        }
    },

    mounted() { 
        this.getParkList()
        this.getTableData()
    },
    filters:{
        formatStatus:function(val){
            return val == '0' ? '未支付' : '已支付'
        },
        formatMoney:function(val){
            if(isNaN(parseInt(val))){
                return ''
            }
            return (parseInt(val) / 100).toFixed(0)
        }
    },
    watch:{
        typeRadio:function(val){
            this.listQuery.page = 1
            this.getTableData(val == '未支付' ? 0 : 1)
        }
    },
    methods: {
        // 取发票
        getInvoiceHandle:function(data){
            console.log('>>>>',data)
            this.$fetch({
                url: process.env.park_api + '/writeoff/operate',
                method: 'post',
                data: {
                    monthBillId:'',
                    parkBillId:data.orderno,
                    invoiceStatus:1,
                    operator:this.$store.getters.name,  
                    token: this.$store.getters.token
                }
            }).then(res =>{
                if(res.code == 200){
                    this.$message.success('发票领取成功！')
                    this.getTableData()
                }
            })
        },
        // 操作：销账
        operationHandle:function(scope){
            this.$confirm('确定要销账？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(scope.row)
                this.$fetch({
                    url: process.env.park_api + '/bind/writeOff/',
                    method: 'post',
                    data: {
                        typeId:'1001',
                        plateNo:scope.row.plateno,
                        token: this.$store.getters.token
                    }
                }).then((res) => {
                    this.$message.success(res.msg)
                    this.getTableData()
                }).catch((err) => {

                })
            })
        },
        // 获取园区列表
        getParkList: function() {
            this.$fetch({
                url: process.env.park_api + '/parking-config/all',
                method: 'get',
                params: {
                    token: this.$store.getters.token
                }
            }).then((res) => {
                this.parkList = res.concat({name:'全部',parking_id:''})
            }).catch((err) => {

            })
        },
        // 分页变化
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getTableData();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getTableData();
        },
        // 提交
        submit: function() {
            this.getTableData()
        },
        // 表格数据
        getTableData: function(status) {
            this.$myLoading.show()
            var starttime = '', endtime = ''
            if (this.form.orderTime[0]) {
                starttime = this.form.orderTime[0].format('yyyy-MM-dd hh:mm:ss')
            }
            if (this.form.orderTime[1]) {
                endtime = this.form.orderTime[1].format('yyyy-MM-dd hh:mm:ss')
            }
            this.$fetch({
                url: process.env.park_api + '/bill/selectTemporaryParkingList',
                method: 'get',
                params: {
                    plateNo:this.form.plateNo,
                    parkId:this.selectPark,
                    status: this.typeRadio == '未支付' ? 0 :1 ,
                    startCreateTime: starttime,
                    endCreateTime: endtime,
                    page:  this.listQuery.page,
                    limit: this.listQuery.limit,
                }
            }).then((res) => {
                this.$myLoading.hide()
                var self = this
                this.currentShowTableDataArr = res.list
                this.currentShowTableDataArr.forEach(item =>{
                    item.parkOwner =  self.parkList.filter( o=>{
                        return o.parking_id == item.parkinginfo_id + ''
                    })[0].name
                })
                this.total = res.totalCount
            })
        },
    }
}
</script>

<style lang='scss' scoped>
.temporaryParkingPage {
    border: 20px solid #eee;
    background-color: #fff;
    #form {
        padding: 20px 0 0 0;
    }
    .recordTable{
        border-top: 10px solid #eee;
        padding: 20px;
        overflow: hidden;
    }
}
</style>
