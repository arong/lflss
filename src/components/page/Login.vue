<template>
  <div class="outer">
    <div class="middle">
      <div class="inner">
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="login_name">
            <el-input v-model.trim="loginForm.login_name" placeholder="登录名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center">
            <el-button type="primary" class="submit_btn" @click="fakeLogin('loginForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/utils/index.js";
export default {
  name: "login",
  data: function() {
    return {
      loginForm: {
        login_name: "",
        password: ""
      },
      rules: {
        login_name: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    fakeLogin(loginForm) {
      this.$refs[loginForm].validate(async (valid) => {
        if (valid) {
          // console.log(this.loginForm.login_name);
          // console.log(this.loginForm.password);
          // localStorage.setItem("login_name", "aronic");
          // localStorage.setItem("token", "zhi-ma-kai-men");
          // localStorage.setItem("user_id", "1000");
          // this.$router.push("/");
          let res = await utils.simplePost(
            "/auth/login",
            { login_name: this.loginForm.login_name, password: this.loginForm.password },
            true
          );
          if (res.code != 0) {
            console.log(res.data);
            return false;
          }
          sessionStorage.setItem("token", res.data);
          this.$router.push("/");
          // return true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style>
.outer {
  display: table;
  position: absolute;
  height: 100%;
  width: 100%;
  /*
   * code below generate the background image
   * https://stackoverflow.com/questions/3540194/how-to-make-a-grid-like-graph-paper-grid-with-just-css
   * http://codepen.io/anon/pen/VvPWvv
   */
  background-size: 40px 40px;
  background-image: linear-gradient(to right, grey 1px, transparent 1px),
    linear-gradient(to bottom, grey 1px, transparent 1px);
}

.middle {
  display: table-cell;
  vertical-align: middle;
}

.inner {
  margin-left: auto;
  margin-right: auto;
  width: 20%;
}
</style>
