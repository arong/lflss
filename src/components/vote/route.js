import { mapMutations } from "vuex";

export default {
  methods: {
    ...mapMutations({
      setState: "setState"
    }),
    /**
     * 跳转到指定页面(组件)
     * @param {}} pageName
     */
    route(pageName) {
      this.setState({
        key: 'votePage',
        val: pageName
      });
    }
  }
}
