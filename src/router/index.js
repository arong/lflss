import Vue from 'vue'
import Router from 'vue-router'
import VoteCode from "@/components/vote/VoteCode.vue";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'vote',
      component: VoteCode
    },
  ]
})
