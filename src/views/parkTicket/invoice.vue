<template>
  <div class="container">
    <el-form ref="form" id="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="公司选择:" prop="park">
            <el-select style="width:300px" v-model="form.park" clearable placeholder="请选择">
              <el-option v-for="item in parkList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="uploadUrl"
            accept=".xlsx"
            :data="{company:this.form.park,username:this.$store.state.user.name}"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button type="primary" style="margin-left:100px">上传文件</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" style="padding-bottom:20px">
          <el-button type="primary" @click="submit" style="margin-left:100px">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table :data="tableDataArr" border fit highlight-current-row>
        <el-table-column prop="batch" label="批次" align="center"></el-table-column>
        <el-table-column prop="company" label="公司" align="center"></el-table-column>
        <el-table-column prop="url" label="下载" align="center">
          <template scope="scope">
            <!-- <el-button size="small" > -->
            <span
              style="color:blue;cursor:pointer"
              @click="previewHandle(scope.row)"
            >{{scope.row.url}}</span>
            <!-- </el-button> -->
          </template>
        </el-table-column>
        <el-table-column prop="createtime" :formatter="formatDate" label="时间" align="center"></el-table-column>
      </el-table>
    </div>
    <div style=";margin-top:10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      form: {
        park: "",
        status: "",
        name: "",
        time: ["", ""]
      },
      tableDataArr: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      parkList: [],
      uploadUrl: process.env.dropdbandescape + "/invoice/paperinvoice/upload"
    };
  },
  filters: {
    formatPrice(val) {
      return (val / 100).toFixed(2);
    },
    formatDate(val) {
      console.log(val)
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
    this.getTableData();
    this.getParkList();
  },

  methods: {
    beforeUpload(){
      if(!this.form.park){
        this.$message.error('请先选择公司！')
        return false
      }
      return true
    },
    formatDate(val) {
      console.log(val)
      return new Date(val.createtime).format("yyyy-MM-dd hh:mm:ss");
    },
    previewHandle(data) {
      window.open(data.url);
    },
    //   上传成功
    uploadSuccess: function(response, file, fileList) {
      if (response.status == 200) {
        this.$message.success("导入成功！");
      } else {
        this.$message.error("导入失败！");
      }
    },
    fmtDate(val) {
      if (val.status == "2") return "-";
      return new Date(val.spike_time).format("yyyy-MM-dd hh:ss:mm");
    },

    // 获取园区列表
    getParkList() {
      this.$fetch({
        url: process.env.dropdbandescape + "/invoice/paperinvoice/company",
        method: "post",
        data: {
          limit: 10000000,
          page: 1
        }
      }).then(res => {
        this.parkList = res.data;
      });
    },

    // 搜索
    submit: function() {
      this.listQuery.page = 1;
      this.listQuery.limit = 10;
      this.getTableData();
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
    // 重置表单
    resetForm: function() {
      for (var k in this.form) {
        this.form[k] = "";
      }
    },

    // 表格数据
    getTableData: function() {
      console.log(this.$store);
      this.$myLoading.show();

      this.$fetch({
        url: process.env.dropdbandescape + "/invoice/uploadRecord/pageList",
        method: "post",
        data: {
          limit: this.listQuery.limit,
          page: this.listQuery.page,
          username: this.$store.state.user.name,
          company: this.form.park
        }
      }).then(res => {
        this.$myLoading.hide();
        if (res) {
          this.tableDataArr = res.list || [];
          this.total = res.totalCount;
        } else {
          this.tableDataArr = [];
          this.total = 1;
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.container {
  border: 20px solid #eee;
  background-color: #fff;
  // border-bottom: 500px solid #eee; // #qrcode {
  //    display: none;
  // }
  .productTable {
    overflow: hidden;
    table {
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
  .QRCodeDialogVisible {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(111, 111, 111, 0.5);
    z-index: 999;
    .box {
      display: flex;
      color: #111;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      background-color: #eee;
      padding: 20px;
      border-radius: 20px;
      box-shadow: 0 0 15px #888;
      a {
        margin-top: 20px;
      }
    }
  }
  #form {
    padding-top: 15px;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
  }
  .createTime /deep/ .el-input__inner {
    text-align: center;
  }
  & /deep/ .el-upload-list {
    display: none;
  }
}
</style>
