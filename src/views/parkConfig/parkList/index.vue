<template>
  <div class="parkListPage">
    <p class="addBtn" @click="addHandle">+新增园区</p>
    <ul class="parkList">
      <li v-for="item in parkList">
        <img src="../../../assets/img/logo.jpg" alt>
        <div class="info">
          <p>{{item.name}}</p>
          <address class="desc">{{item.address}}</address>
          <address>{{item.remarker}}</address>
        </div>
        <div class="utils">
          <el-button size="small" @click="editHandle(item)">编辑</el-button>
          <el-button size="small" @click="lookDetailHandle(item)">查看详情</el-button>
        </div>
      </li>
    </ul>
    <!-- 编辑dialog -->
    <el-dialog :title="dialogTitle" @close="otherDialogCloseHandle" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="园区名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="园区地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.is_deleted"></el-switch>
        </el-form-item>
        <el-form-item label="园区描述">
          <el-input type="textarea" v-model="form.remarker"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
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
      parkList: [],
      dialogVisible: false,
      dialogTitle: "编辑",
      form: {
        id: "",
        code: "",
        name: "",
        address: "",
        is_deleted: false,
        remarker: ""
      }
    };
  },

  mounted() {
    this.getParkList();
  },

  methods: {
    // Dialog 关闭
    otherDialogCloseHandle: function() {
      this.dialogTitle = "编辑";
      for (const key in this.form) {
        this.form[key] = "";
      }
    },
    // 新增园区
    addHandle: function() {
      this.dialogVisible = true;
      this.dialogTitle = "添加";
    },
    //   提交
    onSubmit: function() {
      var method = "put",url = this.form.id,
        obj = {
          id: this.form.id,
          code: this.form.code,
          name: this.form.name,
          address: this.form.address,
          is_deleted: this.form.is_deleted ? "0" : "1",
          remarker: this.form.remarker,
          token: this.$store.getters.token
        }
      if (this.dialogTitle == "添加") {
        (method = "post"), delete obj.id;
        obj.code = new Date().getTime();
        url = "";
      }
      this.$fetch({
        url: process.env.park_api + "/park/" + url,
        method: method,
        data: obj
      })
        .then(res => {
          this.$message({
            type: "success",
            message: this.dialogTitle+"成功！"
          });
          this.dialogVisible = false;
          this.getParkList();
        })
        .catch(err => {});
    },
    //   查看详情
    lookDetailHandle: function(item) {
      this.$router.push({
        path: "/parkConfig/parkDetail",
        query: { code: item.code, id: item.id }
      });
    },
    // 编辑
    editHandle: function(item) {
      this.dialogVisible = true;
      for (const key in this.form) {
        this.form[key] = item[key];
      }
      this.form.is_deleted = parseInt(item.is_deleted) == 0 ? true : false;
    },
    getParkList: function() {
      this.$fetch({
        url: process.env.park_api + "/park/all",
        method: "get",
        data: {
          token: this.$store.getters.token
        }
      })
        .then(res => {
          this.parkList = res;
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang='scss' scoped>
.parkListPage {
  border: 20px solid #eee;
  background-color: #fff;
  // border-bottom: 200px solid #eee;
  p.addBtn{
    text-align: center;
    border: 1px solid lightgray;
    height: 40px;
    line-height: 40px;
    margin: 20px 20px 20px 20px;
    border-radius: 5px;
    cursor: pointer;
    color: #777;
  }
  .parkList {
    margin: 0;
    padding: 0;
    li {
      border-bottom: 1px solid #eee;
      overflow: hidden;
      padding: 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      img {
        width: 150px;
        border: 1px solid #eee;
      }
      .info {
        margin-left: 20px;
        p {
          margin-top: 0px;
          margin-bottom: 0px;
        }
        .desc {
          margin: 10px 0;
        }
        address {
          font-size: 14px;
          font-style: normal;
          color: #666;
        }
      }
      .utils {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(-20px, -50%);
      }
    }
  }
}
</style>
