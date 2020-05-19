<template>
  <div class="carBaseInfoPage">
    <div>
      <div class="baseInfo">
        <h1>基本信息: <el-button size="small" style="float:right" @click="openEditBaseInfoHandle">编辑</el-button> </h1>
        <ul>
          <li>项目名称：{{baseInfo.projectName}}</li>
          <li>项目编号：{{baseInfo.projectCode}}</li>
          <li>开发商：{{baseInfo.developers}}</li>
          <li>管理公司：{{baseInfo.company}}</li>
        </ul>
        <ul>
          <li>招商状态：{{baseInfo.statusName}}</li>
          <li>占地面积：{{baseInfo.area}}㎡</li>
          <li>
            项目图片：
            <span class="anchor" @click="lookImgDialogVisible = true">查看</span>
          </li>
          <li>详细地址：{{baseInfo.address}}</li>
        </ul>
      </div>
      <!-- 项目详情 -->
      <div class="daybill">
        <h1>项目详情:</h1>
        <div class="dayBillTable">
          <div class="box">
            <h2>房源信息：</h2>
            <el-table :data="baseInfo.housingResources" border fit highlight-current-row style="width: 100%">
              <template v-for="(item,index) in houseInfoHeaderArr">
                <el-table-column v-if="item.prop=='operation'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
                  <template scope="scope">
                    <el-button size="small" @click="editHouseInfoHandle(scope.row)">编辑</el-button>
                  </template>
                </el-table-column>
                <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label"></el-table-column>
              </template>
            </el-table>
          </div>
          <div class="box">
            <h2 class="params">价格与参数分数：</h2>
            <div class="desc">
               <el-button size="small" @click="editPriceHandle">编辑价格</el-button><el-button size="small"  @click="go2priceCalc">价格试算</el-button>
              <p>本区域内的项目的价格基线为：
                <span class="c-red">{{baseInfo.baselinePrices}}</span>元/㎡
              </p>
              <p>该项目的指导价格：
                <span class="c-red">{{baseInfo.referencePrice}}</span>元/㎡
              </p>
              
            </div>
            <!-- 参数组 -->
            <el-table :data="baseInfo.args" border fit highlight-current-row style="width: 100%">
              <template v-for="(item,index) in paramsHeaderArr">
                <el-table-column v-if="item.prop=='operation'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
                  <template scope="scope">
                    <el-button size="small" @click="editArgsInfoHandle(scope.row)">编辑</el-button>
                  </template>
                </el-table-column>
                 <!--周边定价  -->
                <el-table-column
                  v-else-if="item.prop=='detail'"
                  :key="Math.random() +100"
                  :align="item.align"
                  :prop="item.prop"
                  :label="item.label">
                  <template scope="scope">
                    <el-popover placement="right" width="400" trigger="click">
                      <el-table :data="scope.row.smallArgs" fit>
                        <el-table-column property="argsName" label="名称"></el-table-column>
                        <el-table-column property="weight" label="权重%"></el-table-column>
                        <el-table-column property="score" label="分值"></el-table-column>
                      </el-table>
                      <el-button size="small" slot="reference" v-waves>查看</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label"></el-table-column>
              </template>
            </el-table>
          </div>
          <div class="box">
            <h2 class="around">周边园区定价：</h2>
            <el-table :data="aroundTableData" border fit highlight-current-row style="width: 100%">
              <template v-for="(item,index) in aroundHeaderArr">
                <el-table-column v-if="item.prop=='index3'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
                  <template scope="scope">
                    <el-button size="small" @click="lookPositionHandle(scope)">查看</el-button>
                  </template>
                </el-table-column>
                <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label"></el-table-column>
              </template>
            </el-table>
          </div>
        </div>
      </div>
      <!--lookImgDialog查看图片  -->
      <el-dialog title="查看图片" :before-close="beforeUploadClose" id="lookImgDialog" :modal="false" :visible.sync="lookImgDialogVisible" width="30%">
        <el-upload ref="upload" action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-remove="handleUploadRemove" :file-list="fileList" :auto-upload="false">
           <i class="el-icon-plus"></i>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateImageHandle">确 定</el-button>
        </span>
      </el-dialog>
      <!--lookImgDialog查看地理位置  -->
      <el-dialog title="查看地理位置" id="lookPositionDialog" :modal="false" :visible.sync="lookPositionDialogVisible" width="30%">
        <div id="BMap" style="height:300px;width:100%;margin:0 auto" class="container"></div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="lookPositionDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- dialog编辑基本信息 -->
      <el-dialog title="编辑基本信息" :before-close="beforeBaseFormClose" :visible.sync="editBaseInfoUnion.visible"  >
        <el-form ref="baseForm"  :model="editBaseInfoUnion.form" :rules="rules" label-width="130px">
          <el-form-item label="项目名称：" prop="projectName">
            <el-input v-model="editBaseInfoUnion.form.projectName" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="开发商：" prop="developers">
            <el-input v-model="editBaseInfoUnion.form.developers" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="管理公司：" prop="company">
            <el-input v-model="editBaseInfoUnion.form.company" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="招商状态："  prop="statusName">
           <el-select v-model="editBaseInfoUnion.form.statusName" style="width:400px;" placeholder="招商状态：">
            <el-option label="招商中" value="招商中"></el-option>
            <el-option label="关闭" value="关闭"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="占地面积：" prop="area">
            <el-input v-model="editBaseInfoUnion.form.area" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input v-model="editBaseInfoUnion.form.address" style="width:400px;"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveBaseInfoUpdate('baseForm')">保存</el-button>
        </span>
      </el-dialog>
       <!-- dialog编辑房源 -->
      <el-dialog title="编辑房源信息"   :visible.sync="editHouseInfoUnion.visible"  >
        <el-form ref="form" :model="editHouseInfoUnion.form" label-width="130px">
          <el-form-item label="房源名称：">
            <el-input v-model="editHouseInfoUnion.form.housingResourceName" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="房源面积(㎡)：">
            <el-input v-model="editHouseInfoUnion.form.housingResourceArea" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="房源单价(元)：">
            <el-input v-model="editHouseInfoUnion.form.housingResourcePrice" style="width:400px;"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveHouseInfoUpdate">保存</el-button>
        </span>
      </el-dialog>
      <!-- dialog编辑参数组 -->
      <el-dialog title="编辑参数组"   :visible.sync="editArgsInfoUnion.visible"  >
        <el-form ref="form" :model="editArgsInfoUnion.form" label-width="130px">
          <el-form-item label="参数名称：">
            <el-input v-model="editArgsInfoUnion.form.argsName" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="分数：">
            <el-input v-model="editArgsInfoUnion.form.totalScore" style="width:400px;"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveArgsInfoUpdate">保存</el-button>
        </span>
      </el-dialog>
      <!-- dialog编辑价格 -->
      <el-dialog title="编辑价格"   :visible.sync="editPriceInfoUnion.visible"  >
        <el-form ref="form" :model="editPriceInfoUnion.form" label-width="130px">
          <el-form-item label="基线价格：">
            <el-input v-model="editPriceInfoUnion.form.baselinePrices" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="指导价格：">
            <el-input v-model="editPriceInfoUnion.form.referencePrice" style="width:400px;"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="savePriceInfoUpdate">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      baseInfo: {}, // 基本信息
      //房源信息
      houseInfoTableData: [],
      houseInfoHeaderArr: [
        { prop: "housingResourceName",align: "center",label: "房源名称",width: 100},
        {prop: "housingResourceArea",align: "center",label: "房源面积(㎡)",width: 100},
        {prop: "housingResourcePrice",align: "center",label: "房源单价(元)",width: 100},
        {prop: "operation",align: "center",label: "操作",width: 100}
      ],
      //参数信息
      paramsTableData: [],
      paramsHeaderArr: [
        { prop: "argsName", align: "center", label: "参数组", width: 100 },
        { prop: "totalScore", align: "center", label: "分数", width: 100 },
        { prop: "detail", align: "center", label: "详情", width: 100 },
        { prop: "operation", align: "center", label: "操作", width: 100 }
      ],
      //周边园区定价
      aroundTableData: [],
      aroundHeaderArr: [
        { prop: "address", align: "center", label: "地理位置", width: 100 },
        { prop: "currentPrice", align: "center", label: "当前定价(元/㎡)", width: 100 },
        { prop: "index3", align: "center", label: "地理位置", width: 100 },
        { prop: "totalScore", align: "center", label: "总分", width: 100 },
      ],
      // dialog弹窗
      lookImgDialogVisible: false,
      lookPositionDialogVisible: false,
      // 上传文件列表
      fileList:[],
      removeFileIds:[],
      // 编辑基本信息
      editBaseInfoUnion:{
        visible:false,
        form:{
          id:'',
          projectCode:'',
          projectName:'',
          developers:'',
          company:'',
          statusName:'',
          area:'',
          address:'',
          statusId:'',
        }
      },
      // 基本信息验证
      rules:{
          projectName: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
          ],
          developers: [
            { required: true, message: '请输入开发商', trigger: 'blur' },
          ],
          company: [
            { required: true, message: '请输入管理公司', trigger: 'blur' },
          ],
          area: [
            { required: true,type:'number', message: '请输入面积', trigger: 'blur' },
          ],
          address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
          ],
      },
      // 编辑房源信息
      editHouseInfoUnion:{
        visible:false,
        form:{
          id:'',
          housingResourcePrice:'',
          housingResourceName:'',
          housingResourceArea:'',
        }
      },
      // 编辑参数信息
      editArgsInfoUnion:{
        visible:false,
        form:{
          id:'',
          argsCode:'',
          argsName:'',
          totalScore:'',
        }
      },
      // 编辑价格
      editPriceInfoUnion:{
        visible:false,
        form:{
          priceId:'',
          baselinePrices:'',
          referencePrice:'',
        }
      }
    };
  },

  mounted() {
    var projectCode = this.$route.query.projectCode;
    this.getDataByCode(projectCode)
    
  },
  methods: {
    // 基本信息表格关闭的时候，重置
    beforeBaseFormClose:function(done){
      this.$refs['baseForm'].resetFields();
      done()
    },
    // 去价格试算
    go2priceCalc:function(){
      this.$router.push('/parkManager/priceCalc')
    },
    // 保存指导价格
    savePriceInfoUpdate:function(){
      this.editPriceInfoUnion.form.id = this.editPriceInfoUnion.form.priceId
      this.editPriceInfoUnion.form.updateDate = new Date().format('yyyy-MM-dd hh:mm:ss')
      this.$fetch({
        url: process.env.price_system + "/pricingProjectPrice/" + this.baseInfo.priceId ,
        method: "put",
        data:this.editPriceInfoUnion.form
      })
        .then(res => {
         this.$message.success('信息保存成功！')
         this.editPriceInfoUnion.visible = false
         this.getDataByCode(this.baseInfo.projectCode)
         // 重置表单
         for (var key in this.editPriceInfoUnion.form) {
           this.editPriceInfoUnion.form[key] = ''
         }
        })
        .catch(err => {});
    },
    // 编辑指导价格
    editPriceHandle:function(){
      this.editPriceInfoUnion.visible = true
      for (var key in this.editPriceInfoUnion.form) {
         this.editPriceInfoUnion.form[key] = this.baseInfo[key]
      }
    },
    // 编辑参数
    editArgsInfoHandle:function(data){
      console.log(data)
      this.editArgsInfoUnion.visible = true
      for (var key in data) {
        this.editArgsInfoUnion.form[key] = data[key]
      }
    },
    // 保存参数编辑
    saveArgsInfoUpdate:function(){
       this.$fetch({
        url: process.env.price_system + "/pricingArgs/" + this.editArgsInfoUnion.form.id ,
        method: "put",
        data:this.editArgsInfoUnion.form
      })
        .then(res => {
         this.$message.success('信息保存成功！')
         this.editArgsInfoUnion.visible = false
         this.getDataByCode(this.baseInfo.projectCode)
         // 重置表单
         for (var key in this.editHouseInfoUnion.form) {
           this.editArgsInfoUnion.form[key] = ''
         }
        })
        .catch(err => {});
    },
    // 保存房源编辑
    saveHouseInfoUpdate:function(){
      this.$fetch({
        url: process.env.price_system + "/pricingHousingResource/" + this.editHouseInfoUnion.form.id ,
        method: "put",
        data:this.editHouseInfoUnion.form
      })
        .then(res => {
         this.$message.success('信息保存成功！')
         this.editHouseInfoUnion.visible = false
         this.getDataByCode(this.baseInfo.projectCode)
         // 重置表单
         for (var key in this.editHouseInfoUnion.form) {
           this.editHouseInfoUnion.form[key] = ''
         }
        })
        .catch(err => {});
    },
    // 编辑房源
    editHouseInfoHandle:function(data){
      this.editHouseInfoUnion.visible = true
      for (const key in data) {
        this.editHouseInfoUnion.form[key] = data[key]
      }
    },
    // 保存基本信息更改
    saveBaseInfoUpdate:function(name){
      this.$refs[name].validate((valid) => {
          if (valid) {
            this.editBaseInfoUnion.form.statusId = this.editBaseInfoUnion.form.statusName == '招商中' ? 1 : 0
            this.$fetch({
              url: process.env.price_system + "/pricingProject/"+this.baseInfo.projectCode,
              method: "put",
              data:this.editBaseInfoUnion.form
            })
              .then(res => {
              this.$message.success('信息保存成功！')
              this.editBaseInfoUnion.visible = false
              this.getDataByCode(this.baseInfo.projectCode)
              // 重置表单
              for (var key in this.editBaseInfoUnion.form) {
                this.editBaseInfoUnion.form[key] = ''
              }
              })
              .catch(err => {});
          } else {
            this.$message.error('请完善信息!')
            return false;
          }
        });
    },
    // 打开基本信息编辑dialog 
    openEditBaseInfoHandle:function(){
        this.editBaseInfoUnion.visible = true
        for (var key in this.editBaseInfoUnion.form) {
          this.editBaseInfoUnion.form[key] = this.baseInfo[key]
        }
    },
    // 关闭upload窗口，清空数据
    beforeUploadClose:function(done){
      this.removeFileIds = []
      var projectCode = this.$route.query.projectCode;
      this.getDataByCode(projectCode)
      done()
    },
    // 更新图片请求
    updateImageHandle:function(){
      var noUploadImageList = this.$refs.upload.uploadFiles.filter(item =>{
        return !item.id
      })
      this.image2base64(noUploadImageList).then(files =>{
        console.log(files)
        var data =  {
            picIds:this.removeFileIds,
            files:files,
            projectCode: this.baseInfo.projectCode,
            token: this.$store.getters.token
        }
        if(files.length < 1) delete data.files
        if(this.removeFileIds.length < 1) delete data.picIds
        this.$fetch({
          url: process.env.price_system + "/pricingProjectPicture/updateProjectPic",
          method: "post",
          data:data
        })
          .then(res => {
            this.lookImgDialogVisible = false
            this.$message.success('修改图片成功！')
          })
          .catch(err => {});
      })
    },
    // 删除图片
    handleUploadRemove:function(file, fileList){
      console.log(file,fileList)
      if(file.id){
        this.removeFileIds.push(file.id)
      }
    },
    // 查看地理位置
    lookPositionHandle: function(scope) {
      this.lookPositionDialogVisible = true;
      this.$nextTick(function() {
        this.initMap(scope.row.address);
      });
    },
    // 地图
    initMap: function(address) {
      var map = new BMap.Map("BMap");
      // 创建地址解析器实例
      var myGeo = new BMap.Geocoder();
      map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}))
       map.addControl(new BMap.NavigationControl())
        // map.addControl( new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}))
      // 将地址解析结果显示在地图上,并调整地图视野
      myGeo.getPoint(address, function(point){
        if (point) {
          map.centerAndZoom(point, 16);
          var marker = new BMap.Marker(point)
          map.addOverlay(marker);
           var opts = {
            width : 200,     // 信息窗口宽度
            height: 100,     // 信息窗口高度
            // title : "上海e通世界北区" , // 信息窗口标题
            enableMessage:true,//设置允许信息窗发送短息
          }
          var infoWindow = new BMap.InfoWindow(address, opts);  // 创建信息窗口对象 
           map.openInfoWindow(infoWindow,point);
          marker.addEventListener("click", function(){          
            map.openInfoWindow(infoWindow,point); //开启信息窗口
          });
        }else{
          alert("您的地址没有解析到结果!");
        }
      }, "北京市");
       
    },
    // img转换base64
    image2base64: function(files) {
      var result = [];
      return new Promise((resolve, reject) => {
        if(files.length < 1){
          resolve([])
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
    // 获取页面信息
    getDataByCode: function(projectCode) {
      this.$myLoading.show()
      this.$fetch({
        url: process.env.price_system + "/pricingProject/listPricingProject",
        method: "post",
        data: {
          projectCode: projectCode,
          token: this.$store.getters.token
        }
      })
        .then(res => {
          this.$myLoading.hide()
          var data = res.data.list[0]
          for (var key in data) {
              this.$set(this.baseInfo,key,data[key])
          }
          this.aroundTableData = res.data.list[0].rimProjects
          this.fileList = res.data.list[0].projectPictures.map(item =>{
            return {
              url:item.prefix + item.path,
              id:item.id,
            }
          })
        })
        .catch(err => {
          this.$myLoading.hide()
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.c-red {
  color: red;
}

.anchor {
  color: #4db3ff;
  cursor: pointer;
}

.carBaseInfoPage {
  // position: fixed;
  // left: 210px;
  // top: 50px;
  // height: 100%;
  // width: calc(100% - 210px);
  background-color: #eee;
  padding: 20px 0 20px 20px;
  overflow: scroll;
  #lookImgDialog {
    img {
      width: 70%;
      display: block;
      margin: 0 auto;
      border: 1px solid lightgray;
    }
  }
  & > div {
    padding: 10px;
    background-color: #fff;
  }
  h1 {
    margin: 0px;
    font-size: 18px; //  border-bottom: 1px solid #eee;
    font-weight: 500;
  }
  .baseInfo {
    ul {
      margin: 0;
      overflow: hidden;
      padding-left: 20px;
      width: 100%;
      li {
        font-size: 14px;
        width: 25%;
        list-style: none;
        float: left; // padding-left: 20px;
        margin-top: 30px;
        color: #666;
      }
    }
  }
  .daybill {
    padding-top: 20px;
    border-top: 1px solid #eee;
    margin-top: 30px;
    .dayBillTable {
      overflow: hidden;
      margin-top: 10px;
      .box {
        border: 1px solid #eee;
        padding: 10px;
        margin-bottom: 50px;
        background-color: rgb(250, 250, 250);
        border-radius: 10px;
      }
      h2 {
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
        font-weight: normal;
        font-size: 15px;
        margin-top: 0;
        background-color: #eee;
      }
      .params {
        // margin-top: 80px;
      }
      .desc {
        padding-left: 20px;
        p {
          font-size: 14px;
        }
      }
      .around {
        // margin-top: 80px;
      }
    }
  }
}
</style>
