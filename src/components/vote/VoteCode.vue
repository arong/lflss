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
              <el-button type="primary" @click="onStartVote" :disabled="!voteCode">开始评分</el-button>
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
import axios from "axios";

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

  methods: {
    ...mapMutations({
      setState: "setState"
    }),
    onStartVote() {
      this.voteCode = this.voteCode.trim();
      console.log(this.voteCode + "|");
      if (this.voteCode == "") {
        return;
      }

      // 请求URL
      axios
        .get("http://localhost/api/v1/dean/vote/" + this.voteCode)
        .then(res => {
          console.log(res);
          if (res.data.code != 0) {
            alert("请输入正确的投票码");
          } else if (res.data.data.length == 0) {
            alert("目前尚无您可以投票的老师");
          } else {
            // 准备跳转到另外一个页面
          }
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
