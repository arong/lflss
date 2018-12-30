<template>
  <div class="questionnaire">
    <div class="title">
      <el-input type="text" v-model.trim="questionnaire.title"></el-input>
    </div>
    <div>
      <div class="question" v-for="question in questionnaire.questions" :key="question.question_id">
        <el-row>
          <el-col :span="12">
            <div class="grid-content ">
              <el-input type="text" v-model="question.question"></el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-select class="select" v-model="question.type" placeholder="题目类型">
                <el-option
                  v-for="s in question_types"
                  :key="s.key"
                  :label="s.label"
                  :value="s.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
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
      question_types: [
        { key: "单选", label: "单选", value: 1 },
        { key: "复选", label: "多选", value: 2 },
        { key: "文本", label: "文本框", value: 3 }
      ],
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
          },
          {}
        ]
      }
    };
  },
  methods: {}
};
</script>

<style scopped>
.questionnaire {
  width: 80%;
  margin: 0 auto;
  border: black;
}

.title {
  width: 50%;
  text-align: center;
  padding-top: 1em;
  padding-bottom: 1em;
}

.question {
  width: 100%;
  padding-bottom: 2em;
}

.select {
  width: 100%;
}

.option {
  margin-top: 1em;
}

.el-row {
  margin-bottom: 20px;
  /* &:last-child {
    margin-bottom: 0;
  } */
}
.el-col {
  border-radius: 4px;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
