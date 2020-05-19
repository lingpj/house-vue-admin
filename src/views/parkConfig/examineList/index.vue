<template>
  <div class="container">
    <el-form ref="form" id="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="公司:" prop="companyname">
           <el-input v-model="form.companyname" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="姓名:" prop="companyname">
           <el-input v-model="form.v_name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="园区:" prop="park">
           <el-select  v-model="form.park" clearable>
             <el-option label="华新园" value="华新园"></el-option>
             <el-option label="虹桥园南区" value="虹桥园南区"></el-option>
             <el-option label="虹桥园北区" value="虹桥园北区"></el-option>
             <el-option label="三银基金产业园" value="三银基金产业园"></el-option>
             <el-option label="虹桥园西区" value="虹桥园西区"></el-option>
           </el-select>
          </el-form-item>
        </el-col> 
        <el-col :span="6">
          <el-form-item label="状态:" prop="park">
            <el-select v-model="form.status" clearable="">
              <el-option label="未审批" value="0">未审批</el-option>
              <el-option label="已审批" value="1">已审批</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
             <el-col :span="6">
                  <el-form-item label="楼座:" prop="companyname">
                  <el-input v-model="form.roominfo" clearable></el-input>
                  </el-form-item>
             </el-col>
              <el-col :span="6">
                  <el-form-item label="户籍:" prop="companyname">
                  <el-input v-model="form.househol_register" clearable></el-input>
                  </el-form-item>
             </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" :offset="1">
             <el-button type="primary" @click="submit"  >查询</el-button>
             </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table :data="tableDataArr" border fit highlight-current-row>
        <el-table-column width="100" label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="v_type" label="入园情况登记" align="center">
          <template scope="scope">
            {{scope.row.v_type == 1 ? '园区企业员工':'园区访客'}}
          </template>  
        </el-table-column>
        <el-table-column prop="v_name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="park" label="到访园区" align="center"></el-table-column>
        <el-table-column prop="companyname" label="公司名称" align="center"></el-table-column>
        <el-table-column prop="roominfo"  label="楼栋以及房号" align="center"></el-table-column>
        <el-table-column prop="sex"  label="性别" align="center">
          <template scope="scope"> {{scope.row.sex == 1 ? '男':'女'}}</template>
        </el-table-column>
         <el-table-column prop="createtime"   label="提交时间" align="center">
           <template scope="scope"> {{new Date(scope.row.createtime).format('yyyy-MM-dd hh:mm:ss')}}</template>
         </el-table-column>
        <!-- <el-table-column prop="arrive_time"  label="到达上海日期" align="center"></el-table-column>
        <el-table-column prop="pass_by"  label="途径省份" align="center"></el-table-column>
        <el-table-column prop="card_id"  label="身份证号码" align="center"></el-table-column>
        <el-table-column prop="address"  label="现居住地址" align="center"></el-table-column>
        <el-table-column prop="househol_register"  label="户籍地" align="center"></el-table-column> -->
        <!-- <el-table-column prop="mobile"  label="手机号码" align="center"></el-table-column> -->
        <!-- <el-table-column prop="vehicle"  label="来沪交通工具" align="center"></el-table-column>
        <el-table-column prop="remarker"  label="具体车次" align="center"></el-table-column>
        <el-table-column prop="visit_area"  label="近15天内到访地点" align="center"></el-table-column>
        <el-table-column prop="is_quarantine"  label="是否已完成隔离" align="center"></el-table-column>
        <el-table-column prop="quarantine_type"  label="完成隔离方式" align="center"></el-table-column> -->
        <!-- <el-table-column prop="quarantine_url" width="100px" label="结束隔离证明" align="center">
          <template scope="scope">
            <img class="img" @click="scaleImgHandle(scope.row.quarantine_url)" :src="scope.row.quarantine_url" alt="">
          </template>  
        </el-table-column>
        <el-table-column prop="card_url"  label="身份证照片" align="center">
          <template scope="scope">
            <img class="img" @click="scaleImgHandle(scope.row.card_url)" :src="scope.row.card_url" alt="">
          </template>  
        </el-table-column>
        <el-table-column prop="people_url"  label="个人头像" align="center">
          <template scope="scope">
            <img class="img" @click="scaleImgHandle(scope.row.people_url)" :src="scope.row.people_url" alt="">
          </template>  
        </el-table-column> -->
        <el-table-column  label="操作" width="280px" align="center">
          <template scope="scope">
            <el-button size="small" type="info" @click="lookHandle(scope.row)">查看</el-button>
            <el-button size="small" type="primary" v-if="scope.row.status != 1" @click="examineHandle(scope.row)">审批</el-button>
            <el-button size="small" type="danger" @click="deleteHandle(scope.row,1)">删除</el-button>
            <el-button size="small" type="warning" @click="deleteHandle(scope.row,2)">回退</el-button>
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
    
<el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="80%">
  <p>提交时间：{{new Date(currentData.createtime).format('yyyy-MM-dd hh:mm:ss')}}</p>
  <p>入园情况登记：{{currentData.v_type == 1 ? '园区企业员工':'园区访客'}}</p>
  <p>姓名：{{currentData.v_name}}</p>
  <p>到访园区：{{currentData.park}}</p>
  <p>公司名称：{{currentData.companyname}}</p>
  <p>楼栋以及房号：{{currentData.roominfo}}</p>
  <p>性别：{{currentData.sex == 1 ? '男':'女'}}</p>
  <p>到达上海日期：{{new Date(currentData.arrive_time).format('yyyy-MM-dd')}}</p>
  <p>途径省份：{{currentData.pass_by == 1 ? '湖北或途径湖北': (currentData.pass_by == 2 ?'其他省市': (currentData.pass_by == 3 ?'疫情期间未离开过上海':'境外') )}}</p>
  <p>身份证号码：{{currentData.card_id}}</p>
  <p>现居住地址：{{currentData.address}}</p>
  <p>户籍地：{{currentData.househol_register}}</p>
  <p>手机号码：{{currentData.mobile}}</p>
  <p>来沪交通工具：{{currentData.vehicle == 1 ? '飞机' : (currentData.vehicle == 2 ? '火车': currentData.vehicle == 3 ? '汽车':'自驾') }}</p>
  <p>具体车次：{{currentData.remarker}}</p>
  <p>近15天内到访地点：{{currentData.visit_area}}</p>
  <p>是否已完成隔离：{{currentData.is_quarantine == 1 ? '是' : (currentData.is_quarantine == 2 ? '否':'疫情期间未离开过上海')}}</p>
  <p>完成隔离方式：{{currentData.quarantine_type == 1 ?'居家隔离':(currentData.quarantine_type == 2 ?'单位隔离':'医院隔离')}}</p>
  <div class="imgBox">
  <div><p>结束隔离证明：</p>{{currentData.quarantine_url ?'':'无'}}<img @click="scalePhotoHandle(currentData.quarantine_url)" style="width:100%;vertical-align:text-top;cursor:pointer" :src="currentData.quarantine_url" class="" alt=""></div>
  <div><p>身份证照片：</p><img @click="scalePhotoHandle(currentData.card_url)" style="width:100%;vertical-align:text-top;cursor:pointer"  :src="currentData.card_url" class="" alt=""> </div>
  <div> <p>个人头像照：</p> <img @click="scalePhotoHandle(currentData.people_url)" style="width:100%;vertical-align:text-top;cursor:pointer"  :src="currentData.people_url" class="" alt=""> </div>
  </div>
  <img :src="imgSrc" alt="" style="width:100%">
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="提示"
  :visible.sync="photoDialogVisible"
  width="80%">
  <img style="width:100%" :src="scaleImgSrc" alt="">
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      scaleImgSrc:'',
      photoDialogVisible:false,
      dialogVisible:false,
      imgSrc:'',
      form: {
        companyname: "",
        status: "",
        park:'',
        v_name:'',
        househol_register:'',
        roominfo:'',
      },
      tableDataArr: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      parkList: [],
      uploadUrl: process.env.dropdbandescape + "/budget/budgetdetails/upload",
      currentData:{}
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
    console.log(this.$store.state.user.name)
    this.getTableData();
    this.$myLoading.show();
  },

  methods: {
    scalePhotoHandle(url){
      this.scaleImgSrc = url
      this.photoDialogVisible = true
    },
    deleteHandle(data,type){
      this.$confirm(`确定要${type == 1 ?'删除':'回退'}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$fetch({
            url: process.env.dropdbandescape + "/codiv/employee/auth/",
            method: "post",
            data: {
              code:data.code,
              shenpi:this.$store.state.user.name,
              type:type
            }
          }).then(res => {
            if(res.status == 200 || res.code == 200){
              this.$message.success('操作成功！')
            }
            this.getTableData()
          });
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
      
    },
    lookHandle(data){
      this.dialogVisible = true
      this.currentData = data
    },
    examineHandle(data){
         this.$fetch({
        url: process.env.dropdbandescape + "/codiv/employee/"+data.code,
        method: "put",
        data: {
          code:data.code,
          status:1,
          shenpi:this.$store.state.user.name
        }
      }).then(res => {
         if(res.status == 200 || res.code == 200){
           this.$message.success('操作成功！')
         }
         this.getTableData()
      });
    },  
    error(){
      this.$myLoading.hide();
    },
    beforeUpload(){
      this.$myLoading.show();
      return true
    },
    formatDate(val) {
      console.log(val)
      return new Date(val.createtime).format("yyyy-MM-dd hh:mm:ss");
    },
    previewHandle(data) {
      window.open(data.file_path);
    },
    //   上传成功
    uploadSuccess: function(response, file, fileList) {
      this.$myLoading.hide();
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
    scaleImgHandle(url){
      this.imgSrc = url
      this.dialogVisible = true
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
      this.$myLoading.show();

      this.$fetch({
        url: process.env.dropdbandescape + "/codiv/employee/infolist",
        method: "post",
        data: {
          ...this.form,
          limit: this.listQuery.limit,
          page: this.listQuery.page,
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
  .imgBox{
    display: flex;
    div{
      flex:1
    }
    img{
      border: 2px solid #fff;
    }
  }
  .img{
    width: 100%;
    &:hover{
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
