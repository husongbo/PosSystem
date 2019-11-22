<template>
  <div class="app-container">


    <div style="display: flex;justify-content: space-between">
      <div></div>
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
      <el-table-column label="备付金剩余金额" width="150px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.M0011_RESERVE_GOLD_BALANCE }}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column label="充值金额" width="150px" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<el-tag>{{ scope.row.M0011_RESERVE_GOLD_BALANCE }}</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="财务审核状态" width="200px" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.M0011_FINANCE_EXAMINE_STATE=='0'"  class="fa fa-circle text-danger ml5" style="color: red"/>
          <i v-else class="fa fa-circle text-success ml5" style="color: #15db81"/>
        </template>
      </el-table-column>
      <el-table-column label="财务审核时间" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.DATA_FINANCE_EXAMINE_TIME }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.DATA_CREATE_TIME }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-card class="box-card" style="margin-top: 10px;">
      <div class="text item" style="margin-bottom: 10px;">
        总笔数: <el-tag>{{total}}</el-tag><span style="margin-left: 5px;">条</span>
      </div>
    </el-card>



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
          method:'list',
          merchant_id:''
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
          if(parseInt(item.M0011_FINANCE_EXAMINE_STATE)==0){
            return item.M0011_FINANCE_EXAMINE_STATE='未审核'
          }
          else{
            return item.M0011_FINANCE_EXAMINE_STATE='已审核'
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
