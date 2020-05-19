<template>
  <div class="paramsManagerPage">
    <!--搜索条件  -->
    <div class="searchBox">
      <span>参数名称：</span>
      <el-input v-model="paramsName" placeholder="请输入"></el-input>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;添加人：</span>
      <el-input v-model="addUser" placeholder="请输入"></el-input>
      <el-button type="primary" @click="searchHandle">搜索</el-button>
      <!-- <div class="toggleSearch" @click="toggleSearch = !toggleSearch">
        <span>{{ !toggleSearch ? '展开∨' : '收起∧'}}</span>
      </div> -->
    </div>
    <!-- <p class="moreSearchOption" v-if="toggleSearch">更多搜索条件</p> -->
    <div class="utils">
      <el-button type="primary" @click="addParamsUnion.visible = true" size="small">添加参数模板</el-button>
      <el-button size="small" @click="batchOperation = !batchOperation">批量操作</el-button>
      <el-button size="small" @click="setParamsUnion.visible = true;getConfigBigArgData()">配置参数组</el-button>
      <el-button
        size="small"
        style="float:right;margin-right:20px;"
        @click="deleteArgsByCodes(batchDataArr)"
        v-if="batchOperation"
        type="danger"
      >删除</el-button>
    </div>
    <!--主表  -->
    <div class="mainTableBox">
      <el-table fit style="width:100%" :data="tableDataArr">
        <el-table-column v-if="batchOperation" type="selection" width="55"></el-table-column>
        <el-table-column prop="argsCode" label="编号" align="center"></el-table-column>
        <el-table-column prop="argsName" label="参数组名称" align="center"></el-table-column>
        <el-table-column prop="remarker" label="参数组说明" align="center"></el-table-column>
        <el-table-column label="参数数量" align="center">
          <template scope="scope">
              <el-popover placement="top" width="250" trigger="click">
                <ul>
                  <li><b style="font-size:16px;">名称：</b></li>
                  <li style="font-size:14px;" v-for="(item,index) in scope.row.argsVersionSmalls" :key="Math.random()">{{index+1}}.{{item.argsNameSmall}}</li>
                </ul>
                <span
                class="anchor"
                  slot="reference"
                  size="small"
                  v-waves
                >{{scope.row.argsVersionSmalls.length}}</span>
              </el-popover>
            </template>
        </el-table-column>
        <el-table-column prop="createtime" label="更新时间" align="center"></el-table-column>
        <el-table-column prop="operation" align="center" label="操作">
          <template scope="scope">
              <el-button size="small" @click="operationHandle(scope.row,1)" v-waves>编辑</el-button>
              <el-button size="small" @click="operationHandle(scope.row,2)" v-waves>删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- argsCode，argsName，remarker,argsVersionSmalls,createtime,operation -->
      <!-- <el-table
        :data="tableDataArr"
        @selection-change="selectionChange"
        fit
        style="width: 100%">
        <el-table-column v-if="batchOperation" type="selection" width="55"></el-table-column>
        <template v-for="item in tableHeaderArr">
          操作 
          <el-table-column
            v-if="item.prop=='operation'"
            :key="Math.random() +100"
            :align="item.align"
            :width="item.width"
            :prop="item.prop"
            :label="item.label">
            <template scope="scope">
              <el-button size="small" @click="operationHandle(scope.row,1)" v-waves>编辑</el-button>
              <el-button size="small" @click="operationHandle(scope.row,2)" v-waves>删除</el-button>
            </template>
          </el-table-column>
          参数数量 
          <el-table-column
            v-else-if="item.prop=='argsVersionSmalls'"
            :key="Math.random() +100"
            :align="item.align"
            :prop="item.prop"
            :width="item.width"
            :label="item.label">
            <template scope="scope">
              <el-popover placement="top" width="250" trigger="click">
                <ul>
                  <li><b style="font-size:16px;">名称：</b></li>
                  <li style="font-size:14px;" v-for="(item,index) in scope.row.argsVersionSmalls" :key="Math.random()">{{index+1}}.{{item.argsNameSmall}}</li>
                </ul>
                <span
                class="anchor"
                  slot="reference"
                  size="small"
                  v-waves
                >{{scope.row.argsVersionSmalls.length}}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :align="item.align"
            :key="Math.random() +100"
            :prop="item.prop"
            :label="item.label"
          ></el-table-column>
        </template>
      </el-table> -->
    </div>
    <!--dialog参数组权重  -->
    <el-dialog
      id="dialogSetParamsWeight"
      title="设置参数组权重"
      :visible.sync="setParamsUnion.visible"
    >
      <div class="itemBox">
        <p class="title">参数</p>
        <div class="paramsGroup" v-for="(item,index) in setParamsUnion.listData" :key="Math.random()">
          <div class="group">
            <div>
              参数组名称：
              <span style="color:#20a0ff">{{item.argsName}}</span>
            </div>
            <div>
              <span>参数权重：</span>
              <el-input type="number" min="0" max="100" @change.native="configArgsFormChange(item,index,$event,'totalWeight')" :value="item.totalWeight"></el-input>
              <span>%</span>
            </div>
            <div>
              <span>分值：</span>
              <el-input type="number" min="0" max="10" @change.native="configArgsFormChange(item,index,$event,'totalScore')" :value="item.totalScore"></el-input>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveConfigParamsHandle">保 存</el-button>
      </span>
    </el-dialog>
    <!--dialog添加参数-->
    <el-dialog
      id="dialogAddParams"
      :title="dialogIsAddParams ? '添加参数' :'编辑参数'"
      :visible.sync="addParamsUnion.visible"
      :before-close="beforeCloseAddParams"
    >
      <div class="paramsGroupName">
        <p class="title">参数组名称</p>
        <div>
          <span>版本号 <span style="color:red">*</span> &nbsp;&nbsp;&nbsp;：&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-input style="width:300px;" v-model="addParamsUnion.form.argsVersion"></el-input>
        </div>
        <div>
          <span>参数名称 <span style="color:red">*</span>：&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-input style="width:300px;" v-model="addParamsUnion.form.argsName"></el-input>
        </div>
        <div>
          <span>参数组备注 <span style="color:red">*</span>：</span>
          <el-input style="width:300px;" v-model="addParamsUnion.form.remarker" type="textarea"></el-input>
        </div>
      </div>
      <div class="paramsGroup">
        <p class="title">参数</p>
        <div class="group" v-for="(item,index) in addParamsUnion.form.args" :key="Math.random()+10">
          <div>
            <span>参数名称 <span style="color:red">*</span>：&nbsp;&nbsp;&nbsp;</span>
            <el-input
              :tabindex="index"
              :value="addParamsUnion.form.args[index].argsNameSmall"
              @change.native="addParamsFormChange(item,index,$event,'argsNameSmall')"
              style="width:300px"
            ></el-input>
          </div>
        </div>
        <el-button size="small" v-if="dialogIsAddParams" @click="addMoreArgsGroup">+添加</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddParamsHandle">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      tableData:[
      {name:'张三',age:18,tel:15038927731,tel2:123,tel3:234,tel4:234234,tel5:231231},
      {name:'张三',age:18,tel:15038927731,tel2:123,tel3:234,tel4:234234,tel5:231231},
      {name:'张三',age:18,tel:15038927731,tel2:123,tel3:234,tel4:234234,tel5:231231}],
      // 搜索参数
      paramsName: "",
      addUser: "",
      toggleSearch: false,
      // 主表
      tableHeaderArr: [
        { prop: "argsCode", align: "center", label: "编号", width: 250 },
        { prop: "argsName", align: "center", label: "参数组名称", width: 200 },
        { prop: "remarker", align: "center", label: "参数组说明", width: 200 },
        {
          prop: "argsVersionSmalls",
          align: "center",
          label: "参数数量",
          width: 200
        },
        {
          prop: "createtime",
          align: "center",
          label: "最新更新时间",
          width: 200
        },
        { prop: "operation", align: "center", label: "操作", width: 200 }
      ],
      tableDataArr: [],
      batchOperation: false, // 批量操作
      batchDataArr: [],
      // 设置参数
      setParamsUnion: {
        visible: false,
        listData:[],
      },
      // 添加参数
      addParamsUnion: {
        visible: false,
        form: {
          id: "",
          argsName: "",
          argsVersion: "",
          remarker: "",
          args: [{ argsNameSmall: "", weight: "", score: "" }]
        }
      },
      dialogIsAddParams: true,
    };
  },

  mounted() {
    this.searchHandle();
  },
  methods: {
    // 保存配置参数
    saveConfigParamsHandle:function(){
      console.log(this.setParamsUnion.listData)
      for(var i=0;i<this.setParamsUnion.listData.length;i++){
        var data = this.setParamsUnion.listData[i]
        this.$fetch({
          url: process.env.price_system + "/pricingArgsVersionBig/updateArgs",
          method: "post",
          data: {
            bigArgs: {
              id: data.id,
              created: this.$store.getters.name,
              argsVersion: data.argsVersion,
              argsName: data.argsName,
              remarker: data.remarker,
              totalScore:data.totalScore,
              totalWeight:data.totalWeight
            },
            // smallArgs: this.addParamsUnion.form.args,
            token: this.$store.getters.token
          }
        })
          .then(res => {
            this.setParamsUnion.visible = false;
            this.$message.success("操作成功！");
            this.searchHandle();
          })
          .catch(err => {});
      }
      
    },
    // 配置参数组
    getConfigBigArgData: function() {
      this.$fetch({
        url: process.env.price_system + "/pricingArgsVersionBig/listArgs",
        method: "post",
        data: {
          created: this.addUser,
          argsName: this.paramsName,
          token: this.$store.getters.token
        }
      })
        .then(res => {
          this.setParamsUnion.listData = res.data;
        })
        .catch(err => {});
    },
    // 在关闭dialog之前重置form
    beforeCloseAddParams: function(done) {
      for (var key in this.addParamsUnion.form) {
        this.addParamsUnion.form[key] = "";
      }
      this.addParamsUnion.form.args = [
        { argsNameSmall: "", weight: "", score: "" }
      ];
      done();
    },
    // 选项变化
    selectionChange: function(selection) {
      var codes = selection.map(item => item.argsCode);
      this.batchDataArr = codes;
    },
    // 编辑/删除/价格计算
    operationHandle: function(data, n) {
      console.log(data, n);
      if (!this.batchOperation) {
        if (n == 1) {
          // 初始化编辑表单数据
          this.dialogIsAddParams = false;
          this.addParamsUnion.visible = true;
          this.addParamsUnion.form.argsName = data.argsName;
          this.addParamsUnion.form.argsVersion = data.argsVersion;
          this.addParamsUnion.form.remarker = data.remarker;
          this.addParamsUnion.form.args = data.argsVersionSmalls;
          this.addParamsUnion.form.id = data.id;
        } else if (n == 2) {
          this.deleteArgsByCodes([data.argsCode]);
        } else {
        }
      }
    },
    // 删除大类/小类
    deleteArgsByCodes: function(codes) {
      if (codes.length > 0) {
        this.$confirm("确定要删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$fetch({
            url: process.env.price_system + "/pricingArgsVersionBig/delArgs",
            method: "post",
            data: {
              argCodes: codes,
              token: this.$store.getters.token
            }
          })
            .then(res => {
              this.$message.success("删除成功！");
              this.searchHandle();
            })
            .catch(err => {});
        });
      }
    },
    // 重置表单form
    resetForm:function(){
      for (var key in this.addParamsUnion.form) {
         this.addParamsUnion.form[key] = ''
      }
      this.addParamsUnion.form.args = [{ argsNameSmall: "", weight: "", score: "" }]
    },
    // 搜索
    searchHandle: function() {
      this.$myLoading.show()
      this.$fetch({
        url: process.env.price_system + "/pricingArgsVersionBig/listArgs",
        method: "post",
        data: {
          created: this.addUser,
          argsName: this.paramsName,
          token: this.$store.getters.token
        }
      })
        .then(res => {
          this.$myLoading.hide()
          this.tableDataArr = res.data;
        })
        .catch(err => {
          this.$myLoading.hide()
        });
    },
    // 通过input的value，更新数据源arr中对应的对象
    addParamsFormChange: function(item, index, $event, key) {
      var value = $event.target.value;
      item[key] = value;
      this.addParamsUnion.form.args[index] = item;
    },
    configArgsFormChange: function(item, index, $event, key) {
      var value = $event.target.value;
      if(parseFloat(value) >100){
        value = 100
      }
      if((parseFloat(value) >10 && key =='totalScore')){
        value = 10
      }
      item[key] = value;
      this.setParamsUnion.listData[index] = item;
    },
    // 添加更多参数组
    addMoreArgsGroup: function() {
      this.addParamsUnion.form.args.push({
        argsNameSmall: "",
        weight: "",
        score: ""
      });
    },
    // 新增/编辑 大类小类参数
    saveAddParamsHandle: function() {
      this.addParamsUnion.form.args.forEach(item => {
        (item.created = this.$store.getters.name),
          (item.argsVersionSmall = this.addParamsUnion.form.argsVersion);
      });
      var url = "addArgs";
      var data = {
            // id: this.addParamsUnion.form.id,
            created: this.$store.getters.name,
            argsVersion: this.addParamsUnion.form.argsVersion,
            argsName: this.addParamsUnion.form.argsName,
            remarker: this.addParamsUnion.form.remarker
      }
      if (!this.dialogIsAddParams) {
        url = "updateArgs";
        data.id = this.addParamsUnion.form.id
      }
      // 验证不能为空
      if(this.addParamsUnion.form.argsVersion.trim()=='' || this.addParamsUnion.form.argsName.trim()=='' ||this.addParamsUnion.form.remarker.trim()==''){
        this.$message.error('*选项不能为空！')
        return 
      }
      for(var i=0;i<this.addParamsUnion.form.args.length;i++){
        var o = this.addParamsUnion.form.args[i]
        if(o.argsNameSmall.trim() == ''){
          this.$message.error('*选项不能为空！')
          return 
        }
      }
      this.addParamsUnion.form.args.forEach(item =>{
        item.score = 0;
        item.weight = 0;
      })
      this.$fetch({
        url: process.env.price_system + "/pricingArgsVersionBig/" + url,
        method: "post",
        data: {
          bigArgs: data,
          smallArgs: this.addParamsUnion.form.args,
          token: this.$store.getters.token
        }
      })
        .then(res => {
          this.dialogIsAddParams = true;
          this.addParamsUnion.visible = false;
          this.resetForm()
          if(res.code == 200){
            this.$message.success("操作成功！");
          }else{
            this.$message.error("操作失败！");
          }
          this.searchHandle();
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang='scss' scoped>
.anchor{
  color: #20a0ff !important;
  cursor: pointer ;
}
.paramsManagerPage {
  border: 20px solid #eee;
  background-color: #fff;
  #dialogSetParamsWeight {
    & /deep/ .el-dialog--large {
      width: 900px;
    }
    & /deep/ .el-input {
      width: 150px;
    }
    & /deep/ .itemBox {
      border: 1px solid #eee;
      .title {
        background-color: #eee;
        padding: 20px;
        margin: 0;
      }
      .paramsGroup {
        .group {
          overflow: hidden;
          display: flex;
          align-items: center;
          margin: 20px 0;
          & /deep/ .el-input{
            width: 100px;
          }
          & > div {
            margin-left: 30px;
            flex: 1;
          }
        }
      }
    }
  }
  #dialogAddParams {
    & /deep/ .el-dialog {
      width: 750px;
    }
    & /deep/ .el-input {
      width: 150px;
    }
    & /deep/ .el-textarea {
      width: 200px;
    }
    & /deep/ .paramsGroupName {
      border: 1px solid #eee;
      padding-bottom: 20px;
      .title {
        margin: 0;
        padding: 10px;
        background: #eee;
      }
      & > div {
        margin-left: 20px;
        margin-top: 20px;
        display: flex;
        align-items: flex-start;
      }
    }
    & /deep/ .paramsGroup {
      border: 1px solid #eee;
      padding-bottom: 20px;
      margin-top: 30px;
      & /deep/ .el-input {
        width: 100px;
      }
      & /deep/ .el-button {
        margin-left: 20px;
        margin-top: 20px;
      }
      .title {
        margin: 0;
        padding: 10px;
        background: #eee;
      }
      .group {
        display: flex;
        align-items: center;
        & > div {
          margin-left: 20px;
          margin-top: 20px;
        }
      }
    }
  }
  .searchBox {
    display: flex;
    padding: 10px 0 20px 20px;
    & /deep/ .el-input {
      width: 300px;
    }
    & /deep/ .el-button {
      margin-left: 20px;
    }
    span {
      line-height: 38px;
      text-align: center;
    }
    span:last-child {
      margin-left: 20px;
    }
    .toggleSearch {
      color: #20a0ff;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .moreSearchOption {
    padding-left: 20px;
  }
  .utils {
    border-top: 1px solid #eee;
    padding-top: 20px;
    padding-left: 20px;
  }
  .mainTableBox {
    padding: 20px;
    overflow: hidden;
  }
}
</style>
