<template>
  <div class="bg">
    <div class="login-wrap animated fadeIn">
      <h3>POS后台系统</h3>
      <p>欢迎使用POS后台管理系统</p>
      <el-form ref="form" :model="form"  label-width="0px">
        <el-form-item prop="name">
          <el-input :placeholder="$text.LoginName" v-model="form.username" clearable></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :placeholder="$text.LoginPassword" v-model="form.password" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="space-between">
            <el-checkbox v-model="isMemery" style="color:#eee">记住账号</el-checkbox>
            <a href @click.prevent="openMsg" style="color:#eee">忘记密码</a>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loginflag" type="primary" @click="Login('form')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 粒子漂浮物 -->
    <vue-particles color="#fff" :particleOpacity="0.7" :particlesNumber="30" shapeType="star" :particleSize="5" linesColor="#fff" :linesWidth="2" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="3" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push"></vue-particles>
  </div>
</template>
<script>
// 引入粒子特效插件并注册
import Vue from "vue";
import generateRoutes from "../router/parse";
import VueParticles from "vue-particles";
import md5 from 'md5'
Vue.use(VueParticles);
export default {
  name: "signin",
  data() {
    return {
      form: {
        // name: localStorage.userInfo || "admin",
        // password: localStorage.passwordInfo || "654321"
        username:'',
        password:'',
      },
      isMemery: false,
      // rules: {
      //   name: [
      //     {
      //       required: true,
      //       message: this.$t("m.login.name_tip"),
      //       trigger: "blur"
      //       // validator: checkone
      //     }
      //   ],
      //   password: [
      //     {
      //       required: true,
      //       message: this.$t("m.login.password_tip"),
      //       trigger: "blur"
      //     }
      //   ]
      // },
      loginflag:false,
    };
  },
  methods: {
    async Login(formName) {
      if(this.form.username==''||this.form.password==''){
        this.$message.error("用户名或密码不能为空！请正确输入")
        return
      }
      this.loginflag=true//开始加载
      //获取key
      var mdpsd=md5(this.form.password).slice(0,16).toUpperCase()
      console.log(mdpsd)
      var Aesjson=encodeURIComponent(this.$util.encrypt(JSON.stringify({
        password:this.form.password
      }),mdpsd))
     await this.$axios.post(`${this.LoginUrl}SmsLogin?params=${Aesjson}&username=${this.form.username}`).
        then((res)=>{
          if(res.data.RESULT==1&&res.data.MESSAGE==this.$text.LoginRes){
            this.$message.error(this.$text.LoginRes)
            this.form.password=''
          }
          else if(res.data.RESULT==1&&res.data.MESSAGE==this.$text.loginErr){
            this.$message.error(this.$text.loginErr)
            this.form.password=''
          }
          else{
            localStorage.setItem('UserInfo',JSON.stringify(res.data))
            this.$store.dispatch('GetUserMenuList',res.data.MS_ROLE_ID)
            this.getMenu()
          }
          console.log(res)
        this.loginflag=false
      })
      console.log(Aesjson)
    },
    getMenu() {
      setTimeout(()=>{
        this.$router.push("/");
      },1000)
    },
    openMsg() {
      // 注意这里使用了国际化
      this.$message.warning(this.$t("m.login.info"));
    }
  },
  watch: {
    isMemery(n, o) {
      if (n) {
        localStorage.userInfo = this.form.name;
        localStorage.passwordInfo = this.form.password;
      } else {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("passwordInfo");
      }
    }
  }
};
</script>
<style scoped lang="scss">
.bg {
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background:rgb(48, 65, 86);
  background-position: -20% 10%;
  background-size: contain;
  #particles-js {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
.login-wrap {
  width: 310px;
  padding: 30px;
  z-index: 3;
  margin-right: -40%;
  position: relative;
  background: rgba(48, 75, 90,.5);
  .el-form-item {
    margin-bottom: 25px !important;
  }
  h3 {
    text-align: center;
    color: #ebedef;
    margin-top: 0px;
    margin-bottom: 5px;
    font-size: 22px;
    span {
      color: #20a0ff;
    }
  }
  p {
    text-align: center;
    color:#fff;
    margin:0;
  }
  form {
    margin-top: 25px;
    .el-form-item {
      margin-bottom: 15px;
    }

  }
  a {
    text-decoration: none;
    color: #1f2d3d;
  }
  button {
    width: 100%;
    font-weight: 600;
    border:none;
    border-radius: 0;
    background-color: #34495e;
  }
}
</style>
