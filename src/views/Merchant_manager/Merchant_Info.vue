<template>
  <div class="app-container">
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
      <el-table-column label="商户ID" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.baseInfo.M0007_ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户名" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.baseInfo.M0007_NAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" width="150px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.M0007_CONTACTS }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="150px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.M0007_PHONE }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备付金" width="120px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.M0007_BALANCE }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="预警值" width="120px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.M0007_EARLY_WARNING_LINE }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="停止线" width="120px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.M0007_STOP_LINE }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商户公司名称" width="320px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.MERCHANT_COMPANY_NAME }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商户地址" width="150px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.baseInfo.M0007_ADD }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商户状态" width="100px" align="center">
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
        // 分页查询参数
        pageForm: {
          pageNum: 1,
          pageSize: 10,
          dataType: 1,
          totalCount:4,
        },
        //排序
        ascdesc:[
          {id:1,names:'升序'},
          {id:2,names:'降序'},
        ],
        ascdesctxt:'',
        //导出
        exportloadLoading:false,
        disabled:true,
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
          const tHeader = ['商户号', '商户名','联系人', '手机号', '备付金','预警值','停止线','商户公司名称','商户地址','商户状态','创建日期']
          const filterVal = ['M0007_ID', 'M0007_NAME','M0007_CONTACTS', 'M0007_PHONE', 'M0007_BALANCE','M0007_EARLY_WARNING_LINE','M0007_STOP_LINE','MERCHANT_COMPANY_NAME',
          'M0007_ADD','DATA_STATE','DATA_CREATE_TIME']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '商户信息'
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
  .el-table::before{
    height: 0!important;
  }
</style>
