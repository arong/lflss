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
                <el-button type="primary" @click="handleCreate" class='new-button'>新建</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="real_name" label="姓名" width="120"> </el-table-column>
                <el-table-column prop="gender_text" label="性别" width="120"> </el-table-column>
                <el-table-column prop="mobile" label="手机号" width="120"> </el-table-column>
                <el-table-column prop="subject_id" label="科目" width="120"> </el-table-column>
                <el-table-column prop="birthday" label="出生年月" sortable width="150"> </el-table-column>
                <el-table-column prop="age" label="年龄" sortable width="150"> </el-table-column>
                <el-table-column prop="address" label="地址" :formatter="formatter"> </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
                <el-form-item label="登录名" prop="login_name" v-show= "form.opType == 'create'">
                    <el-input v-model.trim="form.login_name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-show="form.opType=='create'">
                    <el-input type='password' v-model.trim="form.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="password_reconfig" v-show="form.opType=='create'">
                    <el-input type='password' v-model.trim="form.password_reconfig"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="real_name">
                    <el-input v-model.trim="form.real_name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                <el-select v-model="form.gender_text" placeholder="性别">
                    <el-option key="3" label="未知" value= "未知"></el-option>
                    <el-option key="1" label="男" value='男'></el-option>
                    <el-option key="2" label="女" value='女'></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model.trim="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="科目" prop="subject">
                    <el-input v-model.trim="form.subject_id"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model.trim="form.address"></el-input>
                </el-form-item>
                <el-form-item label="出生年月">
                    <el-date-picker type="date" placeholder="选择日期" v-model.trim="form.birthday" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit(form.opType)">确 定</el-button>
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
  name: "teacherlist",
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
      idx: -1,
      title: "",
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
    this.getData();
  },
  computed: {
    data() {
      return this.tableData.filter(d => {
        // get gender text
        d.gender_text = this.genderMap[d.gender];
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
      this.filter.gender = this.genderText2Enum[this.filter.gender_text];
      let res = await utils.simplePost("/teacher/filter", this.filter, true);
      if (res.code === 0) {
        this.tableData = res.data.list;
        this.total = res.data.total;
      } else {
        this.tableData = [];
      }
    },
    newTeacher() {
      return {
        login_name: "",
        real_name: "",
        gender: 0,
        mobile: "",
        birthday: "",
        address: ""
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
    handleCreate() {
      this.title = "新建";
      this.form = this.newForm("create");
      this.editVisible = true;
    },
    async handleEdit(index, row) {
      this.title = "编辑";
      this.form["opType"] = "edit";
      this.editVisible = true;
      let res = await utils.simpleGet(
        "/teacher/" + this.tableData[index].teacher_id,
        {},
        true
      );
      if (res.code == 0) {
        this.form = res.data;
        this.form.gender_text = this.genderMap[this.form.gender]
      } else {
        this.$message.error(res.msg);
        return;
      }
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checkFormData(data) {
      // check condition
      // todo: maybe add some alert
      if (data.opType == "create") {
        if (!data.login_name) {
          this.$message.error("登录名不可为空");
          return false;
        }
        if (!data.password) {
          this.$message.error("请输入密码");
          return false;
        }
        if (!data.password_reconfig) {
          this.$message.error("请确认密码");
          return false;
        }
        if (data.password != data.password_reconfig) {
          this.$message.error("两次输入的密码不一致");
          return false;
        }
      }
      if (!data.real_name) {
        this.$message.error("姓名不可为空");
        return false;
      }
      if (data.gender != 1 && this.form.gender != 2) {
        this.$message.error("性别为必选项");
        return false;
      }
      data.gender = Number(data.gender);
      if (!data.mobile) {
        this.$message.error("手机为必填项");
        return false;
      }
      if (data.subject_id == 0) {
        this.$message.error("科目为必填项");
        return false;
      }
      data.subject_id = Number(data.subject_id);
      return true;
    },
    // 保存编辑
    async saveEdit(opType) {
      this.form.gender = this.genderText2Enum[this.form.gender_text];
      let isValid = this.checkFormData(this.form);
      if (!isValid) {
        return;
      }
      if (opType == "edit") {
        let res = await utils.simplePut(
          "/teacher/" + this.form.teacher_id,
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
        let res = await utils.simplePost("/teacher", this.form, true);
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
