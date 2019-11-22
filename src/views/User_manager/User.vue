<template>


  <div class="category">
    <div>
      <el-button
        class="filter-item"
        style="margin-left: 10px;margin-bottom: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="dialogFormVisible=true"
      >添加角色
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      size="small"
      header-align="center"
      style="width: 100%;max-height:calc(100vh - 250px);overflow-y: scroll;"
    >
      <el-table-column
        sortable
        prop="role_zh_name"
        label="角色名称"
        header-align="center"
        align="center"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="id"
        label="角色标识"
        align="center"
        header-align="center"/>
      <el-table-column
        :show-overflow-tooltip="true"
        sortable
        prop="statess"
        label="启用状态"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <i v-if="scope.row.role_status!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
          <i v-if="scope.row.role_status==1" class="fa fa-circle text-success ml5" style="color: #15db81"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="userOnline"
        label="编辑"
        width="120">
        <template slot-scope="scope" >
          <el-tag @click="EditRoles(scope.row)">编辑</el-tag>
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
              <el-dropdown-item :command="{type:'menu',val:scope.row}">
                分配权限
              </el-dropdown-item>
              <!--<el-dropdown-item :command="{type:'user'}">-->
                <!--用户列表-->
              <!--</el-dropdown-item>-->
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

    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      append-to-body
      width="70%"
      :before-close="handleClose">
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
      <el-button @click="Abolitionclose">取 消</el-button>
      <el-button type="primary" @click="AbolitionOk">确 定</el-button>
      </span>
    </el-dialog>


    <!--编辑-->
    <el-dialog title="修改角色" append-to-body :visible.sync="editdialogVisible">
      <el-form
        ref="dataForm"
        label-position="left"
        label-width="120px"
        style="width: 420px; margin-left:50px;">
        <el-form-item label="角色中文名">
          <el-input v-model="Editrole.role_zh_name" placeholder="请输入角色中文名" clearable/>
        </el-form-item>
        <el-form-item label="角色英文名">
          <el-input v-model="Editrole.role_en_name" placeholder="请输入角色英文名" clearable/>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            @change="Changestate"
            v-model="Editrole.role_state"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取消</el-button>
        <el-button type="primary" @click="EditRoleQuestion">确定</el-button>
      </div>
    </el-dialog>

    <!--分配用户到角色-->
    <el-dialog
      title="角色的用户列表"
      :visible.sync="userDialogVisible"
      append-to-body
      width="70%">
      <div class="block">
      </div>
      <el-table
        :data="tableData"
        size="small"
        header-align="center"
        style="width: 100%"
      >

        <el-table-column
          sortable
          prop="name"
          label="用户名"
          center
          align="center"
          header-align="center"/>
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="statess"
          label="帐号状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <i v-if="scope.row.statess!=1"  class="fa fa-circle text-danger ml5" style="color: red"/>
            <i v-if="scope.row.statess==1" class="fa fa-circle text-success ml5" style="color: #15db81"/>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="UserpageForm.totalCount"
        :current-page="UserpageForm.pageNumber"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="UserpageForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="userPageSizeChange"
        @current-change="userPageNumberChange"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>


    <!--添加角色-->
    <el-dialog title="添加角色" append-to-body :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="Addrole"
        label-position="left"
        label-width="120px"
        style="width: 420px; margin-left:50px;">
        <el-form-item label="角色中文名">
          <el-input v-model="Addrole.role_zh_name" placeholder="请输入角色中文名" clearable/>
        </el-form-item>
        <el-form-item label="角色英文名">
          <el-input v-model="Addrole.role_en_name" placeholder="请输入角色英文名" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="AddRoles">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import menu from '@/menu/index'
  import rolelist from '@/menu/Role'
  export default {
    data() {
      return {
        listLoading:true,
        tableKey: 0,
        checheds:[],
        dialogFormVisible:false,
        editdialogVisible:false,
        tableData:[
          {id:1,name:'阿波',statess:1},
          {id:1,name:'阿波',statess:1},{id:1,name:'阿波',statess:1},{id:1,name:'阿波',statess:1},
        ],
        //添加角色
        Addrole:{
          method:'add',
          role_zh_name:'',
          role_en_name:''
        },
        //编辑角色
        Editrole:{
          method:'edit',
          role_id:'',
          role_zh_name:'',
          role_en_name:'',
          role_state:0,
        },
        //修改角色权限
        Changerole:{
          method:'add',
          role_id:'',
          meun_id_list:'',
          power_detail_list:''
        },
        // 分页查询参数
        pageForm: {
          pageNum: 1,
          pageSize: 10,
          dataType: 1,
          totalCount:4,
        },
        UserpageForm:{
          pageNum: 1,
          pageSize: 10,
          dataType: 1,
          totalCount:4,
        },
        dialogVisible:false,
        userDialogVisible:false,
        data2: menu,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        Userinfo:'',
        MenuList:[],
        MenuFlag:false,
        total:0,
      }
    },
    created(){
      console.log(menu)
      var _this=this
      this.Userinfo=JSON.parse(localStorage.getItem('UserInfo'))
      this.getlist()
    } ,
    methods: {
      //编辑角色
      EditRoleQuestion(){
        var _this=this
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        this.EditRoles.role_state=parseInt(this.EditRoles.role_state)
        console.log(this.Editrole)
        var Aesjson=encodeURIComponent(this.$util.encrypt(encodeURIComponent(JSON.stringify(this.Editrole)),tokenmd))
        this.$axios.post(`${this.LoginUrl}SmsRoleInfonMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          console.log(res)
          if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.ChangRoleText){
            this.$notify({
              message:this.$text.ChangRoleText,
              type: 'success',
              duration: 1000
            });
            this.editdialogVisible=false
            _this.getlist()
          }
          else{
            this.$message.error(res.data.MESSAGE)
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      Changestate(val){
        console.log(val)
      },
      getlist(){
        this.listLoading=true
        this.total=0
        var _this=this
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify({
          method:'list',
          role_id:this.Userinfo.MS_ROLE_ID
        }),tokenmd))
        console.log({
          method:'list',
          role_id:this.Userinfo.MS_ROLE_ID
        })
        this.$axios.post(`${this.LoginUrl}SmsRoleInfonMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          var list=JSON.parse(res.data.DATA)
          _this.tableData=list
          this.total=_this.tableData.length
          console.log(list)
        }).catch((err)=>{
          console.log(err)
        })
        console.log(tokenmd)
        setTimeout(()=>{
          _this.listLoading=false
        },1000)

      },
      //添加角色
      AddRoles(){
        this.listLoading=true
        var _this=this
        if(this.Addrole.role_en_name==''||this.Addrole.role_zh_name==''){
          this.$message.error("文本框不能为空！请正确输入")
          return
        }
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        console.log(tokenmd)
        console.log(this.Addrole)
        var Aesjson=encodeURIComponent(this.$util.encrypt(encodeURIComponent(JSON.stringify(this.Addrole)),tokenmd))
        this.$axios.post(`${this.LoginUrl}SmsRoleInfonMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          console.log(res)
          this.dialogFormVisible=false
          this.getlist()
        }).catch((err)=>{
          console.log(err)
        })
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      dropdownCommand(command){
        var _this=this
        console.log(command.val)
        if(command.type=='menu'){
          this.MenuList=[]
          console.log(this.MenuList)
          this.Changerole.role_id=command.val.id
          var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
          var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify({
            method:'list',
            role_id:command.val.id
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
                this.MenuFlag=true
                this.$nextTick(() => {
                  _this.$refs.tree.setCheckedKeys(this.MenuList);
                });

                console.log(this.MenuList)
            }
            else{
              this.MenuList=[]
              this.MenuFlag=false
            }
            this.dialogVisible=true
          })

          return
        }
        if(command.type=='user'){
          this.userDialogVisible=true
          return
        }
      },
      EditRoles(json){
        this.Editrole.role_zh_name=json.role_zh_name
        this.Editrole.role_en_name=json.role_en_name
        this.Editrole.role_state=json.role_status
        this.Editrole.role_id=json.id
        console.log(json)
        this.editdialogVisible=true
      },
      handleCheckChange(val){
        // console.log(val)
        // if(val==[]){
        //   this.MenuList=[]
        //   return
        // }
        // if(val.children){
        //     return
        // }
        // console.log(val)
        // if(this.MenuList.length==0){
        //   this.MenuList.push(val.id)
        // }
        // else{
        //   var index = this.MenuList.indexOf(val.id);
        //   if (index > -1) {
        //     this.MenuList.splice(index, 1);
        //   }
        //   else{
        //     this.MenuList.push(val.id)
        //   }
        // }
        // console.log(this.MenuList)
      },
      //权限取消
      Abolitionclose(){
        this.$refs.tree.setCheckedKeys([])
        this.MenuList=[]
        console.log(this.MenuList)
        this.dialogVisible=false
      },
      //权限确定
      AbolitionOk(){
        var checknode=this.$refs.tree.getCheckedNodes()
        this.MenuList=[]
        checknode.forEach((item)=>{
          if(item.children==undefined){
            this.MenuList.push(item.id)
          }
        })
        console.log(checknode)
        console.log(this.MenuList)
        console.log(rolelist.RoleMenuList)
        var _this=this
        if(this.MenuList.length==0){
          this.$message.error('请正确的选择分配权限')
          return
        }
        this.MenuList.forEach((item,index)=>{
          if(this.MenuList.length==1){
            _this.Changerole.meun_id_list=item.toString()
          }
          else{
            if(index==0){
              _this.Changerole.meun_id_list=item.toString()
            }
            else{
              _this.Changerole.meun_id_list+=','+item.toString()
            }
          }
          rolelist.RoleMenuList.forEach((items,inx)=>{
            if(items.id==item){
              if(this.MenuList.length==1){
                var text=items.list.join(',')
                _this.Changerole.power_detail_list=text
                return
              }
              else{
                if(index==0){
                  var text=items.list.join(',')
                  _this.Changerole.power_detail_list=text
                }
                else{
                  var text=items.list.join(',')
                  _this.Changerole.power_detail_list+='|'+text
                }
              }
            }
          })
        })
        console.log(_this.Changerole.meun_id_list)
        console.log( _this.Changerole.power_detail_list)
        console.log(_this.Changerole)
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify(_this.Changerole),tokenmd))
        if(!this.MenuFlag){
          console.log('新增')
          _this.Changerole.method='add'
          var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify(_this.Changerole),tokenmd))
          this.$axios.post(`${this.LoginUrl}SmsPowerInfonMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
          then((res)=>{
            console.log(res)
            // if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.RoleAddList){
              this.$notify({
                message:this.$text.RoleAddList,
                type: 'success',
                duration: 1000
              });
              this.dialogVisible=false
            // }
            // else{
            //   this.$message.error(res.data.MESSAGE)
            // }
          })
        }
        else{
          console.log('修改')
          _this.Changerole.method='edit'
          console.log(_this.Changerole)
          var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify(_this.Changerole),tokenmd))
          this.$axios.post(`${this.LoginUrl}SmsPowerInfonMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
          then((res)=>{
            console.log(res)
            if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.ChangeRoleList){
              this.$notify({
                message:this.$text.ChangeRoleList,
                type: 'success',
                duration: 1000
              });
              this.dialogVisible=false

            }
            else{
              this.$message.error(res.data.MESSAGE)
            }
          })
        }
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

</style>
