<template>
  <div class="container">
    <div class="box">
      <h1>买家信息</h1>
      <p>
        昵称：{{parkTicketDetail.name}}
        &#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;
        联系电话：{{parkTicketDetail.mobile}}
        &#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;
        招商部门：{{parkTicketDetail.deptname}}
      </p>
    </div>
    <div class="box">
      <h1>订单信息</h1>
      <p>
        订单编号：{{parkTicketDetail.oid}}
        &#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;
        创建时间：{{parkTicketDetail.createtime | formatDate}}
        &#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;&#x3000;
      </p>
    </div>
    <table>
      <tr>
        <td>宝贝</td>
        <td>数量</td>
        <td>买家信息</td>
        <td>所属公司</td>
        <td>交易状态</td>
        <td>实收款</td>
      </tr>
      <template v-for="item in list">
        <tr>
          <td colspan="7" style="text-align:left">
            订单号：{{item.oid}}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            创建时间：{{item.createtime | formatDate}}
          </td>
        </tr>
        <tr>
          <td>
            <img src="../../assets/401_images/ticket.jpg" alt>
          </td>
          <td>1</td>
          <td>
            {{parkTicketDetail.name}}
            <br>
            {{parkTicketDetail.mobile}}
          </td>
          <td>{{parkTicketDetail.deptname}}</td>
          <td>
            {{parkTicketDetail.status | formatStatus}}
            <br>
            <!-- <el-button type="info" size="small" @click="detailHandle(item)">详情</el-button> -->
          </td>
          <td>¥{{item.price | formatPrice}}元</td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      parkTicketDetail: {},
      list: []
    };
  },
  filters: {
    formatPrice(val) {
      return (val / 100).toFixed(2);
    },
    formatDate(val) {
      return new Date(val).format("yyyy-MM-dd hh:mm:ss");
    },
    fmtDate(val) {
      return parseTime(new Date(val));
    },
    formatStatus(val) {
      var arr = ["支付中", "未使用", "已关闭", "已使用"];
      return arr[val * 1 - 1];
    }
  },
  mounted() {
    this.parkTicketDetail = JSON.parse(
      sessionStorage.getItem("parkTicketDetail")
    );
    this.list = this.parkTicketDetail.list;
    console.log(this.parkTicketDetail);
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
.container {
  .box {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 5px lightgray;
    padding: 10px;
    margin: 10px;
    h1 {
      font-size: 20px;
    }
  }
  table {
    background: #fff;
            padding:10px;
            margin:10px;
            border-radius: 10px;
            overflow: hidden;
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    text-align: center;
  }
  img {
    width: 200px;
  }
  td {
    border: 2px solid lightgray;
    padding: 10px;
  }
}
</style>
