<template>
  <div class="wrap-box">
    <!-- <el-button type="primary" @click="clickHandle('all')" v-waves>所有账单</el-button>
    <el-button type="primary" @click="clickHandle('company')" v-waves>企业账单</el-button> -->
     <el-radio-group v-model="radio3">
      <el-radio-button label="所有账单" value="all" @click="clickHandle('all')"></el-radio-button>
      <el-radio-button label="企业账单" value="company" @click="clickHandle('company')"></el-radio-button>
    </el-radio-group>
    <component :is="currentTabComponent"></component>
  </div>
</template>
<script>
import company from './billType/company.vue';
import all from './billType/all.vue';
export default {
  components: { company, all },
  data() {
    return {
      currentTabComponent: 'all',
      radio3: '所有账单',
    }
  },
  mounted() {
      
  },
  watch:{
    radio3:function(){
      console.log(this.radio3)
      this.currentTabComponent = this.radio3 == '所有账单'  ? 'all' : 'company'
    }
  },
  methods: {
    // clickHandle: function(str) {
    //   alert(str)
    //     this.currentTabComponent = str
    // }
  },
}
</script>
<style lang="scss" scoped>
.wrap-box{
  // padding:20px;
  border:20px solid #eee;
}
</style>

 
