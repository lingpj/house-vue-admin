<template>
  <div class="parkDetailPage">
    <div class="block">
      <h2>基本信息</h2>
      <ul class="baseInfo">
        <li>名称：{{baseInfo.name}}</li>
        <li>code：{{baseInfo.code}}</li>
        <li>地址：{{baseInfo.address}}</li>
        <li>状态：{{baseInfo.is_deleted == '0' ? '正常' :'关闭'}}</li>
        <li>备注：{{baseInfo.remarker}}</li>
      </ul>
    </div>
    <div class="block">
      <h2>
        车场信息
        <span @click="carDialogVisible = true">{{carInfoList.length >0 ? '编辑' : '+添加'}}</span>
      </h2>
      <ul class="baseInfo">
        <div v-for="item in carInfoList">
          <li>车场名称：{{item.name}}</li>
          <li>车 &nbsp;场ID：{{item.parking_id}}</li>
          <li>车场限额：{{item.amount_cap}}</li>
          <li>车场阈值日：{{item.bill_date}}</li>
        </div>
      </ul>
    </div>
    <div class="block">
      <h2>
        其他信息
        <span @click="otherDialogVisible = true">添加</span>
      </h2>
      <ul class="baseInfo">
        <el-table :data="tableDataArr" border fit highlight-current-row style="width: 100%">
          <template v-for="item in tableHeaderArr">
            <!--操作  -->
            <el-table-column
              v-if="item.prop=='operation'"
              :key="Math.random() +100"
              :align="item.align"
              :prop="item.prop"
              :label="item.label"
            >
              <template scope="scope">
                <el-button size="small" @click="editOtherInfoHandle(scope.row)" v-waves>编辑</el-button>
                <el-button size="small" @click="operationHandle(3,scope.row)" v-waves>删除</el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :align="item.align"
              :key="Math.random() +100"
              :prop="item.prop"
              :label="item.label"
            ></el-table-column>
          </template>
        </el-table>
      </ul>
    </div>
    <!-- 车场编辑dialog -->
    <el-dialog
      :title="carInfoList.length >0 ? '编辑' : '+添加'"
      :visible.sync="carDialogVisible"
      width="30%"
    >
      <el-form ref="form" :model="carForm" label-width="100px">
        <el-form-item label="园区名称">
          <el-input v-model="carForm.name"></el-input>
        </el-form-item>
        <el-form-item label="车  场ID">
          <el-input v-model="carForm.parking_id"></el-input>
        </el-form-item>
        <el-form-item label="车场限额">
          <el-input v-model="carForm.amount_cap"></el-input>
        </el-form-item>
        <el-form-item label="车场阈值日">
          <el-date-picker v-model="carForm.bill_date" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="carDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitCarDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 其他信息dialog -->
    <el-dialog
      :title="otherDialogTitle"
      @close="otherDialogCloseHandle"
      :visible.sync="otherDialogVisible"
      width="30%"
    >
      <el-form ref="form" :model="otherForm" label-width="80px">
        <el-form-item label="公众账号">
          <el-input v-model="otherForm.name"></el-input>
        </el-form-item>
        <el-form-item label="appID">
          <el-input v-model="otherForm.appid"></el-input>
        </el-form-item>
        <el-form-item label="serectID">
          <el-input v-model="otherForm.secret"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="otherDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="operationHandle((otherDialogTitle == '添加' ? '': 2))">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      tableHeaderArr: [
        { prop: "name", align: "center", label: "公众账号", width: 100 },
        { prop: "appid", align: "center", label: "appID", width: 130 },
        { prop: "secret", align: "center", label: "serectID", width: 100 },
        { prop: "operation", align: "center", label: "操作", width: 100 }
      ],
      tableDataArr: [],
      // 车场信息
      carDialogVisible: false,
      carForm: {
        id: "",
        name: "",
        amount_cap: "",
        bill_date: "",
        name: "",
        parking_id: "",
        code: ""
      },
      carInfoList: [],
      // 基本信息:
      baseInfo: {},
      // 其他信息
      otherDialogVisible: false,
      otherForm: {
        appid: "",
        name: "",
        secret: "",
        id: ""
      },
      otherDialogTitle: "添加"
    };
  },

  mounted() {
    this.getBaseInfoById();
    this.getCarInfo();
    this.getOtherInfo();
  },
  methods: {
    // otherDialog 关闭
    otherDialogCloseHandle: function() {
      this.otherDialogTitle = "添加";
    },
    // 其他信息-编辑按钮
    editOtherInfoHandle: function(item) {
      // console.log(item)
      this.otherDialogVisible = true;
      this.otherDialogTitle = "编辑";
      this.otherForm.appid = item.appid;
      this.otherForm.name = item.name;
      this.otherForm.secret = item.secret;
      this.otherForm.id = item.id;
    },
    // 编辑、添加、删除
    operationHandle: function(n, scope) {
      console.log(scope, n);
      // !n新增，  2编辑，  3删除
      var url = "",
        method = "post",
        obj = {};
      if (n == 2) {
        url = this.otherForm.id;
        method = "put";
        obj = {
          id: this.otherForm.id,
          appid: this.otherForm.appid,
          name: this.otherForm.name,
          secret: this.otherForm.secret,
          parkid: this.$route.query.id
        };
      } else if (n == 3) {
        var result = confirm('确定要删除该数据？')
        if(!result) return 
        url = scope.id;
        method = "delete";
      } else {
        obj = {
          appid: this.otherForm.appid,
          name: this.otherForm.name,
          secret: this.otherForm.secret,
          parkid: this.$route.query.id
        };
      }
      this.$fetch({
        url: process.env.park_api + "/system/config/" + url,
        method: method,
        data: obj
      })
        .then(res => {
          this.otherDialogVisible = false;
          if (n == 3) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
          for (const key in this.otherForm) {
            this.otherForm[key] = ''
          }
          this.getOtherInfo();
        })
        .catch(err => {});
    },
    // 编辑、添加车场信息
    onSubmitCarDialog: function() {
      var isEdit = this.carInfoList.length > 0 ? true : false;
      var url = "",
        method = "post";
      if (isEdit) {
        url = this.carInfoList[0].id;
        method = "put";
      }
      var obj = {
        id: this.carForm.id,
        amount_cap: this.carForm.amount_cap,
        bill_date:
          typeof this.carForm.bill_date == "Date"
            ? this.carForm.bill_date.format("yyyy-MM-dd hh:mm:ss")
            : this.carForm.bill_date,
        name: this.carForm.name,
        parking_id: this.carForm.parking_id
      };
      if (!isEdit) {
        delete obj.id;
        obj.code = this.$route.query.code;
        obj.parkid = this.$route.query.id;
      }
      this.$fetch({
        url: process.env.park_api + "/parking-config/" + url,
        method: method,
        data: obj
      })
        .then(res => {
          this.$message({
            type: "success",
            message: "编辑车场成功！"
          });
          this.carDialogVisible = false;
          this.getCarInfo();
        })
        .catch(err => {});
    },
    // 获取其他信息
    getOtherInfo: function() {
      this.$fetch({
        url: process.env.park_api + "/system/config/page",
        method: "get",
        params: {
          parkid: this.$route.query.id
        }
      })
        .then(res => {
          this.tableDataArr = res.data.rows;
        })
        .catch(err => {});
    },

    // 获取车场信息
    getCarInfo: function() {
      this.$fetch({
        url: process.env.park_api + "/parking-config/page",
        method: "get",
        params: {
          parkid: this.$route.query.id
        }
      })
        .then(res => {
          this.carInfoList = res.data.rows;
          if (res.data.rows.length > 0) {
            var obj = res.data.rows[0];
            for (var key in obj) {
              this.carForm[key] = obj[key];
            }
          }
        })
        .catch(err => {});
    },
    // 获取园区基本信息
    getBaseInfoById: function() {
      this.$fetch({
        url: process.env.park_api + "/park/" + this.$route.query.code,
        method: "get",
        params: {
          // code: this.$route.query.code
        }
      })
        .then(res => {
          for (const key in res.data) {
            this.$set(this.baseInfo, key, res.data[key]);
          }
          // this.$message({
          //   type: "success",
          //   message: "编辑成功！"
          // });
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang='scss' scoped>
.parkDetailPage {
  border: 20px solid #eee;
  // border-bottom: 200px solid #eee;
  padding: 20px;
  background-color: #fff;
  .block {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    position: relative;
  }
  h2 {
    font-size: 16px;
    margin: 0;
    margin-bottom: 10px;
    span {
      margin-left: 20px;
      color: lightskyblue;
      border-radius: 5px;
      border: 1px solid lightgray;
      background-color: #fff;
      padding: 5px 8px;
      text-align: center;
      font-size: 12px;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }
  }
  ul {
    margin: 0;
    padding: 0;
    margin-left: 20px;
    overflow: hidden;
    width: 100%;
    li {
      margin: 0;
      width: 23%;
      display: inline-block;
      font-size: 14px;
      margin-top: 20px;
    }
  }
}
</style>
