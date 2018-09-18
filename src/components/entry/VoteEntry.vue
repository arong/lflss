<!-- 投票入口页面 -->
<template>
  <div class="com com-entry-vote_entry">
    <!-- <vote-code /> -->
    <component :is="childComponent"></component>
  </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';

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
  }
}
</script>

<style>

</style>
