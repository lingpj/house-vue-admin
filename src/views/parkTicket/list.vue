<template>
    <div class='container'>
        <el-form ref="form" id="form" :model="form" label-width="100px">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="销售部门:" prop="park">
                        <el-select style="width:300px" v-model="form.park"  clearable   placeholder="请选择">
                            <el-option
                                v-for="item in parkList"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="交易状态:">
                         <el-select style="width:300px" v-model="form.status" placeholder="请选择">
                             <el-option  key="item.buildname1" label="全部" value=""></el-option>
                            <el-option  key="item.buildname1" label="支付中" value="1"></el-option>
                            <el-option  key="item.buildname2" label="未使用" value="2"></el-option>
                            <el-option  key="item.buildname3" label="已关闭" value="3"></el-option>
                            <el-option  key="item.buildname4" label="已使用" value="4"></el-option>
                            </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="买家姓名:" prop="park">
                       <el-input v-model="form.name" style="width:300px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="付款时间:">
                         <el-date-picker style="width:300px"
                                v-model="form.time"
                                type="daterange"
                                clearable
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                                </el-date-picker>
                    </el-form-item>
                </el-col>
                
            </el-row>
            <el-row>
                <el-col :span="10" style="padding-bottom:20px">
                    <el-button type="primary" @click="submit" style="margin-left:100px">搜索</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
    
        <div class="productTable">
            <table >
                <tr>
                    <td>宝贝</td>
                    <td>数量</td>
                    <td>买家信息</td>
                    <td>所属公司</td>
                    <td>交易状态</td>
                    <td>实收款</td>
                </tr>
                <template v-for="item in tableDataArr">
                    <tr>
                        <td colspan="7" style="text-align:left">
                            订单号：{{item.oid}}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            创建时间：{{item.createtime | formatDate}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src="../../assets/401_images/ticket.jpg" alt="">
                        </td>
                        <td>{{item.list.length}}</td>
                        <td>{{item.name}}
                            <br>
                            {{item.mobile}}
                        </td>
                        <td>{{item.deptname}}</td>
                        <td>{{item.status | formatStatus}}
                            <br>
                            <el-button type="info" size="small" @click="detailHandle(item)">详情</el-button>
                        </td>
                        <td>¥{{item.price | formatPrice}}元</td>
                    </tr>
                </template>
            </table>
            <div style="float:right;margin-top:10px">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            form: {
                park: '',
                status: '',
                name:'',
                time:['','']
            },
            tableDataArr: [],
            listQuery: {
                page: 1,
                limit: 10,
            },
            total: 0,
            parkList:[],
        }
    },      
    filters: {
        formatPrice(val){
            return (val / 100).toFixed(2)
        },
        formatDate(val){
            return new Date(val).format('yyyy-MM-dd hh:mm:ss')
        },
        fmtDate(val) {
            return parseTime(new Date(val));
        },
        formatStatus(val) {
            var arr = ['支付中','未使用', '已关闭','已使用']
            return arr[val*1 - 1];
        }
  },
    mounted() {
        this.getTableData()
        this.getParkList()
    },

    methods: {
        
        fmtDate(val){
      if(val.status == '2') return '-'
      return new Date(val.spike_time).format('yyyy-MM-dd hh:ss:mm')
    },
       
        // 获取园区列表
        getParkList(){
        this.$fetch({
            url: process.env.dropdbandescape + "/room/dept/pageList",
            method: "post",
            data: {
                limit:10000000,
                page:1
            }
        }).then(res => {
            this.parkList=  res.list
        });
        },
      

       
        // 添加商品
        addProductHandle: function() {
            this.$router.push('/housingResourceGoods/addGoods')
        },
        // 搜索
        submit: function() {
            this.getTableData()
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
        // 重置表单
        resetForm: function() {
            for (var k in this.form) {
                this.form[k] = ''
            }
        },
        // 详情跳转
        detailHandle(data){
            console.log(data)
            sessionStorage.setItem('parkTicketDetail',JSON.stringify(data))
            this.$router.push('/parkTicket/parkTicketDetail')
        },
        // 表格数据
        getTableData: function() {
        this.$myLoading.show();

        this.$fetch({
            url: process.env.dropdbandescape + "/room/paking/order/list",
            method: "post",
            data: {
                limit: this.listQuery.limit,
                page: this.listQuery.page,
                name:this.form.name,
                status:this.form.status || '',
                startdate: this.form.time[0]!=='' && this.form.time[0] ? this.form.time[0].getTime():'',
                enddate:this.form.time[1]!==''&& this.form.time[1] ? this.form.time[1].getTime():'',
                deptname:this.form.park
            }
        }).then(res => {
            this.$myLoading.hide();
            if (res.data) {
                this.tableDataArr = res.data.list || []
                this.total = res.data.totalPage;
            }else{
                this.tableDataArr = []
                this.total = 1
            }
        });
      }
    }
}
</script>

<style lang='scss' scoped>
.container {

    border: 20px solid #eee;
    background-color: #fff;
    // border-bottom: 500px solid #eee; // #qrcode {
    //    display: none;
    // }
    .productTable{
        overflow: hidden;
        table{
            
           border-collapse: collapse;
           border-spacing: 0; 
           width: 100%;
           text-align: center;
        }  
        img{
            width: 200px;
        }
        td{
            border:2px solid lightgray;
            padding: 10px;
        }
    }
    .QRCodeDialogVisible {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(111, 111, 111, .5);
        z-index: 999;
        .box {
            display: flex;
            color: #111;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            background-color: #eee;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 0 15px #888;
            a {
                margin-top: 20px;
            }
        }
    }
    #form {
        padding-top: 15px;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
    }
    .createTime /deep/ .el-input__inner {
        text-align: center;
    }
  
}
</style>
