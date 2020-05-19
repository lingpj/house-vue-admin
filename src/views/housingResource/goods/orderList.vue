<template>
    <div class='container'>
        <el-form ref="form" id="form" :model="form" label-width="100px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="所属园区:" prop="park">
                        <el-select v-model="form.park"  @change="parkChangeHandle"  clearable style="width:200px" placeholder="请选择">
                            <el-option
                                v-for="item in parkList"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="状态:">
                        <el-select style="width:200px" v-model="form.status" placeholder="请选择活动区域">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="交易成功" value="2"></el-option>
                            <el-option label="已关闭" value="3"></el-option>
                            <el-option label="支付中" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="楼栋:">
                       <el-select style="width:200px" v-model="form.build" placeholder="请选择">
                        <el-option v-for="item in buildArr" :key="item.buildname" :label="item.buildname" :value="item.buildname"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="submit" style="margin-left:100px">搜索</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
    
        <div class="productTable">
            <el-button type="primary" class="addProductBtn" @click="addProductHandle">添加商品</el-button>
            <el-table id="table" :data="tableDataArr" border fit highlight-current-row style="width: 100%">
                <el-table-column prop="park" label="所属园区" align="center"></el-table-column>
                <el-table-column prop="build" label="楼栋" align="center"></el-table-column>
                 <el-table-column prop="floor" label="楼层" align="center"></el-table-column>
                  <el-table-column prop="room" label="房号" align="center"></el-table-column>
                <el-table-column prop="price" label="价格" align="center"></el-table-column>
                <el-table-column prop="status" :formatter="fmtStatus" label="状态" align="center"></el-table-column>
                <el-table-column prop="spike_time" :width="200" label="开放秒杀时间" align="center"></el-table-column>
                <el-table-column prop="code" label="支付订单号" align="center"></el-table-column>
                <el-table-column prop="createtime" :formatter="fmtDate" label="下单时间" align="center"></el-table-column>
                <el-table-column prop="salesman" label="销售人员" align="center"></el-table-column>
                <el-table-column prop="mobile" label="销售电话" align="center"></el-table-column>
                <el-table-column prop="enterprice" label="客户名称" align="center"></el-table-column>
                <!-- <el-table-column prop="operation" label="操作" align="center" fixed="right" :width="200">
                    <template scope="scope">
                        <el-button size="small" v-waves v-if="scope.row.status == 1" @click="operationHandle(2,scope.row)">下架</el-button>
                        <el-button size="small" style="margin-left:10px" v-if="scope.row.status == 2" @click="operationHandle(1,scope.row)" v-waves>上架</el-button>
                        <el-button size="small" style="margin-left:10px"  @click="editHandle(scope.row)" v-waves>编辑</el-button>
                    </template>
                </el-table-column> -->
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
 
    data() {
        return {
            form: {
                park: '',
                status: '',
                build:'',
            },
            tableDataArr: [],
            listQuery: {
                page: 1,
                limit: 10,
            },
            total: 0,
            QRCodeDialogVisible: false,
            parkList:[],
            buildArr:[],
        }
    },      
    filters:{
        formatUpDown:function(item){
            // console.log('>>>',val)
            var str = ''
            if (new Date().getTime() > new Date(item.endtime).getTime()) {
                str = '上架'
            } else if (new Date().getTime() < new Date(item.starttime).getTime()) {
                str = ''
            } else {
                str = '下架'
            }
            return str
        }
    },
    mounted() {
        this.getTableData()
        this.getParkList()
    },

    methods: {
        parkChangeHandle(){
      this.$fetch({
        url: process.env.dropdbandescape + "/room/parkinfo/pageList",
        method: "post",
        data:{
          parkname:this.form.park,
          page:1,
          limit:100000000,
        }
      }).then(res => {
        this.buildArr = res.list || []
      });
    },
        fmtDate(val){
      return new Date(val.spike_time).format('yyyy-MM-dd hh:ss:mm')
    },
        operationHandle(flag,data){
            this.$confirm(`确认${flag == 1 ?'上架':'下架'}此房源？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            data.status = parseInt(data.status) == 1 ? 2:1 
            this.$fetch({
                url: process.env.dropdbandescape + "/room/spike/"+data.code,
                method: "put",
                data: data
            }).then(res => {
               this.$message.success('操作成功！')
               this.getTableData()
            })
        }) 
        },
        editHandle(data){
             var str = JSON.stringify(data)
             this.$router.push({ path: "/housingResourceGoods/addGoods", query: {data:str} });
        },  
        fmtStatus(val){
            return ['支付中','交易完成','交易关闭'][parseInt(val.status) - 1]
        },
        // 获取园区列表
        getParkList(){
        this.$fetch({
            url: process.env.dropdbandescape + "/room/parkinfo/name/list",
            method: "get",
            params: {}
        }).then(res => {
            this.parkList=  res.data.rows
        });
        },
        // 上、下架商品
        changeProductStatusHandle:function(scope){
            var data = scope.row
            data.statusId = data.statusName == '已上架' ? 2 : 1
             this.$fetch({
                url: process.env.shop_api + '/shopProduct/' +data.id,
                method: 'put',
                data: data
            }).then((res) => {
                 this.$message({
                        type: 'success',
                        message:'操作成功！'
                    });
                this.getTableData()
            })
        },

        // 预览
        previewHandle(data){
            console.log(data)
        },
       
        // 添加商品
        addProductHandle: function() {
            this.$router.push('/housingResourceGoods/addGoods')
        },
        // 搜索
        submit: function() {


            var startTime = '', endTime = ''
            if (this.form.time == '') {
                // alert('选择时间')
            }
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
        // 表格数据
        getTableData: function() {
        this.$myLoading.show();

        console.log(this.form)
        this.$fetch({
            url: process.env.dropdbandescape + "/room/trade/pageList",
            method: "post",
            data: {
                limit: this.listQuery.limit,
                page: this.listQuery.page,
                status:this.form.status,
                park:this.form.park,
                build:this.form.build
            }
        }).then(res => {
            this.$myLoading.hide();
            if (res.list) {
                this.tableDataArr = res.list;
                this.total = res.totalCount;
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
    .productTable {
        padding: 10px;
        overflow: hidden;
        .addProductBtn {
            margin-bottom: 20px;
        }
    }
}
</style>
