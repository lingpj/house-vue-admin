<template>
    <div class="container">
        <h1>上海XX公司
        </h1>

        <div class="base-info">
            <h2>基本信息</h2>
            <ul>
                <li>公司编号：666</li>
                <li>联系人：张三</li>
                <li>电话：15038927731</li>
                <li>联系邮箱：286098039</li>
            </ul>
        </div>
        <div class="collection-info">
            <h2>收款信息</h2>
            <div class="info-box">
                <div>
                    <!-- <div class="desc">收款信息1</div> -->
                    <el-table :data="collectionTableDataArr" border fit highlight-current-row style="width: 100%">
                        <template v-for="item in collectionTableHeaderArr">
                            <el-table-column :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
                            </el-table-column>
                        </template>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="bill-info">
            <h2>支付凭证</h2>
            <div class="info-box">
                <div>
                    <el-table :data="payTableDataArr" border fit highlight-current-row style="width: 100%">
                        <template v-for="item in payTableHeaderArr">
                            <!--备注信息  -->
                            <el-table-column v-if="item.prop =='remark'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label" >
                                <template scope="scope">
                                    <el-popover title="备注信息" placement="right" width="400" trigger="click">
                                        <el-table fit :data="[{date:'1111',name:'2222',address:'333'}]">
                                            <el-table-column property="date" label="日期"></el-table-column>
                                            <el-table-column property="name" label="操作人"></el-table-column>
                                            <el-table-column property="address" label="备注"></el-table-column>
                                        </el-table>
                                        <el-button size="small" slot="reference">查看</el-button>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column v-else-if="item.prop =='img'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label"  >
                                <template scope="scope">
                                    <el-button size="small"  @click="lookVoucherImgHandle(scope)" v-waves>查看</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column v-else-if="item.prop =='operation'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label" :width="item.width">
                                <template scope="scope">
                                    <el-button size="small" type="primary" @click="operationHandle(1,scope)" v-waves>确认</el-button>
                                    <el-button size="small" type="primary" @click="operationHandle(2,scope)" v-waves>作废</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
                            </el-table-column>
                        </template>
                    </el-table>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            collectionTableHeaderArr: [
                { prop: 'name', align: 'center', label: '楼座名称', width: 100 },
                { prop: 'age', align: 'center', label: '房号', width: 100 },
                { prop: 'height', align: 'center', label: '收费类目', width: 100 },
                { prop: 'weight', align: 'center', label: '收款方', width: 100 },
                { prop: 'tel', align: 'center', label: '收款方账号', width: 100 },
                { prop: 'voucher', align: 'center', label: '收款方开户行', width: 100 },
            ],
            collectionTableDataArr: [
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 1 },
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 2 },
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 1 },
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 2 },
            ],
            radio: '已交账单',
            payTableDataArr: [
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 1 },
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 2 },
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 1 },
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 2 },
            ],
            payTableHeaderArr: [
                { prop: 'name', align: 'center', label: '上传日期', width: 100 },
                { prop: 'age', align: 'center', label: '转账流水', width: 100 },
                { prop: 'height', align: 'center', label: '上传人', width: 100 },
                { prop: 'weight', align: 'center', label: '支付金额', width: 100 },
                { prop: 'tel', align: 'center', label: '户名', width: 100 },
                { prop: 'voucher', align: 'center', label: '开户行', width: 100 },
                { prop: 'img', align: 'center', label: '凭证图片', width: 100 },
                { prop: 'voucher', align: 'center', label: '状态', width: 100 },
                { prop: 'voucher', align: 'center', label: '确认时间', width: 100 },
                { prop: 'voucher', align: 'center', label: '确认人', width: 100 },
                { prop: 'remark', align: 'center', label: '备注', width: 100 },
                { prop: 'operation', align: 'center', label: '操作', width: 200 },
            ],

        }
    },
    mounted() {

    },
    methods: {
        // 确认/作废
        operationHandle:function(n,scope){
            console.log(n,scope)
        },
        // 查看凭证图片
        lookVoucherImgHandle:function(scope){
            console.log(scope)
        }
    }
}
</script>
<style lang="scss" scoped>
h1 {
    font-size: 20px;
}

h2 {
    font-size: 16px;
}

.container {
    background-color: #eee;
    height: 100%;
    padding: 10px;
    padding-bottom: 50px;
    .base-info {
        ul {
            border: 1px solid lightgray;
            padding: 20px;
            margin: 10px 0;
            background-color: #fff;
            list-style: none;
            margin: 0;
            overflow: hidden;
        }
        li {
            float: left;
            margin-left: 50px;
        }
        li:first-child {
            margin-left: 0;
        }
    }
    .collection-info {

        .info-box {
            &>div:first-child~* {
                margin-top: 30px;
            }
            padding: 10px;
            border: 1px solid lightgray;
            background-color: #fff;
            .desc {
                margin-bottom: 5px;
            }
        }
    }
    .bill-info {
        .info-box {
            &>div:first-child~* {
                margin-top: 30px;
            }
            padding: 10px;
            border: 1px solid lightgray;
            background-color: #fff;
            .desc {
                margin-bottom: 5px;
            }
            .desc:first-child~.desc {
                margin-top: 20px;
            }
            .detail {
                border: 1px solid lightgray;
                padding: 10px;
                ul {
                    border: 1px solid lightgray;
                    list-style: none;
                    overflow: hidden;
                    margin: 10px 0;
                    padding: 0 20px 20px 20px;
                    li {
                        float: left;
                        margin-left: 50px;
                        margin-top: 20px;
                    }
                    li:first-child {
                        margin-left: 0;
                    }
                }
            }
        }
    }
}
</style>

