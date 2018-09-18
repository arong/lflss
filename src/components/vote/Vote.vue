<!-- 投票页面 -->
<template>
  <div class="com com-vote-vote">
    <div class="vote-form vote-container">
      <ul class="vote-list">
        <li v-for="(v, i) in voteModels" :key="i" class="vote-line" :class="['vote-line-' + i % 2]">
          <span>名字</span>
          <el-radio-group v-model="voteModels[i]" v-for="v2 in 10" :key="v2">
            <div class="vote-radio-wr">
              <el-radio :label="v2">{{ v2 }}</el-radio>
            </div>
          </el-radio-group>
        </li>
      </ul>
    </div>

    <!-- 这里使用<footer />会和h5自带的footer冲突,所以用大写 -->
    <Footer />
  </div>
</template>

<script>
import Footer from "./Footer.vue";
import utils from "@/utils/index.js";

export default {
  data() {
    return {
      voteModels: utils.genArr(10, 0)
    };
  },
  components: {
    Footer
  },

  methods: {}
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
