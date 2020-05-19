<template>
  <div class='carBaseInfoPage'>
    <div>
      <div class="baseInfo">
        <h1>车辆基本信息:</h1>
        <ul>
          <li>车号：{{carBaseInfo.plate_no}}</li>
          <li>电话：{{carBaseInfo.mobile}}</li>
          <li>微信名：{{carBaseInfo.nickname}}</li>
          <li>首次注册时间：{{carBaseInfo.createtime}}</li>
          <li>园区：{{carBaseInfo.parkname}}</li>
          <li>来源：{{carBaseInfo.sourcename}}</li>
          <li>类型：{{carBaseInfo.typename}}</li>
          <li>当前状态：{{carBaseInfo.is_deleted == '1' ? '已解绑':'未解绑'}}</li>
        </ul>
      </div>
      <div class="daybill">
        <h1>日账单:</h1>
        <div class="dayBillTable">
          <el-table :data="daybillUnion.tableData" border fit highlight-current-row style="width: 100%">
            <template v-for="(item,index) in daybillUnion.headerArr">
              <el-table-column v-if="item.prop=='index'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
                <template scope="scope">
                  {{scope.row.index+1}}
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
              <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
              </el-table-column>
            </template>
          </el-table>
          <div style="float:right;margin-top:10px">
            <el-pagination @size-change="handleSizeChange('daybill',$event)" @current-change="handleCurrentChange('daybill',$event)" :current-page.sync="daybillUnion.listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="daybillUnion.listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="daybillUnion.total"> </el-pagination>
          </div>
        </div>
      </div>
      <div class="unpaid">
        <h1>未付月账单:</h1>
        <div class="unpaidTable">
          <el-table ref="unpaidTable" @expand="expandChange" :data="unpaidUnion.tableData" border fit highlight-current-row style="width: 100%">
            <template v-for="(item,index) in unpaidUnion.headerArr">
              <el-table-column v-if="item.prop=='arrow'" type="expand" :key="Math.random() +100">
                <template scope="scope">
                  <div v-if="scope.row.tableData.length>0">
                    <div class="table">
                    <div class="tr">
                      <div class="td" v-for="(header,index) in unpaidUnion.expandUnion.headerArr" :key="Math.random()">{{header.label}}</div>
                    </div>
                    <div class="tr" v-for="(data,index) in scope.row.tableData">
                      <div class="td" v-for="(header,index) in unpaidUnion.expandUnion.headerArr" @click="parkCountHandle(data,header)" v-if="header.prop!='qwer' && header.prop!='asdf'" :class="{'c-blue' : header.prop=='park_count'}">{{data[header.prop]}}</div>
                      <div class="td" v-for="(header,index) in unpaidUnion.expandUnion.headerArr" @click="parkCountHandle(data,header)"   v-if="header.prop=='qwer'">
                         <el-popover placement="right" v-model="data.reduceMoneyPopurVisible" width="400">
                          <p class="reduceMoney">减免金额：&nbsp;<input type="number" v-model="data.comments"></p>
                          <p class="remark">
                            <span style="vertical-align:top">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备注：</span>
                            <textarea name="" class="remarkArea" v-model="data.reason" id="" cols="30" rows="10"></textarea>
                          </p>
                          <el-button style="margin-left: 65px;" class="remarkBtn" size="small" @click="saveCommentsAndReason(data)">确定</el-button>
                          <el-button slot="reference" size="small" @click="data.reduceMoneyPopurVisible = true">减免金额</el-button>
                        </el-popover>
                      </div>
                      <div class="td" v-for="(header,index) in unpaidUnion.expandUnion.headerArr" @click="parkCountHandle(data,header)"   v-if="header.prop=='asdf'">
                        <el-popover placement="right" width="400">
                          <el-table :data="currentRemarkArr" border>
                            <el-table-column width="100" property="comments" style="font-size:14px;" label="减免金额(元)"></el-table-column>
                            <el-table-column width="200" property="reason" style="font-size:14px;" label="备注"></el-table-column>
                            <el-table-column width="100" property="creator" style="font-size:14px;" label="操作人"></el-table-column>
                          </el-table>
                          <el-button slot="reference" size="small" @click="getCommentsAndReason(data)">查看</el-button>
                        </el-popover>
                      </div>
                    </div>
                  </div>
                  <div style="float:right;margin-top:10px">
                    <el-pagination @size-change="handleSizeChange('unpaid',$event,scope)" @current-change="handleCurrentChange('unpaid',$event,scope)" :current-page.sync="scope.row.listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="scope.row.listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="scope.row.total"> </el-pagination>
                  </div>
                  </div>
                </template>
              </el-table-column>
               <!--pay_money  -->
              <el-table-column v-else-if="item.prop=='pay_money'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
                <template scope="scope">
                  {{scope.row.pay_money | cent2yuan}}
                </template>
              </el-table-column>
               <!--payable  -->
              <el-table-column v-else-if="item.prop=='payable'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
                <template scope="scope">
                  {{scope.row.payable | cent2yuan}}
                </template>
              </el-table-column>
              <!--详情  -->
              <el-table-column v-else-if="item.prop=='detail'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
                <template scope="scope">
                  <el-button size="small" @click="operationHandle(scope)" v-waves>查看</el-button>
                </template>
              </el-table-column>
              <!-- 减免 -->
              <el-table-column v-else-if="item.prop=='qwer'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
                <template scope="scope">
                  <el-popover placement="right" v-model="scope.row.reduceMoneyPopurVisible" width="400">
                    <p class="reduceMoney">减免金额：&nbsp;<input type="number" v-model="scope.row.comments"></p>
                    <p class="remark">
                      <span style="vertical-align:top">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备注：</span>
                      <textarea name="" class="remarkArea" v-model="scope.row.reason" id="" cols="30" rows="10"></textarea>
                    </p>
                    <el-button style="margin-left: 65px;" class="remarkBtn" size="small" @click="saveCommentsAndReason(scope.row)">确定</el-button>
                    <el-button slot="reference" size="small" @click="scope.row.reduceMoneyPopurVisible = true">减免金额</el-button>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
              </el-table-column>
            </template>
          </el-table>
        </div>
      </div>
      <div class="history">
        <h1>历史账单:</h1>
        <div class="historyTable">
          <el-table @expand="expandChange" :data="historyUnion.tableData" border fit highlight-current-row style="width: 100%">
            <!--展开  -->
            <template v-for="(item,index) in historyUnion.headerArr">
              <el-table-column v-if="item.prop=='arrow'" type="expand" :key="Math.random() +100">
                <template scope="scope">
                  <div v-if="scope.row.tableData.length>0">
                    <div class="table">
                    <div class="tr">
                      <div class="td" v-for="(header,index) in daybillUnion.headerArr" :key="Math.random()">{{header.label}}</div>
                    </div>
                    <div class="tr" v-for="(data,index) in scope.row.tableData">
                      <div class="td" v-for="(header,index) in daybillUnion.headerArr" @click="parkCountHandle(data,header)" :class="{'c-blue' : header.prop=='park_count'}">{{data[header.prop]}}</div>
                    </div>
                  </div>
                  <div style="float:right;margin-top:10px">
                    <el-pagination @size-change="handleSizeChange('history',$event,scope)" @current-change="handleCurrentChange('history',$event,scope)" :current-page.sync="scope.row.listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="scope.row.listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="scope.row.total"> </el-pagination>
                  </div>
                  </div>
                </template>
              </el-table-column>
              <!--详情  -->
              <el-table-column v-else-if="item.prop=='detail'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
                <template scope="scope">
                  <el-button size="small" @click="operationHandle(scope)" v-waves>查看</el-button>
                </template>
              </el-table-column>
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
              <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
              </el-table-column>
            </template>
          </el-table>
        </div>
      </div>
      <!--popur  -->
      <el-dialog title="提示" style="overflow:hidden"  :visible.sync="dialogSingleDayUnion.visible" size="large">
        <el-table :data="dialogSingleDayUnion.tableData" border fit highlight-current-row style="width: 100%">
          <template v-for="(item,index) in dialogSingleDayUnion.headerArr">
            <!--详情  -->
            <el-table-column v-if="item.prop=='detail'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                <el-button size="small" @click="operationHandle(scope)" v-waves>查看</el-button>
              </template>
            </el-table-column>
                 <el-table-column v-else-if="item.prop=='payable'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
                <template scope="scope">
                  {{scope.row.payable | cent2yuan}}
                </template>
              </el-table-column>
            <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
            </el-table-column>
          </template>
        </el-table>
        <div style="float:right;margin-top:10px">
            <el-pagination @size-change="singleDaySizeChange" @current-change="singleDayCurrentChange" :current-page.sync="dialogSingleDayUnion.listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="dialogSingleDayUnion.listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="dialogSingleDayUnion.total"> </el-pagination>
        </div>
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
      carBaseInfo: {},  // 基本信息
      // reduceMoneyPopurVisible: false,
      currentRemarkArr: [],
      //当月日账单
      daybillUnion: {
        tableData: [],
        headerArr: [
          { prop: 'plate_no', align: 'center', label: '车牌', width: 100 },
          { prop: 'bill_date', align: 'center', label: '账单日期', width: 100 },
          { prop: 'park_count', align: 'center', label: '停车次数', width: 100 },
          { prop: 'payable', align: 'center', label: '应付金额', width: 100 },
          { prop: 'pay_money', align: 'center', label: '实付金额', width: 100 },
          { prop: 'discounts', align: 'center', label: '优惠金额', width: 100 },
          { prop: 'parkname', align: 'center', label: '园区名称', width: 100 },
          { prop: 'park_days', align: 'center', label: '停车天数', width: 100 },
        ],
        listQuery: {
          page: 1,
          limit: 10,
        },
        total: 0,
      },
      // 历史账单
      historyUnion: {
        tableData: [],
        headerArr: [
          { prop: 'arrow', align: 'center', label: '', width: 100 },
          { prop: 'code', align: 'center', label: '账单编号', width: 100 },
          { prop: 'bill_month', align: 'center', label: '账单月份', width: 100 },
          { prop: 'parking_order', align: 'center', label: '商户订单', width: 100 },
          { prop: 'pay_order', align: 'center', label: '支付订单号', width: 100 },
          { prop: 'pay_type', align: 'center', label: '支付渠道', width: 100 },
          { prop: 'payable', align: 'center', label: '应付金额', width: 100 },
          { prop: 'pay_money', align: 'center', label: '实付金额', width: 100 },
          { prop: 'discounts', align: 'center', label: '优惠金额', width: 100 },
        ],
        listQuery: {
          page: 1,
          limit: 10,
        },
        total: 0,
        expandUnion: {
          tableData: [],
          total: 0,
          listQuery: {
            page: 1,
            limit: 10,
          },
        }
      },
      // 未付月账单
      unpaidUnion: {
        tableData: [],
        headerArr: [
          { prop: 'arrow', align: 'center', label: '', width: 100 },
          { prop: 'code', align: 'center', label: '账单编号', width: 100 },
          { prop: 'bill_month', align: 'center', label: '账单月份', width: 100 },
          { prop: 'createtime', align: 'center', label: '账单创建时间', width: 100 },
          { prop: 'payable', align: 'center', label: '应付金额', width: 100 },
          { prop: 'pay_money', align: 'center', label: '实付金额', width: 100 },
          { prop: 'discounts', align: 'center', label: '优惠金额', width: 100 },
          // { prop: 'qwer', align: 'center', label: '操作', width: 100 },
          // { prop: 'asdf', align: 'center', label: '备注', width: 100 },
        ],
        listQuery: {
          page: 1,
          limit: 10,
        },
        total: 0,
        expandUnion: {
          tableData: [],
          total: 0,
          headerArr:[
            { prop: 'plate_no', align: 'center', label: '车牌', width: 100 },
            { prop: 'bill_date', align: 'center', label: '账单日期', width: 100 },
            { prop: 'park_count', align: 'center', label: '停车次数', width: 100 },
            { prop: 'payable', align: 'center', label: '应付金额', width: 100 },
            { prop: 'pay_money', align: 'center', label: '实付金额', width: 100 },
            { prop: 'discounts', align: 'center', label: '优惠金额', width: 100 },
            { prop: 'parkname', align: 'center', label: '园区名称', width: 100 },
            { prop: 'park_days', align: 'center', label: '停车天数', width: 100 },
            { prop: 'qwer', align: 'center', label: '操作', width: 100 },
            { prop: 'asdf', align: 'center', label: '备注', width: 100 },
          ],
          listQuery: {
            page: 1,
            limit: 10,
          },
        }
      },
      // dialog日账单弹窗
      dialogSingleDayUnion: {
        visible: false,
        tableData: [],
        headerArr: [
          { prop: 'plateno', align: 'center', label: '车牌', width: 100 },
          { prop: 'entryTime', align: 'center', label: '进场时间', width: 100 },
          { prop: 'payTime', align: 'center', label: '出场时间', width: 100 },
          { prop: 'elapsedTime', align: 'center', label: '停车时长(分钟)', width: 100 },
          { prop: 'parkinginfo_id', align: 'center', label: '车场名称', width: 100 },
          { prop: 'payable', align: 'center', label: '金额', width: 100 },
        ],
        total: 0,
        listQuery: {
            page: 1,
            limit: 10,
        },
      },
      // 当前点击的停车次数的对象
      clickedParkCountObj:{}
    }
  },

  mounted() {
    this.getTableData()
  },
  methods: {
    // 停车次数-分页
    singleDaySizeChange:function(val){
        this.dialogSingleDayUnion.listQuery.limit = val
        this.getParkCountTableData()
    },
    singleDayCurrentChange:function(val){
      this.dialogSingleDayUnion.listQuery.page = val
      this.getParkCountTableData()
    },
    // 停车次数-dialog
    parkCountHandle:function(data,header){
        console.log(data,header)
        if(header.prop != "park_count") return
        this.clickedParkCountObj = data
        this.dialogSingleDayUnion.visible = true
        this.getParkCountTableData()
    },
    getParkCountTableData:function(){
        this.$fetch({
        url: process.env.park_api + '/bill/day/park/details',
        method: 'get',
        params: {
          id: this.clickedParkCountObj.id,
          page: this.dialogSingleDayUnion.listQuery.page,
          limit: this.dialogSingleDayUnion.listQuery.limit
        }
      }).then((res) => {
          this.dialogSingleDayUnion.tableData = res.data
          this.dialogSingleDayUnion.total =res.totalCount
      })
    },
    // 分页变化
    handleSizeChange(flag, val, scope) {
      console.log(flag, val, scope)
      if (flag == 'daybill') {
        this.daybillUnion.listQuery.limit = val;
        this.getTableData();
      } else if (flag == 'history') {
        scope.row.listQuery.limit = val;
        this.getExpendTableData(scope.row,1)
      } else{
        scope.row.listQuery.limit = val;
        this.getExpendTableData(scope.row,0)
      }
    },
    handleCurrentChange(flag, val, scope) {
      console.log(flag, val, scope)
      if (flag == 'daybill') {
        this.daybillUnion.listQuery.page = val;
        this.getTableData();
      } else if (flag == 'history') {
        scope.row.listQuery.page = val;
        this.getExpendTableData(scope.row,1)
      } else{
        scope.row.listQuery.page = val;
        this.getExpendTableData(scope.row,0)
      }
    },
    // 表格展开
    expandChange: function(row, expandedRows) {
      console.log(row, expandedRows)
      // 未付月账单 0   历史账单 1
      var status = row.status
      if (expandedRows) {
        this.getExpendTableData(row,status)
      }
    },
    // 获取表格展开的子表格数据
    getExpendTableData: function(row,status) {
      this.$fetch({
        url: process.env.park_api + '/bill/day/pages',
        method: 'post',
        data: {
          credit_payment_id: row.code,
          page: row.listQuery.page,
          limit: row.listQuery.limit
        }
      }).then((res) => {
        var union = status == 0 ? this.unpaidUnion : this.historyUnion
        console.log( status,status == 0 ? '未付' : '已付')
        for (var i = 0; i < union.tableData.length; i++) {
          var item = union.tableData[i]
          if (item.code == row.code || item.credit_payment_id == row.code) {
            item.tableData = res.data.rows.filter(item =>{
              item.pay_money = (parseInt(item.pay_money) / 100).toFixed(0)
              item.payable = (parseInt(item.payable) / 100).toFixed(0)
              item.discounts = (parseInt(item.discounts) / 100).toFixed(0)
              return true
            })
            item.total = res.data.total
            break
          }
        }
      })
    },
    // 查看备注和金额
    getCommentsAndReason: function(data) {
      this.currentRemarkArr = []
      this.$fetch({
        url: process.env.park_api + '/creditReliefReason/listCreditReliefReason',
        method: 'get',
        params: {
          dayBillId: data.id,
        }
      }).then((res) => {   /* 调用vue的ajax来请求数据，promise语法，并用es6的箭头函数 */
        data.reduceMoneyPopurVisible = false
        console.log(res.code == 200)
        if (res.code == 200) {
           this.currentRemarkArr = res.data
        }
      }) 
      
    },
    // 保存备注和金额
    saveCommentsAndReason: function(data) {
      if (data.comments.trim().length < 1) {
        this.$message({
          type: 'error',
          message: '减免金额不能为空'
        })
        return
      }
      console.log(data.comments * 100,data.pay_money)
      if ((data.comments  > parseInt(data.pay_money)) || (data.comments * 100 <= 0)) {
        this.$message({
          type: 'error',
          message: '减免金额应大于0，小于应付金额'
        })
        data.comments = ''
        data.reason = ''
        return
      }
      this.$fetch({
        url: process.env.park_api + '/creditReliefReason/insert',
        method: 'post',
        data: {
          creator: this.$store.getters.name,
          comments: data.comments,
          reason: data.reason,
          dayBillId: data.id,
        }
      }).then((res) => {   /* 调用vue的ajax来请求数据，promise语法，并用es6的箭头函数 */
        data.reduceMoneyPopurVisible = false
        console.log(res.code == 200)
        if (res.code == 200) {
          data.comments = ''
          data.reason = ''
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getTableData()
        }
      }) 
    },
    // 获取当页数据
    getTableData: function() {
      this.$fetch({
        url: process.env.park_api + '/bind/info/' + this.$route.query.plate_no,
        method: 'post',
        data: {
          plateno: this.$route.query.plate_no
        }
      }).then((res) => {
        // 日账单
        this.daybillUnion.tableData = res.data.daybill.list.filter((item, index) => {
          item.index = index
          return item
        })
        this.daybillUnion.total = res.data.daybill.totalcount
        // 历史账单
        var self = this
        this.historyUnion.tableData = res.data.history
        this.historyUnion.tableData.forEach(function(item) {
          self.$set(item, 'tableData', [])
          self.$set(item, 'total', 0)
          self.$set(item, 'listQuery', {
            page: 1,
            limit: 10
          })
        });
        console.log('>>>>>>>>')
        // 未付账单
        this.unpaidUnion.tableData = res.data.unpaid
        this.unpaidUnion.tableData.forEach(function(item) {
          self.$set(item, 'tableData', [])
          self.$set(item, 'total', 0)
          self.$set(item, 'listQuery', {
            page: 1,
            limit: 10
          })
        });
        // this.unpaidUnion.tableData = res.data.unpaid.filter((item, index) => {
        //   item.reason = ''
        //   item.comments = ''
        //   return item
        // })
        // 车辆基础信息
        for (var k in res.data.element) {
          this.$set(this.carBaseInfo, k, res.data.element[k])
        }
      }).catch((err) => {

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
