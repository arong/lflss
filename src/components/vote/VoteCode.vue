<!-- 输入投票码页面 -->
<template>
  <div class="com com-vote-vote_code">
    <div class="vote-form vote-container">
      <div class="form-wr">
        <el-row>
          <el-col :span="8">
            &nbsp;
          </el-col>
          <el-col :span="8">
            <div class="form-group submit">
              <el-input v-model="voteCode" @keyup.enter.native="onStartVote" placeholder="请输入投票码" ></el-input>
              <el-button type="primary" @click="onStartVote" :disabled="!voteCode || isSendingRequest">开始评分</el-button>
            </div>
          </el-col>
          <el-col :span="8">
            &nbsp;
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 这里使用<footer />会和h5自带的footer冲突,所以用大写 -->
    <Footer />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Footer from "./Footer.vue";
import utils from "@/utils/index.js";

import requestMixin from "@/mixin/request.js";
import routeMixin from "./route.js";
import * as CONFIG from "@/config/index.js";

export default {
  data() {
    return {
      voteCode: ""
      // teacherList:[],
    };
  },
  components: {
    Footer
  },
  mixins: [requestMixin, routeMixin],
  methods: {
    onStartVote() {
      this.voteCode = utils.trim(this.voteCode);
      if (!this.voteCode) {
        return alert("投票码不能为空");
      }

      this.handleVoteVode();
    },

    async handleVoteVode() {
      // 避免重复请求
      if (this._isSending()) {
        return;
      }
      this._setSending(true);
      // 请求URL
      let res = await utils.simpleGet(
        `${CONFIG.HOST}/api/v1/dean/vote/` + this.voteCode
      );
      this._setSending(false);

      if (res.code != 0) {
        return alert("请输入正确的投票码");
      }

      let teachers = res.data.Teachers;

      if (!teachers || !teachers.length) {
        return alert("目前尚无您可以投票的老师");
      }

      this.route("vote"); // 跳转到投票页面

      this.setState({
        key: "voteCode",
        val: this.voteCode
      });

      this.setState({
        key: "teachers",
        val: teachers
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.com-vote-vote_code {
  .vote-form {
    height: calc(100vh - 60px);
  }

  .form-wr {
    padding-top: 300px;
  }

  .submit {
    white-space: nowrap;
  }
}
</style>
