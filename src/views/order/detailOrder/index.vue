<template>
  <div class='container'>
    <div class="orderDetail">
      <h2>订单详情：</h2>
      <ul>
        <li>订单编号：{{dataObj.orderId}}</li>
        <li>地址：{{dataObj.userAddr}}</li>
        <li>付款方式：{{dataObj.payWay}}无</li>
        <li>买家：{{dataObj.userName}} </li>
        <li>联系方式：{{dataObj.userPhone}}</li>
      </ul>
    </div>
    <div class="orderStatus">
      <h2>订单状态：{{statusArr[parseInt(dataObj.orderStatus) - 1]}}</h2>
      <ul>
        <!-- <li>超时未付款</li> -->
      </ul>
      <div class="utils">
        <h2>订单操作：</h2>
        <div class="btnBox">
          <el-button>备注</el-button>
          <el-button type="danger">退款</el-button>
          <el-button type="danger">取消退款</el-button>
        </div>
      </div>
    </div>
    <div class="goodsList" v-if="dataObj.goodsInfo">
      <h2>商品列表：</h2>
      <el-table id="table" :data="dataObj.goodsInfo" border fit highlight-current-row style="width: 100%">
        <template v-for="item in tableHeaderArr">
          <!--操作  -->
          <el-table-column v-if="item.prop=='img'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :width="item.width" :label="item.label">
            <template scope="scope">
              <img class="thumbs" :src="scope.row.prefix+scope.row.path" alt="">
            </template>
          </el-table-column>
          <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
          </el-table-column>
        </template>
      </el-table>

    </div>
  </div>
</template>

<script>

export default {
  name: '',

  data() {
    return {
      dataObj: {},
      statusArr: ['待付款', '服务中', '', '已完成', '已关闭'],
      tableHeaderArr: [
        { prop: 'img', align: 'center', label: '图片', width: 150 },
        { prop: 'productName', align: 'center', label: '商品名', width: 100 },
        { prop: 'originalPrice', align: 'center', label: '原价', width: 100 },
        { prop: 'currentPrice', align: 'center', label: '现价', width: 100 },
        { prop: 'goodsNum', align: 'center', label: '购买数量', width: 100 },
        { prop: 'merchantName', align: 'center', label: '商家名称', width: 100 },
        { prop: 'productCode', align: 'center', label: '商品编号', width: 100 },
      ],
    }
  },

  mounted() {
    console.log(this.$route.query.id)

    this.getOrderDetailById(this.$route.query.id)

  },
  methods: {
    // GET 
    getOrderDetailById: function(id) {
      this.$fetch({
        url: process.env.shop_api + '/order/getBackOrderDetail',
        method: 'get',
        params: {
          orderId: id
        }
      }).then((res) => {
        var data = res.data[0]
        for (var k in data) {
          this.$set(this.dataObj, k, data[k])
        }
        console.log('>>>>', this.dataObj)
      }).catch((err) => {

      })
    }
  }
}
</script>

<style lang='scss' scoped>
.tri-left {
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 20px solid red;
}

.container {
  border: 20px solid #eee;
  background-color: #fff;
  // border-bottom: 300px solid #eee;
  .orderDetail {
    border-bottom: 1px solid #eee;
    padding: 20px;
    h2 {
      margin: 0;
      margin-bottom: 20px;
      font-size: 18px;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      li {
        margin-left: 50px;
        margin-bottom: 20px;
        float: left;
      }
    }
  }
  .orderStatus {
    border-bottom: 1px solid #eee;
    padding: 20px;
    h2 {
      margin: 0;
      margin-bottom: 20px;
      font-size: 18px;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
      li {
        margin-left: 50px;
        float: left;
      }
    }
    .utils {
      margin-top: 20px;
      .btnBox{
        margin-left: 50px;
      }
    }
  }
  .goodsList {
    & /deep/ .thumbs {
      width: 100px;
      height: 100px;
    }
    border-bottom: 1px solid #eee;
    padding: 20px;
    img {
      width: 100px;
      height: 100px;
      padding: 5px 0;
    }
    h2 {
      margin: 0;
      margin-bottom: 20px;
      font-size: 18px;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
      li {
        margin-left: 50px;
        display: flex;
        border: 1px solid #eee;
        padding: 10px;
        .desc {
          display: flex;
          flex: 1;
          align-items: center;
          p {
            margin-left: 20px;
            border-left: 3px solid #20a0ff;
            padding-left: 10px;
          }
        }
      }
    }
  }
}
</style>
