<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i>学生列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-input v-model="filter.grade" placeholder="年级" class="handle-select mr10"></el-input>
        <el-input v-model="filter.index" placeholder="班级" class="handle-select mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" @click="handleCreate" class="new-button">新建</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="real_name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="gender" label="性别" width="120"></el-table-column>
        <el-table-column prop="class" label="班级" width="120"></el-table-column>
        <el-table-column prop="address" label="家庭地址" :formatter="formatter"></el-table-column>
        <el-table-column prop="date" label="日期" sortable width="150"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
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
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model.trim="form.real_name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model.trim="form.gender" placeholder="请选择" class="handle-select mr10">
            <el-option key="1" label="男" value="1"></el-option>
            <el-option key="2" label="女" value="2"></el-option>
            <el-option key="3" label="未知" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="subject">
          <el-select v-model="form.class_id" placeholder="选择班级">
            <el-option
              v-for="item in class_list"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model.trim="form.address"></el-input>
        </el-form-item>
        <el-form-item label="入学日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.birthday"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import utils from "@/utils/index.js";
export default {
  name: "basetable",
  data() {
    return {
      url: "./static/vuetable.json",
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      form: {
        name: "",
        date: "",
        address: ""
      },
      idx: -1,
      filter: { grade: 1, index: 1 },
      total: 0,
      class_list: []
    };
  },
  created() {
    Promise.all([this.getClass(), this.getData()]);
  },
  computed: {
    data() {}
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    async getClass() {
      let res = await utils.simpleGet("/dean/class/list", {}, true);
      if (res.code === 0) {
        this.class_list = res.data;
        this.class_map = this.class_list.reduce(function(map, obj) {
          map[obj.id] = obj.name;
          return map;
        }, {});
        // console.log(this.class_map)
      } else {
        this.class_list = [];
      }
      console.log(this.class_list);
    },
    async getData() {
      let res = await utils.simplePost(
        "/dean/student/list",
        { page: this.cur_page, size: 10, ...this.filter },
        true
      );
      if (res.code === 0) {
        if (typeof res.data.list != "undefined" || res.data.list.length > 0) {
          var list = res.data.list;
          for (var i = 0; i < list.length; i++) {
            var curr = list[i];
            if (curr.class_id != 0) {
              curr.class = this.class_map[curr.class_id];
            }
          }
        }
        this.tableData = res.data.list;
        this.total = res.data.total;
      } else {
        this.data = [];
        this.$message.error(res.msg);
      }
    },
    search() {
      this.is_search = true;
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    handleCreate() {
      this.form = {};
      this.form["opType"] = "create";
      this.editVisible = true;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        name: item.name,
        sex: item.sex,
        grade: item.grade,
        index: item.index,
        date: item.date,
        address: item.address
      };
      this.editVisible = true;
    },
    async handleDelete(index, row) {
      var id = this.tableData[index].student_id;
      let res = await utils.simplePost("/dean/student/delete", { id: id }, true);
      if (res.code === 0) {
        this.$message.success("删除成功");
      } else {
        this.$message.error("删除失败");
      }
    },
    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checkData(form) {
      if (!form.real_name) {
        this.$message.error("名字为必填项");
        return false;
      }

      if (!form.class_id) {
        this.$message.error("班级为必选项");
        return false;
      }
      form.class_id = Number(form.class_id);

      if (form.gender == 0) {
        this.$message.error("性别为必选项");
        return false;
      }
      form.gender = Number(form.gender);
      return true;
    },
    // 保存编辑
    async saveEdit() {
      if (this.form.opType == "create") {
        if (!this.checkData(this.form)) {
          return;
        }
        let res = await utils.simplePost("/dean/student/add", this.form, true);
        if (res.code === 0) {
          this.$message.success("添加成功");
        } else {
          this.$message.error(res.msg);
          return;
        }
      } else if (this.form.opType == "edit") {
        let res = await utils.simplePost("/dean/student/update", this.form, true);
        if (res.code === 0) {
        } else {
          this.$message.error(res.msg);
          return;
        }
      }
      this.editVisible = false;
      this.getData();
    },
    // 确定删除
    deleteRow() {
      this.tableData.splice(this.idx, 1);
      this.$message.success("删除成功");
      this.delVisible = false;
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
