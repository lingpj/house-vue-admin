<template>
  <div class="container">
    <el-form ref="form" id="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="所属园区:" prop="name">
            <el-select v-model="form.name"  @change="parkChangeHandle"  style="width:200px" placeholder="请选择">
              <el-option
                v-for="item in parkList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态:">
            <el-select style="width:200px" v-model="form.statusId" placeholder="请选择活动区域">
              <el-option label="全部" value></el-option>
              <el-option label="已租" value="1"></el-option>
              <el-option label="已付意向金" value="2"></el-option>
              <el-option label="空置" value="3"></el-option>
              <el-option label="销控" value="4"></el-option>
              <el-option label="已公示" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
           <el-form-item label="楼栋:">
            <el-select style="width:200px" v-model="form.build" placeholder="请选择">
          <el-option v-for="item in buildArr" :key="item.buildname" :label="item.buildname" :value="item.buildname"></el-option>
        </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="楼层:">
            <el-input v-model="form.floor" style="width:200px"  placeholder="请输入楼层"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="房号:">
            <el-input v-model="form.room" style="width:200px"  placeholder="请输入房号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
        <el-button type="primary" @click="submit" style="margin-left:100px">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
          </el-col>
      </el-row>
    </el-form>

    <div class="productTable">
      <el-button type="primary" class="addProductBtn" @click="addProductHandle">添加房源</el-button>
      <el-table
        id="table"
        :data="tableDataArr"
        border
        highlight-current-row
    
      >
        <el-table-column prop="park" label="所属园区" align="center"></el-table-column>
        <el-table-column prop="build" label="楼栋" align="center"></el-table-column>
        <el-table-column prop="floor" label="楼层" align="center"></el-table-column>
        <el-table-column prop="room" label="房号" align="center"></el-table-column>
        <el-table-column prop="direction" label="朝向" align="center"></el-table-column>
        <el-table-column prop="real_area" label="实际面积(m²)" align="center"></el-table-column>
        <el-table-column prop="built_up_area" label="建筑面积(m²)" align="center"></el-table-column>
        <el-table-column prop="rent" label="租金(元/m²/天)" align="center"></el-table-column>
        <el-table-column prop="net_price" label="净价(元/m²/天)" align="center"></el-table-column>
        <el-table-column prop="enterprise" label="企业" align="center"></el-table-column>
        <el-table-column prop="status" :formatter="fmtStatus" label="状态" align="center"></el-table-column>
        <el-table-column prop="rent_date" width="200" :formatter="fmtDate"  label="租金缴纳日" align="center"></el-table-column>
        <el-table-column prop="merchants" label="招商人员" align="center"></el-table-column>
        <el-table-column prop="operation" fixed="right" label="操作" align="center" :width="150">
          <template scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="operationHandle(scope.row)"
              v-waves
            >编辑</el-button>
            <el-button
              size="small"
              type="primary"
              @click="deleteHandle(scope.row)"
              v-waves
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="float:right;margin-top:10px">
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
  </div>
</template>

<script>
export default {
  name: "",

  data() {
    return {
      buildArr:[],
      form: {
        name: "",
        time: "",
        endTime: "",
        statusId: "",
        room:'',
        floor:'',
        build:'',
      },
      parkList:[],
      statusArr:['已租','已付意向金','空置','销控','已公示'],
      tableDataArr: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      QRCodeDialogVisible: false
    };
  },
  mounted() {
    this.getParkList()
    this.getTableData();
  },

  methods: {
    parkChangeHandle(){
      if(this.form.name == ''){
        this.buildArr = []
        return 
      }
      this.$fetch({
        url: process.env.dropdbandescape + "/room/parkinfo/pageList",
        method: "post",
        data:{
          parkname:this.form.name,
          page:1,
          limit:100000000,
        }
      }).then(res => {
        this.buildArr = res.list || []
      });
    },
    fmtDate(val){
      console.log(val.rent_date)
      if(!val.rent_date || val.rent_date=='') return ''
      return new Date(val.rent_date).format('yyyy-MM-dd')
    },
    // 获取园区列表
    getParkList(){
      this.$fetch({
        url: process.env.dropdbandescape + "/room/parkinfo/name/list",
        method: "get",
        params: {}
      }).then(res => {
        this.parkList=  res.data.rows
      });
    },
    // 删除房源
    deleteHandle(data){
       this.$confirm('确认删除此房源？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$fetch({
              url:  process.env.dropdbandescape + `/room/room/delete/${data.id}`,
              method: "get",
            }).then(res => {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              this.getTableData();
            });
        }).catch(() => {
           
        });
    },
    fmtStatus(val){
      return this.statusArr[parseInt(val.status) -1]
    },
   
    // 操作
    operationHandle: function(data) {
      var str = JSON.stringify(data)
      this.$router.push({ path: "/housingResource/addHousing", query: {data:str} });
    },
    // 预览
    previewHandle(data) {
      console.log(data);
    },

    // 添加房源
    addProductHandle: function() {
      this.$router.push("/housingResource/addHousing");
    },
    // 搜索
    submit: function() {
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
        url: process.env.dropdbandescape + "/room/room/pageList",
        method: "post",
        data: {
          limit: this.listQuery.limit,
          page: this.listQuery.page,
          status:this.form.statusId,
          park:this.form.name,
          floor:this.form.floor,
          room:this.form.room,
          build:this.form.build,
        }
      }).then(res => {
        this.$myLoading.hide();
        if (res.list) {
          this.tableDataArr = res.list;
          this.total = res.totalCount;
        }else{
          this.tableDataArr = []
          this.total = 1
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
  .productTable {
    padding: 10px;
    overflow: hidden;
    .addProductBtn {
      margin-bottom: 20px;
    }
  }
}
</style>
