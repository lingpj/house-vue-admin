<template>
  <div class="resultPage">
    <div class="itemBox doPrice">
      <p class="title">园区定价</p>
      <div class="tips" v-if="!isStaticShow">提示: 点击输入框可修改指导价格</div>
      <div class="areaBaseline">
        本区域内的项目的价格基线为:
        <span>{{baselinePrices}}</span>
      </div>
      <div class="pointerPrice">该项目的指导价格:
        <el-input size="small" style="width:50px;" v-if="!isStaticShow" v-model="referencePrice"></el-input>
        <span style="color:red" v-else>{{referencePrice}}</span>
      </div>
    </div>
    <div class="itemBox doPriceLook">
      <p class="title">周边园区定价参考</p>
      <div class="tips" v-if="!isStaticShow">提示: 请选择周边的园区</div>
      <div class="tableBox">
        <el-table :data="tableDataArr" @selection-change="handleSelectionChange" border fit highlight-current-row style="width: 100%">
          <el-table-column type="selection" width="55" v-if="!isStaticShow"></el-table-column>
          <template v-for="(item,index) in tableHeaderArr">
            <el-table-column
              v-if="item.prop=='index3'"
              :key="Math.random() +100"
              :align="item.align"
              :prop="item.prop"
              :label="item.label"
            >
              <template scope="scope">
                <el-button size="small" @click="lookPositionHandle(scope)">查看</el-button>
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
      </div>
    </div>
    <div class="itemBox">
      <p class="title">各项参数值</p>
      <div class="box" v-for="(item,index) in currentDataList" :key="Math.random()">
      <p class="title">{{item.argsName}}</p>
      <div class="group" v-for="ele in item.argsVersionSmalls " :key="Math.random()">
        <label>{{ele.argsNameSmall}}&nbsp;&nbsp;&nbsp;&nbsp;</label>分数：
        <el-slider disabled="" v-model="ele.score" max="10" style="margin-right:20px;width:200px;"  ></el-slider>
        <el-button size="small">{{ele.score}}</el-button> &#x3000;&#x3000;&#x3000;&#x3000;
        权重： 
        <el-slider disabled="" v-model="ele.weight" style="margin-right:20px;width:200px;"  ></el-slider>
        <el-button size="small">{{ele.weight}}</el-button>
      </div>
    </div>
    </div>
     <!--lookImgDialog查看地理位置  -->
      <el-dialog title="查看地理位置" id="lookPositionDialog" :modal="false" :visible.sync="lookPositionDialogVisible" width="30%">
        <div id="BMap" style="height:300px;width:100%;margin:0 auto" class="container"></div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="lookPositionDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: ["currentState","isStaticShow" ,  'priceData','argsData' ],
  data() {
    return {
      tableDataArr: [],
      tableHeaderArr: [
        { prop: "address", align: "center", label: "地理位置", width: 100 },
        { prop: "currentPrice", align: "center", label: "当前定价", width: 100 },
        { prop: "index3", align: "center", label: "地理位置", width: 100 },
        { prop: "totalScore", align: "center", label: "总分", width: 100 }
      ],
      // 从第3步拿到的数据
      currentDataList:[],
      // 选择的周边定价
      checkedSelection:[],
      // 价格..
      baselinePrices:'',
      referencePrice:'',
      currentPrice:'',
      // 查看地图
      lookPositionDialogVisible:false
    };
  },
  watch:{
    // 根据第3步的选择随时变化
    currentState:function(val,oldVal){
      if(oldVal == 2){
        this.currentDataList = JSON.parse(sessionStorage.getItem('paramsInfo'))
      }
    }
  },
  mounted() {
    this.getAroundPrice()
    this.getBasePrice()
    if(this.argsData){
      this.currentDataList = this.argsData
      console.log('子',this.currentDataList )
    }
  },
  methods: {
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
    // 获取指导价和基线价格
    getBasePrice:function(){
      this.$fetch({
        url: process.env.price_system + "/pricingProjectPrice/getProjectPrice",
        method: "post",
        data:{}
      })
      .then(res => {
        console.log('>>>',this.priceData)
        if(this.priceData){
          this.baselinePrices = this.priceData.baselinePrices
          this.referencePrice = this.priceData.referencePrice
          this.currentPrice = this.priceData.currentPrice
        }else{
          this.baselinePrices = res.data[0].baselinePrices
          this.referencePrice = res.data[0].referencePrice
          this.currentPrice = res.data[0].currentPrice
        }
        
      })
      .catch(err => {});
    },
    // 获取周边定价
    getAroundPrice:function(){
      this.$fetch({
        url: process.env.price_system + "/pricingAllProject/all",
        method: "get"
      })
      .then(res => {
        this.tableDataArr = res
      })
      .catch(err => {});
    },
    // 多选周边定价
    handleSelectionChange:function(data){
        console.log(data)
        this.checkedSelection = data
    },
    getPageData:function(){
      return {
        projectPrice: {
          baselinePrices:this.baselinePrices,
          currentPrice:this.currentPrice,
          referencePrice:this.referencePrice
        } ,
        rimProject: this.checkedSelection
      } 
    }
  }
};
</script>

<style lang='scss' scoped>
.tips {
  color: #999;
}
.anchor {
  color: #20a0ff;
  cursor: pointer;
  margin-left: 50px;
}

.resultPage {
  & /deep/ .el-slider__runway.disabled .el-slider__bar{
     background-color: #20a0ff;
  }
  .doPrice {
    & > div {
      margin-left: 50px;
      margin-bottom: 20px;
    }

    .areaBaseline {
      span {
        color: Red;
        margin-left: 30px;
      }
    }
    .pointerPrice {
      & /deep/ .el-button {
        margin-left: 30px;
      }
    }
  }
  .doPriceLook {
    .tips {
      margin-left: 50px;
    }
    .tableBox {
      margin: 20px 50px;
      overflow: hidden;
    }
  }
  .itemBox {
    border: 1px solid lightgray;
    margin-top: 20px;
    overflow: hidden;
    border-radius: 10px;
    .box{
      // width: 80%;
      // float: left;
      // display: inline-block;
      border: 1px solid #eee;
      margin: 20px;
      padding: 10px 20px;
      border-radius: 10px;
      .title{
        background-color: transparent;
      }
    }
    .item {
      width: 49%;
      display: inline-block;
      p {
        margin-left: 50px;
        padding-bottom: 20px;
        font-size: 15px;
        font-weight: 600;
        color: #20a0ff;
      }
    }
    .title {
      margin: 0;
      margin-bottom: 20px;
      color: #444;
      background-color: #eee;
      padding: 10px;
    }
    & /deep/ .addBtn {
      margin-left: 40px;
      margin-bottom: 50px;
    }
    .group {
      overflow: hidden;
      display: flex;
      align-items: center;
      padding-left: 20px;
      margin-bottom: 20px;
      & > label {
        width: 150px;
        float: left;
      }
      & /deep/ .el-slider {
        width: 70%;
        float: left; // display: inline-block;
      }
    }
  }
}
</style>
