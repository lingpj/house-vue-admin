<template>
  <div class='container'>
    <el-form ref="form" id="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="订单编号:">
            <el-input style="width:300px" v-model="form.orderId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="订单状态:">
            <el-select style="width:350px" v-model="form.orderStatus" placeholder="请选择活动区域">
              <el-option label="全部" value=""></el-option>
              <el-option label="待付款" value="1"></el-option>
              <el-option label="服务中" value="2"></el-option>
              <el-option label="已发货" value="3"></el-option>
              <el-option label="已完成" value="4"></el-option>
              <el-option label="已关闭" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="付款方式:">
            <el-input style="width:300px" v-model="form.payWay"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="下单时间:" class="createTime">
            <el-date-picker style="width:350px;" v-model="form.orderTime" type="datetimerange" range-separator="   至  " start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-button type="primary" @click="submit" style="margin-left:100px">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="productTable">
      <el-radio-group v-model="typeRadio" class="radioGroup">
        <el-radio-button v-for="item in typeRadioRadioArr" :label="item" :key="Math.random() +100"></el-radio-button>
      </el-radio-group>
      <el-table id="table" :data="currentShowTableDataArr" border fit highlight-current-row style="width: 100%">
        <template v-for="item in tableHeaderArr">
          <!--操作  -->
          <el-table-column v-if="item.prop=='operation'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :width="item.width" :label="item.label">
            <template scope="scope">
              <el-button size="small" @click="operationHandle(scope)" v-waves>订单详情</el-button>
            </template>
          </el-table-column>
          <!--状态  -->
          <el-table-column v-else-if="item.prop =='goodsId'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
            <template scope="scope">
              <el-popover placement="right" trigger="click">
                <el-table :data="orderGoodsDetailArr">
                  <el-table-column property="goodsName" label="商品名称"></el-table-column>
                  <el-table-column property="goodsNum" label="数量(件)"></el-table-column>
                  <el-table-column property="goodsPrice" label="单价(元)"></el-table-column>
                  <el-table-column property="goodsSumPrice" label="总价(元)"></el-table-column>
                </el-table>
                <el-button slot="reference" size="small" @click="goodsDetailListHandle(scope)">查看</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
          </el-table-column>
        </template>
      </el-table>
      <div class="customTable">
        <div class="customRow customRowHeader">
          <div class="customCell" v-for="item in tableHeaderArr.slice(1)" :key="Math.random()">
            {{item.label}}
          </div>
        </div>
        <div class="customRow" v-for="(item,itemIndex) in currentShowTableDataArr" :key="Math.random()">
          <p>订单编号{{item.orderId}}</p>
          <div class="customCell" v-for="(head,headIndex) in tableHeaderArr.slice(1)" :key="Math.random()">
            {{item[head.prop]}}
          </div>
        </div>
      </div>
      <div style="float:right;margin-top:10px">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data() {
    return {
      form: {
        orderId: '',
        orderStatus: '',
        payWay: '',
        orderTime: '',
      },
      tableHeaderArr: [
        { prop: 'orderId', align: 'center', label: '订单编号', width: 100 },
        { prop: 'goodsId', align: 'center', label: '商品', width: 100 },
        { prop: 'userName', align: 'center', label: '买家', width: 100 },
        { prop: 'createTime', align: 'center', label: '下单时间', width: 100 },
        { prop: 'orderStatus', align: 'center', label: '订单状态', width: 100 },
        { prop: 'orderAmt', align: 'center', label: '订单金额', width: 100 },
        { prop: 'createTime', align: 'center', label: '创建时间', width: 100, },
        { prop: 'operation', align: 'center', label: '操作', width: 250, },
      ],
      tableDataArr: [],
      orderGoodsDetailArr: [],
      typeRadio: '全部',
      typeRadioRadioArr: ['全部', '待付款', '服务中', '已发货', '已完成', '已关闭'],
      listQuery: {
        page: 1,
        limit: 20,
      },
      total: 0,
      currentShowTableDataArr: []
    }
  },

  mounted() {
    this.getTableData()
    // console.log(window.frames['haha'].contentWindow )
  },
  watch: {
    typeRadio: function() {
      // 1:待付款;2:已支付(服务中);3:已发货;4:已完成,5:已取消;6:已关闭) ,
      if (this.typeRadio == '全部') {
        this.currentShowTableDataArr = this.tableDataArr
        return
      }

      this.currentShowTableDataArr = this.tableDataArr.filter((item) => {
        if (item.orderStatus == this.typeRadio) {
          return true
        }
        return false
      })
    }
  },
  methods: {
    // 分页变化
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getTableData();
    },
    submit: function() {
      this.typeRadio = this.typeRadioRadioArr[parseInt(this.form.orderStatus == '' ? 0 : this.form.orderStatus)]
      this.getTableData()
    },
    // 重置表单
    resetForm: function() {
      for (var k in this.form) {
        this.form[k] = ''
      }
    },
    // 操作
    operationHandle: function(scope) {

      this.$router.push({ path: '/orderManager/detailOrder', query: { id: scope.row.orderId } })
    },
    // 商品列表
    goodsDetailListHandle: function(scope) {


      var id = scope.row.orderId
      this.$fetch({
        url: process.env.shop_api + '/order/getGoodsByOrderId',
        method: 'get',
        params: {
          orderId: id
        }
      }).then((res) => {
        this.orderGoodsDetailArr = res.goodsList.filter((item) => {
          item.goodsSumPrice = item.goodsNum * item.goodsPrice
          return true
        })
      }).catch((err) => {

        this.$message({
          type: 'error',
          message: err
        });
      })
    },
    // 表格数据
    getTableData: function() {
      this.$myLoading.show()
      var starttime = '', endtime = ''
      if (this.form.orderTime[0]) {
        starttime = this.form.orderTime[0].format('yyyy-MM-dd hh:mm:ss')
      }
      if (this.form.orderTime[1]) {
        endtime = this.form.orderTime[1].format('yyyy-MM-dd hh:mm:ss')
      }
      this.$fetch({
        url: process.env.shop_api + '/order/getOrderList',
        method: 'get',
        params: {
          orderId: this.form.orderId,
          orderStatus: this.form.orderStatus,
          payWay: this.form.payWay,
          startOrderTime: starttime,
          endOrderTime: endtime,
          page: this.listQuery.page,
          limit: this.listQuery.limit,
        }
      }).then((res) => {
        this.$myLoading.hide()
        this.tableDataArr = res.data.orderInfo
        this.currentShowTableDataArr = res.data.orderInfo
        this.tableDataArr.forEach((item) => {
          item.orderStatus = this.typeRadioRadioArr[parseInt(item.orderStatus)]
        })
        this.total = res.data.totalCount
      }).catch((err) => {
        this.$myLoading.hide()
        this.$message({
          type: 'error',
          message: err
        });
      })
    },
    // 获取订单商品列表
    getOrderGoodsList: function(ids) {
      this.$myLoading.show()
      this.$fetch({
        url: '/shop/shopProduct/listShopCar',
        method: 'post',
        data: {
          productIds: ids
        }
      }).then((res) => {
        this.$myLoading.hide()

      }).catch((err) => {
        this.$myLoading.hide()
        this.$message({
          type: 'error',
          message: err
        });
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.container {
  border: 20px solid #eee;
  // border-bottom: 500px solid #eee;
  background-color: #fff;
  #table {
    // display: none;
  }
  .customTable {
    display: none;
    border: 1px solid #eee;

    .customRow {
      width: 100%;
      overflow: hidden;
      p {
        margin: 10px 0;
      }
      .customCell {
        float: left;
        width: 14.2857143%;
        min-height: 30px;
        text-align: center;
        line-height: 30px;
        border: 1px solid #eee;
      }
    }
    .customRowHeader {
      font-size: 14px;
      background-color: #eee;
      text-align: center;
      line-height: 40px;
      height: 40px;
      .customCell {
        border-right: 1px solid lightgray;
      }
    }
  }
  #form {
    padding: 20px 0;
  }
  .createTime /deep/ .el-input__inner {
    text-align: center;
  }
  .productTable {
    border-top: 20px solid #eee;
    padding: 20px;
    overflow: hidden;
    .radioGroup {
      margin-bottom: 20px;
    }
  }
}
</style>
