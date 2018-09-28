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
              <el-input v-model="voteCode" placeholder="请输入投票码"></el-input>
              <el-button type="primary" @click="onStartVote">开始评分</el-button>
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

export default {
  data() {
    return {
      voteCode: ""
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
      alert("投票码: " + this.voteCode);

      // TODO: 投票码有效判断
      if (this.voteCode) {
        this.setState({
          key: "votePage",
          val: "vote"
        });
      }
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
