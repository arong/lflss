<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="filter_sex" placeholder="筛选性别" class="handle-select mr10">
                    <el-option key="0" label="全部" value=0></el-option>
                    <el-option key="1" label="男" value=1></el-option>
                    <el-option key="2" label="女" value=2></el-option>
                </el-select>
                <el-input v-model="filter_phone" placeholder="手机号" class="handle-input"></el-input>
                <el-input v-model="filter_grade" placeholder="年级" class="handle-select mr10"></el-input>
                <el-input v-model="filter_index" placeholder="班级" class="handle-select mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">重置</el-button>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" @click="handleCreate" class='new-button'>新建</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
                <el-table-column prop="sex" label="性别" width="120"> </el-table-column>
                <el-table-column prop="mobile" label="手机号" width="120"> </el-table-column>
                <el-table-column prop="subject" label="科目" width="120"> </el-table-column>
                <el-table-column prop="dat" label="出生年月" sortable width="150"> </el-table-column>
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
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total=this.tableData.length>
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model.trim="form.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-input v-model.trim="form.sex"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model.trim="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="科目" prop="subject">
                    <el-input v-model.trim="form.subject"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model.trim="form.address"></el-input>
                </el-form-item>
                <el-form-item label="出生年月">
                    <el-date-picker type="date" placeholder="选择日期" v-model.trim="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
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
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: "teacherlist",
  data() {
    return {
      url: "./static/vuetable.json",
      tableData: [
        {
          date: "2018-11-01",
          mobile: "12345678910",
          sex: 1,
          name: "鱼老师",
          subject: "地理",
          address: "兰州市"
        }
      ],
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
        sex: 0,
        mobile: "",
        address: "",
        date: ""
      },
      idx: -1,
      title: "",
      sexEnum: {
        "0": "未知",
        "1": "男",
        "2": "女"
      }
    };
  },
  created() {
    this.getData();
  },
  computed: {
    data() {
      return this.tableData.filter(d => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            is_del = true;
            break;
          }
        }
        if (!is_del) {
          if (
            d.address.indexOf(this.select_cate) > -1 &&
            (d.name.indexOf(this.select_word) > -1 ||
              d.address.indexOf(this.select_word) > -1)
          ) {
            return d;
          }
        }
      });
    }
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    getData() {
      this.url = "/api/v1/dean/teacher";
      this.$axios
        .get(this.url, {
          page: this.cur_page
        })
        .then(res => {
          this.tableData = res.data.list;
        });
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
      this.title = "新建";
      this.form = {
        name: "",
        sex: 0,
        mobile: "",
        date: "",
        address: "",
        opType: "create"
      };
      this.editVisible = true;
    },
    handleEdit(index, row) {
      this.title = "编辑";
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        name: item.name,
        sex: item.sex,
        mobile: item.mobile,
        date: item.date,
        address: item.address,
        subject: item.subject,
        opType: "edit"
      };
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
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
    // 保存编辑
    saveEdit(opType) {
      if (opType == "edit") {
        this.$set(this.tableData, this.idx, this.form);
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      } else if (opType == "create") {
        // check condition
        // todo: maybe add some alert
        if (!this.form.name) {
          this.$message.error("姓名不可为空");
          return;
        }
        if (this.form.sex != 1 && this.form.sex != 2) {
          this.$message.error("性别为必选项");
          return;
        }
        if (!this.form.mobile) {
          this.$message.error("手机为必填项");
          return;
        }
        if (!this.form.subject) {
          this.$message.error("科目为必填项");
          return;
        }
        this.tableData.push(this.form);
        this.$message.success(`添加成功`);
      }
      this.editVisible = false;
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
