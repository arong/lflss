<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 班级列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delList">批量删除</el-button>
        <el-input v-model="filter.grade" placeholder="年级" class="handle-select mr10"></el-input>
        <el-input v-model="filter.term" placeholder="届别" class="handle-select mr10"></el-input>
        <el-button type="primary" icon="search" @click="resetSearch">重置</el-button>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" @click="createClass" class="new-button">新建</el-button>
      </div>
      <!-- <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange"></el-table> -->
      <el-table border stripe :data="tableData">
        <el-table-column prop="name" label="班级"></el-table-column>
        <el-table-column prop="year" label="开学年份"></el-table-column>
        <el-table-column prop="grade" label="年级"></el-table-column>
        <el-table-column prop="index" label="班级"></el-table-column>
        <el-table-column prop="master" label="班主任"></el-table-column>
        <el-table-column v-for="{ key, name } in subject_list" :key="key" :prop="key" :label="name"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index)">编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="this.total"
        ></el-pagination>
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
        <el-form-item label="开学年份">
          <el-input v-model.trim="form.year"></el-input>
        </el-form-item>
        <el-form-item label="学期">
          <el-input v-model.trim="form.term"></el-input>
        </el-form-item>
        <el-form-item label="班主任" prop="subject">
          <el-select v-model="form.master_id" placeholder="选择老师">
            <el-option
              v-for="item in teacher_list"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任课老师" prop="testData">
          <div>
            <template v-for="(item, i) in form.teacher_list">
              <div :key="i">
                <el-select v-model="item.sid" placeholder="科目">
                  <el-option v-for="s in subject_list" :key="s.key" :label="s.name" :value="s.id"></el-option>
                </el-select>
                <el-select v-model="item.tid" placeholder="老师">
                  <el-option v-for="t in teacher_list" :key="t.name" :label="t.name" :value="t.id"></el-option>
                </el-select>
                <el-button @click="pushBack">添加</el-button>
                <el-button @click="popUp(i)">删除</el-button>
              </div>
            </template>
          </div>
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
      form: {grade:0,
      index:0,
      year:0,
      term:0,
      master_id:0,
       teacher_list: [{ sid: 0, tid: 0 }] },
      filter: {},
      teacher_list: {},
      idx: -1,
      title: "",
      subject_map: {},
      subject_list: []
    };
  },
  created() {
    Promise.all([this.getSubject(), this.getTeacher(), this.getData()]);
  },
  computed: {
    data() {
      // return this.tableData.filter(d => {
      //   return d;
      // });
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
      let res = await utils.simpleGet("/dean/class/filter", this.filter, true);
      if (res.code === 0) {
        if (typeof(res.data.list) === undefined || res.data.list.length == 0) {
          console.log("error found");
          return;
        }
        let list = res.data.list;
        for (var i = 0; i < list.length; i++) {
          var curr = list[i];
          if (curr.master_id != 0) {
            curr.master = this.teacher_map[curr.master_id];
          }
          if (
            typeof curr.teacher_list == "undefined" ||
            curr.teacher_list.length == 0
          ) {
            continue;
          }
          for (var j = 0; j < curr.teacher_list.length; j++) {
            var tmp = curr.teacher_list[j];
            var s = this.subject_map[tmp.sid];
            if (!s) {
              console.log("invalid data found", tmp)
              continue;
            }
            var tname = this.teacher_map[tmp.tid]
            if (!tname) {
              continue;
            }
            // console.log("key", s.key);
            // console.log("tname", tname);
            curr[s.key] = tname;
          }
        }
        this.tableData = res.data.list;
        this.total = res.data.total;
      } else {
        this.tableData = [];
      }
    },
    async getTeacher() {
      let res = await utils.simpleGet("/dean/teacher/list", {}, true);
      if (res.code === 0) {
        this.teacher_list = res.data.list;
        this.teacher_map = this.teacher_list.reduce(function(map, obj) {
          map[obj.id] = obj.name;
          return map;
        }, {});
        // console.log(this.teacher_map);
      } else {
        this.subjectMap = {};
      }
    },
    async getSubject() {
      let res = await utils.simpleGet("/dean/subject/list", {}, true);
      if (res.code === 0) {
        this.subject_list = res.data;
        this.subject_map = this.subject_list.reduce(function(map, obj) {
          map[obj.id] = obj;
          return map;
        }, {});
        // console.log(this.subject_map);
      } else {
        this.subject_list = [];
        this.subject_map = {};
      }
    },
    async getClass(id) {
      let res = await utils.simpleGet("/dean/class/info", { id: id }, true);
      if (res.code === 0) {
        console.log(this.form);
        return res.data;
      } else {
        return {};
      }
    },
    newTeacher() {
      return {
        grade: 0,
        index: 0,
        teacher_list: [{}]
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
      let res = await utils.simpleGet(
        "/dean/class/info",
        { id: this.tableData[index].id },
        true
      );
      if (res.code === 0) {
        if (
          typeof res.data.teacher_list == "undefined" ||
          res.data.teacher_list.length == 0
        ) {
          res.data.teacher_list = [{}];
        }
        this.form = res.data;
      } else {
        //
        this.$message.error(res.msg)
      }
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

      if (data.year == 0) {
        this.$message.error("开学年份为必填项");
        return false;
      }
      data.year = Number(data.year);

      if (data.term == 0) {
        this.$message.error("学期为必填");
        return false;
      }
      data.term = Number(data.term);
      return true;
    },
    // 保存编辑
    async saveClass(opType) {
      let isValid = this.checkFormData(this.form);
      if (!isValid) {
        return;
      }
      if (opType == "edit") {
        let res = await utils.simplePost("/dean/class/update", this.form, true);
        if (res.code == 0) {
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.msg);
          return;
        }
      } else if (opType == "create") {
        let res = await utils.simplePost("/dean/class/add", this.form, true);
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
        "/dean/class/delete",
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
        ids.push(this.multipleSelection[i].id);
      }
      if (ids.length == 0) {
        return;
      }
      let res = await utils.simplePost("/dean/class/delete", { id_list: ids }, true);
      if (res.code === 0) {
        this.$message.success("删除成功");
      } else {
        this.$message.error(res.msg);
        return;
      }
      this.getData();
    },
    pushBack() {
      this.form.teacher_list.push({});
    },
    popUp(index) {
      // this.form.teacher_list.pop()
      this.form.teacher_list.splice(index, 1);
      if (this.form.teacher_list.length == 0) {
        this.form.teacher_list.push({});
      }
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
