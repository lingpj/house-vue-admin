<template>
    <div class='container'>
        <el-form ref="form" id="form" :model="form" label-width="100px">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="关键词:" prop="name">
                        <el-input style="width:350px" v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="状态:">
                        <el-select style="width:300px" v-model="form.statusId" placeholder="请选择活动区域">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="已上架" value="1"></el-option>
                            <el-option label="已下架" value="2"></el-option>
                            <el-option label="未上架" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="创建时间:" class="createTime">
                        <el-date-picker style="width:350px;text-align:center" v-model="form.time" type="datetimerange" range-separator="  至  " start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-button type="primary" @click="submit" style="margin-left:100px">搜索</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
        <a id="qrcode" ref="qrcode"></a>
        <div class="QRCodeDialogVisible" @click="QRCodeDialogHandle" v-show="QRCodeDialogVisible">
            <div class="box">
                请打开微信扫描二维码预览商品。
            </div>
        </div>
        <div class="productTable">
            <el-button type="primary" class="addProductBtn" @click="addProductHandle">添加商品</el-button>
            <el-table id="table" :data="tableDataArr" border fit highlight-current-row style="width: 100%">
                <el-table-column prop="productCode" label="商品编号" align="center"></el-table-column>
                <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="productDetail" label="商品详情" align="center">
                    <template scope="scope">
                            <el-button size="small" @click="previewHandle(scope)">预览</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="repertory" label="库存" align="center"></el-table-column>
                <el-table-column prop="sales" label="已购数量" align="center"></el-table-column>
                <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
                <el-table-column prop="typeName" label="商品类别" align="center"></el-table-column>
                <el-table-column prop="starttime" label="上架时间" align="center"></el-table-column>
                <el-table-column prop="endtime" label="下架时间" align="center"></el-table-column>
                <el-table-column prop="operation" label="操作" align="center" :width="150">
                    <template scope="scope">
                        <el-button size="small" v-waves @click="changeProductStatusHandle(scope)" v-if="new Date().getTime() >= new Date(scope.row.starttime).getTime()">{{scope.row | formatUpDown }}</el-button>
                        <el-button size="small" type="primary" style="margin-left:10px" @click="operationHandle(1,scope)" v-waves>编辑</el-button>
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
import QRCode from 'qrcodejs2'
import config from '../config'
export default {
    name: '',
    components: { QRCode },
    data() {
        return {
            form: {
                name: '',
                time: '',
                endTime: '',
                statusId: '',
            },
            tableHeaderArr: [
                { prop: 'productCode', align: 'center', label: '商品编号', width: 100 },
                { prop: 'productName', align: 'center', label: '商品名称', width: 100 },
                { prop: 'productDetail', align: 'center', label: '商品详情', width: 100 },
                { prop: 'repertory', align: 'center', label: '库存', width: 100 },
                { prop: 'sales', align: 'center', label: '已购数量', width: 100 },
                { prop: 'statusName', align: 'center', label: '状态', width: 100 },
                { prop: 'typeName', align: 'center', label: '商品类别', width: 100 },
                { prop: 'starttime', align: 'center', label: '上架时间', width: 100, },
                { prop: 'endtime', align: 'center', label: '下架时间', width: 100, },
                { prop: 'operation', align: 'center', label: '操作', width: 150, },
            ],
            tableDataArr: [],
            listQuery: {
                page: 1,
                limit: 20,
            },
            total: 0,
            QRCodeDialogVisible: false,

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
        $('html,body').animate({ scrollTop: '0px' }, 800);

    },

    methods: {
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
        // 操作
        operationHandle: function(n, scope) {


            this.$router.push({ path: '/productManager/addProduct', query: scope.row })

        },
        // 二维码展示
        QRCodeDialogHandle: function() {
            this.QRCodeDialogVisible = false
        },
        // 预览
        previewHandle: function(scope) {
            var data = scope.row
            $('#qrcode').empty()
            let qrcode = new QRCode('qrcode', {
                width: 200,  // 二维码宽度 
                height: 200, // 二维码高度
                // text: 'http://pwmall.parkwing.cn/shop/#/goodsDetail?id=' + data.id
                text: config.previewImageUrl+'/shop/share?id=' + data.id
            })
            this.QRCodeDialogVisible = true
            this.$nextTick(function() {
                var imgDom = this.$refs.qrcode
                $('.QRCodeDialogVisible .box').append($(imgDom))
            })
        },
        // 添加商品
        addProductHandle: function() {
            this.$router.push('/productManager/addProduct')
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
            this.$myLoading.show()
            var starttime = '', endtime = ''
            if (this.form.time[0]) {
                starttime = this.form.time[0].format('yyyy-MM-dd hh:mm:ss')
            }
            if (this.form.time[1]) {
                endtime = this.form.time[1].format('yyyy-MM-dd hh:mm:ss')
            }
            this.$fetch({
                url: process.env.shop_api + '/shopProduct/listShopProductAll',
                method: 'post',
                data: {
                    // token: this.$store.getters.token,
                    productName: this.form.name,
                    page: this.listQuery.page,
                    limit: this.listQuery.limit,
                    starttime: starttime,
                    endtime: endtime,
                    statusId: this.form.statusId
                }
            }).then((res) => {

                this.$myLoading.hide()
                if (res.code != 200) {
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    });
                } else {
                    if (!res.data) {
                        this.tableDataArr = []
                        return
                    }
                    this.tableDataArr = res.data.list
                    this.tableDataArr.forEach(function(item) {
                        item.createtime = new Date(item.createtime).format('yyyy-MM-dd hh:mm:ss')
                        item.starttime = new Date(item.starttime).format('yyyy-MM-dd hh:mm:ss')
                        item.endtime = new Date(item.endtime).format('yyyy-MM-dd hh:mm:ss')
                        if (new Date().getTime() > new Date(item.endtime).getTime()) {
                            item.statusName = '已下架'
                        } else if (new Date().getTime() < new Date(item.starttime).getTime()) {
                            item.statusName = '未上架'
                        } else {
                            item.statusName = '已上架'
                        }
                    });
                    this.total = res.data.count
                }
            }).catch(() => {
                this.$myLoading.hide()
                this.$message({
                    type: 'error',
                    message: '查询出错'
                });
            })
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
