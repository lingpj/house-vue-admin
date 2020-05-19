<template>
  <div class="baseInfo">
    <el-form ref="form" :rules="rules" :inline="true" :model="form" label-width="120px">
      <!-- <div class="itemBox">
        <p class="title">项目版本信息</p>
        <div>
          <el-form-item label="版本号：" prop="argsVersion">
            <el-input v-model="form.argsVersion"></el-input>
          </el-form-item>
        </div>
      </div> -->
      <div class="itemBox">
        <p class="title">基本信息</p>
        <div>
          <el-form-item label="项目名称：" prop="projectName">
            <el-input v-model="form.projectName"></el-input>
          </el-form-item>
          <el-form-item label="开发商：" prop="developers">
            <el-input v-model="form.developers"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="管理公司：" prop="company">
            <el-input v-model="form.company"></el-input>
          </el-form-item>
          <el-form-item label="招商状态：" prop="statusId">
            <el-select v-model="form.statusId" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.statusName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="itemBox">
        <p class="title">详情</p>
        <div>
          <el-form-item label="项目图片：">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="form.files"
              ref="fileUpload"
              accept="image/jpg,image/png"
            >
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
            </el-upload>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="详细地址：" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="占地面积：" prop="area">
            <el-input v-model="form.area"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: ["currentState"],
  data() {
    return {
      form: {
        developers: "",
        projectName: "",
        company: "",
        statusId: "",
        address: "",
        area: "",
        // argsVersion: "",
        files: []
      },
      rules: {
        developers: [
          { required: true, message: "请填写开发商", trigger: "blur" }
        ],
        projectName: [
          { required: true, message: "请填写项目名称", trigger: "blur" }
        ],
        company: [
          { required: true, message: "请填写管理公司", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请填写地址", trigger: "blur" },
        ],
        area: [
          { required: true, message: "请填写占地面积", trigger: "blur" },
        ],
        // argsVersion: [
        //   { required: true, message: "请填写参数版本", trigger: "blur" },
        // ],
      },
      statusOptions: []
    };
  },
  watch: {
    // 检查当前页码，存储数据
    currentState: function(val, oldVal) {
      if (oldVal == 0) {
        // console.log("save");
        this.saveData();
      }
    }
  },
  mounted() {
    this.getStatus();
    console.log(this.$parent)
  },
  methods: {
    // 重置表单
    resetFormData: function() {
      for (var key in this.form) {
        if (Array.isArray(this.form[key])) {
          this.form[key] = [];
        } else {
          this.form[key] = "";
        }
      }
    },
    // 保存当前页面数据
    saveData: function() {
      if(this.$refs.fileUpload.uploadFiles.length <1){
        this.$message.error("至少上传一张图片且大小不能超过 1MB!");
      }
      this.image2base64(this.$refs.fileUpload.uploadFiles)
        .then(result => {
          var data = {
            project: {
              projectName: this.form.projectName,
              developers: this.form.developers,
              company: this.form.company,
              statusId: this.form.statusId,
              statusName: this.statusOptions.filter(
                item => item.id == this.form.statusId
              )[0].statusName,
              address: this.form.address,
              area: this.form.area,
              // argsVersion: this.form.argsVersion
            },
            files: result
          };
          sessionStorage.setItem("baseInfo", JSON.stringify(data));
        })
        .catch(err => {
          console.log(err)
          this.$message.error("图片出错！");
        });
    },
    // 获取下拉选项状态
    getStatus: function() {
      this.$fetch({
        url: process.env.price_system + "/pricingProjectStatus/all",
        method: "get"
      })
        .then(res => {
          this.statusOptions = res;
          this.form.statusId = res[0].id;
          // console.log(this.statusOptions);
        })
        .catch(err => {});
    },
    // img转换base64
    image2base64: function(files) {
      var result = [];
      return new Promise((resolve, reject) => {
        if (files.length < 1) {
          resolve([]);
        }
        var file = files.forEach(file => {
          var reader = new FileReader();
          reader.readAsDataURL(file.raw);
          // 判断文件大小
          if (file.raw.size / 1024 / 1024 > 1) {
            reject();
          }
          reader.onload = e => {
            let base64Str = reader.result.split(",")[1];
            result.push(e.target.result);
            if (files.length == result.length) {
              resolve(result);
            }
          };
        });
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.baseInfo {
  .itemBox {
    border: 1px solid lightgray;
    margin-top: 20px;
    border-radius: 10px;
    .title {
      margin: 0;
      margin-bottom: 20px;
      color: #444;
      background-color: #eee;
      padding: 10px;
    }
  }
}
</style>
