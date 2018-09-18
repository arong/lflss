import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import VoteEntry from "@/components/entry/VoteEntry.vue";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'vote',
      component: VoteEntry
    },
  ]
})
