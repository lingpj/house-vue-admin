<template>
  <div class="creditPaymentPage">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="车辆" name="first">
        <car v-if="activeName == 'first'" :key="Math.random()"></car>
      </el-tab-pane>
      <el-tab-pane label="账单" name="second">
        <bill v-if="activeName == 'second'" :key="Math.random()"></bill>
      </el-tab-pane>
      <el-tab-pane label="异常放行" name="third">
        <abnormal v-if="activeName == 'third'" :key="Math.random()"></abnormal>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import car from "./car";
import bill from "./bill";
import abnormal from "./abnormal";
export default {
  name: "",
  components: { car, bill, abnormal },
  data() {
    return {
      activeName: "first"
    };
  },

  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang='scss' scoped>
.creditPaymentPage {
  border: 20px solid #eee;
  background-color: #fff;
  & /deep/ .el-tabs__item {
    font-size: 16px;
  }
}
</style>
