<!-- 投票页面 -->
<template>
  <div class="com com-vote-vote">
    <div class="vote-form vote-container">
      <ul class="vote-list">
        <li v-for="(v, i) in teachers" :key="v.ID" class="vote-line" :class="['vote-line-' + i % 2]">
          <span>{{v.Name}}</span>
          <el-radio-group v-model="voteModels[i]" v-for="v2 in 10" :key="v2">
            <div class="vote-radio-wr">
              <el-radio :label="v2">{{ v2 }}</el-radio>
            </div>
          </el-radio-group>
        </li>
      </ul>
      <div style="padding: 30px; text-align: center;">
        <el-button type="primary" @click="onSubmit" :disabled="false">投票</el-button>
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
  mixins: [routeMixin, requestMixin],
  data() {
    return {
      voteModels: utils.genArr(10, 0)
    };
  },

  computed: {
    ...mapState({
      teachers: state => state.teachers,
      voteCode: state => state.voteCode
    })
  },

  components: {
    Footer
  },

  methods: {
    onSubmit() {
      console.log(this.voteModels);
      let validateResult = this.validate();

      if (!validateResult.valid) {
        return alert(validateResult.msg);
      }

      this.handleVote(this.formatPostData());
    },

    validate() {
      let ret = {
        valid: true,
        msg: ""
      };

      let models = this.voteModels;
      let teachers = this.teachers;
      const len = models.length;

      if (len == 0) {
        ret.valid = false;
        res.msg = "数据非法";
        return ret;
      }
      // 只有一个老师
      else if (models.length <= 1) {
        if (models[0] == 0) {
          // 未选择
          ret.valid = false;
          res.msg = "请选择";
        }
      } else if (models.length >= 2) {
        let model0 = models[0];
        let tmpIdx = -1;
        const initVal = 0;

        for (let i = 0, len = models.length; i < len; i++) {
          if (models[i] === initVal) {
            tmpIdx = i;
            break;
          }
        }

        if (tmpIdx >= 0) {
          ret.valid = false;
          ret.msg = `请为${teachers[tmpIdx].Name}老师投票`;
        } else {
          let isAllTheSameScore = !models.some(function(value, index) {
            return value !== model0;
          });

          if (isAllTheSameScore) {
            ret.valid = false;
            ret.msg = "分数不能完全一样";
          }
        }
      }

      return ret;
    },

    formatPostData() {
      let models = this.voteModels;
      let teachers = this.teachers;
      return {
        VoteCode: this.voteCode,
        Scores: models.map((v, i) => {
          return {
            TeacherID: teachers[i].ID,
            Score: v
          };
        })
      };
    },

    async handleVote(data) {
      console.log("handleVote", data);

      if (this._isSending()) {
        return;
      }

      this._setSending(true);

      let res = await utils.simplePost(`${CONFIG.HOST}/api/v1/dean/vote`, data);

      this._setSending(false);

      if (res.code === 0) {
        alert("投票成功");

        // 跳转
        this.route("voteSuccess");
      } else {
        alert(res.msg || "请求失败");
      }
    },

    patchVoteModels() {
      this.voteModels = utils.genArr(this.teachers.length, 0);
    }
  },

  mounted() {
    this.patchVoteModels();
  }
};
</script>

<style lang="scss" scoped>
.com-vote-vote {
  .vote-line {
    line-height: 50px;
  }

  .vote-line-0 {
    background-color: #efefef;
  }

  .vote-radio-wr {
    display: inline-block;
    padding-left: 10px;
    padding-right: 30px;
  }
}
</style>
