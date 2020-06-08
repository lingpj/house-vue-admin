<template>
  <div class="container">
    <el-form ref="form" id="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="公司:" prop="company">
            <el-input v-model="form.company" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="姓名:" prop="username">
            <el-input v-model="form.username" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="账号:" prop="name">
            <el-input v-model="form.name" clearable ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电话:" prop="mobile">
            <el-input v-model="form.mobile" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="2">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="primary" @click="dialogVisible = true;isEdit = false">新增</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table :data="tableDataArr" border fit highlight-current-row>
        <el-table-column width="100" label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="name" label="账号" align="center"></el-table-column>
        <el-table-column prop="company" label="公司" align="center"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template scope="scope">
                {{scope.row.status == 1 ? '正常' : '冻结'}}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" align="center">
            <template scope="scope">
                {{scope.row.createtime | formatDate}}
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template scope="scope">
            <el-button size="small" type="warning" @click="updateHandle(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
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

    <el-dialog title="提示" @close="closeHandle" :visible.sync="dialogVisible" width="80%">
      <el-form ref="form" id="form" :model="addForm" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司:" prop="company">
            <el-input v-model="addForm.company" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话:" prop="mobile">
            <el-input v-model="addForm.mobile" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号:" prop="name">
            <el-input v-model="addForm.name" clearable :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码:" prop="pwd">
            <el-input v-model="addForm.pwd" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="有效性:" prop="status">
            <el-select v-model="addForm.status">
              <el-option value="1" label="正常"></el-option>
              <el-option value="2" label="冻结"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="addForm.username" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addInfo">确 定</el-button>
      </span>
    </el-dialog>
   
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
  
      dialogVisible: false,
     
      form: {
       name:'',
       mobile:'',
       company:'',
       username:'',
      },
      addForm: {
       name:'',
       mobile:'',
       company:'',
       status:'',
       pwd:'',
       username:''
      },
      tableDataArr: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      isEidt:false,
    };
  },
  filters: {
    formatPrice(val) {
      return (val / 100).toFixed(2);
    },
    formatDate(val) {
      console.log(val);
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
    console.log(this.$store.state.user.name);
    this.getTableData();
    this.$myLoading.show();
  },

  methods: {
    closeHandle(){
      this. addForm={
       name:'',
       mobile:'',
       company:'',
       status:'',
       pwd:'',
      }
    },
    updateHandle(data){
        this.dialogVisible = true
        this.isEdit = true
        this.addForm = {...data,pwd:''}
    },
    deleteHandle(data, type) {
      this.$confirm(`确定要${type == 1 ? "删除" : "回退"}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$fetch({
            url: process.env.dropdbandescape + "/codiv/employee/auth/",
            method: "post",
            data: {
              code: data.code,
              shenpi: this.$store.state.user.name,
              type: type
            }
          }).then(res => {
            if (res.status == 200 || res.code == 200) {
              this.$message.success("操作成功！");
            }
            this.getTableData();
          });
        })
        .catch(() => {
         
        });
    },
    
    addInfo(){
        var url = process.env.dropdbandescape + "/codiv/property/user"
        if(this.isEdit){
            url = process.env.dropdbandescape + "/codiv/property/user/"+this.addForm.name
        }
        this.$fetch({
            url: url,
            method: this.isEdit ? 'put' : "post",
            data: {
                ...this.addForm
            }
        }).then(res => {
            if (res.status == 200 || res.code == 200) {
                this.$message.success("操作成功！");
            }
            this.dialogVisible = false
            this.getTableData();
        });
    },
    
    formatDate(val) {
      console.log(val);
      return new Date(val.createtime).format("yyyy-MM-dd hh:mm:ss");
    },
    previewHandle(data) {
      window.open(data.file_path);
    },
    
    fmtDate(val) {
      if (val.status == "2") return "-";
      return new Date(val.spike_time).format("yyyy-MM-dd hh:ss:mm");
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
      this.$myLoading.show();

      this.$fetch({
        url: process.env.dropdbandescape + "/codiv/property/user/pageList",
        method: "post",
        data: {
          ...this.form,
          limit: this.listQuery.limit,
          page: this.listQuery.page
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
  .imgBox {
    display: flex;
    div {
      flex: 1;
    }
    img {
      border: 2px solid #fff;
    }
  }
  .img {
    width: 100%;
    &:hover {
      cursor: pointer;
    }
  }
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
