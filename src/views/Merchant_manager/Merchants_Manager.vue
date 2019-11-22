<template>
  <div class="app-container">
    <el-dialog title="增加" append-to-body  :visible.sync="dialogaddVisible">
      <el-form   label-position="left" status-icon label-width="120px" style="width: 800px; margin-left:50px;">
        <el-form-item label="商户名">
          <el-input style="width:300px;height: 36px;" v-model="AddOilJson.merchantname" size="small" placeholder="请输入商户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input style="width:300px;height: 36px;" v-model="AddOilJson.contacts" size="small" placeholder="请输入联系人" ></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input style="width:300px;height: 36px;" v-model="AddOilJson.phone" size="small" placeholder="请输入手机号" ></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input style="width:300px;height: 36px;" v-model="AddOilJson.address" size="small" placeholder="请输入地址" ></el-input>
        </el-form-item>
        <el-form-item label="备付金">
          <el-input-number
            v-model="AddOilJson.balance"
            :min="1"
            :max="99999999"
            clearable
            controls-position="right"/>
        </el-form-item>
        <el-form-item label="预警值">
          <el-input-number
            v-model="AddOilJson.warning_line"
            :min="1"
            :max="99999999"
            clearable
            controls-position="right"/>
        </el-form-item>
        <el-form-item label="停止线">
          <el-input-number
            v-model="AddOilJson.stop_line"
            :min="1"
            :max="99999999"
            clearable
            controls-position="right"/>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input style="width:300px;height: 36px;" size="small" placeholder="请输入公司名称" v-model="AddOilJson.company_name"></el-input>
        </el-form-item>
        <el-form-item label="商户密钥">
          <el-input style="width:300px;height: 36px;" v-model="AddOilJson.private_key" size="small" placeholder="请输入商户密钥" ></el-input>
        </el-form-item>
        <el-form-item label="终端号">
          <el-input style="width:300px;height: 36px;" size="small" placeholder="请输入终端号" v-model="AddOilJson.terminal"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddVisible = false">{{$text.Close}}</el-button>
        <el-button type="primary" @click="AddOilClick">{{$text.Determine}}</el-button>
      </div>
    </el-dialog>


    <div style="display: flex;justify-content: space-between">
      <div>
        <el-button
          class="filter-item"
          style="margin-left: 10px;margin-bottom: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="AddOil"
        >添加商户
        </el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;max-height:calc(100vh - 250px);overflow-y: scroll;"
    >
      <el-table-column label="商户名" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.baseInfo.M0007_NAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="130px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.M0007_PHONE }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="联系人" width="120px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.M0007_CONTACTS }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="终端号" width="120px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.terminalList}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备付金" width="110px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.M0007_BALANCE }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="预警值" width="110px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.M0007_EARLY_WARNING_LINE }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="停止线" width="110px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.M0007_STOP_LINE }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商户公司名称" width="250px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.MERCHANT_COMPANY_NAME }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商户地址" width="150px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.M0007_ADD }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商户状态" width="50px" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.baseInfo.DATA_STATE=='0'"  class="fa fa-circle text-danger ml5" style="color: red"/>
          <i v-else class="fa fa-circle text-success ml5" style="color: #15db81"/>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.DATA_CREATE_TIME }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="EditOilCard(scope.row)">{{$text.Edit}}</el-button>
          <el-button type="primary" size="mini" @click="AddTemId(scope.row)">{{$text.AddTemid}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-card class="box-card" style="margin-top: 10px;">
      <div class="text item" style="margin-bottom: 10px;">
        总笔数: <el-tag>{{total}}</el-tag><span style="margin-left: 5px;">条</span>
      </div>
    </el-card>


    <!--添加终端号-->
    <el-dialog title="编辑" append-to-body  :visible.sync="AdddialogVisibletemid" style="min-height:800px;">
      <el-form   label-position="left" label-width="120px" style="min-width: 800px; margin-left:50px;">
        <el-form-item label="终端号">
          <el-input style="width:300px;height: 36px;" v-model="AddTemidJson.terminal" size="small" type="text"  placeholder="请输入终端号" ></el-input>
          <el-button type="info" style="margin-left: 15px;" @click="SelectTemidClick(AddTemidJson.merchantid)">{{$text.SelectMerChartTemid}}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AdddialogVisibletemid = false">{{$text.Close}}</el-button>
        <el-button type="primary" @click="AddTemidClick">{{$text.Determine}}</el-button>
      </div>
    </el-dialog>



    <!--查看商户终端号-->
    <el-dialog title="终端号详情" append-to-body  :visible.sync="SelectdialogVisibleTemid">
      <el-table
        :data="SelectTemidList"
        border
        fit
        highlight-current-row
        style="width: 100%;max-height:250px;border: 1px solid #ccc;overflow-y: scroll;"
      >
        <el-table-column label="商户名" width="300px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="Deletetemid(scope.row)">{{$text.Delete}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="SelectdialogVisibleTemid = false">{{$text.Close}}</el-button>
      </div>
    </el-dialog>


    <!--删除终端号-->
    <el-dialog
      :before-close="handleClose"
      append-to-body
      :visible.sync="dialogDeleteVisible"
      title="删除终端号"
      width="35%">
      <span>确定要删除<el-tag>终端号:{{RmoveJson.terminal_id}}</el-tag>吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="RemoveOilCard">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑-->
    <el-dialog title="编辑" append-to-body  :visible.sync="EdialogaddVisible">
      <el-form   label-position="left" label-width="120px" style="width: 800px; margin-left:50px;">
        <el-form-item label="商户号">
          <el-input style="width:300px;height: 36px;" :disabled="disabled" v-model="EditOilJson.merchantid" size="small" type="number"  placeholder="请输入商户号" ></el-input>
        </el-form-item>
        <el-form-item label="商户名">
          <el-input style="width:300px;height: 36px;" v-model="EditOilJson.merchantname" size="small" placeholder="请输入商户名" ></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input style="width:300px;height: 36px;" v-model="EditOilJson.contacts" size="small" placeholder="请输入联系人" ></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input style="width:300px;height: 36px;" v-model="EditOilJson.phone" size="small" placeholder="请输入手机号" ></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input style="width:300px;height: 36px;" v-model="EditOilJson.address" size="small" placeholder="请输入地址" ></el-input>
        </el-form-item>
        <el-form-item label="备付金">
          <el-input-number
            v-model="EditOilJson.balance"
            :min="1"
            :max="99999999"
            clearable
            controls-position="right"/>
        </el-form-item>
        <el-form-item label="预警值">
          <el-input-number
            v-model="EditOilJson.warning_line"
            :min="1"
            :max="99999999"
            clearable
            controls-position="right"/>
        </el-form-item>
        <el-form-item label="停止线">
          <el-input-number
            v-model="EditOilJson.stop_line"
            :min="1"
            :max="99999999"
            clearable
            controls-position="right"/>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input style="width:300px;height: 36px;" v-model="EditOilJson.company_name" size="small" placeholder="请输入公司名称" ></el-input>
        </el-form-item>
        <el-form-item prop="ms_status" label="商户状态">
          <el-switch
            @change="ChangeMerChatState"
            v-model="EditOilJson.state"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ccc"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EdialogaddVisible = false">{{$text.Close}}</el-button>
        <el-button type="primary" @click="EditOilCardClick">{{$text.Determine}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'ComplexTable',
    filters: {

    },
    data() {
      return {
        tableKey: 0,
        list: [],
        dialogFormVisibles:false,
        total: 0,
        listLoading: true,
        disabledNow: false,
        dialogaddVisible:false,
        deleteRowData: {},
        dialogFormVisible: false,
        dialogDeleteVisible: false,
        SelectdialogVisibleTemid:false,
        downloadLoading: false,
        Userinfo:'',
        // 分页查询参数
        pageForm: {
          pageNum: 1,
          pageSize: 10,
          dataType: 1,
          totalCount:4,
        },
        //添加商户
        AddOilJson:{
          method:'add',
          merchantname:'',
          contacts:'',
          phone:'',
          address:'',
          balance:"",
          private_key:'',
          warning_line:"",
          stop_line:"",
          company_name:'',
          terminal:''
        },
        //编辑商户
        EditOilJson:{
          method:'edit',
          merchantid:'',
          merchantname:'',
          contacts:'',
          phone:'',
          address:'',
          balance:'',
          private_key:'',
          warning_line:'',
          stop_line:'',
          company_name:'',
          state:'',
        },
        EdialogaddVisible:false,
        disabled:true,
        AddFlag:true,
        AdddialogVisibletemid:false,
        //添加终端号
        AddTemidJson:{
          method:'add',
          merchantid:'',
          terminal:''
        },
        SelectTemidList:[],//终端号列表
        //删除终端
        RmoveJson:{
          method:'delete',
          terminal_id:''
        },
      }
    },
    created() {
      this.Userinfo=JSON.parse(localStorage.getItem('UserInfo'))
      console.log(this.Userinfo)
      this.getList()
    },
    methods: {
      Addinformation(){

      },
      //删除商户对应的终端号
      Deletetemid(temid){
        this.RmoveJson.terminal_id=temid
        this.dialogDeleteVisible=true
      },
      //查找商户对应的所有终端号
      SelectTemidClick(val){
        this.list.forEach((item) => {
          if(item.baseInfo.M0007_ID==val){
            this.SelectTemidList=item.terminalList.split(',')
            console.log(this.SelectTemidList)
          }
        })
        this.SelectdialogVisibleTemid=true
      },
      //添加终端号单击
      AddTemidClick(){
        if(this.AddTemidJson.terminal==''){
          this.$message.error(this.$text.InputErrorText)
          return
        }
        if(!this.$text.Temid.test(this.AddTemidJson.terminal)){
          this.$message.error(this.$text.TemidErrorText)
          return
        }
        console.log(this.AddTemidJson)
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(encodeURIComponent(JSON.stringify(this.AddTemidJson)),tokenmd))
        this.$axios.post(`${this.LoginUrl}TerminalMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          console.log(res)
          if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.AddtemidText){
            this.$notify({
              message:this.$text.AddtemidText,
              type: 'success',
              duration: 1000
            });
            this.AdddialogVisibletemid=false
            this.getList()
          }
          else{
            this.$message.error(res.data.MESSAGE)
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      //添加终端号
      AddTemId(row){
        this.AddTemidJson.merchantid=row.baseInfo.M0007_ID
        this.AddTemidJson.terminal=''
        this.AdddialogVisibletemid=true
      },
      getList() {
        var _this=this
        this.total=0
        this.listLoading = true
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify({
          method:'list'
        }),tokenmd))
        this.$axios.post(`${this.LoginUrl}SmsMerchantMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          this.list=JSON.parse(res.data.DATA)
          this.list.map((item)=>{
            return item.baseInfo.DATA_CREATE_TIME=this.$filter.ForDataTimes(item.baseInfo.DATA_CREATE_TIME)
          })
          this.total=this.list.length
          console.log(this.list)
          this.listLoading=false
        }).catch((err)=>{
          console.log(err)
        })
      },
      //删除终端号
      RemoveOilCard(){
        new Promise((req,res)=>{
          this.getListtemid(this.RmoveJson.terminal_id,(resid)=>{
            var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
            var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify({
              method:'delete',
              terminal_id:resid
            }),tokenmd))
            this.$axios.post(`${this.LoginUrl}TerminalMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
            then((res)=>{
              console.log(res)
              if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.RemoveTemidText){
                this.$notify({
                  message:this.$text.RemoveTemidText,
                  type: 'success',
                  duration: 1000
                });
                this.dialogDeleteVisible=false
                this.SelectdialogVisibleTemid=false
                this.AdddialogVisibletemid=false
                this.getList()
              }
              else{
                this.$message.error(res.data.MESSAGE)
              }
            }).catch((err)=>{
              console.log(err)
            })
          })
        })
      },
      //获取所有终端号
      getListtemid(temid,callback) {
        var _this=this
        var Rotetemid=''
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify({
          method:'alllist'
        }),tokenmd))
        this.$axios.post(`${this.LoginUrl}TerminalMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          var temidlist=JSON.parse(res.data.DATA)
          temidlist.forEach((item) => {
            if(item.M0006_IMEI==temid){
              Rotetemid=item.R0607_ID
            }
          })
          callback(Rotetemid)
          console.log(temidlist)
        }).catch((err)=>{
          console.log(err)
        })
      },
      //修改油卡状态
      ChangeOilCradState(val){
        this.EditOilJson.state=val
      },
      //修改商户状态
      ChangeMerChatState(val){
        this.EditOilJson.state=val
        console.log(val)
      },
      //添加油卡
      AddOil(){
        this.AddOilJson.merchantname=''
        this.AddOilJson.contacts=''
        this.AddOilJson.phone=''
        this.AddOilJson.address=''
        this.AddOilJson.balance=''
        this.AddOilJson.private_key=''
        this.AddOilJson.warning_line=''
        this.AddOilJson.stop_line=''
        this.AddOilJson.company_name=''
        this.AddOilJson.terminal=''
        this.dialogaddVisible=true
      },
      //修改油卡
      EditOilCard(val){
        console.log(val)
        this.EditOilJson.merchantid=val.baseInfo.M0007_ID
        this.EditOilJson.merchantname=val.baseInfo.M0007_NAME
        this.EditOilJson.contacts=val.baseInfo.M0007_CONTACTS
        this.EditOilJson.phone=val.baseInfo.M0007_PHONE
        this.EditOilJson.address=val.baseInfo.M0007_ADD
        this.EditOilJson.balance=val.baseInfo.M0007_BALANCE
        this.EditOilJson.private_key=val.baseInfo.M0007_PRIVATE_KEY
        this.EditOilJson.warning_line=val.baseInfo.M0007_EARLY_WARNING_LINE
        this.EditOilJson.stop_line=val.baseInfo.M0007_STOP_LINE
        this.EditOilJson.company_name=val.baseInfo.MERCHANT_COMPANY_NAME
        this.EditOilJson.state=val.baseInfo.DATA_STATE
        this.EdialogaddVisible=true
      },
      //修改油卡单击
      EditOilCardClick(){
        this.EditOilJson.balance=this.EditOilJson.balance.toString()
        this.EditOilJson.warning_line=this.EditOilJson.warning_line.toString()
        this.EditOilJson.stop_line=this.EditOilJson.stop_line.toString()
        if(this.CheckText(this.EditOilJson)){
          console.log(this.EditOilJson)
          var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
          console.log(tokenmd)
          var Aesjson=encodeURIComponent(this.$util.encrypt(encodeURIComponent(JSON.stringify(this.EditOilJson)),tokenmd))
          this.$axios.post(`${this.LoginUrl}SmsMerchantMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
          then((res)=>{
            console.log(res)
            if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.ChangeMerChatText){
              this.$notify({
                message:this.$text.ChangeMerChatText,
                type: 'success',
                duration: 1000
              });
              this.EdialogaddVisible=false
              this.getList()
              }
              else{
                this.$message.error(res.data.MESSAGE)
              }
            }).catch((err)=>{
            console.log(err)
            })
          }
        },
      //校验文本
      CheckText(CheckJsonText){
        if(CheckJsonText.merchantname==''||CheckJsonText.contacts==''||CheckJsonText.phone==''||CheckJsonText.address==''||CheckJsonText.balance==''||CheckJsonText.warning_line==''||CheckJsonText.stop_line==''||CheckJsonText.company_name==''){
          this.$message.error(this.$text.InputErrorText)
          return false
        }
        if(!this.$text.Phone.test(CheckJsonText.phone)){
          this.$message.error(this.$text.PhoneErrorText)
          return false
        }
        // if(!this.$text.Temid.test(CheckJsonText.terminal)){
        //   this.$message.error(this.$text.TemidErrorText)
        //   return false
        // }
        if(parseFloat(CheckJsonText.balance)<=this.$text.MerChatNumber){
          this.$message.error(this.$text.BalanceText)
          return false
        }
        if(parseFloat(CheckJsonText.warning_line)<=this.$text.MerChatNumber){
          this.$message.error(this.$text.Warning_lineText)
          return false
        }
        if(parseFloat(CheckJsonText.stop_line)<=this.$text.MerChatNumber){
          this.$message.error(this.$text.Stop_lineText)
          return false
        }
        else{
          return true
        }
      },
      //单击添加油卡
      AddOilClick(){
        if(this.CheckText(this.AddOilJson)){
          this.AddOilJson.balance=this.AddOilJson.balance.toString()
          this.AddOilJson.warning_line=this.AddOilJson.warning_line.toString()
          this.AddOilJson.stop_line=this.AddOilJson.stop_line.toString()
          this.AddOilJson.terminal=this.AddOilJson.terminal.toString()
          console.log(this.AddOilJson)
          var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
          console.log(tokenmd)
          var Aesjson=encodeURIComponent(this.$util.encrypt(encodeURIComponent(JSON.stringify(this.AddOilJson)),tokenmd))
          this.$axios.post(`${this.LoginUrl}SmsMerchantMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
          then((res)=>{
            console.log(res)
            if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.AddMerChatText){
              this.$notify({
                message:this.$text.AddMerChatText,
                type: 'success',
                duration: 1000
              });
              this.dialogaddVisible=false
              this.getList()
            }
            else{
              this.$message.error(res.data.MESSAGE)
            }
          }).catch((err)=>{
            console.log(err)
          })
        }

      },
      changestatues(val){


      },
      changestatuess(val){

      },
      pageSizeChange(){

      },
      pageNumberChange(){

      },
      handleClose() {},
    }
  }
</script>
<style>
  .el-dialog{
    margin-top:5vh!important;
  }
  .el-table::before{
    height: 0!important;
  }
</style>
