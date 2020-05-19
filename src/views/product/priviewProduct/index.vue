<template>
  <div class='container'>
    <!-- <iframe id="iframe" src="http://101.132.179.51/shop/#/" frameborder="0"></iframe> -->
    <div id="qrcode" ref="qrcode"></div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  name: '',
  components: { QRCode },
  data () {
    return {
    }
  },

  mounted(){
    this.qrcodeScan()
  },
  methods: {
     qrcodeScan:function(){ 
      let qrcode = new QRCode('qrcode', {
        width: 200,  // 二维码宽度 
        height: 200, // 二维码高度
        text: 'https://www.baidu.com'
      })
    }
  }
}
</script>

<style lang='scss' scoped>
 .container{
     padding: 20px;
     #iframe{
         width: 375px;
         height: 667px;
     }
 }
</style>
