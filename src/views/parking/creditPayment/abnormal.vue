<template>
  <div class='container'>
    <div class="searchBox">
      <span>车牌：</span>
      <el-input v-model="plateNo" placeholder="请输入车牌或电话"></el-input>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;出场日期：</span>
      <el-date-picker v-model="createTime" type="date" placeholder="选择日期"></el-date-picker>
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
          <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
          </el-table-column>
        </template>
      </el-table>
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
      // 主表格
      plateNo: '',
      createTime:'',
      tableHeaderArr: [
        { prop: 'id', align: 'center', label: '编号', width: 100 },
        { prop: 'plateNo', align: 'center', label: '车牌号', width: 100 },
        { prop: 'ownedPark', align: 'center', label: '所属园区', width: 100 },
        { prop: 'parkingProperty', align: 'center', label: '停车属性', width: 100 },
        { prop: 'createTime', align: 'center', label: '放行时间', width: 100 },
        { prop: 'releaseR', align: 'center', label: '放行人', width: 100 },
        { prop: 'reason', align: 'center', label: '放行原因', width: 100 },
      ],
      tableDataArr: [],
      listQuery: {
        page: 1,
        limit: 20,
      },
      total: 0,
      
    }
  },

  mounted() {
    this.getTableData()
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
        url: process.env.park_api + '/abnormalRecord/page',
        method: 'get',
        params: {
          plateNo: this.plateNo,
          createTime : this.createTime == '' ? '' : this.createTime.format('yyyy-MM-dd'),
          page: this.listQuery.page,
          limit: this.listQuery.limit,
        }
      }).then((res) => {
        this.$myLoading.hide()
        this.tableDataArr = res.data.rows
        this.total = res.data.total
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
