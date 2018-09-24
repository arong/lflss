<!-- 投票入口页面 -->
<template>
  <div class="com com-entry-vote_entry">
    <!-- <vote-code /> -->
    <component :is="childComponent"></component>
  </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';
import utils from "@/utils/index.js";

export default {
  data() {
    return {
      components: {
        voteCode: () => import("@/components/vote/VodeCode.vue"),
        vote: () => import("@/components/vote/Vote.vue"),
      }
    };
  },

  computed: {
    ...mapState({
      votePage: state => state.votePage
    }),

    childComponent() {
      return this.components[this.votePage];
    }
  },

  created() {
    // 测试调用接口
    utils.simplePost('/');
  }
}
</script>

<style lang="scss">
  .vote-container {
    height: calc(100vh - 60px);
  }
</style>
