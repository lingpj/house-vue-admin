<template>
  <div class="parkListPage">
    <!--搜索条件  -->
    <div class="searchBox">
      <span>项目名称：</span>
      <el-input v-model="projectName" placeholder="请输入"></el-input>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;状态：</span>
      <el-select clearable v-model="projectStatus" placeholder="请选择">
        <el-option
          v-for="item in projectStatusArr"
          :key="item.id"
          :label="item.statusName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="getTableData">搜索</el-button>
    </div>
    <div class="utils">
      <el-button type="primary" size="small" @click="addProjectVisible = true">添加项目</el-button>
    </div>
    <!--主表  -->
    <div class="mainTableBox">
      <el-table :data="tableDataArr" fit style="width: 100%">
        <!--checkbox  -->
        <el-table-column v-if="batchOperation" type="selection" width="55"></el-table-column>
        <template v-for="item in tableHeaderArr">
          <!--操作  -->
          <el-table-column
            v-if="item.prop=='operation'"
            :key="Math.random() +100"
            :align="item.align"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
          >
            <template scope="scope">
              <!-- <el-button size="small" @click="operationHandle(scope.row,1)" v-waves>编辑</el-button> -->
              <el-button size="small" @click="operationHandle(scope.row,2)" v-waves>删除</el-button>
            </template>
          </el-table-column>
          <!--状态  -->
          <el-table-column
            v-else-if="item.prop=='isDeleted'"
            :key="Math.random() +100"
            :align="item.align"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
          >
            <template scope="scope">
              <span
                :style="{ color: (scope.row.statusId == 1 ? 'green' : 'red')}"
              >● {{scope.row.statusId == 1 ? '招商中' : '关闭'}}</span>
            </template>
          </el-table-column>
          <!--项目名称  -->
          <el-table-column
            v-else-if="item.prop=='projectName'"
            :key="Math.random() +100"
            :align="item.align"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
          >
            <template scope="scope">
              <span
                class="anchor"
                size="small"
                v-waves
                @click="projectNameHandle(scope)"
              >{{scope.row.projectName}}</span>
            </template>
          </el-table-column>
          <!-- 更新时间 -->
          <el-table-column
            v-else-if="item.prop=='updateDate'"
            :key="Math.random() +100"
            :align="item.align"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
          >
            <template scope="scope">{{scope.row.updateDate | formatDate}}</template>
          </el-table-column>
          <!--周边定价  -->
          <el-table-column
            v-else-if="item.prop=='price3'"
            :key="Math.random() +100"
            :align="item.align"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
          >
            <template scope="scope">
              <el-popover placement="right" width="600" trigger="click">
                <el-table :data="scope.row.rimProjects" fit>
                  <el-table-column property="projectName" label="项目名称"></el-table-column>
                  <el-table-column property="address" label="地址"></el-table-column>
                  <el-table-column property="totalScore" label="分值"></el-table-column>
                  <el-table-column property="position" label="地图">
                    <template scope="msg">
                      <el-button size="small" @click="lookProjectMap(scope)" v-waves>查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button size="small" slot="reference" v-waves>查看</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop=='lookArgs'"
            :key="Math.random() +100"
            :align="item.align"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
          >
            <template scope="scope">
              <el-popover placement="left" width="400" trigger="click">
                <!-- <ul>
                  <li><b style="font-size:16px;">名称：</b></li>
                  <li style="font-size:14px;" v-for="(item,index) in scope.row.args" :key="Math.random()">{{index+1}}.{{item.argsName}}</li>
                </ul> -->
                <el-table :data="scope.row.args" fit>
                  <el-table-column property="argsName" label="参数名称"></el-table-column>
                  <el-table-column property="totalScore" label="分值"></el-table-column>
                  <el-table-column property="totalWeight" label="权重%"></el-table-column>
                </el-table>
                <el-button size="small" slot="reference" v-waves>查看</el-button>
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
      </el-table>
      <div style="float:right;margin-top:10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="listQuery.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!--添加项目  -->
    <el-dialog
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="新建项目"
      v-model="addProjectVisible"
      :visible.sync="addProjectVisible"
      size="large"
    >
      <addProject @closeDialog="closeDialog"></addProject>
    </el-dialog>
    <!--lookImgDialog查看地理位置  -->
    <el-dialog
      title="查看地理位置"
      id="lookPositionDialog"
      :modal="false"
      :visible.sync="lookPositionDialogVisible"
      width="30%"
    >
      <div id="BMap" style="height:300px;width:100%;margin:0 auto" class="container"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookPositionDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addProject from "../components/addProject";
export default {
  name: "",
  components: { addProject },
  data() {
    return {
      projectName: "",
      projectStatus: "",
      projectStatusArr: [{ id: 1, name: "招商中" }, { id: 0, name: "关闭" }],
      toggleSearch: false,
      tableHeaderArr: [
        { prop: "projectCode", align: "center", label: "编号", width: 100 },
        { prop: "projectName", align: "center", label: "项目名称", width: 200 },
        { prop: "isDeleted", align: "center", label: "状态", width: 100 },
        { prop: "address", align: "center", label: "项目区位", width: 100 },
        {
          prop: "updateDate",
          align: "center",
          label: "价格更新时间",
          width: 150
        },
        { prop: "lookArgs", align: "center", label: "参数测评", width: 100 },
        { prop: "price3", align: "center", label: "周边园区定价", width: 150 },
        { prop: "operation", align: "center", label: "操作", width: 100 }
      ],
      tableDataArr: [],
      // 分页
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      // 批量操作
      batchOperation: false,
      // 添加项目
      addProjectVisible: false,
      // 查看地图
      lookPositionDialogVisible: false
    };
  },

  mounted() {
    this.getTableData();
    this.getStatus()
  },
  filters: {
    formatDate: function(val) {
      if (!val) return "";
      return val.slice(0, 10);
    }
  },
  methods: {
    // 获取下拉选项状态
    getStatus: function() {
      this.$fetch({
        url: process.env.price_system + "/pricingProjectStatus/all",
        method: "get"
      })
        .then(res => {
          this.projectStatusArr = res;
          this.projectStatus = res[0].statusName;
        })
        .catch(err => {});
    },
    //   1编辑，2删除，3价格计算
    operationHandle: function(data, n) {
      console.log(data, n);
      if (n == 1) {
      } else if (n == 2) {
        this.deleteProjectByCode(data.projectCode);
      } else {
      }
    },
    // 删除项目
    deleteProjectByCode: function(code) {
      this.$confirm("确定要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$fetch({
          url: process.env.price_system + "/pricingProject/delProject",
          method: "get",
          params: {
            projectCode: code,
            token: this.$store.getters.token
          }
        })
          .then(res => {
            this.$message.success("删除成功！");
            this.getTableData();
          })
          .catch(err => {});
      });
    },
    // 分页变化
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getTableData();
    },
    // 项目名称详情
    projectNameHandle: function(scope) {
      console.log(scope);
      this.$router.push({
        path: "/parkManager/projectDetail/",
        query: { projectCode: scope.row.projectCode }
      });
    },
    // 获取主表数据
    getTableData: function() {
      this.$myLoading.show();
      this.$fetch({
        url: process.env.price_system + "/pricingProject/listPricingProject",
        method: "post",
        data: {
          projectName: this.projectName,
          statusId: this.projectStatus,
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          token: this.$store.getters.token
        }
      })
        .then(res => {
          this.$myLoading.hide();
          this.tableDataArr = res.data.list;
          this.total = res.data.count;
        })
        .catch(err => {
          this.$myLoading.hide();
        });
    },
    // 关闭添加项目dialog
    closeDialog: function() {
      this.addProjectVisible = false;
      this.getTableData();
    },
    // 查看项目地图
    lookProjectMap: function(data) {
      var addressArr = data.row.rimProjects.map(item => item.address);
      this.lookPositionDialogVisible = true;
      this.$nextTick(function() {
        this.initMap(addressArr);
      });
      console.log(addressArr);
    },
    // 编写自定义函数,创建标注
    addMarker: function(point, map) {
      var marker = new BMap.Marker(point);
      map.addOverlay(marker);
      return marker
    },
    // 地图
    initMap: function(addressArr) {
      var self = this;
      var map = new BMap.Map("BMap");
      // 创建地址解析器实例
      var myGeo = new BMap.Geocoder();
      map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));
      map.addControl(new BMap.NavigationControl());
      // 将地址解析结果显示在地图上,并调整地图视野
      for (let i = 0; i < addressArr.length; i++) {
        let address = addressArr[i]
        myGeo.getPoint(address, function(point) {
          if (point) {
            map.centerAndZoom(point, 16);
            var marker =  self.addMarker(point, map);
            let opts = {
              width: 200, // 信息窗口宽度
              height: 100, // 信息窗口高度
              // title : "上海e通世界北区" , // 信息窗口标题
              enableMessage: true //设置允许信息窗发送短息
            };
            let infoWindow = new BMap.InfoWindow(address, opts); // 创建信息窗口对象
            map.openInfoWindow(infoWindow, point);
            marker.addEventListener("click", function() {
              map.openInfoWindow(infoWindow, point); //开启信息窗口
            });
          } else {
            alert("您的地址没有解析到结果!");
          }
        });
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.anchor {
  color: #20a0ff !important;
  cursor: pointer;
}
.parkListPage {
  border: 20px solid #eee;
  background-color: #fff;
  & /deep/ .el-dialog--large {
    width: 70%;
  }
  & /deep/ .el-steps {
    margin-left: 20%;
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
