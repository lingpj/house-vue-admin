import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router);

/* layout */
import Layout from '../views/layout/Layout';

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export const constantRouterMap = [{
  path: '/login',
  component: _import('login/index'),
  hidden: true
},
{
  path: '/authredirect',
  component: _import('login/authredirect'),
  hidden: true
},
{
  path: '/404',
  component: _import('error/404'),
  hidden: true
},
{
  path: '/401',
  component: _import('error/401'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  name: '首页',
  hidden: true,
  children: [{
    path: 'dashboard',
    component: _import('dashboard/index')
  }]
},
{
  path: '/introduction',
  component: Layout,
  redirect: '/introduction/index',
  icon: 'form',
  noDropdown: true,
  children: [{
    path: 'index',
    component: _import('introduction/index'),
    name: '简述'
  }]
},
// 企业账单详情
{
  path: '/companyDetail',
  component: _import('bill/billList/components/companyDetail'),
  hidden: true
},
// 企业支付凭证
{
  path: '/paymentVoucher',
  component: _import('bill/billList/components/paymentVoucher'),
  hidden: true
},
// 企业支付凭证
{
  path: '/payOrNoPayBill',
  component: _import('bill/billList/components/payOrNoPayBill'),
  hidden: true
},


// 通知
{
  path: '/notification',
  component: Layout,
  redirect: '/notification/index',
  name: '通知',
  children: [{
    path: 'index',
    component: _import('notification/index'),
    name: '通知'
  }]
},
// 订单详情
{
  path: '/orderManager',
  component: Layout,
  redirect: '/orderManager/searchOrder',
  name: '订单管理',
  children: [{
    path: '/orderManager/detailOrder',
    component: _import('order/detailOrder/index'),
    name: '订单详情'
  }]
},
]



export const asyncRouterMap = [{
  path: '/baseManager',
  component: Layout,
  name: '基础配置管理',
  icon: 'setting',
  authority: 'baseManager',
  redirect:'userManager',
  children: [{
    path: 'userManager',
    icon: 'fa-user',
    component: _import('admin/user/index'),
    name: '用户管理',
    authority: 'userManager'
  }, {
    path: 'menuManager',
    icon: 'category',
    component: _import('admin/menu/index'),
    name: '菜单管理',
    authority: 'menuManager'
  }, {
    path: 'groupManager',
    icon: 'group_fill',
    component: _import('admin/group/index'),
    name: '角色权限管理',
    authority: 'groupManager'
  }, {
    path: 'groupTypeManager',
    icon: 'fa-users',
    component: _import('admin/groupType/index'),
    name: '角色类型管理',
    authority: 'groupTypeManager'
  }, {
    path: 'gateLogManager',
    icon: 'viewlist',
    component: _import('admin/gateLog/index'),
    name: '操作日志管理',
    authority: 'gateLogManager'
  }]
},
// {
//   path: '/authManager',
//   component: Layout,
//   name: '基础配置管理',
//   icon: 'setting',
//   authority: 'authManager',
//   children: [{
//     path: 'serviceManager',
//     component: _import('auth/service/index'),
//     name: '用户管理',
//     authority: 'serviceManager'
//   }]
// },
{
  path: '/monitorManager',
  component: Layout,
  name: '监控模块管理',
  icon: 'setting',
  authority: 'monitorManager',
  redirect:'serviceEurekaManager',
  children: [{
    path: 'serviceEurekaManager',
    component: _import('monitor/eureka/index'),
    name: 'Eureka注册中心',
    authority: 'serviceEurekaManager'
  }, {
    path: 'serviceMonitorManager',
    component: _import('monitor/service/index'),
    name: '服务状态监控',
    authority: 'serviceMonitorManager'
  }, {
    path: 'serviceZipkinManager',
    component: _import('monitor/zipkin/index'),
    name: '服务状态监控',
    authority: 'serviceZipkinManager'
  }]
},
{
  path: '/billManager',
  component: Layout,
  name: '账单管理',
  icon: 'setting',
  authority: 'billManager',
  redirect: 'billListManager',
  children: [{
    path: 'billListManager',
    component: _import('bill/billList/index'),
    name: '账单列表',
    authority: 'billListManager'
  }, {
    path: 'businessManager',
    component: _import('bill/business/index'),
    name: '企业管理',
    authority: 'businessManager'
  }, {
    path: 'collectionManager',
    component: _import('bill/collection/index'),
    name: '催收管理',
    authority: 'collectionManager'
  }, {
    path: 'reportManager',
    component: _import('bill/report/index'),
    name: '操作日志',
    authority: 'reportManager'
  }]
},
{
  path: '/userConfigManager',
  component: Layout,
  name: '个人中心',
  icon: 'service',
  redirect: 'userConfig',
  authority: 'userConfigManager',
  children: [{
    path: 'userConfig',
    component: _import('userConfig/userCenter/index'),
    name: '个人中心',
    authority: 'userConfig'
  }]
},
{
  path: '/productManager',
  component: Layout,
  name: '商品管理',
  icon: 'service',
  redirect: 'addProduct',
  authority: 'productManager',
  children: [{
    path: 'addProduct',
    component: _import('product/addProduct/index'),
    name: '添加商品',
    authority: 'addProduct'
  }, {
    path: 'priviewProduct',
    component: _import('product/priviewProduct/index'),
    name: '预览商品',
    authority: 'priviewProduct'
  }, {
    path: 'searchProduct',
    component: _import('product/searchProduct/index'),
    name: '检索商品',
    authority: 'searchProduct'
  }]
},
{
  path: '/orderManager',
  component: Layout,
  name: '订单管理',
  icon: 'service',
  redirect: 'searchOrder',
  authority: 'orderManager',
  children: [{
    path: 'searchOrder',
    component: _import('order/searchOrder/index'),
    name: '查询订单',
    authority: 'searchOrder'
  }]
},
{
  path: '/parkingManager',
  component: Layout,
  name: '停车缴费',
  icon: 'service',
  redirect: 'temporaryParking',
  authority: 'parkingManager',
  children: [{
    path: 'temporaryParking',
    component: _import('parking/temporaryParking/index'),
    name: '临时停车',
    authority: 'temporaryParking'
  }, {
    path: 'creditPayment',
    component: _import('parking/creditPayment/index'),
    name: '个人信用付',
    authority: 'creditPayment'
  }, {
    path: 'componyCreditPayment',
    component: _import('parking/componyCreditPayment/index'),
    name: '企业信用付',
    authority: 'componyCreditPayment',
  },{
    path: 'componyCreditPaymentDetail',
    component: _import('parking/componyCreditPayment/detail'),
    name: '企业信用付账单详情',
    authority: 'parkingManager'
  },{
    path: 'creditPaymentCar',
    component: _import('parking/creditPayment/detail'),
    name: '个人信用付车辆详情',
    authority: 'parkingManager'
  },]
},
{
  path: '/sendMsg',
  component: Layout,
  name: '短信消息发送',
  icon: 'service',
  redirect: 'msgConfig',
  authority: 'sendMsg',
  children: [{
    path: 'msgConfig',
    component: _import('sendMsg/msgConfig/index'),
    name: '消息配置',
    authority: 'sendMsg'
  }, {
    path: 'msgHistory',
    component: _import('sendMsg/msgHistory/index'),
    name: '发送记录',
    authority: 'sendMsg'
  }]
},
{
  path: '/parkManager',
  component: Layout,
  name: '定价管理',
  icon: 'service',
  redirect: 'parkList',
  authority: 'parkManager',
  children: [{
    path: 'parkList',
    component: _import('priceSystem/parkManager/parkList/index'),
    name: '园区列表',
    authority: 'parkManager',
  },
  {
    path: 'projectDetail',
    component: _import('priceSystem/parkManager/projectDetail/index'),
    name: '项目详情',
    authority: 'parkManager',
  }, {
    path: 'paramsManager',
    component: _import('priceSystem/paramsManager/index'),
    name: '参数管理',
    authority: 'parkManager',
  }, {
    path: 'priceCalc',
    component: _import('priceSystem/priceCalc/index'),
    name: '参数管理',
    authority: 'parkManager',
  }]
},
{
  path: '/parkTicket',
  component: Layout,
  name: '停车券管理',
  icon: 'service',
  redirect: 'parkTicketList',
  authority: 'parkTicket',
  children: [{
    path: 'parkTicketList',
    component: _import('parkTicket/list'),
    name: '订单列表',
    authority: 'parkTicket',
  } ,
  {
    path: 'parkInvoice',
    component: _import('parkTicket/invoice'),
    name: '停车发票',
    authority: 'parkTicket',
  },
  {
    path: 'depBudget',
    component: _import('parkTicket/depBudget'),
    name: '部门预算',
    authority: 'parkTicket',
  },
  {
    path: 'parkTicketDetail',
    component: _import('parkTicket/detail'),
    name: '订单详情',
    authority: 'parkTicket',
  }]
},
{
  path: '/parkConfig',
  component: Layout,
  name: '园区管理',
  icon: 'service',
  redirect: 'parkList',
  authority: 'parkConfig',
  children: [{
    path: 'parkList',
    component: _import('parkConfig/parkList/index'),
    name: '园区列表',
    authority: 'parkConfig',
  },{
    path: 'parkDetail',
    component: _import('parkConfig/parkDetail/index'),
    name: '园区列表',
    authority: 'parkConfig',
  }, {
    path: 'examineList',
    component: _import('parkConfig/examineList/index'),
    name: '审核人员列表',
    authority: 'parkConfig'
  }]
},
{
  path: '/housingResourceGoods',
  component: Layout,
  name: '商品管理',
  icon: 'service',
  redirect: 'goodsList',
  authority: 'housingResourceGoods',
  children: [{
    path: 'goodsList',
    component: _import('housingResource/goods/goodsList'),
    name: '商品列表',
    authority: 'goodsList'
  }, {
    path: 'addGoods',
    component: _import('housingResource/goods/addGoods'),
    name: '添加商品',
    authority: 'addGoods'
  }, {
    path: 'orderList',
    component: _import('housingResource/goods/orderList'),
    name: '订单管理',
    authority: 'orderList'
  }]
},
{
  path: '/housingResource',
  component: Layout,
  name: '房源管理',
  icon: 'service',
  redirect: 'housingList',
  authority: 'housingResource',
  children: [{
    path: 'housingList',
    component: _import('housingResource/housing/housingList'),
    name: '房源列表',
    authority: 'housingList'
  },{
    path: 'addHousing',
    component: _import('housingResource/housing/addHousing'),
    name: '房源发布',
    authority: 'addHousing'
  }]
},
];


export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});