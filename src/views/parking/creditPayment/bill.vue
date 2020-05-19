<template>
  <div class='container'>
    <div class="searchBox">
      <span>车牌：</span>
      <el-input v-model="carNumber" placeholder="请输入车牌或联系电话"></el-input>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button type="primary" @click="notifyAllPayHandle">全部催付</el-button>
    </div>
   
    <div class="recordTable" >
      <el-radio-group v-model="typeRadio" class="radioGroup">
        <el-radio-button v-for="item in typeRadioRadioArr" :label="item" :key="Math.random() +100"></el-radio-button>
      </el-radio-group>
      <el-table id="table" :data="tableDataArr" border fit highlight-current-row style="width: 100%">
        <template v-for="item in currentTableHeaderArr">
          <!--停车次数  -->
          <el-table-column v-if="item.prop=='park_count'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
              <el-button size="small" @click="parkCountHandle(scope.row)" v-waves >{{scope.row.park_count}}</el-button>
            </template>
          </el-table-column>
          <!-- 金额转元 -->  
          <el-table-column v-else-if="item.prop=='payable'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
                {{scope.row.payable | cent2yuan}}
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.prop=='pay_money'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
                {{scope.row.pay_money | cent2yuan}}
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.prop=='discounts'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
                {{scope.row.discounts | cent2yuan}}
            </template>
          </el-table-column>
           <!--状态  -->
          <el-table-column v-else-if="item.prop=='status'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
                {{scope.row.status | formatStatus}}
            </template>
          </el-table-column>
           <!--状态  -->
          <el-table-column v-else-if="item.prop=='invoice_status'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
                {{scope.row.invoice_status | formatInvoceStatus}}
            </template>
          </el-table-column>
          <!--销账  -->
          <el-table-column v-else-if="item.prop=='operation'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
                <el-button size="small" v-if="scope.row.status == '0'" @click="operationHandle(1,scope.row)" v-waves>销账</el-button>
                <el-button size="small" v-if="scope.row.status == '0'" @click="operationHandle(2,scope.row)" v-waves>催付</el-button>
                <el-button size="small" v-if="scope.row.status == '1' && scope.row.invoice_status != 1" @click="getInvoiceHandle(scope.row)" v-waves>取发票</el-button>
                <span v-if="scope.row.status == '1' && scope.row.invoice_status == 1">已领取发票</span>
            </template>
          </el-table-column>
          <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
          </el-table-column>
        </template>
      </el-table>
      <div style="float:right;margin-top:10px">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </div>
     <!-- 日账单  -->
      <el-dialog title="查看账单" :before-close="dayBillDialogClose" :visible.sync="dayBillUnion.visible" size="large">
        <div style="overflow:hidden">
          <p>车牌号：{{dayBillUnion.checkedData.plate_no}} &#x3000;&#x3000;&#x3000;&#x3000;电话：{{dayBillUnion.checkedData.mobile}}&#x3000;&#x3000;&#x3000;&#x3000;总支付金额：{{dayBillUnion.checkedData.pay_money | cent2yuan}}元</p>
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
              <!-- 金额转元 -->  
          <el-table-column v-else-if="item.prop=='payable'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
                {{scope.row.payable | cent2yuan}}
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.prop=='payMoney'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
                {{scope.row.payMoney | cent2yuan}}
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.prop=='discounts'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
                {{scope.row.discounts | cent2yuan}}
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
                            <span v-if="parkList.filter(item => item.parking_id == scope.row.parkinginfo_id).length >0"> {{parkList.filter(item => item.parking_id == scope.row.parkinginfo_id)[0].name}}</span>
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
        </div>
      </el-dialog>
      <el-dialog title="填写销账原因" :visible.sync="killBillUnion.visible" >
        销账原因：<el-input type="textarea" v-model="killBillUnion.reason"></el-input>
        <br>
        <br>
        <el-button type="primary" @click="certainKillBillHandle">确认销账</el-button>
      </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
  name: '',
  components: {},
  data() {
    return {
      // 主表格
      carNumber: '',
      currentTableHeaderArr:[],
      tableHeaderArr: [
        { prop: 'code', align: 'center', label: '账单编号', width: 100 },
        { prop: 'plate_no', align: 'center', label: '车牌', width: 100 },
        { prop: 'status', align: 'center', label: '状态', width: 100 },
        { prop: 'bill_month', align: 'center', label: '账单月份', width: 100 },
        { prop: 'park_count', align: 'center', label: '停车次数', width: 100 },
        { prop: 'payable', align: 'center', label: '应付金额', width: 100 },
        { prop: 'pay_money', align: 'center',isPayed:true, label: '实付金额', width: 100 },
        { prop: 'updatetime', align: 'center',isPayed:true, label: '支付时间', width: 100 },
        { prop: 'invoice_status', align: 'center',isPayed:true, label: '发票状态', width: 100 },
        { prop: 'operator', align: 'center',isPayed:true, label: '销账人', width: 100 },
        { prop: 'reason', align: 'center',isPayed:true, label: '销账原因', width: 100 },
        { prop: 'operation', align: 'center', label: '操作', width: 100 },
      ],
      tableDataArr: [],
      listQuery: {
        page: 1,
        limit: 20,
      },
      total: 0,
      typeRadio:'未支付',
      typeRadioRadioArr:['未支付','已支付'],
      // 日账单
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
      // 销账
      killBillUnion:{
        visible:false,
        reason:'',
        checkedData:{}
      }
    }
  },
  filters:{
    formatStatus:function(val){
      return parseInt(val) == 1 ? '已支付' : '未支付'
    },
    formatInvoceStatus:function(val){
      return parseInt(val) == 1 ? '已领取':'未领取'
    }
  },
  watch:{
    typeRadio:function(val){
        this.changeTableHeader()
        this.getTableData()
    }
  },
  mounted() {
    this.getParkList()
    this.changeTableHeader()
    this.getTableData()
  },
  methods: {
    // 取发票
    getInvoiceHandle:function(data){
      if(data.invoice_status == 1){
          this.$message.warning('已经领取过了！')
      }else{
        this.$fetch({
          url: process.env.park_api + '/writeoff/operate',
          method: 'post',
          data: {
            monthBillId:data.code,
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
      }
    },
    // 全部催付
    notifyAllPayHandle:function(){
      this.$confirm('确定要全部催付？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$fetch({
                url: process.env.park_api + '/paymentMessage/carPayMessage',
                method: 'get',
                params: {
                    plateNo:'',
                    token: this.$store.getters.token
                }
            }).then((res) => {
                if(res.code == 200){
                  this.$message.success(res.msg)
                }
            })
      })
    },
    // 停车次数
    parkCountHandle:function(data){
      this.dayBillUnion.visible = true
      this.dayBillUnion.checkedData = data
      this.getDayBillApi()
    },
    // 日账单：停车次数点击
    dayBillParkCountHandle:function(data){
      console.log(data)
      console.log('改')
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
    // // 日账单：停车次数点击
    // dayBillParkCountHandle:function(data){
    //   console.log(data)
    //   this.$fetch({
    //       url: process.env.park_api + '/bill/day/park/details',
    //       method: 'get',
    //       params: {
    //           dayBillId:data.id
    //       }
    //   }).then(res =>{
    //     this.dayBillUnion.childTable =res.data
    //   })
    // },
    // 日账单关闭：重置dialog内容
    dayBillDialogClose:function(done){
      this.dayBillUnion.tableData = []
      this.dayBillUnion.total = 0
      this.dayBillUnion.form.money = ''
      this.dayBillUnion.form.date = ''
      done()
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
    // 未付、已付：改变表头
     changeTableHeader:function(){
      this.currentTableHeaderArr = this.tableHeaderArr.filter(item =>{
        if(this.typeRadio == '未支付'){
          return item.isPayed ? false : true
        }else{
          return true
        }
      })
    },
    // 确认销账
    // 1、存原因。2、销账
    certainKillBillHandle:function(){
      console.log(this.killBillUnion.reason)
      this.$fetch({
        url: process.env.park_api + '/writeoff/operate',
        method: 'post',
        data: {
          monthBillId:this.killBillUnion.checkedData.code,
          operator:this.$store.getters.name,  
          reason:this.killBillUnion.reason,
          token: this.$store.getters.token
        }
      })
      this.$fetch({
        url: process.env.park_api + '/bind/writeOff',
        method: 'post',
        data: {
          typeId:'1000',
          plateNo:this.killBillUnion.checkedData.plate_no,
          billList:[this.killBillUnion.checkedData],
          token: this.$store.getters.token
        }
      }).then((res) => {
           this.killBillUnion.visible = false
           this.getTableData()
           this.killBillUnion.reason = ''
         if(res.code == 200){
            this.$message.success('销账成功！')
         }else{
            this.$message.success(res.msg)
         }
      }) 
    },
    // 单个车辆销账、催付
    // 1销账 2催付
    operationHandle:function(flag,data){
      if(flag == 1){
        this.killBillUnion.checkedData = data
        this.killBillUnion.visible = true
      }else{
        this.$confirm('确定要催付？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$fetch({
                url: process.env.park_api + '/paymentMessage/carPayMessage',
                method: 'get',
                params: {
                    plateNo:data.plate_no,
                    token: this.$store.getters.token
                }
            }).then((res) => {
                if(res.code == 200){
                  this.$message.success(res.msg)
                }
            })
        })
      }
    },
    // 全部销账
    killAllBillHandle:function(){
      this.$fetch({
        url: process.env.park_api + '/bind/writeOff',
        method: 'post',
        data: {
          plateNo:this.untyingUnion.plateNo,
          billList:this.untyingUnion.tableData,
          token: this.$store.getters.token
        }
      }).then((res) => {
          this.untying()
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
        this.parkList = res
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
    // 搜索
    search: function() {
      this.getTableData()
    },
    // 获取日账单数据
    getDayBillApi:function(){
      this.$fetch({
        url: process.env.park_api + '/creditDayBill/getChargeOffBill',
        method: 'get',
        params: {
          page:this.dayBillUnion.listQuery.page,
          limit:this.dayBillUnion.listQuery.limit,
          plateNo:this.dayBillUnion.checkedData.plate_no,
          bill_month:this.dayBillUnion.checkedData.bill_month,
          billDate:this.dayBillUnion.form.date == ''?'': this.dayBillUnion.form.date.format('yyyy-MM-dd') ,
          payMoney:this.dayBillUnion.form.money,
          chargeOff: this.typeRadio == '未支付' ? '' : 1
        }
      }).then((res) => {
         this.dayBillUnion.tableData = res.list
         this.dayBillUnion.total = res.totalCount
      })
    },
    // 表格数据
    getTableData: function() {
      
      this.$myLoading.show()
      this.$fetch({
        url: process.env.park_api + '/month/bill/selectMonthBill',
        method: 'get',
        params: {
          billId: '',
          billMonth: '',
          status:this.typeRadio == '未支付' ? 0 :1,
          typeId:1000,
          plateNo: this.carNumber,
          page: this.listQuery.page,
          limit: this.listQuery.limit,
        }
      }).then((res) => {
        this.$myLoading.hide()
        this.tableDataArr = res.list
        this.total = res.totalCount
      })
    },
  }
}
</script>

<style lang='scss' scoped>
.container {
  .searchBox {
    display: flex;
    padding: 10px 0 20px 20px;
    & /deep/ .el-input {
      width: 300px;
    }
    & /deep/ .el-button {
      margin-left: 20px;
    }
    span {
      line-height: 38px;
      text-align: center;
    }
    span:last-child {
      margin-left: 20px;
    }
  }
  .recordTable {
    border-top: 1px solid #eee;
    padding: 10px 20px;
    .hurry2pay {
      margin-bottom: 10px;
    }
  }
}
</style>
