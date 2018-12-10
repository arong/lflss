<template>
  <div class="questionnaire">
    <div class="title">
      <h2 @click="editTitle" v-if="!titleEditing">{{questionnaire.title}}</h2>
      <el-input
        type="text"
        v-model.trim="questionnaire.title"
        v-if="titleEditing"
        @blur="onblur"
        @keyup.enter="submitTitle()"
      ></el-input>
    </div>
    <div class="content">
      <div class="question" v-for="question in questionnaire.questions" :key="question.question_id">
        <p>{{question.question}}</p>
        <el-radio-group v-model="question.choosed" v-if="question.type ===1">
          <p v-for="option in question.options" :key="option.option_id">
            <el-radio class="option" :label="option.option_id">{{option.option}}</el-radio>
          </p>
        </el-radio-group>
        <el-checkbox-group v-model="question.checked" v-if="question.type===2">
          <el-checkbox
            v-for="{option, option_id} in question.options"
            :key="option_id"
            :label="option"
          ></el-checkbox>
        </el-checkbox-group>
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="question.advice"
          v-if="question.type === 3"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      titleEditing: false,
      questionnaire: {
        title: "new questionnaire",
        questions: [
          {
            question_id: 1,
            question: "您觉得老师上课认真吗",
            type: 1,
            options: [
              { option: "良好", option_id: 1 },
              { option: "bad", option_id: 2 }
            ]
          },
          {
            question_id: 2,
            question: "老师上课溜出去吗",
            type: 2,
            checked: [],
            options: [
              { option: "有", option_id: 1 },
              { option: "没有", option_id: 2 }
            ]
          },
          {
            question_id: 3,
            question: "您的意见",
            advice: "",
            type: 3,
            options: []
          }
        ]
      }
    };
  },
  methods: {
    editTitle() {
      this.titleEditing = true;
    },
    submitTitle() {
      this.titleEditing = false;
    },
    onblur() {
      this.titleEditing = false;
    }
  }
};
</script>

<style scopped>
.title {
  width: 100%;
  text-align: center;
  padding-top: 1em;
  padding-bottom: 1em;
}

.question {
  width: 100%;
  padding-bottom: 2em;
}

.option {
  margin-top: 1em;
}
</style>
