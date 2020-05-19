<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
  export default{
    name: 'APP'
  }
</script>

<style lang="scss">
  // .el-loading-mask{
  //   background-color: rgb(0,0,0,.3);
  // }
  @import './styles/index.scss'; // 全局自定义的css样式
</style>
