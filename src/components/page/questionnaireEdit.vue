<template>
  <div class="questionnaire">
    <div class="title">
      <el-input type="text" v-model.trim="questionnaire.title"></el-input>
    </div>
    <div>
      <div class="question" v-for="(item, index) in questionnaire.questions" :key="item.question_id">
        <el-row>
          <el-col :span="8">
            <div class="grid-content">
              <template v-if="item.is_edit">
                <el-input type="text" v-model="item.question"></el-input>
              </template>
              <template v-else>
                <div v-text="item.question"></div>
              </template>
            </div>
          </el-col>
          <el-col :span="12" :offset="4">
            <el-row type="flex" align="middle" :style="{marginBottom: 0}">
              <el-col :span="10">
                <div>
                  <el-select class="select" v-model="item.type" placeholder="题目类型" :disabled="!item.is_edit">
                    <el-option
                      v-for="s in question_types"
                      :key="s.key"
                      :label="s.label"
                      :value="s.value"
                    ></el-option>
                  </el-select>
                </div>
              </el-col>

              <el-col :span="10" :offset="4">
                <div>
                  <el-checkbox v-model="item.is_required" :disabled="!item.is_edit">此题是否必填</el-checkbox>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <!-- 单选 -->
            <template v-if="item.type === 1">
              <template v-if="item.is_edit">
                <el-radio-group>
                  <div v-for="(option, i) in item.options" :key="i">
                    <el-radio class="option" :label="i">
                      <el-input type="text" v-model="option.option"></el-input>
                      <i class="el-icon-lx-roundadd"></i>
                      <i class="el-icon-lx-roundclose"></i>
                    </el-radio>
                  </div>
                </el-radio-group>
              </template>
              <template v-else>
                 <el-radio-group>
                  <div v-for="(option, i) in item.options" :key="i">
                    <el-radio class="option" :label="i">{{option.option}}</el-radio>
                  </div>
                </el-radio-group>
              </template>
            </template>

            <!-- 复选 -->
            <template v-if="item.type === 2">
              <template v-if="item.is_edit">
                <el-checkbox-group>
                  <div v-for="(option, i) in item.options" :key="i">
                    <el-checkbox :label="i" class="option">
                      <el-input type="text" v-model="option.option"></el-input>
                      <i class="el-icon-lx-roundadd"></i>
                      <i class="el-icon-lx-roundclose"></i>
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </template>
              <template v-else>
                <el-checkbox-group>
                  <div v-for="(option, i) in item.options" :key="i">
                    <el-checkbox :label="i" class="option">{{option.option}}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </template>
            </template>

            <!-- 文本框 -->
            <template v-if="item.type === 3">
              <el-input type="textarea" :rows="3" placeholder="请输入内容" readonly resize="none"></el-input>
            </template>

          </el-col>
          <el-col :span="5" :offset="1">
            <div>
              <el-button type="text" v-if="index !== 0" @click="handleMoveUp">上移</el-button>
              <el-button type="text" v-if="index !== (questionnaire.questions || []).length - 1" @click="handleMoveDown">下移</el-button>
              <el-button type="text" @click="handleCopyItem(item, index)">复用</el-button>
              <el-button type="text" @click="handleDeleteItem(index)">删除</el-button>
            </div>

            <div>
              <template v-if="item.is_edit">
                <el-button type="text" :style="{color: '#999'}" @click="handleCancelEdit(index)">取消编辑</el-button>
                <el-button type="text" @click="handleSaveEdit(index)">保存编辑</el-button>
              </template>
              <template v-else>
                <el-button type="text" @click="handleStartEdit(index)">编辑</el-button>
              </template>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          :style="{width: '100%'}"
          @click="handleAddQuestion"
        >添加问题</el-button>
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
      questionnaire: {}
    };
  },
  created() {
    this.getQuestionData();
  },
  methods: {
    handleCancelEdit(i) {
      this.questionnaire.questions = (this.questionnaire.questions || []).map((item, index) => {
        return {
          ...item,
          question: item.initialItem.question,
          type: item.initialItem.type,
          is_required: item.initialItem.is_required,
          options: (item.initialItem.options || []).map(cur => ({...cur})),
          is_edit: index === i ? false : item.is_edit
        }
      });
    },
    handleSaveEdit(i) {
      this.questionnaire.questions = (this.questionnaire.questions || []).map((item, index) => {
        return {
          ...item,
          is_edit: index === i ? false : item.is_edit,
          initialItem: {
            question: item.question,
            type: item.type,
            is_required: item.is_required,
            options: (item.options || []).map(cur => ({...cur}))
          }
        }
      });
    },
    handleStartEdit(i) {
      this.questionnaire.questions = (this.questionnaire.questions || []).map((item, index) => {
        return {
          ...item,
          is_edit: index === i ? true : item.is_edit
        }
      });
    },
    handleMoveUp() {

    },
    handleMoveDown() {
    },
    handleCopyItem(item, i) {
      console.log(item);
      console.log(i);

    },
    handleDeleteItem(i) {
      this.questionnaire.questions = (this.questionnaire.questions || []).filter((item, index) => index !== i);
    },
    handleAddQuestion() {
      (this.questionnaire.questions || []).push({
        question: `问题${(this.questionnaire.questions || []).length + 1}`,
        type: 1,
        is_required: false,
        is_edit: true,
        options: Array.apply(null, new Array(3)).map((item, i) => {
          return {
            option: `选项${i+1}`
          }
        }),
        initialItem: {
          question: `问题${(this.questionnaire.questions || []).length + 1}`,
          type: 1,
          is_required: false,
          options: Array.apply(null, new Array(3)).map((item, i) => {
            return {
              option: `选项${i+1}`
            }
          })
        }
      });
    },
    getQuestionData() {
      setTimeout(() => {
        this.questionnaire = {
          title: "new questionnaire",
          questions: [
            {
              question_id: 1,
              question: "您觉得老师上课认真吗",
              type: 1,
              is_required: false,
              is_edit: false,
              options: [
                { option: "良好", option_id: 1 },
                { option: "bad", option_id: 2 }
              ],
              initialItem: {
                question_id: 1,
                question: "您觉得老师上课认真吗",
                type: 1,
                is_required: false,
                options: [
                  { option: "良好", option_id: 1 },
                  { option: "bad", option_id: 2 }
                ]
              }
            },
            {
              question_id: 2,
              question: "老师上课溜出去吗",
              type: 2,
              is_required: false,
              is_edit: false,
              options: [
                { option: "有", option_id: 1 },
                { option: "没有", option_id: 2 }
              ],
              initialItem: {
                question_id: 2,
                question: "老师上课溜出去吗",
                type: 2,
                is_required: false,
                options: [
                  { option: "有", option_id: 1 },
                  { option: "没有", option_id: 2 }
                ]
              }
            },
            {
              question_id: 3,
              question: "您的意见",
              type: 3,
              is_required: false,
              is_edit: false,
              options: [
                { option: "选项一" },
                { option: "选项二" }
              ],
              initialItem: {
                question_id: 3,
                question: "您的意见",
                type: 3,
                is_required: false,
                options: [
                  { option: "选项一" },
                  { option: "选项二" }
                ],
              }
            }
          ]
        };
      }, 1000);
    }
  }
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
  padding: 15px;
}

.question:hover {
  background: #fcf0e5;
}

.question + .question {
  margin-top: 15px;
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
  /* min-height: 36px; */
}
</style>
