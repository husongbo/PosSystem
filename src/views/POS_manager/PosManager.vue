<template>
  <div class="app-container" style="">

    <div style="display: flex;justify-content: space-between">
      <div>
      </div>
      <div style="display: flex;">
        <el-button icon="el-icon-download" :loading="exportloadLoading" type="primary" style="margin-left: 10px;margin-bottom: 10px;"
                   @click="handleDownload">导出</el-button>
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
      <el-table-column label="商户名" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.M0007_NAME }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="终端号" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.M0006_IMEI }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="终端状态" width="200px" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.DATA_STATE=='0'"  class="fa fa-circle text-danger ml5" style="color: red"/>
          <i v-else class="fa fa-circle text-success ml5" style="color: #15db81"/>
        </template>
      </el-table-column>
      <el-table-column label="申请日期" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.DATA_CREATE_TIME }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="EditOilCard(scope.row)">{{$text.Edit}}</el-button>
          <el-button type="primary" size="mini" @click="DeleteOilCard(scope.row)">{{$text.Delete}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-card class="box-card" style="margin-top: 10px;">
      <div class="text item" style="margin-bottom: 10px;">
        总笔数: <el-tag>{{total}}</el-tag><span style="margin-left: 5px;">条</span>
      </div>
    </el-card>

    <!--编辑-->
    <el-dialog title="编辑" append-to-body  :visible.sync="EdialogaddVisible">
      <el-form   label-position="left" label-width="120px" style="width: 800px; margin-left:50px;">
        <el-form-item label="终端号">
          <el-input style="width:200px;height: 36px;" size="small" disabled="disabled" v-model="EditOilJson.terminal"  placeholder="请输入终端号" ></el-input>
        </el-form-item>
        <el-form-item label="终端状态">
          <el-switch
            @change="ChangeOilCradState"
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



    <!--删除-->
    <el-dialog
      :before-close="handleClose"
      append-to-body
      :visible.sync="dialogDeleteVisible"
      title="删除终端号"
      width="35%">
      <span>确定要删除<el-tag>终端号:{{DelJson.Temid}}</el-tag>吗?</span>
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
        //编辑终端
        EditOilJson:{
          method:'edit',
          terminal_id:'',
          terminal:'',
          state:'',
        },
        EdialogaddVisible:false,
        DelJson:{
          OilCard:'',
          Temid:''
        },
        //删除终端
        RmoveJson:{
          method:'delete',
          terminal_id:''
        },
        //排序
        ascdesc:[
          {id:1,names:'升序'},
          {id:2,names:'降序'},
        ],
        ascdesctxt:'',
        //导出
        exportloadLoading:false,
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
      getList() {
        var _this=this
        this.total=0
        this.listLoading = true
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify({
          method:'alllist'
        }),tokenmd))
        this.$axios.post(`${this.LoginUrl}TerminalMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
           this.list=JSON.parse(res.data.DATA)
          this.list.map((item)=>{
            return item.DATA_CREATE_TIME=this.$filter.ForDataTimes(item.DATA_CREATE_TIME)
          })
          this.total=this.list.length
          console.log(this.list)
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
      //修改终端号状态
      ChangeOilCradState(val){
        this.EditOilJson.state=val
      },
      //修改终端号
      EditOilCard(val){
        console.log(val)
        this.EditOilJson.terminal=val.M0006_IMEI
        this.EditOilJson.terminal_id=val.R0607_ID
        this.EditOilJson.state=val.DATA_STATE
        this.EdialogaddVisible=true
      },
      //删除终端号
      DeleteOilCard(val){
        console.log(val)
        this.RmoveJson.terminal_id=val.R0607_ID
        this.DelJson.Temid=val.M0006_IMEI
        this.dialogDeleteVisible=true
      },
      //删除终端号单击
      RemoveOilCard(){
        console.log(this.RmoveJson)
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify(this.RmoveJson),tokenmd))
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
            this.getList()
          }
          else{
            this.$message.error(res.data.MESSAGE)
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      //修改终端号
      EditOilCardClick(){
        console.log(this.EditOilJson)
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(encodeURIComponent(JSON.stringify(this.EditOilJson)),tokenmd))
        this.$axios.post(`${this.LoginUrl}TerminalMs?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          console.log(res)
          if(res.data.RESULT==1 && res.data.MESSAGE==this.$text.ChangeTemidText){
            this.$notify({
              message:this.$text.ChangeTemidText,
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
          const tHeader = ['终端号', '油卡状态', '申请日期']
          const filterVal = ['M0006_IMEI', 'DATA_STATE', 'DATA_CREATE_TIME']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '终端信息'
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
