<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 科目列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delList">批量删除</el-button>
        <el-button type="primary" @click="createClass" class="new-button">新建</el-button>
      </div>
      <el-table
        :data="data"
        border
        stripe
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="科目" width="120"></el-table-column>
        <el-table-column prop="key" label="key" width="120"></el-table-column>
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
        <el-form-item v-show='form.opType=="create"' label="科目*">
          <el-input v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item label="key*">
          <el-input v-model.trim="form.key"></el-input>
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
  name: "subjectList",
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
      title: ""
    };
  },
  created() {
    this.getData();
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
      let res = await utils.simpleGet("/dean/subject/list", this.filter, true);
      if (res.code === 0) {
        this.tableData = res.data;
        this.total = this.tableData.length;
      } else {
        this.tableData = [];
      }
    },
    newForm(type) {
      return { name: "", key: "", opType: type };
    },
    createClass() {
      this.title = "新建";
      this.form = this.newForm("create");
      this.editVisible = true;
    },
    async handleEdit(index) {
      this.title = "编辑";
      this.editVisible = true;
      this.form = this.tableData[index]
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
        if (!data.name) {
          this.$message.error("科目名称为必填");
          return false;
        }
      }
      if (!data.key) {
        this.$message.error("key 为必填项");
        return false;
      }
      return true;
    },
    // 保存编辑
    async saveClass(opType) {
      let isValid = this.checkFormData(this.form);
      if (!isValid) {
        return;
      }
      if (opType == "edit") {
        let res = await utils.simplePost("/dean/subject/update", this.form, true);
        if (res.code == 0) {
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.msg);
          return;
        }
      } else if (opType == "create") {
        let res = await utils.simplePost("/dean/subject/add", this.form, true);
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
      let id = this.tableData[this.idx].id;
      let res = await utils.simplePost(
        "/dean/subject/delete",
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
      let res = await utils.simplePost(
        "/dean/subject/delete",
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
