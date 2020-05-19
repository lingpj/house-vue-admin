<template>
  <div class="priceCalcPage">
    <p class="tips">提示：请填写完整的项目内容，以确保算出精确的定价</p>
    <div class="module baseInfo">
      <h2>项目基本信息</h2>
      <div class="block">
        <div>
          <span>所属项目&#x3000;：</span>
          <el-select v-model="projectCode" placeholder="请选择">
            <el-option v-for="item in selectDataArrr" :key="item.id" :label="item.projectName" :value="item.projectCode"></el-option>
          </el-select>
        </div>
        <div class="paramsGroup" v-for="(item,index) in houses" :key="Math.random()">
          <div>
            <span>房源面积 <span style="color:red">*</span> ：</span>
            <el-input :value="item.housingResourceArea" @change.native="inputChange(item,index,$event,'housingResourceArea')"></el-input>
          </div>
          <div>
            <span>房源单价<span style="color:red">*</span>：</span>
            <el-input :value="item.housingResourcePrice" @change.native="inputChange(item,index,$event,'housingResourcePrice')"></el-input>
          </div>
        </div>
        <el-button size="small" @click="addHouseHandle">+添加</el-button>
        <!-- <el-button size="small">+模板导入</el-button> -->
      </div>
    </div>
    <h2>标签</h2>
    <div class="module">
      <span class="tips" v-if="args.length <1">请先选择项目</span>
      <div class="block" v-for="item in args">
        <h3>{{item.argsName}}</h3>
        <div class="group" v-for="ele in item.smallArgs">
          <label>{{ele.argsName}}&nbsp;&nbsp;&nbsp;&nbsp;</label>分数：
          <el-slider disabled="" style="width:20%" max="10" v-model="ele.score"></el-slider>&#x3000;
          <el-button size="small">{{ele.score}}</el-button>
          &#x3000;&#x3000;&#x3000;&#x3000;权重：
          <el-slider disabled="" style="width:20%" v-model="ele.weight"></el-slider>&#x3000;
          <el-button size="small">{{ele.weight}}</el-button>
        </div>
      </div>
      <div class="utilsBtn">
        <el-button @click="cancelHandle">取消</el-button>
        <el-button type="primary" @click="submitHandle">提交</el-button>
      </div>
      <el-dialog title="结果" :visible.sync="dialogVisible">
        <result :isStaticShow="true" :priceData="priceUnion" :argsData="argsData"></result>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import result from "../parkManager/components/result";
export default {
  name: "",
  components: { result },
  data() {
    return {
      value1: 1,
      projectCode:'',
      selectDataArrr:[],
      houses:[ {housingResourceArea: "",housingResourcePrice: ""}],
      dialogVisible: false,
      args:[],
      // 测算的结果
      priceUnion:{},
      argsData:[],
    };
  },
  watch:{
    projectCode:function(val){
      this.getDataByCode(val)
    }
  },
  mounted() {
    this.getDropListData()
  },
  methods: {
    // 根据projectCode查询项目参数
    getDataByCode: function(projectCode) {
      this.$myLoading.show()
      this.$fetch({
        url: process.env.price_system + "/pricingProject/listPricingProject",
        method: "post",
        data: {
          projectCode: this.projectCode,
          token: this.$store.getters.token
        }
      })
        .then(res => {
          this.$myLoading.hide()
          this.args = res.data.list[0].args
          this.argsData = this.args.map(item =>{
            return {
                argsName:item.argsName,
                argsVersionSmalls:item.smallArgs.map(o =>{
                  return {
                    argsNameSmall:o.argsName,
                    score:o.score
                  }
                })
            }
          })
        })
        .catch(err => {
          this.$myLoading.hide()
        });
    },
    // 添加房源
    addHouseHandle:function(){
      this.houses.push({housingResourceArea: "",housingResourcePrice: ""})
    },
    // 通过input的value，更新数据源arr中对应的对象
    inputChange: function(item, index, $event, key) {
      var value = $event.target.value;
      item[key] = value;
      this.houses[index] = item;
    },
    // 取消
    cancelHandle: function() {
      location.reload();
    },
    // 获取下拉列表数据
    getDropListData:function(){
      this.$fetch({
        url: process.env.price_system + "/pricingProject/all",
        method: "get",
        data: {}
      })
        .then(res => {
          this.selectDataArrr = res
        })
        .catch(err => {});
    },
    // 提交
    submitHandle: function() {
      
      // 验证
      if(this.args.length <1){
        this.$message.error('请先选择项目！')
        return 
      }
      for(var i=0;i<this.houses.length;i++){
        var o = this.houses[i]
        if(o.housingResourceArea.trim() == '' || o.housingResourcePrice.trim() == ''){
          this.$message.error('房源单价和房源面积不能为空！')
          return 
        }
      }
      // 组织数据
      var args = this.args.map(item =>{
        return {
          argsName:item.argsName,
          smallArgs:item.smallArgs.map(o =>{
            return {
              argsName:o.argsName,
              score:o.score
            }
          })
        }
      })
      this.$fetch({
        url: process.env.price_system + "/pricingProjectPrice/getProjectPrice",
        method: "post",
        data: {
          houses:this.houses,
          args: args
        }
      })
        .then(res => {
          this.priceUnion = res.data[0]
          this.dialogVisible = true
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang='scss' scoped>
.priceCalcPage {
  border: 20px solid #eee;
  // border-bottom: 300px solid #eee;
  background-color: #fff;
  #dialog {
    & /deep/ .el-dialog {
      width: 80%;
    }
  }
  .tips {
    color: #777;
    margin: 10px;
    // padding-left: 20px;
  }
  h2 {
    font-size: 16px;
    margin: 20px 0 0 10px;
  }
  .addMoreBtn {
    margin: 20px 0;
  }
  .module {
    padding: 10px;
    h2 {
      font-size: 16px;
      margin: 0;
    }
    h3 {
      font-size: 14px;
      margin: 0;
      margin-bottom: 10px;
    }
    .utilsBtn {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .block {
      // background-color: #eee;
      box-shadow: 0 0 2px lightgray;
      padding: 20px;
      font-size: 14px;
      margin: 10px 20px 20px 20px;
      border: 1px solid #eee;
      border-radius: 10px;
      .paramsGroup {
        display: flex;
        margin: 20px 0;
        & > div {
          margin-right: 50px;
        }
        & /deep/ .el-input {
          width: 215px;
        }
      }
      .group {
        overflow: hidden;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding-left: 20px;
        & > label {
          width: 200px;
          float: left;
          font-weight: normal;
        }
        & /deep/ .el-slider {
          width: 50%;
          float: left; // display: inline-block;
        }
      }
    }
  }
}
</style>
