import util from '@/utils/util'
import url from '@/utils/HttpUrl'
import axios from 'axios'
import menu from '@/menu/index'
export default {
  ChangeIsCollapse: (state) =>{
    state.isCollapse=!state.isCollapse
  },
  getmenulist: (state,roleid,callback) =>{
    var childlist=[]
    state.MenuList=[]
    console.log(roleid)
    var Userinfo=JSON.parse(localStorage.getItem('UserInfo'))
     new Promise((ress,req)=>{
      var tokenmd=Userinfo.MS_TOKEN.slice(0,16)
      var Aesjson=encodeURIComponent(util.encrypt(JSON.stringify({
        method:'list',
        role_id:roleid
      }),tokenmd))
      axios.post(`${url.BaseLoginUrl}SmsPowerInfonMs?params=${Aesjson}&username=${Userinfo.MS_REAL_NAME}`).
      then((res)=>{
        var Stringmenukey=JSON.parse(res.data.DATA)[0].meun_id_list.split(',')
        var menukey=Stringmenukey.map((val) => {
          return parseInt(val)
        })
        ress(menukey)
      })
    }).then((menukeys)=>{
       console.log(menukeys)
       console.log(menu)
       menukeys.forEach((item) => {
         menu.forEach((val) => {
           if(item==val.id){
             if(state.MenuList.length==0){
               state.MenuList.push(val)
             }
             else{
               var flag=true
               state.MenuList.forEach((list) => {
                 if(list.id==val.id){
                   flag=false
                 }
               })
               if(flag){
                 state.MenuList.push(val)
               }
             }
           }
         })
       })
       console.log(state.MenuList)
       menukeys.forEach((item) => {
         menu.forEach((val) => {
           if(val.children){
             val.children.forEach((key)=>{
               if(key.id==item){
                 if(childlist.length==0){
                   childlist.push(val)
                 }
                 else{
                   var flag=true
                   childlist.forEach((child) => {
                     if(child.name==val.name){
                       flag=false
                     }
                   })
                   if(flag){
                     childlist.push(val)
                   }
                 }
               }
             })
           }
         })
       })
       console.log(childlist)
       state.MenuList=childlist.concat(state.MenuList)
       localStorage.setItem('MenuList',JSON.stringify(state.MenuList))
       console.log(state.MenuList)
    })
  },
  NavPush:(state,Json) => {
    state.NavList.push(Json)
  },
  RemoveNav:(state,Name) => {
    state.NavList.forEach((item,index) => {
      if(item.title==Name){
        state.NavList.splice(index,1)
      }
    })
  }
}
