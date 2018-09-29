// 标记是否在发送请求
export default {
  data() {
    return {
      isSendingRequest: false
    }
  },

  methods: {
    _setSending(is) {
      this.isSendingRequest = is;
    },

    _isSending() {
      return this.isSendingRequest;
    }
  }
}
