<template>
  <div class="addProjectDialog">
    <div class="steps">
      <el-steps :active="current+1" align-center simple style="margin-top: 20px">
        <el-step title="项目基本信息"></el-step>
        <el-step title="房源信息"></el-step>
        <el-step title="参数信息"></el-step>
        <el-step title="价格测算"></el-step>
      </el-steps>
      <!-- <div class="step" :class="{  'c-blue':current ==0}">
        <span class="number">①</span> 项目基本信息
        <span class="arrow">→</span>
      </div>
      <div class="step" :class="{  'c-blue':current ==1}">
        <span class="number">②</span> 房源信息
        <span class="arrow">→</span>
      </div>
      <div class="step" :class="{  'c-blue':current ==2}">
        <span class="number">③</span> 参数信息
        <span class="arrow">→</span>
      </div>
      <div class="step"  :class="{  'c-blue':current ==3}">
        <span class="number">④</span> 价格测算
      </div>-->
    </div>
    <!--视图  -->
    <one v-show="current==0" ref="one" @stepError="alertStepError" :currentState="current"></one>
    <two v-show="current==1" :currentState="current"></two>
    <three v-show="current==2" :currentState="current"></three>
    <four v-show="current==3" ref="result" :isStaticShow="false" :currentState="current"></four>
    <div class="btnGroup">
      <el-button v-if="current == 0" @click="cancelHandle">取消</el-button>
      <el-button @click="preventStepHandle " v-if="current !=0">上一步</el-button>
      <el-button type="primary" @click="inputPriceModeVisible = true" v-if="current==0">输入价格</el-button>
      <el-button type="primary" @click="nextStepHandle">{{ current == 3 ? '确定':'下一步' }}</el-button>
    </div>
    <!--输入价格  -->
    <el-dialog :modal="false" title="输入价格" :visible.sync="inputPriceModeVisible" size="small">
      项目均价：
      <el-input style="display:inline-block;width:500px" v-model="revisePrice"></el-input>㎡/天
      <span slot="footer" class="dialog-footer">
        <el-button @click="inputPriceModeVisible = false;isInputPriceMode = false">取消</el-button>
        <el-button type="primary" @click="jump2result ">测算价格</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import one from "../components/baseInfo"; // 基础信息
import two from "../components/houseInfo"; // 房源信息
import three from "../components/paramsInfo"; // 参数信息
import four from "../components/result"; // 价格测算(结果)
export default {
  name: "",
  components: { one, two, three, four },
  data() {
    return {
      viewArr: [one, two, three, four],
      current: 0,
      isInputPriceMode: false,
      inputPriceModeVisible: false,
      // 项目均价
      revisePrice: "",
      stepNoError: true
    };
  },

  mounted() {},
  methods: {
    // 取消
    cancelHandle: function() {
      this.current = 0;
      this.$refs.one.resetFormData();
      sessionStorage.clear();
      this.$emit("closeDialog");
    },
    // 上一步
    preventStepHandle: function() {
      if (!this.isInputPriceMode) {
        this.current -= 1;
      } else {
        this.isInputPriceMode = false;
        this.current = 0;
      }
    },
    // 子步骤中有错误，弹出
    alertStepError: function(err) {
      alert(err);
    },
    // 下一步
    nextStepHandle: function() {
      if (this.current < 3) {
        this.current = (this.current + 1) % 4;
      } else {
        this.createProject();
      }
    },
    // 创建项目
    createProject: function() {
      // 基本信息
      var baseInfo = JSON.parse(sessionStorage.getItem("baseInfo"));
      // 房源
      var houseInfo = sessionStorage.getItem("houseInfo");
      if (houseInfo != "" && houseInfo) {
        baseInfo.houses = JSON.parse(houseInfo);
      }
      // 参数
      var paramsInfo = sessionStorage.getItem("paramsInfo");
      if (paramsInfo != "" && paramsInfo) {
        baseInfo.args = JSON.parse(paramsInfo);
        baseInfo.smallArgs = [];
        baseInfo.args.forEach(item => {
          item.argsVersionSmalls.forEach(o =>{
              o.argsVersion = item.argsVersion
              o.argsCode = item.argsCode
          })
          baseInfo.smallArgs = baseInfo.smallArgs.concat(
            item.argsVersionSmalls
          );
        });
        baseInfo.smallArgs.forEach(item =>{
          delete item.idSmall
          item.argsName = item.argsNameSmall
          delete item.argsNameSmall
        })
      }
      // 周边定价
      baseInfo.rimProject = this.$refs.result
        .getPageData()
        .rimProject.filter(item => {
          if (item) {
            delete item.id;
          }
          return true;
        });
      baseInfo.rimProject = baseInfo.rimProject;
      // 价格
      baseInfo.projectPrice = this.$refs.result.getPageData().projectPrice;
      baseInfo.projectPrice.revisePrice = this.revisePrice;
      // 验证form
      console.log(baseInfo.project);
      for (var key in baseInfo.project) {
        if (baseInfo.project[key].trim && baseInfo.project[key].trim() == "") {
          this.$message.error("项目基本信息中*为必填信息");
          return;
        }
      }
      if (baseInfo.files.length < 1) {
        this.$message.error("至少上传一张图片且大小不能超过1MB");
        return;
      }

      this.$fetch({
        url: process.env.price_system + "/pricingProject/addPricingProject",
        method: "post",
        data: baseInfo
      })
        .then(res => {
          this.cancelHandle();
          if (res.code == 200) {
            this.$message.success("添加成功！");
          } else {
            this.$message.error("添加失败！");
          }
        })
        .catch(err => {
          this.$message.error("添加失败！");
        });
    },
    // 输入价格直接跳到结果页
    jump2result: function() {
      this.isInputPriceMode = true;
      this.inputPriceModeVisible = false;
      this.current = 3;
    }
  }
};
</script>

<style lang='scss' scoped>
.c-blue {
  color: #20a0ff !important;
}

.addProjectDialog {
  .btnGroup {
    width: 100%;
    display: flex;
    margin-top: 50px;
    justify-content: center;
    align-items: center;
    & /deep/ .el-button {
      margin-left: 30px;
    }
  }
}
</style>
