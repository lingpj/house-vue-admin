<template>
  <div class="wrap-box">
    <!--搜索表单  -->
    <el-form class="" id="form" :model="searchForm" :rules="searchFormRules" label-width="150px" ref="searchForm">
      <el-row>
        <el-col :span="6">
          <el-form-item label-width="100px" label="关键词:" prop="key_word">
            <el-input v-model="searchForm.key_word" placeholder="请输入企业名称、房号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label-width="100px" label="状态:" prop="bill_status">
            <el-select v-model="searchForm.bill_status" placeholder="请选择">
              <el-option v-for="item in searchForm.bill_status_options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-button style="margin-left:20px;" type="primary" @click="search('searchForm')">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="border:20px solid #eee;border-top:none;border-bottom:300px solid #eee;;padding:10px;overflow:hidden">
      <div style="float:right;margin-bottom:10px;">
        <el-button type="primary" @click="addOrImportHandle(1)" v-waves>新增企业</el-button>
        <el-button type="primary" @click="addOrImportHandle(2)" v-waves>批量导入企业</el-button>
      </div>
      <el-table id="table" :data="tableDataArr" border fit highlight-current-row style="width: 100%">
        <template v-for="item in tableHeaderArr">
          <!--操作  -->
          <el-table-column v-if="item.prop=='operation'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label" :width="item.width">
            <template scope="scope">
              <el-button type="info" size="small" @click="operationHandle(1,scope)" v-waves>编辑</el-button>
              <el-button type="warning" size="small" @click="operationHandle(2,scope)" v-waves>详情</el-button>
            </template>
          </el-table-column>
          <!--状态  -->
          <el-table-column v-else-if="item.prop =='status'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
            <template scope="scope">
              <span :class="{  green : scope.row.status == 1,red:scope.row.status == 2 }">● </span>{{scope.row.status}}
            </template>
          </el-table-column>
          <!--企业名称  -->
          <el-table-column v-else-if="item.prop =='name'" :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
            <template scope="scope">
              <el-button size="small" @click="companyDetailHandle(scope)">{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
          </el-table-column>
        </template>
      </el-table>
      <div class="pagination-container" style="float:right ">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
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
      },
      // 主表格
      mainTableRadio: '全部',
      tableHeaderArr: [
        { prop: 'name', align: 'center', label: '企业编号', width: 100 },
        { prop: 'age', align: 'center', label: '企业名称', width: 100 },
        { prop: 'height', align: 'center', label: '楼座', width: 100 },
        { prop: 'weight', align: 'center', label: '房号', width: 100 },
        { prop: 'tel', align: 'center', label: '联系人', width: 100 },
        { prop: 'voucher', align: 'center', label: '联系电话', width: 100 },
        { prop: 'remark', align: 'center', label: '电子邮箱', width: 100 },
        { prop: 'status', align: 'center', label: '状态', width: 100, },
        { prop: 'operation', align: 'center', label: '操作', width: 200, },
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
      // search表单验证
      searchFormRules: {
        key_word: [
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
    }
  },
  mounted() {

  },
  methods: {
    // 搜索
    search: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

        } else {
          return false;
        }
      });
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
    // 添加/导入
    addOrImportHandle: function(n) {
      alert(n)
    },
    // 编辑/详情
    operationHandle: function(n, scope) {
      console.log(n, scope)
    },
    // 公司详情
    companyDetailHandle: function(scope) {
      console.log(scope)
    }
  },
}
</script>

<style lang="scss" scoped>
.wrap-box {
  // padding: 20px;
}

.tx-c {
  text-align: center;
}

.wrap-box {
  .single-bill-introduction-wrap {
    border: 1px solid #dfe6ec; // padding: 20px;
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

  #form {
    // background: #eee;
    border: 20px solid #eee; // margin: 20px 0;
    padding-top: 20px;
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
    margin-top: 20px;
    span {
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
    ul {
      width: 60%;
      float: left;
      list-style: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
      white-space: nowrap;
      li {
        display: inline-block;
        width: 100px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        background-color: #eee;
        margin-left: 20px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-size: 14px;
      }
    }
  }
  .month-detail-wrap {

    border: 1px solid #eee; // border-top: none;
    padding: 10px 0;
    margin-bottom: 20px;
    overflow: hidden;
    aside {
      float: left;
      display: inline-block;
      position: relative;
      top: 10px;
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
      margin-top: 5px;
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
      width: 80%;
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
      }
    }
    .left-arrow {}
    .right-arrow {
      margin-left: 20px;
      margin-right: 20px;
    }
  }
  .anchor {
    cursor: pointer;
    user-select: none;
    color: blue;
  }
  #table {
    margin-top: 10px;
  }
}

// .wrap-box /deep/ .el-form-item__label{
//   font-weight: normal;
//   font-size: 16px;
// }
</style>

</style>