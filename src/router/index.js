import Vue from 'vue'
import Router from 'vue-router'
import VoteEntry from "@/components/entry/VoteEntry.vue";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'voteEntry',
      component: VoteEntry
    }
  ]
})
