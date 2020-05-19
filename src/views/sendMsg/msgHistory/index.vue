<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="手机号码">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
           <el-form-item label="发送日期">
              <el-date-picker
                v-model="form.date"
                type="datetimerange"
                range-separator=" 至 "
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              &#x3000; 
              <el-button @click="query" type="primary">查询</el-button>
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <el-table id="table" :data="tableDataArr" border fit highlight-current-row style="width: 100%">
        <template v-for="item in tableHeaderArr">
          <!--详情  -->
          <el-table-column v-if="item.prop=='content'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
            <template scope="scope">
              <el-button size="small" @click="contentHandle(scope.row)" v-waves>查看</el-button>
            </template>
          </el-table-column>
          <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
          </el-table-column>
        </template>
      </el-table>
    <div style="float:right;margin-top:10px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogUnion.visible"
      size="large">
      <div style="overflow:hidden">
        <el-table id="table" :data="dialogUnion.tableDataArr" border fit highlight-current-row style="width: 100%">
          <template v-for="item in dialogUnion.tableHeaderArr">
            <!--详情  -->
            <el-table-column v-if="item.prop=='content'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                <el-button size="small" @click="contentHandle(scope.row)" v-waves>查看</el-button>
              </template>
            </el-table-column>
             <!--详情  -->
            <el-table-column v-else-if="item.prop=='sendStatus'" :key="Math.random() +100" :align="item.align" :prop="item.prop" :label="item.label">
              <template scope="scope">
                {{scope.row.sendStatus | formatStatus}}
              </template>
            </el-table-column>
            <el-table-column v-else :align="item.align" :key="Math.random() +100" :prop="item.prop" :label="item.label">
            </el-table-column>
          </template>
        </el-table>
      <div style="float:right;margin-top:10px">
        <el-pagination @size-change="dialogHandleSizeChange" @current-change="dialogHandleCurrentChange" :current-page.sync="dialogUnion.listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="dialogUnion.listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="dialogUnion.total"> </el-pagination>
      </div>
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
      form: {
        phone: "",
        date:''
      },
      tableHeaderArr: [
        { prop: "send_time", align: "center", label: "发送日期", width: 100 },
        { prop: "receive_num", align: "center", label: "收信人", width: 100 },
        { prop: "success_num", align: "center", label: "成功数量", width: 100 },
        { prop: "failed_num", align: "center", label: "失败数量", width: 100 },
        { prop: "content", align: "center", label: "发送结果", width: 100 },
        { prop: "template_name", align: "center", label: "消息模板", width: 100 },
        { prop: "send", align: "center", label: "发送人", width: 100 },
      ],
      tableDataArr: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      // dialog
      dialogUnion:{
        visible:false,
        tableHeaderArr: [
          { prop: "sendTime", align: "center", label: "发送时间", width: 100 },
          { prop: "roomNum", align: "center", label: "户名", width: 100 },
          { prop: "receive", align: "center", label: "电话号码", width: 100 },
          { prop: "sendStatus", align: "center", label: "状态", width: 100 },
        ],
        tableDataArr: [],
        listQuery: {
          page: 1,
          limit: 10
        },
        total: 0,
        checkedData:{}
      }
    };
  },
  filters:{
    formatStatus:function(val){
      return parseInt(val) == 1 ? '失败' : '成功'
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    // dialog分页
    dialogHandleSizeChange:function(val){
      this.dialogUnion.listQuery.limit = val
      this.getSendContentApi()
    },
    dialogHandleCurrentChange:function(val){
      this.dialogUnion.listQuery.page = val
      this.getSendContentApi()
    },
    // 主分页
    handleSizeChange:function(val){
      this.listQuery.limit = val
      this.query()
    },
    handleCurrentChange:function(val){
      this.listQuery.page = val
      this.query()
    },
    // 查询
    query: function() {
      this.$myLoading.show()
      var startTime = this.form.date == '' ? '' : this.form.date[0].format('yyyy-MM-dd hh:ss:mm')
      var endTime = this.form.date == '' ? '' : this.form.date[1].format('yyyy-MM-dd hh:ss:mm')

      this.$fetch({
        url: process.env.sendMsg_api + '/messageRecord/listMessageRecord',
        method: 'get',
        params: {
          page:this.listQuery.page,
          limit:this.listQuery.limit,
          phone:this.form.phone,
          startTime:startTime,
          endTime:endTime,
        }
      }).then(res => {
        this.$myLoading.hide()
        if(res.data){
          this.total = res.data.count
          this.tableDataArr = res.data.list
        }else{
          this.total = 0
          this.tableDataArr = []
        }
      })
    },
    // 获取发送内容api
    getSendContentApi:function(){
      this.$fetch({
        url: process.env.sendMsg_api + '/messageRecord/list',
        method: 'get',
        params: {
          page:this.dialogUnion.listQuery.page,
          limit:this.dialogUnion.listQuery.limit,
          phone:this.form.phone,
          send:this.dialogUnion.checkedData.send,
          sendTime:this.dialogUnion.checkedData.send_time,
          templateId:this.dialogUnion.checkedData.template_id
        }
      }).then(res => { 
        this.dialogUnion.tableDataArr = res.data.list.filter(item =>{
          try {
            var o = JSON.parse(item.content)
            item.roomNum = o.roomNum
          } catch (error) {
            item.roomNum = ''
          }
          return true
        })
        this.dialogUnion.total = res.data.count
      })
    },
    // 发送内容
    contentHandle:function(data){
      this.dialogUnion.checkedData = data
      this.dialogUnion.visible = true
      this.getSendContentApi()
    }
  }
};
</script>

<style lang='scss' scoped>
.container {
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  overflow: hidden;
}
</style>
