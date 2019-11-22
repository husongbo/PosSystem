<template>
  <div class="app-container">
    <!--增加-->
    <el-dialog title="增加" append-to-body  :visible.sync="dialogaddVisible">
      <el-form   label-position="left" label-width="120px" style="width: 800px; margin-left:50px;">
        <el-form-item label="汇款银行">
          <el-input style="width:200px;height: 36px;" size="small"  v-model="AddOilJson.remittance_bank"  placeholder="请输入汇款银行" ></el-input>
        </el-form-item>
        <el-form-item label="汇入银行">
          <el-input style="width:200px;height: 36px;" size="small"  v-model="AddOilJson.paying_bank"  placeholder="请输入汇入银行" ></el-input>
        </el-form-item>
        <el-form-item label="汇款流水号">
          <el-input style="width:200px;height: 36px;" size="small"  v-model="AddOilJson.remittance_flow" placeholder="请输入汇款流水号" ></el-input>
        </el-form-item>
        <el-form-item label="备付金金额">
          <el-input-number
            v-model="AddOilJson.gold_balance"
            :min="1"
            :max="99999999"
            clearable
            controls-position="right"/>
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
          v-if="Userinfo.MS_ROLE_ID=='6'"
          class="filter-item"
          style="margin-left: 10px;margin-bottom: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="AddOil"
        >添加备付金
        </el-button>
      </div>
      <div style="display: flex;margin-bottom: 10px;">
        <!--<el-button icon="el-icon-download" :loading="exportloadLoading" type="primary" style="margin-left: 10px;margin-bottom: 10px;"-->
                   <!--@click="handleDownload">导出</el-button>-->
        <el-select v-model="ascdesctxt" clearable placeholder="默认升序"
                   style="width: 160px;margin-left: 20px;"
                   @change="clickdescType">
          <el-option v-for="items in ascdesc" :key="items.id" :label="items.names"
                     :value="items.id"/>
        </el-select>
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
      <el-table-column label="申请人" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.DATA_REVIEWED_USER }}</span>
        </template>
      </el-table-column>
      <el-table-column label="汇款银行" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.M0011_REMITTANCE_BANK }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="汇入银行" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.M0011_PAYING_BANK }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="汇款流水号" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.M0011_REMITTANCE_FLOW }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备付金金额" width="150px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.M0011_RESERVE_GOLD_BALANCE }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="财务审核状态" width="200px" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.M0011_FINANCE_EXAMINE_STATE=='0'"  class="fa fa-circle text-danger ml5" style="color: red"/>
          <i v-else class="fa fa-circle text-success ml5" style="color: #15db81"/>
        </template>
      </el-table-column>
      <el-table-column label="财务审核时间" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.M0011_FINANCE_EXAMINE_STATE=='1'">{{ scope.row.DATA_FINANCE_EXAMINE_TIME }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.DATA_CREATE_TIME }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240px" class-name="small-padding fixed-width" v-if="Userinfo.MS_ROLE_ID!=7">
        <template slot-scope="scope" >
          <div v-if="scope.row.M0011_FINANCE_EXAMINE_STATE=='0' && Userinfo.MS_ROLE_ID==6">
            <el-button type="primary" size="mini" @click="EditOilCard(scope.row)">{{$text.Edit}}</el-button>
            <el-button type="primary" size="mini" @click="DeleteOilCard(scope.row)">{{$text.Delete}}</el-button>
          </div>
          <el-button v-if="scope.row.M0011_FINANCE_EXAMINE_STATE=='0' && Userinfo.MS_ROLE_ID==4" type="primary" size="mini" @click="EditOilCard(scope.row)">{{$text.Examine}}</el-button>
        </template>
        <!--<template slot-scope="scope" v-else>-->
          <!--<el-button type="primary" size="mini" @click="EditOilCard(scope.row)">{{$text.Examine}}</el-button>-->
        <!--</template>-->
      </el-table-column>
    </el-table>
    <el-card class="box-card" style="margin-top: 10px;">
      <div class="text item" style="margin-bottom: 10px;">
        总笔数: <el-tag>{{total}}</el-tag><span style="margin-left: 5px;">条</span>
      </div>
    </el-card>


    <!--编辑-->
    <el-dialog :title="changtext" append-to-body  :visible.sync="EdialogaddVisible">
      <el-form   label-position="left" label-width="120px" style="width: 800px; margin-left:50px;">
        <el-form-item label="申请人">
          <el-input style="width:200px;height: 36px;" size="small"  v-model="EditOilJson.username" disabled="disabled" ></el-input>
        </el-form-item>
        <el-form-item label="汇款银行">
          <el-input style="width:200px;height: 36px;" size="small" disabled="disabled" v-model="EditOilJson.remittance_bank"></el-input>
        </el-form-item>
        <el-form-item label="汇入银行">
          <el-input style="width:200px;height: 36px;" size="small" disabled="disabled"  v-model="EditOilJson.paying_bank" ></el-input>
        </el-form-item>
        <el-form-item label="汇款流水号">
          <el-input style="width:200px;height: 36px;" size="small" disabled="disabled" v-model="EditOilJson.remittance_flow" ></el-input>
        </el-form-item>
        <el-form-item label="备付金金额">
          <el-input-number
            v-model="EditOilJson.gold_balance"
            :disabled="RoleFlag"
            :min="1"
            :max="99999999"
            clearable
            controls-position="right"/>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-switch
            :disabled="!RoleFlag"
            @change="ChangeOilCradState"
            v-model="EditOilJson.finance_examine_state"
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

    <!--删除-->
    <el-dialog
      :before-close="handleClose"
      append-to-body
      :visible.sync="dialogDeleteVisible"
      title="删除油卡"
      width="35%">
      <span>确定要删除吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="RemoveOilCard">确 定</el-button>
      </span>
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
        downloadLoading: false,
        Userinfo:'',
        // 分页查询参数
        pageForm: {
          pageNum: 1,
          pageSize: 10,
          dataType: 1,
          totalCount:4,
        },
        //添加油卡
        AddOilJson:{
          method:'add',
          merchant_id:'',
          remittance_bank:'',
          paying_bank:'',
          remittance_flow:'',
          gold_balance:1
        },
        //编辑油卡
        EditOilJson:{
          method:'edit',
          balance_id:'',
          merchant_id:'',
          remittance_bank:'',
          paying_bank:'',
          remittance_flow:'',
          gold_balance:'',
          username:'',
          finance_examine_user:'',
          finance_examine_state:'',
          state:'',
        },
        EdialogaddVisible:false,
        DelJson:{
          OilCard:'',
          Temid:''
        },
        RmoveJson:{
          method:'delete',
          balance_id:''
        },
        //排序
        ascdesc:[
          {id:1,names:'升序'},
          {id:2,names:'降序'},
        ],
        ascdesctxt:'',
        //导出
        exportloadLoading:false,
        RoleFlag:false,
        changtext:'编辑',
      }
    },
    created() {
      this.Userinfo=JSON.parse(localStorage.getItem('UserInfo'))
      if(parseInt(this.Userinfo.MS_ROLE_ID)!=6){
        this.changtext='审核'
        this.RoleFlag=true
      }
      console.log(this.Userinfo)
      this.getList()
    },
    methods: {
      Addinformation(){

      },
      getList() {
        var _this=this
        this.total=0
        this.listLoading = true
        var merid=''
        if(parseInt(this.Userinfo.MS_ROLE_ID)==6){
          merid=this.Userinfo.MS_MERCHANT_ID
        }
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify({
          method:'list',
          merchant_id:merid
        }),tokenmd))
        this.$axios.post(`${this.LoginUrl}SmsBalanceMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          console.log(res)
          if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.SelectReserveList){
            this.list=JSON.parse(res.data.DATA)
            this.list.map((item)=>{
              return item.DATA_FINANCE_EXAMINE_TIME=this.$filter.ForDataTimes(item.DATA_FINANCE_EXAMINE_TIME)
            })
            this.list.map((item)=>{
              return item.DATA_CREATE_TIME=this.$filter.ForDataTimes(item.DATA_CREATE_TIME)
            })
            this.total=this.list.length
            console.log(this.list)
          }
          else{
            this.list=[]
          }
          this.listLoading=false
        }).catch((err)=>{
          console.log(err)
        })
      },
      //排序
      clickdescType(val){
        console.log(val)
        if(val==''){
          return
        }
        if(val==1){
          this.list = this.list.sort(this.sortDownDate);
        }
        else{
          this.list = this.list.sort(this.descUpDate);
        }
      },
      //升序
      sortDownDate(a, b) {
        return Date.parse(a.DATA_CREATE_TIME) - Date.parse(b.DATA_CREATE_TIME);
      },
      //降序
      descUpDate(a, b) {
        return Date.parse(b.DATA_CREATE_TIME) - Date.parse(a.DATA_CREATE_TIME);
      },
      //修改备付金状态
      ChangeOilCradState(val){
        this.EditOilJson.finance_examine_state=val
      },
      //添加备付金
      AddOil(){
        this.AddOilJson.remittance_bank=''
        this.AddOilJson.paying_bank=''
        this.AddOilJson.remittance_flow=''
        this.AddOilJson.gold_balance=1
        this.dialogaddVisible=true
      },
      //修改备付金
      EditOilCard(val){
        this.EditOilJson.balance_id=val.M0011_RESERVE_GOLD_ID
        if(this.Userinfo.MS_ROLE_ID!=6){
          this.EditOilJson.finance_examine_user=this.Userinfo.MS_REAL_NAME
        }
        else{
          this.EditOilJson.finance_examine_user=val.DATA_FINANCE_EXAMINE_USER
        }
        this.EditOilJson.merchant_id=val.M0007_ID
        this.EditOilJson.remittance_bank=val.M0011_REMITTANCE_BANK
        this.EditOilJson.paying_bank=val.M0011_PAYING_BANK
        this.EditOilJson.remittance_flow=val.M0011_REMITTANCE_FLOW
        this.EditOilJson.gold_balance=val.M0011_GOLD_BALANCE_BEFORE
        this.EditOilJson.username=this.Userinfo.MS_REAL_NAME
        this.EditOilJson.finance_examine_state=val.M0011_FINANCE_EXAMINE_STATE
        this.EditOilJson.state=val.DATA_STATE
        this.EdialogaddVisible=true
      },
      //删除备付金
      DeleteOilCard(val){
        console.log(val)
        this.RmoveJson.balance_id=val.M0011_RESERVE_GOLD_ID
        this.dialogDeleteVisible=true
      },
      //删除备付金单击
      RemoveOilCard(){
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify(this.RmoveJson),tokenmd))
        this.$axios.post(`${this.LoginUrl}SmsBalanceMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          console.log(res)
          if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.DeleteReserveText){
            this.$notify({
              message:this.$text.DeleteReserveText,
              type: 'success',
              duration: 1000
            });
            this.dialogDeleteVisible=false
            this.getList()
          }
          else{
            this.$message.error(res.data.MESSAGE)
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      //修改备付金单击
      EditOilCardClick(){
        if(this.EditOilJson.gold_balance<=0){
          this.$message.error(this.$text.ReserveText)
          return
        }
        // this.EditOilJson.finance_examine_state=parseInt(this.EditOilJson.finance_examine_state)
        this.EditOilJson.gold_balance=this.EditOilJson.gold_balance.toString()
        console.log(this.EditOilJson)
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(encodeURIComponent(JSON.stringify(this.EditOilJson)),tokenmd))
        this.$axios.post(`${this.LoginUrl}SmsBalanceMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          console.log(res)
          if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.ChangeReserveText){
            if(this.Userinfo.MS_ROLE_ID==6){
              this.$notify({
                message:this.$text.ChangeReserveText,
                type: 'success',
                duration: 1000
              });
            }
            else{
              this.$notify({
                message:this.$text.ExamineReserveText,
                type: 'success',
                duration: 1000
              });
            }
            this.EdialogaddVisible=false
            this.getList()
          }
          else{
            this.$message.error(res.data.MESSAGE)
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      //单击添加备付金
      AddOilClick(){
        if(this.AddOilJson.remittance_bank==''||this.AddOilJson.paying_bank==''||this.AddOilJson.remittance_flow==''){
          this.$message.error(this.$text.InputErrorText)
          return
        }
        if(this.AddOilJson.gold_balance<=0){
          this.$message.error(this.$text.ReserveText)
          return
        }
        this.AddOilJson.gold_balance=this.AddOilJson.gold_balance.toString()
        this.AddOilJson.merchant_id=this.Userinfo.MS_MERCHANT_ID
        console.log(this.AddOilJson)
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(encodeURIComponent(JSON.stringify(this.AddOilJson)),tokenmd))
        this.$axios.post(`${this.LoginUrl}SmsBalanceMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          console.log(res)
          if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.AddReserveText){
            this.$notify({
              message:this.$text.AddReserveText,
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
      handleDownload() {
        this.exportloadLoading = true
        this.list.map((item)=>{
          if(parseInt(item.DATA_STATE)==0){
            return item.DATA_STATE='未激活'
          }
          else{
            return item.DATA_STATE='已激活'
          }
        })
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['申请人', '汇款银行', '汇入银行','汇款流水号','备付金金额','财务审核状态','财务审核时间']
          const filterVal = ['DATA_REVIEWED_USER', 'M0011_REMITTANCE_BANK', 'M0011_PAYING_BANK', 'M0011_REMITTANCE_FLOW','M0011_RESERVE_GOLD_BALANCE','M0011_FINANCE_EXAMINE_STATE','DATA_FINANCE_EXAMINE_TIME']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '备付金信息'
          })
          this.exportloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
<style>
  .el-dialog{
    margin-top:5vh!important;
  }
</style>
