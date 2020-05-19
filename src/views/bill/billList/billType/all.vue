<template>
    <div class="container">
        <el-form class="" id="form" :model="searchForm" :rules="searchFormRules" label-width="150px" ref="searchForm">
            <div>
                <el-form-item label="关键词:" prop="key_word">
                    <!-- <el-autocomplete style="width:215px;" v-model="searchResult" :fetch-suggestions="querySearchAsync" placeholder="请输入企业名称、房号" @select="handleSelect"></el-autocomplete> -->
                    <multiselect v-model="value" @search-change="searchChange" @input="inputing" :options="options" :multiple="true" :searchable="true" :close-on-select="false" :show-labels="false" placeholder="搜索"></multiselect>
                </el-form-item>
                <el-form-item label="账单状态:" prop="bill_status">
                    <el-select v-model="searchForm.bill_status" placeholder="请选择">
                        <el-option v-for="item in searchForm.bill_status_options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择园区:" prop="park_section">
                    <el-select v-model="searchForm.park_section" placeholder="请选择">
                        <el-option v-for="item in searchForm.park_section_options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div>
                <el-form-item label="最新账单应收时间:" prop="bill_time">
                    <el-date-picker v-model="searchForm.bill_time" type="daterange" range-separator=" 至 " start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="销账类型:" prop="pay_type">
                    <el-select v-model="searchForm.pay_type" placeholder="请选择">
                        <el-option v-for="item in searchForm.pay_type_options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择收款方:" prop="acceptor">
                    <el-select v-model="searchForm.acceptor" placeholder="请选择">
                        <el-option v-for="item in searchForm.acceptor_options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left:65px;" type="primary" @click="search('searchForm')">搜索</el-button>
                </el-form-item>
            </div>
        </el-form>
        <!-- 统计周期 -->
        <section class="countCycle" v-if="countCycleVisible">
            <div class="result">
                <p v-if="countCycle.time !=='' ">统计周期: {{countCycle.time}}</p>
                <p v-if="countCycle.park !=='' ">园区: {{countCycle.park}}</p>
                <p v-if="countCycle.type !=='' ">销账类型: {{countCycle.type}}</p>
                <p v-if="countCycle.status !=='' ">账单状态: {{countCycle.status}}</p>
                <p v-if="countCycle.word !=='' ">关键字: {{countCycle.word}}</p>
                <p v-if="countCycle.acceptor !=='' ">收款方: {{countCycle.acceptor}}</p>
            </div>
            <ul>
                <li>
                    <p class="number">待结算总笔数:
                        <span>208</span>笔</p>
                    <p class="money">账单总额:
                        <span>123123123</span>元</p>
                </li>
                <li>
                    <p class="number">已结清总笔数:
                        <span>208</span>笔</p>
                    <p class="money">账单总额:
                        <span>123123123</span>元</p>
                </li>
                <li>
                    <p class="number">租金待结算笔数:
                        <span>208</span>笔</p>
                    <p class="money">账单总额:
                        <span>123123123</span>元</p>
                </li>
                <li>
                    <p class="number">租金已结算总笔数:
                        <span>208</span>笔</p>
                    <p class="money">账单总额:
                        <span>123123123</span>元</p>
                </li>
                <li>
                    <p class="number">物业费待结算笔数:
                        <span>208</span>笔</p>
                    <p class="money">账单总额:
                        <span>123123123</span>元</p>
                </li>
                <li>
                    <p class="number">物业费已结算总笔数:
                        <span>208</span>笔</p>
                    <p class="money">账单总额:
                        <span>123123123</span>元</p>
                </li>
            </ul>
        </section>

        <!-- 年、月账单  -->
        <div class="month-select-wrap">
            <span class="left-arrow" @click="monthSelectScrollHandle('month',-1)">
                <</span>
                    <ul ref="monthSelectWrap">
                        <li v-for="(item,index) in yearMonthBillArr" @click="monthClickHandle(item,index)" :class="{ currentCountCycleClass : currentCountCycle == item }" :key="Math.random()+10">{{item}}</li>
                    </ul>
                    <span class="right-arrow" @click="monthSelectScrollHandle('month',1)">></span>
                    <div class="util-btn">
                        <div>
                            <el-button type="primary" size="small" v-waves @click="cuifuHandle">催付</el-button>
                        </div>
                        <div>
                            <el-button type="primary" size="small" v-waves @click="addBillHandle(false)">添加账单</el-button>
                        </div>
                        <div>
                            <el-button type="primary" size="small" v-waves @click="dialogImportFormVisible = true">导入账单</el-button>
                        </div>
                        <div>
                            <el-button type="primary" size="small" v-waves @click="importWaterHandle">导入流水销账</el-button>
                        </div>
                    </div>
        </div>
        <div class="month-detail-wrap">
            <span class="left-arrow" @click="monthSelectScrollHandle('monthDetail',-1)">
                <</span>
                    <aside>{{currentCountCycle}}</aside>
                    <ul ref="monthBillWrap">
                        <li>
                            <p>账单总笔数
                                <span>1</span>
                            </p>
                            <p>账单总金额
                                <span>23232323元</span>
                            </p>
                        </li>
                        <li>
                            <p>账单总笔数
                                <span>2</span>
                            </p>
                            <p>账单总金额
                                <span>23232323元</span>
                            </p>
                        </li>
                        <li>
                            <p>账单总笔数
                                <span>3</span>
                            </p>
                            <p>账单总金额
                                <span>23232323元</span>
                            </p>
                        </li>
                        <li>
                            <p>账单总笔数
                                <span>4</span>
                            </p>
                            <p>账单总金额
                                <span>23232323元</span>
                            </p>
                        </li>
                        <li>
                            <p>账单总笔数
                                <span>5</span>
                            </p>
                            <p>账单总金额
                                <span>23232323元</span>
                            </p>
                        </li>
                        <li>
                            <p>账单总笔数
                                <span>6</span>
                            </p>
                            <p>账单总金额
                                <span>23232323元</span>
                            </p>
                        </li>
                        <li>
                            <p>账单总笔数
                                <span>7</span>
                            </p>
                            <p>账单总金额
                                <span>23232323元</span>
                            </p>
                        </li>
                        <li>
                            <p>账单总笔数
                                <span>8</span>
                            </p>
                            <p>账单总金额
                                <span>23232323元</span>
                            </p>
                        </li>
                    </ul>
                    <span class="right-arrow" @click="monthSelectScrollHandle('monthDetail',1)">></span>
        </div>
        <el-radio-group style="padding:10px;" v-model="mainTableRadio" @change="billTypeHandle" size="medium">
            <el-radio-button label="全部"></el-radio-button>
            <el-radio-button label="押金账单"></el-radio-button>
            <el-radio-button label="租金账单"></el-radio-button>
            <el-radio-button label="物业账单"></el-radio-button>
            <el-radio-button label="水费账单"></el-radio-button>
            <el-radio-button label="电费账单"></el-radio-button>
        </el-radio-group>
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
        <div style="float:right;margin-top:10px">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <!--添加账单  -->
        <el-dialog :title=" billAddOrEdit ? '编辑账单' :'添加账单' " :visible.sync="dialogAddFormVisible">
            <el-form :model="addForm" :rules="addFormRules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所属行业" :label-width="formLabelWidth">
                            <el-select v-model="addForm.region" :disabled='billAddOrEdit' placeholder="请选择所属行业">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应收总额" :disabled='billAddOrEdit' :label-width="formLabelWidth">
                            <el-input style="width:90%" placeholder="请输入应收总额" v-model="addForm.name" auto-complete="off"></el-input>
                            <span>元</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收费类型" :label-width="formLabelWidth">
                            <el-select v-model="addForm.region" :disabled='billAddOrEdit' placeholder="请选择收费类型">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计费开始日期" :label-width="formLabelWidth">
                            <el-date-picker v-model="addForm.startDate" :disabled='billAddOrEdit' align="right" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="支付状态" :label-width="formLabelWidth">
                            <el-select v-model="addForm.region" :disabled='billAddOrEdit' placeholder="请选择支付状态">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计费结束日期" :label-width="formLabelWidth">
                            <el-date-picker v-model="addForm.endDate" :disabled='billAddOrEdit' align="right" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="已付款" :label-width="formLabelWidth">
                            <el-select v-model="addForm.region" :disabled='billAddOrEdit' placeholder="请选择支付状态">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="未付款" :label-width="formLabelWidth">
                            <el-select v-model="addForm.region" :disabled='billAddOrEdit' placeholder="请选择支付状态">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="应付日期" :label-width="formLabelWidth">
                            <el-date-picker v-model="addForm.endDate" :disabled='billAddOrEdit' align="right" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="支付日期" :label-width="formLabelWidth">
                            <el-date-picker v-model="addForm.endDate" :disabled='billAddOrEdit' align="right" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="减免金额" :label-width="formLabelWidth">
                            <el-input style="width:89%" placeholder="请输入减免金额" v-model="addForm.name2" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="账单备注" :label-width="formLabelWidth">
                            <el-input type="textarea" :rows="5" :disabled='billAddOrEdit' placeholder="请输入内容" v-model="addForm.textarea">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogAddFormVisible = false">保 存</el-button>
                <el-button v-if="!billAddOrEdit" type="primary" @click="dialogAddFormVisible = false">保 存&新建下一条</el-button>
            </div>
        </el-dialog>
        <!--导入账单  -->
        <el-dialog title="导入账单" :visible.sync="dialogImportFormVisible">
            <el-alert title="请导入当前账单或历史账单" type="warning" :closable="false" show-icon>
            </el-alert>
            <a href="#" class="downLoadExcelHandle" @click="downLoadExcelHandle">点击下载账单模板</a>
            <el-upload class="upload-demo" ref="upload" accept=".jpg" action="https://jsonplaceholder.typicode.com/posts/" :on-success="uploadSuccessHandle" :on-preview="previewUploadHandle" :on-error="uploadFailHandle" :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadHandle"></el-button>  -->
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogImportFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUploadHandle" ref="uploadBtn">上传</el-button>
            </div>
        </el-dialog>
        <!--导入账单预览  -->
        <el-dialog title="导入账单预览" custom-class="el-dialog--large" :visible.sync="importFormPreviewUnion.visible">
            <el-table :data="importFormPreviewUnion.tableDataArr" border fit highlight-current-row style="width: 100%">
                <template v-for="item in importFormPreviewUnion.tableHeaderArr">
                    <!--状态  -->
                    <el-table-column v-if="item.prop =='status'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
                        <template scope="scope">
                            <span :class="{  green : scope.row.status == 1,red:scope.row.status == 2 }">● </span>{{scope.row.status}}
                        </template>
                    </el-table-column>
                    <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
                    </el-table-column>
                </template>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="importFormPreviewUnion.visible = false">取 消</el-button>
                <el-button type="primary" @click="submitUploadHandle">确定导入</el-button>
            </span>
        </el-dialog>
        <!--支付凭证  -->
        <el-dialog title="支付凭证" custom-class="el-dialog--large" :visible.sync="payVoucherUnion.visible">
            <el-table :data="payVoucherUnion.tableDataArr2" border fit highlight-current-row style="width: 100%">
                <template v-for="item in payVoucherUnion.tableHeaderArr2">
                    <!--凭证  -->
                    <el-table-column v-if="item.prop=='operation'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
                        <template scope="scope">
                            <el-button type="primary" size="small" @click="operationHandle(1,scope)" v-waves>查看</el-button>
                        </template>
                    </el-table-column>
                    <!--状态  -->
                    <el-table-column v-else-if="item.prop =='status'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
                        <template scope="scope">
                            <span :class="{  green : scope.row.status == 1,red:scope.row.status == 2 }">● </span>{{scope.row.status}}
                        </template>
                    </el-table-column>
                    <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
                    </el-table-column>
                </template>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="payVoucherUnion.visible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import openWindow from '../../../../utils/openWindow'
import fetch from '../../../../utils/fetch'
import Multiselect from 'vue-multiselect'
export default {
    components: {
        Multiselect
    },
    data() {
        return {
            value: '',
            options: ['张三', '李四', '王五', '赵六', '燕七'],
            // 关键词
            restaurants: [],
            state4: '',
            timeout: null,
            searchResult: '',
            // 年/月 账单
            yearMonthBillArr: [],
            // 表单条件
            searchForm: {
                key_word: '',
                bill_time: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
                park_section_options: [
                    { label: '11', value: '1' },
                    { label: '22', value: '2' },
                    { label: '33', value: '3' }
                ],
                park_section: '',
                bill_status_options: [
                    { label: '11', value: '1' },
                    { label: '22', value: '2' },
                    { label: '33', value: '3' }
                ],
                bill_status: '',
                pay_type_options: [
                    { label: '11', value: '1' },
                    { label: '22', value: '2' },
                    { label: '33', value: '3' }
                ],
                pay_type: '',
                acceptor: '',
                acceptor_options: [
                    { label: '11', value: '1' },
                    { label: '22', value: '2' },
                    { label: '33', value: '3' }
                ],
            },
            // 统计周期
            countCycle: {
                time: '',
                type: '',
                park: '',
                word: '',
                status: '',
                acceptor: ''
            },
            countCycleVisible: false,
            currentCountCycle: '',
            // search表单验证
            searchFormRules: {
                // key_word: [
                //     { required: true, message: '请输入关键词', trigger: 'blur' },
                // ],
                // bill_time: [
                //     { required: true, type: 'array', message: '请选择账单时间', trigger: 'change' },
                // ],
                // park_section: [
                //     { required: true, message: '请选择园区', trigger: 'change' },
                // ],
                // bill_status: [
                //     { required: true, message: '请选择账单状态', trigger: 'change' },
                // ],
                // pay_type: [
                //     { required: true, message: '请选择销账类型', trigger: 'change' },
                // ],
                // acceptor: [
                //     { required: true, message: '请选择收款方', trigger: 'change' },
                // ]
            },
            // 主表格
            mainTableRadio: '全部',
            tableHeaderArr: [
                { prop: 'name', align: 'center', label: '账单编号', width: 100 },
                { prop: 'age', align: 'center', label: '企业名称', width: 100 },
                { prop: 'height', align: 'center', label: '楼座名称', width: 100 },
                { prop: 'weight', align: 'center', label: '房号', width: 100 },
                { prop: 'tel', align: 'center', label: '收费项目', width: 100 },
                { prop: 'voucher', align: 'center', label: '应收日期', width: 100 },
                { prop: 'remark', align: 'center', label: '应收总额', width: 100 },
                { prop: 'status', align: 'center', label: '计费开始日期', width: 100, },
                { prop: 'operation', align: 'center', label: '计费结束日期', width: 250, },
                { prop: 'asdf', align: 'center', label: '减免金额', width: 100, },
                { prop: 'asdf', align: 'center', label: '已付款', width: 100, },
                { prop: 'asdf', align: 'center', label: '未付款', width: 100, },
                { prop: 'asdf', align: 'center', label: '支付时间', width: 100, },
                { prop: 'asdf', align: 'center', label: '状态', width: 100, },
                { prop: 'asdf', align: 'center', label: '支付类型', width: 100, },
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
            // 分页
            total: 100,
            listQuery: {
                page: 2,
                limit: 20,
                name: undefined
            },
            // 添加表单
            dialogAddFormVisible: false,
            dialogImportFormVisible: false,
            addForm: {
                name: '',
                name2: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
                startDate: '2018-01-01',
                endDate: '2018-11-11',
                textarea: '哈哈'
            },
            formLabelWidth: '100px',
            billAddOrEdit: true,
            // 添加账单-校验
            addFormRules: {
                name: [
                    { required: true, message: '请输入关键词', trigger: 'blur' },
                ],
                bill_time: [
                    { required: true, type: 'array', message: '请选择账单时间', trigger: 'change' },
                ],
                park_section: [
                    { required: true, message: '请选择园区', trigger: 'change' },
                ],
                bill_status: [
                    { required: true, message: '请选择账单状态', trigger: 'change' },
                ],
                pay_type: [
                    { required: true, message: '请选择销账类型', trigger: 'change' },
                ],
            },
            // 支付凭证
            payVoucherUnion: {
                visible: false,
                tableHeaderArr2: [
                    { prop: 'name', align: 'center', label: '上传日期', width: 100 },
                    { prop: 'age', align: 'center', label: '流水单号', width: 100 },
                    { prop: 'height', align: 'center', label: '付款金额', width: 100 },
                    { prop: 'weight', align: 'center', label: '开户名', width: 100 },
                    { prop: 'weight', align: 'center', label: '开户行', width: 100 },
                    { prop: 'weight', align: 'center', label: '凭证', width: 100 },
                    { prop: 'weight', align: 'center', label: '状态', width: 100 },
                ],
                tableDataArr2: [
                    { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 1 },
                ],
            },
            // 备注信息
            remarkInfo: '',

            //  导入账单预览
            importFormPreviewUnion: {
                visible: false,
                tableHeaderArr: [
                    { prop: 'age', align: 'center', label: '企业名称', width: 100 },
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
                    { prop: 'asdf', align: 'center', label: '支付类型', width: 100, },
                ],
                tableDataArr: [
                    { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 1 },
                    { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 2 },
                    { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 1 },
                    { name: '张三', age: 22, height: 180, weight: 110, tel: 15038927731, status: 2 },
                ],
            }
        }
    },
    watch: {
        value: function() {
            console.log(this.value)
            
        }
    },
    mounted() {
        this.yearMonthBillArr = this.calcYearBill()
        console.log('>>>>>', this.$store.getters.token)

    },
    methods: {
        searchChange: function(searchQuery, id) {
            fetch({
                url: '/api/bill/tabBillBasicinfo/listEnterpirseAndRoom',
                method: 'get',
                params: { token: this.$store.getters.token, room_enterpirse_name: searchQuery }
            }).then((res) => {
                this.options = res.data.map(item => item.enterpirse_name)
            }).catch(() => {

            })
        },
        // 选择联想结果
        handleSelect(item) {
            this.searchForm.key_word = item.value
        },
        inputing: function(value, id) {
            console.log('>>  ', value)
        },
        // 搜索
        search: function(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 展示统计周期
                    this.countCycleVisible = true
                    this.countCycle.time = this.searchForm.bill_time.map(item => new Date(item).format('yyyy-MM-dd')).reduce((x, y) => x + ' 到 ' + y)
                    this.countCycle.status = this.searchForm.bill_status
                    this.countCycle.park = this.searchForm.park_section
                    this.countCycle.type = this.searchForm.pay_type
                    this.countCycle.word = this.searchForm.key_word
                    this.countCycle.acceptor = this.searchForm.acceptor

                    fetch({
                        url: '/api/bill/tabBillBasicinfo/listTabBillBasicinfoAll',
                        method: 'Post',
                        data: { token: this.$store.getters.token }
                    }).then((res) => {

                    }).catch(() => {

                    })
                } else {
                    return false;
                }
            });
        },
        // 计算一年内账单月份
        calcYearBill: function() {
            var y = new Date().getFullYear()
            var m = new Date().getMonth() + 1
            var temp = []
            for (var i = 0; i < 12; i++) {
                var mm = (m + i) % 13
                if (mm < m) mm += 1
                var str = (i > (12 - m) ? y : y - 1) + ' - ' + (mm < 10 ? '0' + mm : mm)
                temp.push(str)
                if (i == 0) this.currentCountCycle = str
            }
            return temp
        },
        // 选择月份
        monthClickHandle: function(item, index) {
            this.currentCountCycle = item

        },
        // 月份 左右滚动
        monthSelectScrollHandle: function(which, n) {
            var dom = which == 'month' ? this.$refs.monthSelectWrap : this.$refs.monthBillWrap
            dom.scrollLeft = dom.scrollLeft + (150 * n)
        },
        // 催付
        cuifuHandle: function() {
            this.$confirm('确定要进行整体催付吗？点击确定按钮，未支付的企业将收到短信和邮件的各类账单支付通知', '催付', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '催付成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消催付'
                });
            });
        },
        // 添加账单
        addBillHandle: function(flag) {
            this.billAddOrEdit = flag
            this.dialogAddFormVisible = true
        },
        // 导入流水销账
        importWaterHandle: function() {

        },
        // 全部/租金/物业/水费/电费
        billTypeHandle: function() {
            if (this.mainTableRadio == '全部') {

            } else if (this.mainTableRadio == '租金账单') {

            } else if (this.mainTableRadio == '物业账单') {

            } else if (this.mainTableRadio == '水费账单') {

            } else if (this.mainTableRadio == '押金账单') {

            } else {

            }
        },
        // 查看支付凭证
        lookVoucherHandle: function(scope) {
            console.log(scope)
            this.payVoucherUnion.visible = true
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
        // 备注popover隐藏后清除textarea   
        remarkHideAfter: function() {
            this.remarkInfo = ''
        },
        // 企业详情
        companyDetailHandle: function(scope) {
            console.log(scope)
            openWindow('./#/companyDetail', '')
        },
        // 分页
        getList() {
            this.listLoading = true;
            // page(this.listQuery).then(response => {
            //   this.list = response.data.rows;
            //   this.total = response.data.total;
            //   this.listLoading = false;
            // })
        },
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getList();
        },
        // 下载账单模板
        downLoadExcelHandle: function() {

        },
        // 上传到服务器
        submitUploadHandle: function() {
            if (this.$refs.upload.uploadFiles.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请选择文件！'
                });
            } else {
                this.importFormPreviewUnion.visible = false
                this.$refs.upload.submit()
                this.$myLoading.show()
            }
        },
        // 上传预览
        previewUploadHandle: function(file) {
            console.log(file)
            this.importFormPreviewUnion.visible = true
        },

        // 上传成功
        uploadSuccessHandle: function(response, file, fileList) {
            console.log(response, file, fileList)
            this.$myLoading.hide()
            this.$message({
                type: 'success',
                message: '上传成功'
            });

        },
        // 上传失败
        uploadFailHandle: function(err, file, fileList) {
            console.log(err, file, fileList)
            this.$myLoading.hide()
            this.$message({
                type: 'error',
                message: '上传失败'
            });

        }
    },
}
</script>

<style lang="scss" scoped>
.tx-c {
    text-align: center;
}

.currentCountCycleClass {
    color: #fff;
    background-color: #20a0ff !important;
    border: 1px solid #20a0ff; // border-bottom: none;
}

.container {
    overflow: hidden;
    padding-bottom: 30px;
}

.wrap-box {
    .single-bill-introduction-wrap {
        border: 1px solid #dfe6ec;
        padding: 20px;
        font-size: 16px;
        margin: 20px 0;
    }
    .downLoadExcelHandle {
        color: blue;
        display: block;
        margin: 10px 0;
    }
    .red {
        color: red;
    }
    .green {
        color: green !important;
    }
    padding: 20px 10px 10px 20px;
    #form {
        display: flex; // background: #eee;
        margin: 10px 10px;
        padding-top: 15px;
    }
    .countCycle {
        border: 1px solid lightgray;
        padding-left: 10px;
        .result {
            overflow: hidden;
            p {
                margin: 10px 0 0 0;
                float: left;
            }
            p:first-child~* {
                margin-left: 10px;
            }
        }
        ul {
            padding: 0;
            overflow: hidden;
            list-style: none;
            li {
                font-size: 14px;
                float: left;
                border: 1px solid #eee;
                padding: 10px;
                background: #eee;
                p:nth-child(1) span {
                    color: blue;
                    font-size: 16px;
                }
            }
            li:first-child~* {
                border: 1px solid #eee;
                margin-left: 10px;
            }
        }
    }
    .month-select-wrap {
        overflow: hidden;
        padding: 20px 10px 0 10px;
        border-top: 30px solid #eee;
        span {
            float: left;
            font-size: 20px;
            display: inline-block;
            text-align: center;
            position: relative;
            padding-top: 3px;
            border: 1px solid lightgray;
            color: lightgray;
            width: 30px;
            height: 30px;
            user-select: none;
            &:hover {
                cursor: pointer;
            }
        }
        .left-arrow {}
        .right-arrow {
            margin-left: 20px;
            margin-right: 20px;
        }
        .util-btn {
            float: left;
            width: calc(40% - 100px); // background: red;
            &>div {
                width: 25%;
                float: left;
            }
        }
        ul {
            width: 60%;
            float: left;
            list-style: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            white-space: nowrap;
            li {
                cursor: pointer;
                display: inline-block;
                width: 100px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                background-color: #eee;
                margin-left: 20px;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                font-size: 14px;
                &:hover {
                    color: #fff;
                    background-color: #4db3ff !important;
                    border: 1px solid #4db3ff;
                    border-bottom: none;
                }
            }
        }
    }
    .month-detail-wrap {

        border: 1px solid lightgray; // border-top: none;
        border-top: 1px solid #eee;
        padding: 30px 10px 30px 10px;
        border-bottom: 30px solid #eee;
        overflow: hidden;
        aside {
            float: left;
            display: inline-block;
            position: relative;
            top: 15px; // color: #fff;
            // background: #4db3ff;
            // border-radius: 5px;
            // padding: 5px;
            font-size: 14px;
            margin-left: 15px;
        }
        &>span {
            float: left;
            font-size: 20px;
            display: inline-block;
            text-align: center;
            position: relative;
            padding-top: 3px;
            border: 1px solid #eee;
            color: lightgray;
            width: 30px;
            height: 30px;
            margin-top: 8px;
            user-select: none;
            &:hover {
                cursor: pointer;
            }
        }
        p {
            margin: 0;
            font-size: 14px;
            text-align: left;
            span {
                float: right;
                color: blue;
            }
        }
        ul {
            width: calc(100% - 160px);
            float: left;
            list-style: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            white-space: nowrap;
            li {
                display: inline-block;
                width: 200px; // height: 30px;
                text-align: center; // line-height: 30px;
                margin-left: 20px;
                border-left: 1px solid lightgray;
                padding-left: 15px;
                p:nth-child(2) {
                    margin-top: 10px;
                }
            }
        }
        .left-arrow {}
        .right-arrow {
            // margin-left: 40px;
            // margin-right: 20px; // float: right;
        }
    }
    .anchor {
        cursor: pointer;
        user-select: none;
        color: blue;
    }
    #table {
        // margin-top: 10px;
        padding: 10px;
    }
}

// .wrap-box /deep/ .el-form-item__label{
//   font-weight: normal;
//   font-size: 16px;
// }
</style>
