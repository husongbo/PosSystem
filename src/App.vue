<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>

export default {
  name: "app",
  data(){
    return {
      timmer: null,
      lastTime: null
    }
  },
  mounted () {
    window.setInterval(this.tTime, 1000)
  },
  created() {
    this.lastTime = new Date();
    window.addEventListener('resize', () => {
      this.handleTime();
    })
    window.addEventListener('click', () => {
      this.handleTime();
    })
    window.addEventListener('scroll', () => {
      if (this.timmer) {
        clearTimeout(this.timmer);
      }

      this.timmer = setTimeout(() => {
        this.handleTime();
      }, 3000)
    }, true)
  },
  methods:{
    handleTime() {
      const curTime = new Date();
      // console.log(curTime - this.lastTime)
      if (curTime - this.lastTime > 1000 * 60 * 30) {
        if (this.$route.path == '/signin') {
          this.lastTime = new Date();
          return
        }
        //退出
        this.$message({
          message: this.$text.OverTimeText,
          type: 'error',
          duration:1000
        })
        setTimeout(()=>{
          localStorage.removeItem('UserInfo');
          this.$router.push({path: '/signin'});
        },2000)
      } else {
        this.lastTime = curTime;
      }
    }
  },
};
</script>
<style lang="scss">
// 引入全局样式
@import "./assets/scss/global.scss";
</style>
