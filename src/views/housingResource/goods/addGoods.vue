<template>
  <div class="container">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="所属园区" prop="park">
        <el-select style="width:400px" v-model="form.park"  @change="parkChangeHandle"  placeholder="请选择">
          <el-option v-for="item in parkArr" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="楼栋" prop="build">
        <el-select style="width:400px" v-model="form.build" placeholder="请选择">
          <el-option v-for="item in buildArr" :key="item.buildname" :label="item.buildname" :value="item.buildname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="楼层"
        prop="floor"
        :rules="[{ required: true, message: '请输入楼层'},{ validator: (rule, value, callback) => handleValidateNumber(rule, value, callback, '楼层') }]"
      >
        <el-input style="width:400px" v-model="form.floor"></el-input>
      </el-form-item>
      <el-form-item label="房号" prop="room">
        <el-input style="width:400px" v-model="form.room"></el-input>
      </el-form-item>
       <el-form-item
        label="价格"
        prop="price"
        :rules="[{ required: true, message: '请输入价格'},{ validator: (rule, value, callback) => handleValidateNumber(rule, value, callback, '价格') }]"
      >
        <el-input style="width:400px" v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio v-model="form.status" label="1">上架并开放</el-radio>
        <el-radio v-model="form.status" label="2">暂不上架</el-radio>
        <!-- <el-radio v-model="form.status" label="3">上架不开放</el-radio> -->
      </el-form-item>
      <el-form-item label="开放秒杀时间" prop="spike_time">
        <el-date-picker
        :disabled="form.status == 2"
          style="width:400px"
          v-model="form.spike_time"
          type="datetime"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      
      <el-form-item label="房源图片">
        <el-upload
          :auto-upload="true"
          :file-list="fileList"
          list-type="picture-card"
          ref="imgUpload"
          :action="action"
          accept="image/*"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit('form')">确定</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="确认发布如下房源秒杀信息吗？"
      :visible.sync="dialogVisible"
      size="tiny"
    >
    <p>楼栋：{{form.build}}</p>
    <p>楼层：{{form.floor}}</p>
    <p>房号：{{form.room}}</p>
    <p>价格：{{form.price}}</p>
    <p>状态：{{form.status | fmtStatus}}</p>
    <p>开放秒杀时间：{{form.spike_time | fmtDate}}</p>
    
      <span slot="footer" class="dialog-footer">
        <el-button  @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="certainUplaod">确 定</el-button>
      </span>
    </el-dialog>
    <a id="qrcode" ref="qrcode"></a>
  </div>
</template>

<script>
import createUniqueString from "../../../utils/createUniqueString.js";
export default {
  name: "",
  data() {
    return {
      statusArr:['已租','已付意向金','空置','销控'],
      buildArr:[],
      parkArr: [],
      limit:1,
      form: {
        price:'',
        spike_time: "", // 时间
        status: "1", // 状态
        park: "", // 园区
        build: "", // 楼栋
        room: "", // 房号
        files: []
      },
      rules: {
        park: [
          { required: true, message: "请选择园区", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        build: [
          { required: true, message: "请输入楼栋", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        room: [
          { required: true, message: "请输入房号", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        // spike_time: [
        //   {
        //     type: "date",
        //     required: true,
        //     message: "请选择秒杀时间",
        //     trigger: "blur"
        //   }
        // ]
      },
      action: process.env.dropdbandescape + "/room/room/upload",
      uploadMoreData: {},
      productCode: "", // 商品唯一code
      certainUploadProduct: "",
      dialogVisible: false,
      isAddOperation: true,
      fileList: [],
      removeList: []
    };
  },
  filters:{
    fmtDate(val){
      console.log(val)
      if(!val) return ''
      return val.format('yyyy-MM-dd hh:ss:mm')
    },
    fmtStatus(val){
      return ['上架并开放','暂不上架'][val*1-1]
    }
  },
  mounted() {
    this.getParkList();
    // productCode 前端生成商品唯一code
    // 每次页面初始化时创建，出现二维码时，重新获取。编辑时：获取已有的。放弃添加，重新获取。
    this.isAddOperation = this.$route.query.data ? false : true
    // console.log(JSON.parse(this.$route.query.data),this.isAddOperation)
    if (!this.isAddOperation) {
      var data = JSON.parse(this.$route.query.data)
      this.form = {
        ...data,
        spike_time:new Date(data.spike_time)
      }
      if(data.pic_info) this.fileList = [{url:data.pic_info}]
    }
  },

  methods: {
    parkChangeHandle(){
      this.$fetch({
        url: process.env.dropdbandescape + "/room/parkinfo/pageList",
        method: "post",
        data:{
          parkname:this.form.park,
          page:1,
          limit:100000000,
        }
      }).then(res => {
        this.buildArr = res.list || []
      });
    },
    // img转换base64
    image2base64: function(files) {
      var result = [];
      return new Promise((resolve, reject) => {
        if (files.length < 1) {
          resolve([]);
        }
        var file = files.forEach(file => {
          var reader = new FileReader();
          reader.readAsDataURL(file.raw);
          // 判断文件大小
          if (file.raw.size / 1024 / 1024 > 1) {
            reject();
          }
          reader.onload = e => {
            let base64Str = reader.result.split(",")[1];
            result.push(e.target.result);
            if (files.length == result.length) {
              resolve(result);
            }
          };
        });
      });
    },
    handleValidateNumber(rule, value, callback, field) {
      const len = 10;
      if (!Number(value) && Number(value) !== 0) {
        callback(new Error(`${field}只能输入数字`));
      }
      if (Number(value) < 0 && field !=='楼层') {
        callback(new Error(`${field}不能输入负数`));
      }
      if ((value + "").length > len) {
        callback(new Error(`长度不超过${len}位`));
      }
      if (field == "楼层") {
        // if (!/^\d{1,11}$/.test(value)) {
        //   callback(new Error(`不能是小数`));
        // }
      } else {
        if (!/^\d{1,7}(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`整数最多7位,小数最多2位`));
        }
      }
      callback();
    },
    getParkList() {
      var url = process.env.dropdbandescape + "/room/parkinfo/name/list";
      this.$fetch({
        url: url,
        method: "get"
      }).then(res => {
        if (res.code == 200 || res.status == 200) {
          this.parkArr = res.data.rows;
          this.form.park = this.form.park=='' ? this.parkArr[0]: this.form.park
        }
      });
    },
   
        submit: function(form) {
           console.log('>>>>>>')
            this.$refs['form'].validate((valid) => {

                if (valid) {
                   var url = process.env.dropdbandescape + "/room/spike";
                   var uploadFiles = this.$refs.imgUpload.uploadFiles;
                   var method = "post"
                   var path = ''
                   var data ={
                        ...this.form,
                        spike_time: new Date(this.form.spike_time).getTime(),
                        pic_info:path
                   }
  
                   if(uploadFiles.length < 1){
                      this.$message.error('请至少选择一张图片！')
                      return 
                    }else if(uploadFiles.length > 1){
                      this.$message.error('图片不能超过1张！')
                      return 
                    }
                   if(!this.isAddOperation){
                      url = process.env.dropdbandescape + "/room/room/"+data.code
                      method = 'put'
                      data.pic_info = uploadFiles[0].response ? uploadFiles[0].response.path : uploadFiles[0].url
                      delete data.id
                      delete data.createtime
                   }else{
                      data.pic_info = uploadFiles[0].response.path
                   }
                   
                   this.dialogVisible = true
                   
                }
            });
        },
        // 确认上传
        certainUplaod: function(n) {
    
           var url = process.env.dropdbandescape + "/room/spike";
                   var uploadFiles = this.$refs.imgUpload.uploadFiles;
                   var method = "post"
                   var path = ''
                   var data ={
                        ...this.form,
                        spike_time: new Date(this.form.spike_time).getTime(),
                        pic_info:path
                   }
                   console.log(uploadFiles)
                   if(uploadFiles.length < 1){
                      this.$message.error('请至少选择一张图片！')
                      return 
                    }else if(uploadFiles.length > 1){
                      this.$message.error('图片不能超过1张！')
                      return 
                    }
                   if(!this.isAddOperation){
                      url = process.env.dropdbandescape + "/room/spike/"+data.code
                      method = 'put'
                      data.pic_info = uploadFiles[0].response ? uploadFiles[0].response.path : uploadFiles[0].url
                      delete data.id
                      delete data.createtime
                   }else{
                      data.pic_info = uploadFiles[0].response.path
                   }
           this.$fetch({
                      url: url,
                      method: method,
                      data: data
                    }).then(res => {
                      this.dialogVisible = false
                      if (res.code == 200 || res.status == 200) {
                         this.$alert('房源秒杀'+(this.isAddOperation ? '新增':'更新')+'成功！', '提示', {
                          confirmButtonText: '确定',
                          callback: action => {
                            this.$router.push('/housingResourceGoods/goodsList')
                          }
                        });
                      }else{
                        alert('错误')
                      }
                    });
           
        },
        sendRequest(){
         
        }
  }
};
</script>

<style lang='scss' scoped>
.container {
  background-color: #fff;
  .QRCodeDialogVisible {
    text-align: center;
    margin: 10px;
  }
  & /deep/ .w-e-text-container {
    z-index: 1000 !important;
  }
  & /deep/ .w-e-menu {
    z-index: 1000 !important;
  }
  & /deep/ .el-date-editor--datetime {
    width: 400px;
  }
  & /deep/ .el-dialog__wrapper {
    z-index: 10002 !important;
  }

  & /deep/ label {
    font-weight: 500;
  }
  border: 20px solid #eee;
  padding-top: 10px;
}
</style>
