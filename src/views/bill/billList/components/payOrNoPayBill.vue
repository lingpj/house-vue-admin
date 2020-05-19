<template>
    <div class="container">
        <h1>上海XX公司
        </h1>

        <div class="base-info">
            <ul>
                <li>公司编号：666</li>
                <li>联系人：张三</li>
                <li>电话：15038927731</li>
                <li>联系邮箱：286098039</li>
            </ul>
        </div>
        <h1>待缴账单信息</h1>

        <div class="base-info">
            <ul>
                <li>待结总笔数：11笔</li>
                <li>待结总金额：99999元</li>
                <li>收费类型：物业费</li>
                <li>收款方：上海e同</li>
                <li>收款方账号：888888</li>
                <li>收款方开户行：建行</li>
            </ul>
        </div>
   
        <div class="bill-info">
            <div>
                <el-table id="table" :data="tableDataArr" border fit highlight-current-row style="width: 100%">
                    <template v-for="item in tableHeaderArr">
                        <!--操作  -->
                        <el-table-column v-if="item.prop=='operation'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label" :width="item.width">
                            <template scope="scope">
                                <el-popover placement="right" width="400" trigger="click" @hide="remarkHideAfter">
                                    <h2 style="margin:0 0 10px 0">企业备注</h2>
                                    <el-input type="textarea" v-model="remarkInfo"></el-input>
                                    <el-button style=" margin-top:10px" type="primary" size="small" @click="operationHandle(1,scope)" v-waves>确定</el-button>
                                    <el-button slot="reference" type="info" size="small" v-waves>备注</el-button>
                                </el-popover>
                                <el-button size="small" style="margin-left:10px" @click="operationHandle(2,scope)" v-waves>编辑</el-button>
                                <el-button type="danger" size="small" @click="operationHandle(3,scope)" v-waves>手工销账</el-button>
                            </template>
                        </el-table-column>
                        <!--状态  -->
                        <el-table-column v-else-if="item.prop =='status'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label" :width="item.width">
                            <template scope="scope">
                                <span :class="{  green : scope.row.status == 1,red:scope.row.status == 2 }">● </span>{{scope.row.status}}
                            </template>
                        </el-table-column>
                        <!--支付凭证  -->
                        <el-table-column v-else-if="item.prop =='voucher'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label" :width="item.width">
                            <template scope="scope">
                                <el-button size="small" @click="lookVoucherHandle(scope)">查看</el-button>
                            </template>
                        </el-table-column>
                        <!--企业名称  -->
                        <el-table-column v-else-if="item.prop =='name'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label" :width="item.width">
                            <template scope="scope">
                                <el-button size="small" @click="companyDetailHandle(scope)">{{scope.row.name}}</el-button>
                            </template>
                        </el-table-column>
                        <!--备注信息  -->
                        <el-table-column v-else-if="item.prop =='remark'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label" :width="item.width">
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
                        <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label" :width="item.width">
                        </el-table-column>
                    </template>
                </el-table>
            </div>

        </div>
        <el-button type="primary" style="margin:10px 0; " @click="cuiPayClickHandle" v-waves>催付</el-button>

    </div>
</template>
<script>
export default {
    data() {
        return {
            tableHeaderArr: [
                { prop: 'name', align: 'center', label: '账单编号', width: 100 },
                { prop: 'height', align: 'center', label: '楼座名称', width: 100 },
                { prop: 'weight', align: 'center', label: '房号', width: 100 },
                { prop: 'tel', align: 'center', label: '收费项目', width: 100 },
                { prop: 'voucher', align: 'center', label: '应收日期', width: 100 },
                { prop: 'remark', align: 'center', label: '应收总额', width: 100 },
                { prop: 'status', align: 'center', label: '计费开始日期', width: 100, },
                { prop: 'operation', align: 'center', label: '计费结束日期', width: 250, },
                { prop: 'asdf', align: 'center', label: '减免金额', width: 100, },
                { prop: 'asdf', align: 'center', label: '应付款', width: 100, },
                { prop: 'asdf', align: 'center', label: '已付款', width: 100, },
                { prop: 'asdf', align: 'center', label: '未付款', width: 100, },
                { prop: 'asdf', align: 'center', label: '支付时间', width: 100, },
                { prop: 'asdf', align: 'center', label: '状态', width: 100, },
                { prop: 'asdf', align: 'center', label: '销账类型', width: 100, },
                { prop: 'asdf', align: 'center', label: '支付凭证', width: 100, },
                { prop: 'asdf', align: 'center', label: '备注信息', width: 100, },
                { prop: 'asdf', align: 'center', label: '操作', width: 100, },
            ],
            tableDataArr: [
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 1 },
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 2 },
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 1 },
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 2 },
            ],
            remarkInfo: '',
        }
    },
    mounted() {

    },
    methods: {
        // 确认/作废
        operationHandle: function(n, scope) {
            console.log(n, scope)
        },
        // 查看凭证图片
        lookVoucherImgHandle: function(scope) {
            console.log(scope)
        },
        // 查看支付凭证
        lookVoucherHandle: function(scope) {
            console.log(scope)
            this.payVoucherUnion.visible = true
        },
        // 备注popover隐藏后清除textarea   
        remarkHideAfter: function() {
            this.remarkInfo = ''
        },

        // 备注/编辑/销账
        operationHandle: function(type, scope) {
            console.log(type, scope)
            if (type == 1) {
                console.log('备注：', this.remarkInfo)
            } else if (type == 2) {
                this.addBillHandle(true)
            } else {

            }
        },
        cuiPayClickHandle: function() {

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
    background-color: #fff;
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
        margin-top: 20px;
    }
}
</style>

