let menu = [];

/**
 * 首页
 * @type {{name: string, path: string, icon: string}}
 */
// menu.push({//0
//   name: '首页',
//   path: '/',
//   icon: 'fa fa-tachometer',
//   text:'home',
//   id:1,
// });

/**
 * 商戶管理
 * @type {{name: string, icon: string, children: {}}}
 */
menu.push({//2
  name: '用户管理',
  icon: 'el-icon-menu',
  text:'Users_manage',
  children:[
    {
      name: '用户管理',
      path: '/Jurisdiction_manger',
      flag:false,
      text:'Jurisdiction_manger',
      id:2,
    },
    {
      name: '角色管理',
      path: '/Users_manger',
      flag:false,
      text:'Users_manger',
      id:3,
    }
  ]
});
menu.push({
  name: '商户管理',
  icon: 'el-icon-menu',
  text:'Merchant_manage',
  children: [
    {
      name: '商户新增',
      path: '/Merchant_mangers',
      text:'Merchant_mangers',
      flag:false,
      id:4,
    },
    {
      name: '商户信息查询',
      path: '/Merchant_Infos',
      text:'Merchant_Infos',
      flag:false,
      id:5,
    },
  ]
});
menu.push({
  name: '备付金管理',
  icon: 'el-icon-menu',
  text:'Reserve_manage',
  children: [
    {
      name: '备付金信息',
      path: '/Reserve_adds',
      text:'Reserve_adds',
      flag:false,
      id:6,
    },
    {
      name: '备付金新增审核',
      path: '/Reserve_examines',
      text:'Reserve_examines',
      flag:false,
      id:7,
    },
  ]
});
menu.push({
  name: '流水管理',
  path: '/Flow_managers',
  icon: 'el-icon-menu',
  text:'Flow_managers',
  id:8,
});
menu.push({
  name: '油卡管理',
  path: '/Card_managers',
  icon: 'el-icon-menu',
  text:'Card_managers',
  id:9,
});
menu.push({
  name: 'POS管理',
  path: '/Pos_managers',
  icon: 'el-icon-menu',
  text:'Pos_managers',
  id:10,
});
export default menu;

