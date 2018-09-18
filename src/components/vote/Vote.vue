<!-- 投票页面 -->
<template>
  <div class="com com-vote-vote_code">
    <div class="vote-form vote-container">
投票页面
    </div>

    <!-- 这里使用<footer />会和h5自带的footer冲突,所以用大写 -->
    <Footer />
  </div>
</template>

<script>
import Footer from "./Footer.vue";
export default {
  data() {
    return {
    };
  },
  components: {
    Footer
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>
