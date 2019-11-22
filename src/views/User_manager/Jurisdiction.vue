<template>
  <div class="category" style="background: white;">
    <el-button type="primary" style="margin: 10px;" @click="OpenAddUser">新建用户</el-button>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      size="small"
      header-align="center"
      style="width: 100%;max-height:calc(100vh - 250px);overflow-y: scroll;"
    >
      <el-table-column
        sortable
        prop="MS_LOGIN_NAME"
        label="用户名"
        header-align="center"
        align="center"
      />
      <el-table-column
        sortable
        prop="MS_REAL_NAME"
        label="姓名"
        header-align="center"
        align="center"
      />
      <el-table-column
        sortable
        prop="MS_EMAIL"
        label="邮箱"
        header-align="center"
        align="center"
      />
      <el-table-column
        sortable
        prop="MS_PHONE"
        label="手机号"
        header-align="center"
        align="center"
      />
      <el-table-column
        sortable
        prop="MS_ROLE_ID"
        label="角色"
        header-align="center"
        align="center"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        sortable
        prop="MS_STATUS"
        label="启用状态"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <i v-if="scope.row.MS_STATUS!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
          <i v-else class="fa fa-circle text-success ml5" style="color: #15db81"/>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        sortable
        label="编辑"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag @click="EditUser(scope.row)">编辑</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="userOnline"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-dropdown @command="dropdownCommand">
            <el-button size="mini">
              <i class="el-icon-setting"/>
              <span class="el-icon-arrow-down"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{type:'menu',text:scope.row}">
                查看权限
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-card class="box-card" style="margin-top: 10px;">
      <div class="text item" style="margin-bottom: 10px;">
        总笔数: <el-tag>{{total}}</el-tag><span style="margin-left: 5px;">条</span>
      </div>
    </el-card>


    <!--新建用户-->
    <el-dialog
      :visible.sync="addDialogVisible"
      title="新建用户"
      append-to-body
      width="40%">
      <el-form ref="addForm" :model="formData" size="small" label-width="80px">
        <el-form-item prop="ms_login_name" label="用户名">
          <el-input
            v-model="formData.login_name"
            maxlength="100"
            placeholder="登录名"
            auto-complete="off"
            :disabled="EditAddFlag"
            tabindex="2"
            clearable
            type="text"/>
        </el-form-item>
        <el-form-item prop="ms_real_name" label="姓名">
          <el-input
            v-model="formData.real_name"
            maxlength="20"
            placeholder="姓名"
            auto-complete="off"
            tabindex="3"
            clearable
            type="text"/>
        </el-form-item>
        <el-form-item prop="ms_phone" label="手机号码">
          <el-input
            v-model="formData.phone"
            maxlength="20"
            placeholder="手机号码"
            auto-complete="off"
            tabindex="6"
            clearable
            type="text"/>
        </el-form-item>
        <el-form-item prop="ms_role_id" label="角色">
          <el-select v-model="formData.role_id" clearable placeholder="请选择" @change="changeRole">
            <el-option
              v-for="item in RoleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="RoleSelected" prop="ms_role_id" label="商户">
          <el-select v-model="formData.merchant_id" clearable placeholder="请选择" @change="changeMerChart">
            <el-option
              v-for="item in MerCharList"
              :key="item.baseInfo.M0007_ID"
              :label="item.baseInfo.M0007_NAME"
              :value="item.baseInfo.M0007_ID"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="ms_status" label="启用状态">
          <el-switch
            @change="Changestate"
            v-model="formData.state"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--查看角色权限-->
    <el-dialog
      title="查看权限"
      :visible.sync="dialogVisible"
      append-to-body
      width="70%"
      >
      <el-tree
        :data="data2"
        show-checkbox
        ref="tree"
        default-expand-all
        node-key="id"
        :default-checked-keys="MenuList"
        @check-change="handleCheckChange">
        <span slot-scope="scope" class="custom-tree-node">
          <span style="margin-left: 10px;">{{scope.data.name}}</span>
          <span>
            <span  style="font-weight: bold">菜单权限 </span>
          </span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible=false">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  // import {GetRoleList,GetMeunList,SubMiRoleInfo} from '../../api/systemManage'
  import md5 from 'md5'
  import util from "../../utils/util";
  import menu from '@/menu/index'
  export default {
    data() {
      return {
        listLoading:true,
        addDialogVisible:false,
        dialogVisible:false,
        EditAddFlag:false,
        tableKey: 0,
        checheds:[],
        chechedss:[],
        tableDatas:[],
        tableData:[
          {id:1,name:'系统管理员',statess:1},
          {id:1,name:'用户管理员',statess:1},{id:1,name:'财务部',statess:1},
        ],
        // 分页查询参数
        pageForm: {
          pageNum: 1,
          pageSize: 10,
          dataType: 1,
          totalCount:0,
        },
        rolesOptions:[],
        UserpageForm:{
          pageNum: 1,
          pageSize: 10,
          dataType: 1,
          totalCount:0,
        },
        Verification:[
          {
            id:1,
            text:/[\u4e00-\u9fa5]/g,
            flag:true
          },
          {
            id:2,
            text:/[A-Za-z]/g,
            flag:true
          }
        ],
        dialogVisible:false,
        userDialogVisible:false,
        addDialogVisible:false,
        dialogsVisible:false,
        formData: {
          method:'add',
          user_id:'',
          login_name:'',
          real_name:'',
          phone:'',
          role_id:'',
          state:0,
          merchant_id:'',

        },
        formDatas: {
          role_en_name:'',
          role_rules:'',
          role_state:0,
          role_zh_name:'',
          role_id:'',
        },
        status_adds:'open',
        defaultProps: {
          children: 'children',
          label: 'rule_zh_name'
        },
        RoleList:[],
        RoleTextList:[],
        CheckText:'',
        CheckTexts:'',
        newchecklist:[],
        data2: menu,
        Userinfo:'',
        RoleList:[],
        MenuList:[],
        total:0,
        RoleSelected:false,//是否选择角色
        MerCharList:[],
      }
    },
    created(){
      this.Userinfo=JSON.parse(localStorage.getItem('UserInfo'))
      console.log(this.Userinfo)
      this.getlist()
      this.getrolelist()
      this.GetAllMerChart()
    }  ,
    methods: {
      //编辑用户
      EditUser(val){
        this.EditAddFlag=true
        this.formData.login_name=val.MS_LOGIN_NAME
        this.formData.real_name=val.MS_REAL_NAME
        this.formData.phone=val.MS_PHONE
        this.formData.role_id=val.MS_ROLE_ID
        this.formData.state=val.MS_STATUS
        this.formData.user_id=val.MS_ID
        this.addDialogVisible=true
        console.log(this.formData)
      },
      //获取所有商户
      GetAllMerChart(){
        var _this=this
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify({
          method:'list'
        }),tokenmd))
        this.$axios.post(`${this.LoginUrl}SmsMerchantMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          _this.MerCharList=JSON.parse(res.data.DATA)
          console.log(_this.MerCharList)
        }).catch((err)=>{
          console.log(err)
        })
      },
      //选择商户
      changeMerChart(val){
        console.log(val)
      },
      OpenAddUser(){
        this.EditAddFlag=false
        this.formData.user_id=''
        this.formData.login_name=''
        this.formData.real_name=''
        this.formData.phone=''
        this.formData.role_id=''
        this.formData.merchant_id=''
        this.formData.state=0
        this.addDialogVisible=true
      },
      //选择角色
      changeRole(val){
        this.formData.role_id=val
        if(val==''){
          this.RoleSelected=false
        }
        else{
          this.RoleSelected=true
        }
        console.log(val)
      },
      Changestate(val){
        this.formData.state=val
        console.log(val)
      },
      dropdownCommand(val){
        var _this=this
        console.log(val.text.MS_ROLE_ID)
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify({
          method:'list',
          role_id:val.text.MS_ROLE_ID
        }),tokenmd))
        this.$axios.post(`${this.LoginUrl}SmsPowerInfonMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          console.log(res)
          if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.Rolelisttext){
            console.log(JSON.parse(res.data.DATA)[0].meun_id_list)
            var listrole=JSON.parse(res.data.DATA)[0].meun_id_list.split(',')
            listrole.forEach((item)=>{
              this.MenuList.push(parseInt(item))
            })
            this.dialogVisible=true
            this.MenuFlag=true
            this.$nextTick(() => {
              _this.$refs.tree.setCheckedKeys(this.MenuList);
            });
            console.log(this.MenuList)
          }
          else{
            this.$message.error(res.data.MESSAGE)
            this.MenuList=[]
            this.MenuFlag=false
          }
        })
      },
      //添加用户
      AddUser(){
        var _this=this
        if(this.formData.login_name==''||this.formData.real_name==''||this.formData.phone==''){
          this.$message.error(this.$text.InputErrorText)
          return
        }
        if(!this.$text.Phone.test(this.formData.phone)){
          this.$message.error(this.$text.PhoneErrorText)
          return
        }
        if(this.formData.role_id==''){
          this.$message.error(this.$text.RoleErrorText)
          return
        }
        if(this.formData.merchant_id==''){
          this.$message.error(this.$text.SelectMerChart_ID)
          return
        }
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        if(this.formData.user_id==''){
          console.log(this.formData)
          var Aesjson=encodeURIComponent(this.$util.encrypt(encodeURIComponent(JSON.stringify(this.formData)),tokenmd))
          this.$axios.post(`${this.LoginUrl}SmsUserInfonMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
          then((res)=>{
            if(parseInt(res.data.RESULT)==1 && res.data.MESSAGE==this.$text.AddUserText){
              _this.$notify({
                message:_this.$text.AddUserText,
                type: 'success',
                duration: 1000
              });
              _this.getlist()
              _this.addDialogVisible=false
            }
            else if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.AddNoUserText){
              this.$message.error(res.data.MESSAGE)
              _this.addDialogVisible=false
            }
            else{
              this.$message.error(res.data.MESSAGE)
              _this.addDialogVisible=false
            }
            console.log(res)
          }).catch((err)=>{
            console.log(err)
          })
        }
        else{
          this.formData.method='edit'
          console.log(this.formData)
          var Aesjson=encodeURIComponent(this.$util.encrypt(encodeURIComponent(JSON.stringify(this.formData)),tokenmd))
          this.$axios.post(`${this.LoginUrl}SmsUserInfonMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
          then((res)=>{
            if(parseInt(res.data.RESULT)==1 && res.data.MESSAGE==this.$text.ChangeUserText){
              _this.$notify({
                message:_this.$text.ChangeUserText,
                type: 'success',
                duration: 1000
              });
              _this.getlist()
              _this.addDialogVisible=false
            }
            else{
              this.$message.error(res.data.MESSAGE)
              _this.addDialogVisible=false
            }
            console.log(res)
          }).catch((err)=>{
            console.log(err)
          })
        }
      },
      getrolelist(){
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify({
          method:'list',
          role_id:this.Userinfo.MS_ROLE_ID
        }),tokenmd))
        this.$axios.post(`${this.LoginUrl}SmsRoleInfonMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          var list=JSON.parse(res.data.DATA)
          this.RoleList=list.map((item)=>{
            return {
              name:item.role_zh_name,
              id:item.id
            }
          })
          console.log(list)
        }).catch((err)=>{
          console.log(err)
        })
      },
      getlist(){
        var _this=this
        this.total=0
        _this.listLoading=true
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify({
          method:'list',
          role_id:this.Userinfo.MS_ROLE_ID
        }),tokenmd))
        this.$axios.post(`${this.LoginUrl}SmsUserInfonMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
          then((res)=>{
            console.log(JSON.parse(res.data.DATA))
            this.tableData=JSON.parse(res.data.DATA)
            this.total=this.tableData.length
          _this.listLoading=false
        }).catch((err)=>{
          console.log(err)
        })
        console.log(tokenmd)
      },
      getRules(){
        var _this=this
        console.log(this.RoleTextList)
        this.RoleTextList.forEach((item)=>{
          if(item.children==undefined){

            _this.chechedss.push(item.id)
          }

        })
      },
      getCheckedKeys(val){
        console.log(val)
      },
      handleCheckChange(val){
        console.log(val)
        if(val.children==undefined){
          var flag=false
          this.chechedss.forEach((item,index)=>{
            if(val.id==item) {
              this.chechedss.splice(index, 1)
              flag = true
              return
            }
          })
          if(!flag){
            this.chechedss.push(val.id)
          }

        }
        console.log(this.chechedss)
      },
      handleCheckChanges(val){
        if(!val.flag&&val.children==undefined){
          val.flag=true
          this.checheds.push(val.id)
          console.log(this.checheds)
          return
        }
        if(val.flag&&val.children==undefined){
          val.flag=false
          this.checheds.forEach((item,index)=>{
            if(val.id==item){
              console.log("haha")
              this.checheds.splice(index,1)
              return
            }
          })
          console.log(this.checheds)
        }
      },
      RoleOk(){
        var _this=this
        var arr=''
        var checks=[]
        var flags=true
        var checknode=this.$refs.trees.getCheckedNodes()
        console.log(checknode)
        checknode.forEach((item)=>{
          checks.push(item.id)
          if(item.id==6||item.id==7||item.id==8){
            checknode.forEach((items)=>{
              if(items.id==5){
                flags=false
              }
            })
          }
          if(arr==''){
            arr=item.id
          }
          else{
            arr+=","+item.id
          }
        })
        if(flags){
          this.$message.error("当你选择了增加，删除，修改菜单时，请务必选择查看")
          return
        }
        if(flags){
          this.$message.error("当你选择了增加，删除，修改菜单时，请务必选择查看")
          return
        }
        _this.formData.role_rules=arr
        _this.dialogsVisible=false
      },
      //权限取消
      Abolitionclose(){
        // this.$router.go(0)
        this.$refs.tree.setCheckedKeys([]);
        this.chechedss=[]

        this.dialogVisible=false
      },
      //权限确定
      AbolitionOk(row){
        var checks=[]
        var flags=false
        let lens=0
        var checknode=this.$refs.tree.getCheckedNodes()
        console.log(checknode)
        checknode.forEach((item)=>{
          checks.push(item.id)
          if(item.pid!=0){
            var flag=false
            checks.forEach((items)=>{
              if(items==item.pid){
                flag=true
              }
            })
            if(!flag){
              checks.push(item.pid)
            }

          }
          if(item.id==6||item.id==7||item.id==8){
            flags=true
          }
          if(item.id==5){
            lens++
          }
        })
        if(flags&&lens==0){
          this.$message.error("当你选择了增加，删除，修改菜单时，请务必选择查看")
          return
        }
        console.log(checks)
        var len=checks.length
        var arr=''
        if(len==0){
          this.$message.error("请至少选择一个菜单属性")
          return
        }
        // if()
        checks.forEach((item)=>{
          if(arr==''){
            arr=item
          }
          else{
            arr+=","+item
          }
        })
        this.formDatas.role_en_name=this.CheckText.role_en_name
        this.formDatas.role_rules=arr
        this.formDatas.role_state=this.CheckText.role_state
        this.formDatas.role_zh_name=this.CheckText.role_zh_name
        this.formDatas.role_id=this.CheckText.role_id
        console.log(this.formDatas)

        var AesJson=util.encrypt(JSON.stringify(this.formDatas),'a0bdac13b5cb2c2acf8f7j0f737aa78b')
        var datas={
          method:'edit',
          post_params:AesJson
        }
        SubMiRoleInfo(datas).then((res)=>{
          console.log(res)
          if(res.data.result==0){
            this.dialogVisible=false
            this.getlist()
            this.$notify({
              title: '修改',
              message: '权限修改成功',
              type: 'success'
            });
          }
        })



      },
      pageSizeChange(){

      },
      abo(){
        console.log("eeee")
      },
      userPageSizeChange(){

      },
      pageNumberChange(){

      },
      userPageNumberChange(){

      }


    },
    components: {

    },
    mounted: function () {

    }
  }
</script>
<style lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-table::before{
    height: 0!important;
  }

</style>
