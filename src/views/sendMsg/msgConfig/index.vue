<template>
  <div class="container">
    <h1>配置发送内容</h1>
    选择短信模板：
    <el-select v-model="selectTemplate" placeholder="请选择">
      <el-option v-for="item in templateList" :key="item.value" :label="item.templateName" :value="item.id"></el-option>
    </el-select>
    <br>
    <br>
    <el-input type="textarea" disabled="" :rows="2" placeholder="" v-model="textarea"></el-input>
    <el-upload
      ref="upload"
      class="upload-demo"
      :action="uploadUrl"
      :data = "moreData"
      accept=".xlsx"
      :on-success = "uploadSuccess"
      :file-list="fileList"
    >
    <br>
      <el-button size="small" >导入号码</el-button>
      <div slot="tip" class="el-upload__tip">
        <ul>
          <li>请上传xlsx格式，“变量模版”号码文件 <el-button size="small" @click="downloadTemplate">范例下载</el-button> </li>
          <li>请保持导入文件的变量书序与模版内容的变量顺序一致，请严格遵守范例样式</li>
          <li>文件大小不可超过3M，建议单次导入号码50万个以内</li>
        </ul>
      </div>
    </el-upload>
    <el-button @click="send" type="primary">提交发送</el-button>
  </div>
</template>

<script>
import store from 'store'
export default {
  name: "",
  components: {},
  data() {
    return {
      textarea: "123",
      selectTemplate:'',
      templateList:[],
      fileList:[],
      moreData:{userName:store.getters.name},
      uploadUrl:process.env.sendMsg_api + '/file/uploadFile',
      fileName:'',
    };
  },
  watch:{
      selectTemplate:function(val){
          var value = this.templateList.filter(item => item.id == val)[0].templateContent
          this.textarea = value 
      }
  },
  mounted() {
    this.getTemplateList();
  },
  methods: {
    //   上传成功
    uploadSuccess:function(response, file, fileList){
        console.log(response,file,fileList)
        this.fileName = response.file_name
        if(response.code == 200){
          this.$message.success('导入成功！')
        }else{
          this.$message.error('导入失败！')
        }
    },
    //   模板下载
    downloadTemplate:function(){
        window.open('http://api.parkwing.cn/model/energy.xlsx')
    },
    //   模板下拉列表
    getTemplateList: function() {
      this.$fetch({
        url: process.env.sendMsg_api + "/messageTemplate/all",
        method: "get",
        params: {}
      }).then(res => {
          this.templateList = res
          this.selectTemplate = res[0].id
      });
    },
    //   导入号码
    importPhoneNumber: function() {},
    // 发送
    send: function() {

      if(this.$refs.upload.uploadFiles.length<1){
        this.$message.error('请先导入号码！')
        return
      }
      
      this.$fetch({
        url: process.env.sendMsg_api + "/file/readFile",
        method: "get",
        params: {
            templateId:this.selectTemplate,
            fileName : this.fileName,
            userName:this.moreData.userName
        }
      }).then(res => {
          if(res.code == 200){
            this.$message.success('消息发送成功！')
          }else{
            this.$message.error('消息发送失败！')
          }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.container {
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  h1{
    font-size: 20px;
    font-weight: normal;
    margin: 0;
    margin-bottom: 20px;
  }
}
</style>
