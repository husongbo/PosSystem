<!-- 左侧导航组件 -->
<template>
  <div id="sidebar-wrap" :class="{ collapsed: isCollapse }">
    <!-- 顶部图标 -->
    <h3 class="logo">
      <img v-if="!isCollapse" src="../../static/img/poss.png" style="width: 80px;height: 80px;"/>
      <img v-else="isCollapse" src="../../static/img/poss.png" style="width: 50px;height: 50px;"/>
      <!--<span class="rythm twist1">{{isCollapse ? 'POS': 'POS 管理'}}</span>-->
    </h3>
    <el-menu
      router
      background-color="rgb(48, 65, 86)"
      text-color="#fff"
      :default-active="$route.path" class="menu" @open="handleOpen" @close="handleClose"
      :collapse="isCollapse">
      <template v-for="(menu_v,menu_k) in menu">
        <el-submenu v-if="menu_v.children" :index="menu_k+''">
          <template slot="title">
            <i :class="menu_v.icon"></i>
            <span slot="title">{{ menu_v.name }}</span>
          </template>
          <el-menu-item v-for="(menuChildren_v,menuChildren_k) in menu_v.children"
                        :key="menuChildren_k"
                        :index="menuChildren_v.path+''">
            <i class="el-icon-bangzhu"></i>
            <span slot="title">{{ menuChildren_v.name }}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="menu_v.path+''">
          <i :class="menu_v.icon"></i>
          <span slot="title">{{ menu_v.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>
import Rythm from "rythm.js";
const rythm = new Rythm();
const music = require("../../static/audio/romeostune.mp3");
import {mapState,mapMutations} from 'vuex'
import menu from '../menu/index'
export default {
  name: "sidebar",
  data() {
    return {
      isMusicOn: false,
      menu:'',
    };
  },
  computed: {
    isCollapse:{
      get(){
        return this.$store.state.isCollapse
      },
      set(val){
        this.$store.state.isCollapse=val
      }
    },
    toggSiderBar() {
      return true;
    },
    langType() {
      return this.$i18n.locale;
    }
  },
  watch:{
    isCollapse(news,olds){
      this.isCollapse=news
      console.log(this.isCollapse)
    }
  },
  created() {
    this.menu=JSON.parse(localStorage.getItem('MenuList'))
    console.log(this.menu)
    // console.log(this.isCollapse)
    // console.log(menu)
    this.initRythm();
    this.$bus.$on("stopMusic", () => {
      this.isMusicOn = false;
      rythm.stop();
    });
  },
  methods: {
    initRythm() {
      rythm.setMusic(music);
      rythm.addRythm("twist1", "twist", 0, 10);
      rythm.addRythm("pulse3", "pulse", 0, 10, {
        min: 0.75,
        max: 1.5
      });
    },
    toggleDance() {
      if (this.isMusicOn) {
        this.isMusicOn = false;
        rythm.stop();
      } else {
        this.isMusicOn = true;
        rythm.start();
      }
    },
    handleOpen(key, keyPath) {
      //console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //关闭菜单
    },
  }
};
</script>
<style scoped lang="scss">
#sidebar-wrap {
  width: 180px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 5;
  transition: all 0.3s;
  background: #3f4d67;
  &.collapsed {
    width: 64px;
    transition: all 0.3s;
  }

  /* 图标动画 */
  .imgWrap {
    text-align: center;
    position: absolute;
    bottom: 30px;
    width: 100%;
    .gif {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .logo {
    color: #fff;
    text-align: center;
    padding: 18px 0 10px 0;
    margin: 0;
    /*height: 60px;*/
    box-sizing: border-box;
    img{
      /*margin-bottom: 10px;*/
    }
  }
}

.el-menu {
  height: 100%;
  box-shadow: 0px 15px 15px rgba(0,0,0,0.6);
}

// 美化左侧导航的留白
.el-submenu .el-menu-item {
  padding: 0 20px;
  min-width: 160px;
  padding-left: 26px !important;
  i {
    padding-right: 10px;
  }
}

// 改变元素属性，要不动画效果不管用，是不是很厉害啊？哈哈哈
.rythm.twist1 {
  display: block;
}
</style>
