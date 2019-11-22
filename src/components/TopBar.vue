<!-- 顶部导航组件 -->
<!-- 使用说明：<top-bar></top-bar> -->
<template>
  <div id="topbar-wrap" :class="{ topCollapsed: isCollapse }">
    <el-row type="flex" justify="space-between">
      <el-col :span="8" style="display: flex;flex-direction: row;align-items: center">
        <i :class="[isCollapse ? 'icon-spread': 'icon-recovery','iconfont']" @click="toggleSiderBar"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 15px;">
          <el-breadcrumb-item v-for="(item,index) in BreadcrumbList" :key="index">{{item.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" class="row-right" justify="end" style="margin-right:-15px">
          <el-col :span="5">
            <a class="animated fadeIn">{{$t('m.topbar.sayHi')}}，{{userName}}</a>
          </el-col>
          <el-col :span="2">
            <i class="fa fa-language" title="切换语言" @click="toggleLanguage"></i>
          </el-col>
          <el-col :span="2">
            <i :class="[isFullscreen? 'fa-compress': 'fa-arrows-alt','fa ']" title="全屏" @click="toggleFullscreen"></i>
          </el-col>
          <el-col :span="2">
            <i class="fa fa-power-off logout" title="退出" @click.prevent="logout"></i>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import "@/assets/libs/screenfull.js";
import "../../static/css/iconfont.css";
import {mapState,mapMutations} from 'vuex'
import menu from '@/menu/'
export default {
  name: "topbar",
  data() {
    return {
      userName:'',
      isFullscreen: false,
      BreadcrumbList:[],
    };
  },
  computed:{
  isCollapse:{
    get(){
      return this.$store.state.isCollapse
    },
    set(val){
      this.$store.state.isCollapse=val
    }
  }
},
  created(){
    this.BreadcrumbList.push({
      title:'首页',
    })
    menu.forEach((item) => {
      if(item.name==this.$route.meta.title){
        this.BreadcrumbList.push({
          title:this.$route.meta.title,
          path:this.$route.path
        })
      }
      else{
        if(item.children) {
          item.children.forEach((val) => {
            if (val.name == this.$route.meta.title) {
              this.BreadcrumbList.push({
                title: item.name,
              })
              this.BreadcrumbList.push({
                title: val.name,
                path: val.path
              })
            }
          })
        }
      }
    })
    console.log(JSON.parse(localStorage.getItem('UserInfo')))
    this.userName=JSON.parse(localStorage.getItem('UserInfo')).MS_REAL_NAME
    console.log(this.isCollapse)
  },
  methods: {
    ...mapMutations(['ChangeIsCollapse']),
    toggleSiderBar() {
      this.ChangeIsCollapse()
    },
    toggleLanguage() {
      let locale = this.$i18n.locale;
      locale === "zh" ? (this.$i18n.locale = "en") : (this.$i18n.locale = "zh");
      let info = locale === "en" ? "切换成功" : "change language successfully";
      this.$message.success(info);
    },
    toggleFullscreen() {
      if (!screenfull.enabled) {
        this.$message.warning("您的浏览器不支持全屏");
        return false;
      }
      screenfull.toggle();
      // isFullscreen 居然是反的
      this.isFullscreen = !screenfull.isFullscreen;
    },
    logout() {
      var _this=this
      localStorage.removeItem('UserInfo')
      this.$notify({
        message: this.$text.OutLoginText,
        type: 'success',
        duration: 1000,
        onClose:() => {
          _this.$router.push("signin");
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      this.BreadcrumbList=[]
      this.BreadcrumbList.push({
        title:'首页',
      })
      menu.forEach((item) => {
        if(item.name==to.meta.title){
          this.BreadcrumbList.push({
            title:to.meta.title,
            path:to.path
          })
        }
        else{
          if(item.children) {
            item.children.forEach((val) => {
              if (val.name == to.meta.title) {
                this.BreadcrumbList.push({
                  title: item.name,
                })
                this.BreadcrumbList.push({
                  title: val.name,
                  path: val.path
                })
              }
            })
          }
        }
      })
      var PushNavFlag=true
      if(this.$store.state.NavList.length!=0){
        this.$store.state.NavList.forEach((item)=>{
          if(item.title==to.meta.title){
            PushNavFlag=false
          }
        })
      }
      if(PushNavFlag){
        this.$store.commit('NavPush',{
          title:to.meta.title,
          path:to.path
        })
      }
      // this.pathName = this.$route.path.substring(1);
      // this.nowPath = this.$route.path;
    },
    isCollapse(news,olds){
      this.isCollapse=news
      console.log(this.isCollapse)
    },
  }
};
</script>
<style scoped lang="scss">
#topbar-wrap {
  overflow: hidden;
  border-bottom: 1px solid #efefef;
  background: #fff;
  color: #353d47;
  padding: 0 15px;
  z-index: 4;
  box-sizing: border-box;
  // box-shadow: 0px 0px 20px rgba(0,0,0,0.03);
  a {
    line-height: 60px;
  }
  i {
    font-size: 20px;
    line-height: 60px;
    transition: all 0.5s;
    &:hover {
      cursor: pointer;
    }
  }
  .fa-language:hover {
    transform: rotateY(180deg);
  }
  .logout {
    text-decoration: none;
  }
}
.row-right > div {
  text-align: center;
}
</style>
