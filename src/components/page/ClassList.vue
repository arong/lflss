<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delList">批量删除</el-button>
                <el-select v-model.trim = "filter.gender_text" placeholder="筛选性别" class="handle-select mr10">
                    <el-option key="0" label="全部" value="全部"></el-option>
                    <el-option key="1" label="男" value='男'></el-option>
                    <el-option key="2" label="女" value='女'></el-option>
                </el-select>
                <el-input v-model="filter.grade" placeholder="年级" class="handle-select mr10"></el-input>
                <el-input v-model="filter.index" placeholder="班级" class="handle-select mr10"></el-input>
                <el-input v-model="filter.name" placeholder="姓名" class="handle-select mr10"></el-input>
                <el-input v-model="filter.mobile" placeholder="手机号" class="handle-input"></el-input>
                <el-button type="primary" icon="search" @click="resetSearch">重置</el-button>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" @click="createClass" class='new-button'>新建</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="30" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" width="100"> </el-table-column>
                <el-table-column prop="grade" label="年级" width="50"> </el-table-column>
                <el-table-column prop="index" label="班级" width="50"> </el-table-column>
                <el-table-column prop="teacher" label="班主任" width="90"> </el-table-column>
                <el-table-column prop="chinese" label="语文" width="100"> </el-table-column>
                <el-table-column prop="math" label="数学" width="100"> </el-table-column>
                <el-table-column prop="english" label="英语" width="100"> </el-table-column>
                <el-table-column prop="history" label="历史" width="100"> </el-table-column>
                <el-table-column prop="geography" label="地理" width="100"> </el-table-column>
                <el-table-column prop="physical" label="物理" width="100"> </el-table-column>
                <el-table-column prop="biology" label="生物" width="100"> </el-table-column>
                <el-table-column prop="chemistry" label="化学" width="100"> </el-table-column>
                <el-table-column prop="history" label="历史" width="100"> </el-table-column>
                <el-table-column prop="political" label="政治" width="100"> </el-table-column>
                <el-table-column prop="date" label="入学日期" sortable width="120"> </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total=this.total>
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="年级">
                    <el-input v-model.trim="form.grade"></el-input>
                </el-form-item>
                <el-form-item label="班级">
                    <el-input v-model.trim="form.index"></el-input>
                </el-form-item>
                <el-form-item label="班主任" prop="subject">
                  <el-select v-model="form.master_id" placeholder="选择课程">
                    <el-option
                      v-for="item in teacher_list"
                      :key="item.name"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveClass(form.opType)">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import utils from "@/utils/index.js";
export default {
  name: "classlist",
  data() {
    return {
      url: "./static/vuetable.json",
      tableData: [],
      total: 0,
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      form: {},
      filter: {},
      teacher_list: {},
      idx: -1,
      title: "",
      subjectMap: {},
      subjectReverseMap: {},
      genderMap: {
        "0": "未知",
        "1": "男",
        "2": "女"
      },
      genderText2Enum: {
        男: 1,
        女: 2,
        未知: 3
      }
    };
  },
  created() {
    this.getTeacher().then(() => {
      console.log(this.subjectMap);
      this.getData();
    });
  },
  computed: {
    data() {
      return this.tableData.filter(d => {
        return d;
      });
    }
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    async getData() {
      this.filter["page"] = this.cur_page;
      this.filter["size"] = 10;
      let res = await utils.simpleGet("/class", this.filter, true);
      if (res.code === 0) {
        this.tableData = res.data.list;
        this.total = res.data.total;
      } else {
        this.tableData = [];
      }
    },
    async getTeacher() {
      let res = await utils.simpleGet("/teacher/", {}, true);
      if (res.code === 0) {
        this.teacher_list = res.data.list
      } else {
        this.subjectMap = {};
      }
    },
    newTeacher() {
      return {
        grade: 0,
        index: 0,
        name: ""
      };
    },
    newForm(type) {
      let data = this.newTeacher();
      data["opType"] = type;
      return data;
    },
    resetSearch() {
      this.filter = {};
    },
    search() {
      this.cur_page = 1;
      this.getData();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    createClass() {
      this.title = "新建";
      this.form = this.newForm("create");
      this.editVisible = true;
    },
    async handleEdit(index) {
      this.title = "编辑";
      this.editVisible = true;
      // let res = await utils.simpleGet("/teacher/", {}, true);
      // if (res.code == 0) {
      //   this.teacher_list = res.data.list
      // } else {
      //   this.$message.error(res.msg);
      //   return;
      // }
      this.form["opType"] = "edit";
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checkFormData(data) {
      if (data.opType == "create") {
      }
      if (data.grade == 0) {
        this.$message.error("年级为必填");
        return false;
      }
      data.grade = Number(data.grade);

      if (data.index == 0) {
        this.$message.error("班级编号为必填");
        return false;
      }
      data.index = Number(data.index);
      return true;
    },
    // 保存编辑
    async saveClass(opType) {
      let isValid = this.checkFormData(this.form);
      if (!isValid) {
        return;
      }
      if (opType == "edit") {
        let res = await utils.simplePut(
          "/class/" + this.form.teacher_id,
          this.form,
          true
        );
        if (res.code == 0) {
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.msg);
          return;
        }
      } else if (opType == "create") {
        let res = await utils.simplePost("/class", this.form, true);
        if (res.code === 0) {
          this.$message.success("添加成功");
        } else {
          this.$message.error(res.msg);
          return;
        }
      }
      this.editVisible = false;
      this.getData();
    },
    async deleteRow() {
      let id = this.tableData[this.idx].teacher_id;
      let res = await utils.simplePost(
        "/teacher/delete",
        { id_list: [id] },
        true
      );
      if (res.code === 0) {
        this.$message.success("删除成功");
      } else {
        this.$message.error(res.msg);
        return;
      }
      this.delVisible = false;
      this.getData();
    },
    async delList() {
      let ids = [];
      for (var i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].teacher_id);
      }
      if (ids.length == 0) {
        return;
      }
      let res = await utils.simplePost(
        "/teacher/delete",
        { id_list: ids },
        true
      );
      if (res.code === 0) {
        this.$message.success("删除成功");
      } else {
        this.$message.error(res.msg);
        return;
      }
      this.getData();
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
</style>
