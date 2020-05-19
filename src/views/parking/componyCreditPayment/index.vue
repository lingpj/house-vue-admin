<template>
  <div class="container">
    <el-row style="margin:20px 0 ;border-bottom:1px solid #eee;padding-bottom:20px;">
      <el-col :span="6"><span>公司名称：</span><el-input style="width:70%" v-model="company" placeholder="请输入公司名称"></el-input></el-col>
      <el-col :span="3"><el-button type="primary" @click="getBillList">搜索</el-button></el-col>
      <el-col :span="5" :offset="7">
        <!-- <el-button size="small" type="primary" @click="importHandle">导入</el-button> -->
        <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :on-success = "uploadSuccess"
          accept=".xlsx"
  >
  <el-button size="small" type="primary">导入</el-button>
  <div slot="tip" class="el-upload__tip">上传Excel文件(仅支持后缀为xlsx)</div>
</el-upload>
        
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="small" @click="downloadTemplate">下载模板</el-button>
      </el-col>
      
    </el-row>
    <el-radio-group v-model="typeRadio" class="radioGroup">
      <el-radio-button v-for="item in typeRadioRadioArr" :label="item" :key="Math.random() +100"></el-radio-button>
      </el-radio-group>
      <el-table id="table" :data="tableDataArr" border fit highlight-current-row style="margin-top:0px">
        <template v-for="item in tableHeaderArr">
          <!-- 所有车辆 -->
          <el-table-column v-if="item.prop=='allCars'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
              <el-popover placement="right"  trigger="click">
              <el-table :data="allCarsUnion.tableDataArr">
                <el-table-column width="200" property="index" label="序号"></el-table-column>
                <el-table-column width="200" property="plate_no" label="车牌号"></el-table-column>
              </el-table>
              <el-pagination @size-change="handleSizeChangeOfCar" @current-change="handleCurrentChangeOfCar" :current-page.sync="allCarsUnion.listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="allCarsUnion.listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="allCarsUnion.total"> </el-pagination>
              <el-button size="small"  slot="reference" @click="showAllCarsHandle(scope.row)" v-waves>查看</el-button>
            </el-popover>
            </template>
          </el-table-column>
          <!--详情  -->
          <el-table-column v-else-if="item.prop=='detail'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
              <el-button size="small" @click="jump2detail(scope.row)" v-waves>查看</el-button>
            </template>
          </el-table-column>
          <!--金额  -->
          <el-table-column v-else-if="item.prop=='payable'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
              {{scope.row.payable | cent2yuan}}
            </template>
          </el-table-column>
          <!--状态  -->
          <el-table-column v-else-if="item.prop=='status'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
              {{ scope.row.status == '0' ? '未支付' : '已支付' }}
            </template>
          </el-table-column>
          <!--操作  -->
          <el-table-column v-else-if="item.prop=='operation'" width="200" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
              <el-button size="small" v-if="scope.row.status == '0'" type="danger" @click="killBillHandle(scope.row)" v-waves>销账</el-button>
              <el-button size="small" @click="exportBillHandle(scope.row)" v-waves>导出账单</el-button>
            </template>
          </el-table-column>
          <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
          </el-table-column>
        </template>
      </el-table>
      <div style="float:right;margin-top:10px">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
      <div style="clear:both"></div>
      <!-- 销账dialog -->
      <el-dialog title="销账" :visible.sync="killBillUnion.visible">
      <el-form>
        <el-form-item label="销账原因：">
          <el-select v-model="killBillUnion.reason" placeholder="请选择活动区域">
            <el-option :label="item.writeoffReason" :key="Math.random()" v-for="item in killBillUnion.reasonList" :value="item.writeoffReason"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="killBillApi">确 定</el-button>
      </div>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      fileName:'',              //导入的文件名
      uploadUrl:process.env.park_api + '/bind/uploadFile',
      company:'',
      tableHeaderArr: [
        { prop: 'id', align: 'center', label: '账单编号', width: 100 },
        { prop: 'company', align: 'center', label: '公司', width: 100 },
        { prop: 'status', align: 'center', label: '状态', width: 100 },
        { prop: 'billMonth', align: 'center', label: '账单月份', width: 100 },
        { prop: 'allCars', align: 'center', label: '所有车辆', width: 100 },
        { prop: 'detail', align: 'center', label: '账单详情', width: 100 },
        { prop: 'payable', align: 'center', label: '应付金额', width: 100 },
        { prop: 'operator', align: 'center', label: '支付人', width: 100 },
        { prop: 'reason', align: 'center', label: '销账原因', width: 100 },
        { prop: 'operation', align: 'center', label: '操作', width: 100 },
      ],
      tableDataArr: [],
      listQuery: {
        page: 1,
        limit: 20,
      },
      total: 0,
      typeRadio:'未支付',
      typeRadioRadioArr:['未支付','已支付'],
      // 所有车辆
      allCarsUnion:{
          listQuery: {
          page: 1,
          limit: 20,
        },
        total:0,
        tableDataArr:[],
        checkedData:{}
      },
      // 销账
      killBillUnion:{
        visible:false,
        reason:'',
        reasonList:[],
        checkedData:{},
      }
    };
  },
  watch:{
    typeRadio:function(val){
        this.getBillList(val == '未支付' ? 0 : 1)
    }
  },
  mounted() {
    this.getBillList()
    this.getKillReasonApi()
  },
  methods: {
    //  导入成功
    uploadSuccess:function(response, file, fileList){
        console.log(response,file,fileList)
        this.fileName = response.file_name
        this.upload()
    },
    // 上传
    upload:function(){
      this.$fetch({
        url: process.env.park_api + '/bind/insertBindCar',
        method: 'get',
        params: {
          fileName:this.fileName,
          operator:this.$store.getters.name
        }
      }).then((res) => {
        if(res.code == 200){
          this.$message.success('导入成功！')
        }
      })
    },
    // 展示所有车辆
    showAllCarsHandle:function(data){
      console.log(data)
      if(data){
        this.checkedData = data
      }
      this.$fetch({
        url: process.env.park_api + '/creditEnterpriseBill/getEnterpriseCar',
        method: 'get',
        params: {
          page:this.allCarsUnion.listQuery.page,
          limit:this.allCarsUnion.listQuery.limit,
          enterpriseId:this.checkedData.enterpriseId
        }
      }).then((res) => {
         this.allCarsUnion.total = res.totalPage
         this.allCarsUnion.tableDataArr = res.list.filter((item,index) =>{
           item.index = index+1
           return true
         })
      })
    },
    // 导出账单
    exportBillHandle:function(data){
      console.log(data)
      var tempwindow=window.open('_blank');  
      this.$fetch({
        url: process.env.park_api + '/creditEnterpriseBill/getEnterpriseBill',
        method: 'get',
        params: {
          enterpriseBillId:data.id,
          enterpriseId:data.enterpriseId
        }
      }).then((res) => {
        if(res.code == 200){
          this.$message.success('导出成功！')
          tempwindow.location=res.data;  
        }
      })
    },
    // 销账请求
    killBillApi:function(){
  
      this.$fetch({
        url: process.env.park_api + '/creditEnterpriseBill/doBookingBill?enterpriseBillId='+this.killBillUnion.checkedData.id+'&reason='+this.killBillUnion.reason+'&operator='+this.$store.getters.name,
        method: 'put',
        data: {
          enterpriseBillId:this.killBillUnion.checkedData.id,
          reason:this.killBillUnion.reason,
          operator:this.$store.getters.name
        }
      }).then((res) => {
        this.killBillUnion.visible = false
        this.$message.success('销账成功！')
        this.getBillList()
      })
    },
    // 销账
    killBillHandle:function(data){
        this.killBillUnion.visible = true
        this.killBillUnion.checkedData = data  
    },
    // 查看详情
    jump2detail:function(data){
        this.$router.push({path:'/parkingManager/componyCreditPaymentDetail',query:{ company:data.company,status:data.status,enterpriseId:data.enterpriseId }})
    },
    // 获取销账原因
    getKillReasonApi:function(){
      this.$fetch({
        url: process.env.park_api + '/writeReason/all',
        method: 'get',
        params: {}
      }).then((res) => {
        this.killBillUnion.reasonList = res
        this.killBillUnion.reason = res[0].writeoffReason
      })
    },
    // 获取表格数据
    getBillList: function() {
      this.$myLoading.show()
      this.$fetch({
        url: process.env.park_api + '/creditEnterpriseBill/listCreditEnterpriseBill',
        method: 'get',
        params: {
          company:this.company,
          status: this.typeRadio == '未支付' ? 0 : 1,
          page: this.listQuery.page,
          limit: this.listQuery.limit,
        }
      }).then((res) => {
        this.$myLoading.hide()
        this.tableDataArr = res.data.list
        this.total = res.data.totalCount
      })
    },
    // 分页变化
    handleSizeChangeOfCar(val) {
      this.allCarsUnion.listQuery.limit = val;
      this.showAllCarsHandle();
    },
    handleCurrentChangeOfCar(val) {
      this.allCarsUnion.listQuery.page = val;
      this.showAllCarsHandle();
    },
    // 分页变化
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getBillList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getBillList();
    },
    //   导入
    importHandle: function() {
      this.$fetch({
        url: process.env.park_api + '/creditEnterpriseBill/listCreditEnterpriseBill',
        method: 'get',
        params: {
          company:this.company,
          status: this.typeRadio == '未支付' ? 0 : 1,
          page: this.listQuery.page,
          limit: this.listQuery.limit,
        }
      }).then((res) => {
        this.$myLoading.hide()
        this.tableDataArr = res.data.list
        this.total = res.data.totalCount
      })
    },
    //   下载模板
    downloadTemplate:function(){
        window.open(process.env.park_api.replace('wxbackstage','template')+'企业车辆.xls');
    }
  }
};
</script>

<style lang='scss' scoped>
.container {
  background-color: #fff;
  margin: 20px;
  padding: 10px;
}
</style>
