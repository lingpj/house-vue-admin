<template>
  <div class='container'>
    <div class="searchBox">
      <span>车牌：</span>
      <el-input v-model="carNumber" placeholder="请输入车牌或电话"></el-input>
      <!-- <span>&nbsp;&nbsp;&nbsp;&nbsp;园区：</span> -->
      <!-- <el-select clearable v-model="selectPark" placeholder="请选择">
        <el-option v-for="item in parkList" :key="item.parking_id" :label="item.name" :value="item.parking_id">
        </el-option>
      </el-select> -->
      <el-button type="primary" @click="search">搜索</el-button>
    </div>
    <div class="recordTable">
      <el-table id="table" :data="tableDataArr" border fit highlight-current-row style="width: 100%">
        <template v-for="item in tableHeaderArr">
          <!--详情  -->
          <el-table-column v-if="item.prop=='detail'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
              <el-button size="small" @click="operationHandle(scope)" v-waves>查看</el-button>
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
          <!--详情  -->
          <el-table-column v-else-if="item.prop=='operation'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
              <el-button size="small" v-if="scope.row.is_deleted == '0'" @click="untyingHandle(scope)" v-waves>解绑</el-button>
              <el-button size="small" v-if="scope.row.is_deleted == '1'" @click="tyingCarHandle(scope)" v-waves>绑定</el-button>
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
    <!--解绑dialog  -->
    <el-dialog title="解绑" :visible.sync="untyingUnion.visible" width="30%">
      <!-- <el-button size="small" type="primary" style="margin-bottom:10px;" @click="killAllBillHandle">全部销账</el-button> -->
      <el-table id="table" :data="untyingUnion.tableData" border fit highlight-current-row style="width: 100%">
        <template v-for="item in untyingUnion.tableHeader">
          <!--详情  -->
          <el-table-column v-if="item.prop=='detail'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
              <el-button size="small" @click="operationHandle(scope)" v-waves>查看</el-button>
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="untyingCertainHandle">解绑</el-button>
      </span>
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
      tableHeaderArr: [
        { prop: 'code', align: 'center', label: '编号', width: 100 },
        { prop: 'plate_no', align: 'center', label: '车牌', width: 100 },
        { prop: 'mobile', align: 'center', label: '联系电话', width: 100 },
        // { prop: 'parkname', align: 'center', label: '所属园区', width: 100 },
        { prop: 'sourcename', align: 'center', label: '来源', width: 100 },
        { prop: 'createtime', align: 'center', label: '注册时间', width: 100 },
        { prop: 'detail', align: 'center', label: '详情', width: 100 },
        { prop: 'operation', align: 'center', label: '操作', width: 100 },
      ],
      tableDataArr: [],
      listQuery: {
        page: 1,
        limit: 20,
      },
      total: 0,
      parkList: [],
      selectPark: '',
      // 解绑
      untyingUnion: {
        visible: false,
        tableData: [],
        tableHeader: [
            { prop: 'code', align: 'center', label: '信用付月账单编号', width: 100 },
            { prop: 'bill_month', align: 'center', label: '账单月份', width: 100 },
            { prop: 'pay_money', align: 'center', label: '应付金额', width: 100 },
            { prop: 'payable', align: 'center', label: '实付金额', width: 100 },
            { prop: 'discounts', align: 'center', label: '减免金额', width: 100 },
            { prop: 'statusName', align: 'center', label: '状态', width: 100 },
        ],
        listQuery: {
          page: 1,
          limit: 10,
        },
        plateNo:'',
        classify:'',
      },
    }
  },

  mounted() {
    this.getParkList()
    this.getTableData()
  },
  methods: {
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
      }).catch((err) => {

      })
    },
    // 绑定
    tyingCarHandle:function(scope){
        this.$confirm('确定要绑定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$fetch({
              url: process.env.park_api + '/bind/bindCar',
              method: 'post',
              data: {
                plateNo:scope.row.plate_no,
                parkId:scope.row.parkid,
                typeId:scope.row.typeid,
                isDelete:0
              }
            }).then((res) => {
              this.getTableData()
              this.$message({
                type: 'success',
                message: '绑定成功!'
            });
          })
        })
    },
    // 解绑请求
    untying:function(){
      this.$fetch({
        url: process.env.park_api + '/bind/unBindCar',
        method: 'get',
        params: {
          plateNo:this.untyingUnion.plateNo,
          classify:this.untyingUnion.classify,
          token: this.$store.getters.token
        }
      }).then((res) => {
        this.untyingUnion.visible = false
        this.getTableData()
        this.$message({
          type: 'success',
          message: '解绑成功!'
        });
      })
    },
    // 确定解绑
    untyingCertainHandle:function(){
        if(this.untyingUnion.tableData.length>0){
          this.$confirm('当前车辆有未销账单，解绑之前会先进行销账，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.killAllBillHandle()
          })
        }else{
          this.untying()
        }
     
    },
    // 解绑dialog数据
    untyingHandle: function(scope) {
      console.log('>>',scope)
        this.untyingUnion.visible = true
        this.untyingUnion.plateNo = scope.row.plate_no
        this.untyingUnion.classify = scope.row.typeid
        this.$fetch({
          url: process.env.park_api + '/bind/unBindCarBill',
          method: 'get',
          params: {
            plateNo:scope.row.plate_no,
            token: this.$store.getters.token
          }
        }).then((res) => {
          this.untyingUnion.tableData = res.data.filter(item =>{
            item.statusName = '未支付'
            return true
          })
        }).catch((err) => {

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
    // 详细查看
    operationHandle: function(scope) {
 
      this.$router.push({path:'/parkingManager/creditPaymentCar',query:{plate_no : scope.row.plate_no}})
    },
    // 表格数据
    getTableData: function() {

      this.$myLoading.show()
      this.$fetch({
        url: process.env.park_api + '/bind/list',
        method: 'post',
        data: {
          plate_no: this.carNumber,
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          parkid: this.selectPark,
          typeid: 1000,
        }
      }).then((res) => {
        this.$myLoading.hide()
        this.tableDataArr = res.data.list
        this.total = res.data.totalCount
      }).catch((err) => {
        this.$myLoading.hide()
        this.$message({
          type: 'error',
          message: err
        });
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
