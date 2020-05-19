<template>
  <div class="paramsInfo">版本号：
    <el-select v-model="checkedVersion" placeholder="请选择">
      <el-option
        v-for="item in this.dataList.map(item => item.version)"
        :key="item"
        :label="item"
        :value="item"
      ></el-option>
    </el-select>
    <div class="itemBox" v-for="item in currentDataList">
      <p class="title">{{item.argsName}}</p>
        <div class="group" v-for="obj in item.argsVersionSmalls">
          <label>{{obj.argsNameSmall}}</label>
          分值：
          <el-slider style="width:200px" max="10" v-model="obj.score"></el-slider>&#x3000;
          <el-button size="small">{{obj.score}}</el-button>
          &#x3000; &#x3000; &#x3000; &#x3000;
          权重：
          <el-slider style="width:200px" v-model="obj.weight"></el-slider>&#x3000;
          <el-button size="small">{{obj.weight}}</el-button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: ["currentState"],
  data() {
    return {
      dataList: [],
      currentDataList: [],
      checkedVersion: "",
    };
  },
  watch: {
    // 选择大类，改变小类
    checkedVersion: function(val) {
      this.dataList.forEach(item => {
        if (val == item.version) {
          this.currentDataList = item.data;
        }
      });
    },
    // 检查当前页码，存储数据
    currentState: function(val, oldVal) {
      if (oldVal == 2) {
        this.saveData();
      }
    }
  },
  mounted() {
    this.$fetch({
      url: process.env.price_system + "/pricingArgsVersionBig/selectArgsAll",
      method: "get"
    })
      .then(res => {
        for (const key in res.data) {
          var value = res.data[key];
          this.dataList.push({
            version: key,
            data: value
          });
        }

        // 默认
        console.log('>>> ',this.dataList)
        this.checkedVersion = this.dataList[0].version;
        this.currentDataList = this.dataList[0].data;
        // this.currentDataList.splice(0,0,this.dataList[1].data)
        
      
      })
      .catch(err => {});
  },
  methods: {
    handle:function(){
      console.log(this.currentDataList)
    },
    //   保存当前页面数据
    saveData: function() {
      var data = this.currentDataList.filter(item => {
        delete item.id;
        return true;
      });
      console.log(data)
      console.log(this.currentDataList)
      sessionStorage.setItem(
        "paramsInfo",
        JSON.stringify(this.currentDataList)
      );
    },
   
  }
};
</script>

<style lang='scss' scoped>
.paramsInfo {
  & /deep/ .el-slider__runway {
    // background-color: #20a0ff;
  }
  & /deep/ .el-slider__runway.disabled .el-slider__bar {
    //  background-color: #20a0ff;
  }
  padding-top: 20px;
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
    & /deep/ .addBtn {
      margin-left: 40px;
      margin-bottom: 50px;
    }
    .group {
      overflow: hidden;
      display: flex;
      align-items: center;
      padding-left: 50px;
      margin-bottom: 20px;

      & > label {
        width: 150px;
        float: left;
      }
      & /deep/ .el-slider {
        // width: 30%;
        // float: left; // display: inline-block;
      }
    }
  }
}
</style>
