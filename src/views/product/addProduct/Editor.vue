<template>
  <div>
    <div ref="editor" style="text-align:left"></div>
  </div>
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'editor',
  props: ['defaultContent', 'productCode'],
  data() {
    return {
      editorContent: '',
      code: ''
    }
  },
  watch: {
    productCode(val) {
 
      var editor = new E(this.$refs.editor)
      editor.customConfig.showLinkImg = false  // 隐藏“网络图片”tab
      editor.customConfig.uploadImgServer =  process.env.shop_api+ '/shopProductPicture/addShopProductPicture'// 配置服务器端地址
      editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
      editor.customConfig.uploadImgParams = { token: this.$store.getters.token, productCode: val }  // token
      editor.customConfig.uploadFileName = 'file'
      editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调

        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
          //
          // let imgUrl = result.data;
          // insertImg(imgUrl)
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          console.log(editor)
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功,插入图片的回调
          console.log(result);
          // if(result.code == 200){
          var url = result.data;
          insertImg(url)//将内容插入到富文本中
          // console.log(insertImg(url)+"DFDF")
          // console.log(data+"dsfd")
          // }
        }
      };
      editor.customConfig.onchange = (html) => {
        this.editorContent = html
      }
      editor.create()
      editor.txt.html(this.defaultContent)
    }
  },
  methods: {
    getContent: function() {
      return this.editorContent
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
