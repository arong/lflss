<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin">
		  		<div class="manage_tip">
		  			<p>教务系统</p>
		  		</div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm">
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" placeholder="用户名"><span>dsfsf</span></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" @keyup.enter.native="submitForm('loginForm')" placeholder="密码" v-model="loginForm.password"></el-input>
					</el-form-item>
					<el-form-item>
				    	<el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
				  	</el-form-item>
				</el-form>
				<p class="tip">温馨提示：</p>
				<p class="tip">操作完毕后记得退出账户.</p>
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import utils from "@/utils/index.js";
import * as CONFIG from "@/config/index.js";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      showLogin: false
    };
  },
  mounted() {
    this.showLogin = true;
  },
  methods: {
    async submitForm(formName) {
      let res = await utils.simpleGet(
        `${CONFIG.BASE_URL}/user/login`,
        this.loginForm
      );

      if (res.code === 0) {
        this.route("voteSuccess");
      } else {
        alert(res.msg || "请求失败");
      }
    }
  },
};
</script>

