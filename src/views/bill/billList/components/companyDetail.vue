<template>
    <div class="container">
        <h1>上海XX公司
            <el-button type="primary" size="small" v-waves @click="editHandle">编辑</el-button>
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
                    <div class="desc">收款信息1</div>
                    <el-table :data="collectionTableDataArr" border fit highlight-current-row style="width: 100%">
                        <template v-for="item in collectionTableHeaderArr">
                            <el-table-column :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
                            </el-table-column>
                        </template>
                    </el-table>
                </div>
                <div>
                    <div class="desc">收款信息1</div>
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
            <h2>账单信息</h2>
            <div class="info-box">
                <div>
                    <div class="desc">收款方：深圳腾讯</div>
                    <div class="detail">
                        <el-radio-group v-model="radio" size="small">
                            <el-radio-button label="已交账单" value="all"></el-radio-button>
                            <el-radio-button label="未缴账单" value="company"></el-radio-button>
                        </el-radio-group>
                        <ul>
                            <li>待结总笔数：25笔</li>
                            <li>待结总金额：666元</li>
                            <li>收费类型：租金</li>
                            <li>收款方：25笔</li>
                            <li>收款方账号：25笔</li>
                            <li>收款方开户行：25笔</li>
                        </ul>
                        <el-table :data="billTableDataArr" border fit highlight-current-row style="width: 100%">
                            <template v-for="item in billTableHeaderArr">
                                <!--备注信息  -->
                                <el-table-column v-if="item.prop =='remark'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label" :width="item.width">
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
                                <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
                                </el-table-column>
                            </template>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <div class="remark-info">
            <h2>备注信息</h2>
            <el-table fit border :data="remarkTableData" :align="center">
                <el-table-column property="date" label="日期" align="center"></el-table-column>
                <el-table-column property="name" label="操作人" align="center"></el-table-column>
                <el-table-column property="address" label="备注" align="center"></el-table-column>
            </el-table>
        </div>
        <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="活动名称" :label-width="100">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="100">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
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
            billTableDataArr: [
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 1 },
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 2 },
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 1 },
                { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 2 },
            ],
            billTableHeaderArr: [
                { prop: 'name', align: 'center', label: '账单编号', width: 100 },
                { prop: 'age', align: 'center', label: '收费项目', width: 100 },
                { prop: 'height', align: 'center', label: '计费开始日期', width: 100 },
                { prop: 'weight', align: 'center', label: '计费结束日期', width: 100 },
                { prop: 'tel', align: 'center', label: '应收总额', width: 100 },
                { prop: 'voucher', align: 'center', label: '减免金额', width: 100 },
                { prop: 'voucher', align: 'center', label: '已付款', width: 100 },
                { prop: 'voucher', align: 'center', label: '未付款', width: 100 },
                { prop: 'voucher', align: 'center', label: '状态', width: 100 },
                { prop: 'voucher', align: 'center', label: '应付时间', width: 100 },
                { prop: 'voucher', align: 'center', label: '实付日期', width: 100 },
                { prop: 'remark', align: 'center', label: '备注', width: 100 },
            ],
            remarkTableData: [
                { date: '666', name: '张三', address: '777' }
            ],
            // 表单
            dialogFormVisible: false,
            form:{
                name:'11',
                regin:'22'
            }
        }
    },
    mounted() {

    },
    methods: {
        // 编辑
        editHandle: function() {
            this.dialogFormVisible = true
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

