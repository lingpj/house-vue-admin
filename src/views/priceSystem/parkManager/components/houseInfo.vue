<template>
  <div class="houseInfo">
    <div class="itemBox">
      <p class="title">
        基本信息
        <!-- <span class="anchor">+模板导入</span> -->
      </p>
      <el-form ref="form" :inline="true"  label-width="120px">
        <div v-for="(group,index) in groupArr" :key="Math.random()">
          <el-form-item label="房源名称：">
            <el-input :value="group.housingResourceName" @change.native="inputChange(group,index,$event,'housingResourceName')"></el-input>
          </el-form-item>
          <el-form-item label="房源面积：">
            <el-input :value="group.housingResourceArea" @change.native="inputChange(group,index,$event,'housingResourceArea')"></el-input>
          </el-form-item>
          <el-form-item label="房源单价：">
            <el-input :value="group.housingResourcePrice" @change.native="inputChange(group,index,$event,'housingResourcePrice')"></el-input>
          </el-form-item>
        </div>
        <el-button class="addBtn" @click="addGroupHandle" size="small">+添加</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props:['currentState'],
  data() {
    return {
      groupArr: [
        {
          housingResourceName: "",
          housingResourceArea: "",
          housingResourcePrice: ""
        }
      ]
    };
  },
  watch: {
    // 检查当前页码，存储数据
    currentState: function(val, oldVal) {
      if (oldVal == 1) {
          console.log('save2')
        this.saveData();
      }
    }
  },
  mounted() {},
  methods: {
    // 通过input的value，更新数据源arr中对应的对象
    inputChange: function(item, index, $event, key) {
      var value = $event.target.value;
      item[key] = value;
      this.groupArr[index] = item;
    },
    //  保存当页数据 
    saveData:function(){
        var data = JSON.stringify(this.groupArr)
        if(this.groupArr.length == 1 && this.groupArr[0].housingResourceName == ''){
            data = ''
        }
        sessionStorage.setItem('houseInfo',data)
    },
    //   添加更多
    addGroupHandle: function() {
      this.groupArr.push({
        housingResourceName: "",
        housingResourceArea: "",
        housingResourcePrice: ""
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.houseInfo {
  .anchor {
    color: blue;
    cursor: pointer;
    float: right;
  }
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
  }
}
</style>
