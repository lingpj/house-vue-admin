<template>
  <div class='carBaseInfoPage'>
    <div>
      <div class="baseInfo">
        <h1>企业基本信息:</h1>
        <ul>
          <li>公司名：{{baseInfo.company}}</li>
          <li>账单月份：{{baseInfo.billMonth}}</li>
          <li>首次注册时间：{{baseInfo.createTime}}</li>
          <li>应付金额：{{baseInfo.payable}}</li>
          <li>操作人：{{baseInfo.operator}}</li>
          <li>销账原因：{{baseInfo.reason}}</li>
          <li>状态：{{baseInfo.status == '1' ? '已支付':'未支付'}}</li>
        </ul>
      </div>
      <div class="unpaid">
        <el-table :data="mainUnion.tableData" border fit  style="width: 100%">
          <template v-for="(item,index) in mainUnion.headerArr">
            <!-- 未出 -->
            <el-table-column v-if="item.prop=='noout'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                <el-button size="small" @click="noOutBillHandle(scope.row)" v-waves>查看</el-button>
              </template>
            </el-table-column>
            <!-- 已付 -->
            <el-table-column v-else-if="item.prop=='payed'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                <el-button size="small" @click="payedAndNopayBillHandle(1,scope.row)" v-waves>查看</el-button>
              </template>
            </el-table-column>
            <!-- 未付 -->
            <el-table-column v-else-if="item.prop=='nopay'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                <el-button size="small" @click="payedAndNopayBillHandle(0,scope.row)" v-waves>查看</el-button>
              </template>
            </el-table-column>
            <!-- 停车属性 -->
            <el-table-column v-else-if="item.prop=='property'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                {{scope.row.type_id | formatProperty}}
              </template>
            </el-table-column>
            <!-- 解绑 -->
            <el-table-column v-else-if="item.prop=='operation'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                <el-button size="small" @click="untyingHandle(scope.row)" type="danger" v-waves>解绑</el-button>
              </template>
            </el-table-column>
            <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
            </el-table-column>
          </template>
        </el-table>
        <div style="float:right;margin-top:10px">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="mainUnion.listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="mainUnion.listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="mainUnion.total"> </el-pagination>
        </div>
      </div>
      <!-- 日账单  -->
      <el-dialog title="查看账单" :before-close="dayBillDialogClose" :visible.sync="dayBillUnion.visible" size="large">
        <el-form ref="form" :model="dayBillUnion.form" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="支付金额">
                <el-input v-model="dayBillUnion.form.money"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账单日期">
                  <el-date-picker
                    v-model="dayBillUnion.form.date"
                    type="date"
                     placeholder="选择日期"
                  ></el-date-picker>
                  &#x3000; 
                  <el-button @click="getDayBillApi" type="primary">查询</el-button>
                </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="dayBillUnion.tableData" border fit highlight-current-row style="width: 100%">
          <template v-for="(item,index) in dayBillUnion.headerArr">
             <!-- 园区名称 -->
            <el-table-column v-if="item.prop=='parkId'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                {{parkList.filter(item => item.parking_id == scope.row.parkId)[0].name}}
              </template>
            </el-table-column>
            <!-- 停车次数 -->
            <el-table-column v-else-if="item.prop=='parkCount'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                 <el-popover placement="right"  trigger="click">
                    <el-table :data="dayBillUnion.childTable" fit>
                      <el-table-column width="100" property="plateno" label="车牌号"></el-table-column>
                      <el-table-column  width="100" property="parkinginfo_id" label="所属园区">
                        <template scope="scope">
                          {{parkList.filter(item => item.parking_id == scope.row.parkinginfo_id)[0].name}}
                        </template>
                      </el-table-column>
                      <el-table-column  width="150" property="entryTime" label="入场时间"></el-table-column>
                      <el-table-column width="150"  property="payTime" label="出场时间"></el-table-column>
                      <el-table-column  width="100" property="elapsedTime" label="时长（分钟）"></el-table-column>
                      <el-table-column  width="100" property="payable" label="费用（元）"></el-table-column>
                    </el-table>
                    <el-button slot="reference" size="small" @click="dayBillParkCountHandle(scope.row)">{{scope.row.parkCount}}</el-button>
                  </el-popover>
              </template>
            </el-table-column>
            <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
            </el-table-column>
          </template>
        </el-table>
        <div style="float:right;margin-top:10px">
            <el-pagination @size-change="dayBillHandleSizeChange" @current-change="dayBillHandleCurrentChange" :current-page.sync="dayBillUnion.listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="dayBillUnion.listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="dayBillUnion.total"> </el-pagination>
        </div>
      </el-dialog>
      <!-- 未付账单  -->
      <el-dialog title="查看未付账单"   :visible.sync="nopayUnion.visible" size="large">
        <p>车牌号：{{nopayUnion.checkedData.plate_no}}</p>
        <el-table :data="nopayUnion.tableData" border fit highlight-current-row style="width: 100%">
          <template v-for="(item,index) in nopayUnion.headerArr">
            <!-- 停车次数 -->
            <el-table-column v-if="item.prop=='park_count'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                <el-button size="small" @click="parkCountDetailHandle(0,scope.row)">{{scope.row.park_count}}</el-button>
              </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column v-else-if="item.prop=='status'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                {{ scope.row.status |  formatStatus}}
              </template>
            </el-table-column>
            <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
            </el-table-column>
          </template>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="killBillUnion.visible = true">全部销账</el-button>
        </div>
      </el-dialog>
      <!-- 已付账单  -->
      <el-dialog title="查看已付账单" :visible.sync="payedUnion.visible" size="large">
        <p>&#x3000;车牌号：{{payedUnion.checkedData.plate_no}}</p>
        <el-form ref="form" :model="payedUnion.form" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="账单编号">
                <el-input v-model="payedUnion.form.billId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账单月份">
                  <el-date-picker
                    v-model="payedUnion.form.billDate"
                    type="month"
                     placeholder="选择月份"
                  ></el-date-picker>
                  &#x3000; 
                  <el-button @click="payedBillSearchHandle" type="primary">查询</el-button>
                </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="payedUnion.tableData" border fit highlight-current-row style="width: 100%">
          <template v-for="(item,index) in payedUnion.headerArr">
            <!-- 取发票 -->
            <el-table-column v-if="item.prop=='operation'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                <el-button size="small" @click="operationHandle(scope)" v-waves>取发票</el-button>
              </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column v-else-if="item.prop=='status'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                {{ scope.row.status |  formatStatus}}
              </template>
            </el-table-column>
            <!-- 停车次数 -->
            <el-table-column v-else-if="item.prop=='park_count'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                <el-button size="small" @click="parkCountDetailHandle(1,scope.row)" >{{scope.row.park_count}}</el-button>
              </template>
            </el-table-column>
            <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
            </el-table-column>
          </template>
        </el-table>
         <div style="float:right;margin-top:10px">
            <el-pagination @size-change="payedHandleSizeChange" @current-change="payedHandleCurrentChange" :current-page.sync="payedUnion.listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="payedUnion.listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="payedUnion.total"> </el-pagination>
        </div>
      </el-dialog>
      <el-dialog title="填写销账原因" :visible.sync="killBillUnion.visible" >
        销账原因：<el-input type="textarea" :model="killBillUnion.reason"></el-input>
        <el-button type="primary" @click="certainKillBillHandle">确认销账</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {  },
  data() {
    return {
      parkList:[],   // 园区列表
      baseInfo: {},  // 企业基本信息
      // 主表格
      mainUnion: {
        tableData: [],
        headerArr: [
          { prop: 'plate_no', align: 'center', label: '车牌', width: 100 },
          { prop: 'mobile', align: 'center', label: '联系电话', width: 100 },
          { prop: 'property', align: 'center', label: '停车属性', width: 100 },
          { prop: 'createtime', align: 'center', label: '注册时间', width: 100 },
          { prop: 'noout', align: 'center', label: '未出账单', width: 100 },
          { prop: 'payed', align: 'center', label: '已付账单', width: 100 },
          { prop: 'nopay', align: 'center', label: '未付账单', width: 100 },
          { prop: 'operation', align: 'center', label: '操作', width: 100 },
        ],
        listQuery: {
          page: 1,
          limit: 10,
        },
        total: 0,
      },
      // 未出账单(日账单)
      dayBillUnion:{
        visible:false,
        tableData: [],
        headerArr: [
          { prop: 'creditPaymentId', align: 'center', label: '日账单编号', width: 100 },
          { prop: 'plateNo', align: 'center', label: '车牌号', width: 100 },
          { prop: 'billDate', align: 'center', label: '账单日期', width: 100 },
          { prop: 'parkCount', align: 'center', label: '停车次数', width: 100 },
          { prop: 'payMoney', align: 'center', label: '实付金额', width: 100 },
          { prop: 'payable', align: 'center', label: '应付金额', width: 100 },
          { prop: 'discounts', align: 'center', label: '优惠金额', width: 100 },
          { prop: 'parkId', align: 'center', label: '园区名称', width: 100 },
        ],
        listQuery: {
          page: 1,
          limit: 10,
        },
        total: 0,
        checkedData:{},
        form:{
          money:'',
          date:''
        },
        childTable:[]
      },
      // 已付账单
      payedUnion:{
        visible:false,
        tableData: [],
        headerArr: [
          { prop: 'code', align: 'center', label: '账单编号', width: 100 },
          { prop: 'status', align: 'center', label: '状态', width: 100 },
          { prop: 'bill_month', align: 'center', label: '账单月份', width: 100 },
          { prop: 'park_count', align: 'center', label: '停车次数', width: 100 },
          { prop: 'pay_money', align: 'center', label: '实付金额', width: 100 },
          { prop: 'payed', align: 'center', label: '支付时间', width: 100 },
          { prop: 'nopay', align: 'center', label: '发票状态', width: 100 },
          { prop: 'operaasdtion', align: 'center', label: '支付人', width: 100 },
          { prop: 'remarker', align: 'center', label: '销账原因', width: 100 },
          { prop: 'operation', align: 'center', label: '操作', width: 100 },
        ],
        listQuery: {
          page: 1,
          limit: 10,
        },
        total: 0,
        checkedData:{},
        form:{
          billId:'',
          billDate:'',
        }
      },
      // 未付账单
      nopayUnion:{
        visible:false,
        tableData: [],
        headerArr: [
          { prop: 'code', align: 'center', label: '账单编号', width: 100 },
          { prop: 'status', align: 'center', label: '状态', width: 100 },
          { prop: 'bill_month', align: 'center', label: '账单月份', width: 100 },
          { prop: 'park_count', align: 'center', label: '停车次数', width: 100 },
          { prop: 'pay_money', align: 'center', label: '应付金额', width: 100 },
        ],
        listQuery: {
          page: 1,
          limit: 100,
        },
        total: 0,
        checkedData:{},
      },
      // 全部销账
      killBillUnion:{
        visible:false,
        reason:''
      }
    }
  },
  filters:{
    formatProperty:function(val){
      var str = '企业信用付'
      if(parseInt(val) == 1000){
        str = '个人信用付'
      }else if(parseInt(val) == 1001){
        str = '临时停车'
      }
      return str
    },
    formatStatus:function(val){
      return parseInt(val) == 1 ? '已支付' : '未支付'
    },
  },
  mounted() {
    this.getTableData()
    this.showAllCarsHandle()
    this.getParkList()
  },
  methods: {
    // 确认销账
    certainKillBillHandle:function(){
      this.$fetch({
        url: process.env.park_api + '/bind/writeOff',
        method: 'post',
        data: {
          plateNo:this.nopayUnion.checkedData.plate_no,
          billList:this.nopayUnion.tableData,
          token: this.$store.getters.token
        }
      }).then((res) => {
         if(res.code == 200){
           this.$message.success('销账成功！')
           this.killBillUnion.visible = false
           this.nopayUnion.visible = false
         }
      }) 
    },
    // 解绑
    untyingHandle:function(data){
      this.$confirm(' 确定要解绑么？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$fetch({
            url: process.env.park_api + '/bind/unBindCar',
            method: 'get',
            params: {
              plateNo:data.plate_no,
              classify:data.type_id,
              token: this.$store.getters.token
            }
          }).then((res) => {
            if(res.code == 200){
              this.showAllCarsHandle()
              this.$message({
                type: 'success',
                message: '解绑成功!'
              });
            }
          })
        })

    },
    // 日账单：停车次数点击
    dayBillParkCountHandle:function(data){
      console.log(data)
      this.$fetch({
          url: process.env.park_api + '/bill/day/park/details',
          method: 'get',
          params: {
              id: data.id,
              page: this.dayBillUnion.listQuery.page,
              limit: this.dayBillUnion.listQuery.limit
          }
      }).then(res =>{
        this.dayBillUnion.childTable =res.data
      })
    },
    // 已付账单：查询
    payedBillSearchHandle:function(){
      this.getPayedAndNopayBillApi(1,{
        billId:this.payedUnion.form.billId,
        billDate:this.payedUnion.form.billDate,
      })
    },
    // 日账单关闭：重置dialog内容
    dayBillDialogClose:function(done){
      this.dayBillUnion.tableData = []
      this.dayBillUnion.total = 0
      this.dayBillUnion.form.money = ''
      this.dayBillUnion.form.date = ''
      done()
    },
    // 获取园区列表
    getParkList: function() {
      this.$fetch({
          url: process.env.park_api + '/parking-config/all',
          method: 'get',
          params: {
              token: this.$store.getters.token
          }
      }).then(res =>{
        this.parkList = res
      })
    },
    // 已付：停车次数点击
    // 0 未付  1已付
    parkCountDetailHandle:function(flag,data){
      console.log(data)
      if(flag == 0){
        data.plate_no = this.nopayUnion.checkedData.plate_no
      }else{
        data.plate_no = this.payedUnion.checkedData.plate_no
      }
      this.noOutBillHandle(data)
    },
    // 主分页变化
    handleSizeChange(val) {
      this.mainUnion.listQuery.limit = val;
      this.showAllCarsHandle()
    },
    handleCurrentChange(val) {
      this.mainUnion.listQuery.page = val;
      this.showAllCarsHandle()
    },
    // 日账单分页
    dayBillHandleSizeChange:function(val){
      this.dayBillUnion.listQuery.limit = val;
      this.getDayBillApi()
    },
    dayBillHandleCurrentChange:function(val){
      this.dayBillUnion.listQuery.page = val;
      this.getDayBillApi()
    },
    // 已付分页
    payedHandleSizeChange:function(val){
      this.payedUnion.listQuery.limit = val;
      this.getPayedAndNopayBillApi(1)
    },
    payedHandleCurrentChange:function(val){
      this.payedUnion.listQuery.page = val;
      this.getPayedAndNopayBillApi(1)
    },
    // 未出账handle:
    // 记录当前点击的data
    // 显示dialog
    noOutBillHandle:function(data){
      this.dayBillUnion.checkedData = data
      this.dayBillUnion.visible = true
      this.getDayBillApi()
    },
    // 已付、未付handle
    // 1已付,0未付
    payedAndNopayBillHandle:function(flag,data){
        if(flag == 1){
          this.payedUnion.visible = true
          this.payedUnion.checkedData = data
          this.getPayedAndNopayBillApi(flag)
        }else{
          this.nopayUnion.visible = true
          this.nopayUnion.checkedData = data
          this.getPayedAndNopayBillApi(flag)
        }
    },
    // 获取未付、已付账单
    getPayedAndNopayBillApi:function(flag,data){
      var union = flag == 1 ? this.payedUnion : this.nopayUnion
      this.$fetch({
        url: process.env.park_api + '/month/bill/selectMonthBill',
        method: 'get',
        params: {
          billId: data ? data.billId : '',
          billMonth:data ? (data.billDate == '' ? '': data.billDate.format('yyyy-MM')) : '',
          page:union.listQuery.page,
          limit:union.listQuery.limit,
          plateNo:union.checkedData.plate_no,
          status:flag,
          typeId:this.$route.query.enterpriseId
        }
      }).then((res) => {
         union.tableData = res.list
         union.total = res.totalCount
      })
    },
    // 获取日账单
    getDayBillApi:function(){
      this.$fetch({
        url: process.env.park_api + '/creditDayBill/getChargeOffBill',
        method: 'get',
        params: {
          page:this.dayBillUnion.listQuery.page,
          limit:this.dayBillUnion.listQuery.limit,
          plateNo:this.dayBillUnion.checkedData.plate_no,
          billDate:this.dayBillUnion.form.date == ''?'': this.dayBillUnion.form.date.format('yyyy-MM-dd') ,
          payMoney:this.dayBillUnion.form.money,
          chargeOff: (this.payedUnion.visible || this.nopayUnion.visible ) ? 1 : 0
        }
      }).then((res) => {
         this.dayBillUnion.tableData = res.list
         this.dayBillUnion.total = res.totalCount
      })
    },
    // 展示所有车辆
    showAllCarsHandle:function(){
      this.$fetch({
        url: process.env.park_api + '/creditEnterpriseBill/getEnterpriseCar',
        method: 'get',
        params: {
          page:this.mainUnion.listQuery.page,
          limit:this.mainUnion.listQuery.limit,
          enterpriseId:this.$route.query.enterpriseId
        }
      }).then((res) => {
         this.mainUnion.tableData = res.list
         this.mainUnion.total = res.totalCount
      })
    },
    // 获取当页数据
    getTableData: function() {
      this.$myLoading.show()
      this.$fetch({
        url: process.env.park_api + '/creditEnterpriseBill/listCreditEnterpriseBill',
        method: 'get',
        params: {
          company:this.$route.query.company,
          status: this.$route.query.status,
          page:this.mainUnion.listQuery.page,
          limit:this.mainUnion.listQuery.limit,
        }
      }).then((res) => {
        this.$myLoading.hide()
        var data = res.data.list[0]
        for (var key in data) {
          this.$set(this.baseInfo,key,data[key])
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.reduceMoney {
  input {
    border-radius: 5px;
    border: 1px solid #999;
    height: 30px;
  }
}

.remark {
  margin-top: 10px;
  margin-bottom: 5px;
  .remarkArea {
    min-height: 50px;
    width: 230px;
    border-radius: 5px;
    border: 1px solid #999;
    resize: none;
  }
}
.c-blue{
      color:blue !important;
      cursor: pointer;
}

.carBaseInfoPage {
  // position: fixed;
  // left: 210px;
  // top: 50px;
  height: 100%;
  // width: calc(100% - 210px);
  background-color: #eee;
  padding: 20px;
  overflow: scroll;
  & /deep/ .el-dialog{
    overflow: hidden;
  }
  .table {
    display: box;
    border-top: 1px solid lightgray;
    border-left: 1px solid lightgray;
    border-collapse: collapse;
    
    .tr {
      display: flex;
      width: 100%;
      .td {
        flex: 1;
        border-bottom: 1px solid lightgray;
        border-right: 1px solid lightgray;
        display: table-cell;
        text-align: center;
        color: #333;
        height: 30px;
        line-height: 30px;
        
      }
    }
  }
  &>div {
    padding: 10px;
    background-color: #Fff;
  }
  h1 {
    margin: 0px;
    font-size: 18px; //  border-bottom: 1px solid #eee;
    font-weight: 500;
  }
  .baseInfo {
    ul {
      margin: 0%;
      overflow: hidden;
      padding-left: 0;
      padding-right: 50px;
      li {
        font-size: 14px;
        list-style: none;
        float: left;
        margin-left: 50px;
        margin-top: 30px;
        color: #666;
      }
    }
  }
  .daybill {
    padding-top: 20px;
    border-top: 1px solid #eee;
    margin-top: 30px;
    .dayBillTable {
      overflow: hidden;
      margin-top: 10px;
    }
  }
  .unpaid {
    padding-top: 20px;
    border-top: 1px solid #eee;
    margin-top: 30px;
    overflow: hidden;
    .unpaidTable {
      overflow: hidden;
      margin-top: 10px;
    }
  }
  .history {
    padding-top: 20px;
    border-top: 1px solid #eee;
    margin-top: 30px;
    .historyTable {
      overflow: hidden;
      margin-top: 10px;
    }
  }
}
</style>
