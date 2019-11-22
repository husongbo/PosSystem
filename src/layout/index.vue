<template>
    <div style="background: white;height: 100vh;">
        <!-- 这是侧导航 -->
        <side-bar></side-bar>
        <div class="con-wrap" :class="{conCollapse: isCollapse}">
            <!-- 这是顶部导航 -->
            <top-bar></top-bar>
            <nav class="nav-bar" v-if="nav.length!=0">
              <ScrollPane class="nav-bar-scroll">
                <router-link :to="v.path"
                             class="nav-bar-tag"
                             v-for="(v,i) in nav"
                             :key="i.path"
                             :class="$route.path == v.path ? ' active':''"
                >
                  <i class="point"></i>
                  {{ v.title }}
                  <div v-show="nav.length != 1" class="close-box">
                    <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(v)'></span>
                  </div>
                </router-link>
              </ScrollPane>
            </nav>
            <!-- 这是组件要插入的地方 -->
            <router-view class="page-component-wrap animated fadeIn"></router-view>
        </div>
    </div>
</template>
<script>
import TopBar from '@/components/TopBar'
import SideBar from '@/components/SideBar'
import ScrollPane from '@/components/ScrollPane.vue'
import {mapState,mapMutations} from 'vuex'
export default {
  name: 'layout',
  computed:{
    isCollapse:{
      get(){
        return this.$store.state.isCollapse
      },
      set(val){
        this.$store.state.isCollapse=val
      }
    },
    NavList:{
      get(){
        return this.$store.state.NavList
      },
      set(val){
        this.$store.state.NavList=val
      }
    }
  },
  data(){
    return{
      nav:[]
    }
  },
  components: {
    'top-bar': TopBar,
    'side-bar': SideBar,
    ScrollPane
  },
  methods:{
    closeSelectedTag(item){
      this.$store.commit('RemoveNav',item.title,this)
    }
  },
  created(){
    console.log(this.$route.meta.title)
    if(this.$route.meta.title==this.$text.IndexText){
      this.$notify({
        title: '',
        message: '欢迎进入POS管理后台',
        type: 'success',
        duration: 2000
      });
    }
    else{
      this.nav.push({
        title:this.$route.meta.title,
        path:this.$route.path
      })
      this.$store.commit('NavPush',{
        title:this.$route.meta.title,
        path:this.$route.path
      })
    }
  },
  watch:{
    isCollapse(news,olds){
      this.isCollapse=news
      console.log(this.isCollapse)
    },
    NavList(news,olds){
      this.nav=news
      var NavFlag=false
      this.nav.forEach((item) => {
        if(this.$route.meta.title==item.title){
          NavFlag=true
        }
      })
      if(!NavFlag){
        this.$router.push(this.nav[this.nav.length-1].path)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  $--color-primary: #3c8dbc;
.con-wrap {
  padding-left: 180px;
  transition: all 0.3s;
  h3 {
    margin-top: 0;
    color: #324157;
  }
  .page-component-wrap {
    padding: 10px;
  }
}
.con-wrap.conCollapse {
  padding-left: 64px;
  transition: all 0.3s;
}
.nav-bar {
  height: 38px;
  width: 100%;
  z-index: 8;
  background: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  transition: all 0.2s;
  .nav-bar-tag {
    height: 26px;
    color: #495060;
    text-decoration: none;
    margin: 6px 2px;
    padding-left: 6px;
    padding-right: 6px;
    font-size: 12px;
    line-height: 26px;
    border: 1px solid #ebeef5;
    border-radius: 2px;
    display: inline-block;
    .close-box {
      display: inline-block;
      height: 100%;
      border-left: 1px solid #ebeef5;
      margin-left: 6px;
    }
    &:hover {
      opacity: 0.85;
      //box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
      //border-color: #3d8dbc;
    }
    .point {
      display: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin: auto 0;
      position: relative;
      background: #fff;
    }
    .el-icon-close {
      font-weight: bolder;
      margin-left: 6px;
      &:hover {
        color: #ff0000;
      }
    }
  }
  .active {
    border: 1px solid $--color-primary;
    background: $--color-primary;
    color: #fff;
    .point {
      display: inline-block;
    }
  }
  .scroll-container {
    flex: 1;
    height: 100%;
  }
}
.v-enter {
  opacity: 0;
  transform: translateX(100%);
}

.v-leave-to {
  opacity: 0;
  transform: translateX(-100%);
  position: absolute;
}

.v-enter-active,
.v-leave-active {
  transition: all 1s ease;
}
</style>

