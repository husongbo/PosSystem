<template>
  <div class="app-container">
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-date-picker
          v-model="modifyDate"
          :picker-options="pickerOptions2"
          type="daterange"
          align="right"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator=""
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleFilterDate"
        />
        <el-select v-model="Mode" clearable placeholder="消费方式"
                   style="width: 160px;margin-left: 20px;"
                   @change="ChangeMode">
          <el-option v-for="items in ModeList" :key="items.value" :label="items.text"
                     :value="items.value"/>
        </el-select>
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
      <el-table-column label="ID" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.M0007_ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费用户" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.M0007_NAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道方式" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.MS0007_NAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费方式" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.DATA_TRANCE_NAME }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="流水号" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.M0009_NO }}</el-tag>
        </template>
      </el-table-column>
        <el-table-column label="支付金额" width="200px" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.M0009_AMOUNT }}</el-tag>
          </template>
      </el-table-column>
      <el-table-column label="消费时间" width="200px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.DATA_CREATE_TIME }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-card class="box-card" style="margin-top: 10px;">
      <div class="text item" style="margin-bottom: 10px;">
        总笔数: <el-tag>{{total}}</el-tag><span style="margin-left: 5px;">条</span>
      </div>
      <div class="text item">
        总金额: <el-tag>{{bussinessTotalMoney}}</el-tag>
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
        listLoading: true,
        disabledNow: false,
        deleteRowData: {},
        dialogFormVisible: false,
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
        modifyDate:[],
        pickerOptions2: {
          shortcuts: [
            {
              text: '最近一天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '全部',
              onClick(picker) {
                const end = ""
                const start = ""
                picker.$emit('pick', [start, end])
              }
            }]
        },
        FlowJson:{
          terminal:'',
          userid:'',
          begintime:'',
          endtime:'',
          trancename:''
        },
        total:0,//总笔数
        bussinessTotalMoney:0.00,//总金额
        Mode:'',//消费方式
        ModeList:[
          {
            value: '油信宝消费',
            text: '油信宝'
          }, {
            value: '微信消费',
            text: '微信'
          }, {
            value: '支付宝消费',
            text: '支付宝'
          },{
            value: '翼支付消费',
            text: '翼支付'
          }, {
            value: '沃支付消费',
            text: '沃支付'
          }, {
            value: '银行卡消费',
            text: '银行卡'
          }, {
            value: '云闪付消费',
            text: '云闪付'
          }, {
            value: '现金消费',
            text: '现金'
          }
        ]
      }
    },
    created() {
      this.Userinfo=JSON.parse(localStorage.getItem('UserInfo'))
      this.modifyDate[0]=this.$filter.Fun_Data(-7)
      this.modifyDate[1]=this.$filter.GetData()
      this.FlowJson.begintime=this.$filter.Fun_Data(-7)
      this.FlowJson.endtime=this.$filter.GetData()
      console.log(this.Userinfo)
      this.getList()
    },
    methods: {
      Addinformation(){

      },
      //查询消费方式
      ChangeMode(mode){
        this.FlowJson.trancename=mode
        this.getList()
        console.log(mode)
      },
      handleFilterDate(fromdata){
        console.log(fromdata)
        if(fromdata==null){
          this.$message.error(this.$text.FromDataQueryText)
          return
        }
        this.FlowJson.begintime=fromdata[0]
        this.FlowJson.endtime=fromdata[1]
        this.getList()
      },
      getList() {
        var _this=this
        this.total=0
        this.bussinessTotalMoney=0
        this.listLoading = true
        console.log(this.FlowJson)
        var tokenmd=this.Userinfo.MS_TOKEN.slice(0,16)
        var Aesjson=encodeURIComponent(this.$util.encrypt(encodeURIComponent(JSON.stringify(this.FlowJson)),tokenmd))
        this.$axios.post(`${this.LoginUrl}CouponList?params=${Aesjson}&username=${this.Userinfo.MS_REAL_NAME}`).
        then((res)=>{
          if(res.data.RESULT==0 && res.data.MESSAGE==this.$text.QueryFlowListText){
            this.list=JSON.parse(res.data.data)
            this.list.map((item)=>{
              return item.DATA_CREATE_TIME=this.$filter.ForDataTimes(item.DATA_CREATE_TIME)
            })
            this.total=this.list.length
            this.list.forEach((item) => {
              this.bussinessTotalMoney+=parseFloat(item.M0009_AMOUNT)
            })
            console.log(this.list)
          }
          else{
            this.list=[]
            this.$message.error(res.data.MESSAGE)
          }

          console.log(res)
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
          if(parseInt(item.DATA_STATE)==0){
            return item.DATA_STATE='未激活'
          }
          else{
            return item.DATA_STATE='已激活'
          }
        })
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID', '消费用户', '渠道方式', '消费方式','流水号','支付金额','消费时间']
          const filterVal = ['M0007_ID', 'M0007_NAME', 'MS0007_NAME', 'DATA_TRANCE_NAME','M0009_NO','M0009_AMOUNT','DATA_CREATE_TIME']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '流水信息'
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
