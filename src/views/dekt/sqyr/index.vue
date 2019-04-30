<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" :placeholder="currentRole() ? '检索：寝室号' : '检索：学生姓名、学号'" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(163)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
        <ImportData v-if="authCheck(167)" :model="$route.name" />
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(166)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column :type="currentRole() ? 'index' : 'selection'" align="center" width="45" fixed="left" />
        <el-table-column min-width="110" prop="ym" label="年月" sortable="custom" fixed="left" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="name" label="学生姓名" show-overflow-tooltip sortable="custom" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="sex" label="性别" sortable="custom">
          <template slot-scope="d">
            {{ d.row.sex ? d.row.sex==1 ? '男' : '女' : '--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="!currentRole()" min-width="110" prop="szbj" label="所在班级" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="120" prop="szqsl" label="所在寝室楼" show-overflow-tooltip />
        <el-table-column min-width="110" prop="qsh" label="寝室号" />
        <el-table-column min-width="180" prop="ypf" label="月寝室卫生检查评分" sortable="custom" />
        <el-table-column min-width="200" prop="mfqs_time" label="评选为模范寝室的时间">
          <template slot-scope="d">
            {{ d.row.mfqs_time || '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="130" prop="wzyd" label="违章用电时间" show-overflow-tooltip>
          <template slot-scope="d">
            {{ d.row.wzyd || '--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="authCheck(165)||authCheck(166)" align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(165)" type="primary" size="mini" plain icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
            <el-button v-if="authCheck(166)" type="danger" size="mini" plain icon="el-icon-delete" @click="deleteData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :sqyr-id="sqyrId" @CB-sqyr="CB_sqyr" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import NewEdit from "./newEdit";
import { publicMixin } from "@/api/mixins";
import { sqyrList, sqyrDel } from "@/api/dekt/sqyr";

export default {
  name: "sqyr",
  components: { NewEdit },
  directives: { waves },
  mixins: [publicMixin],
  data() {
    return {
      //table 参数
      listLoading: false,
      total: 0,
      dataList: [],
      // 检索参数
      listQuery: {
        listRows: this.$store.state.pageSize,
        page: 1,
        keys: "",
        _sort: "desc",
        _order: "id"
      },
      multipleSelection: [],
      //新增、编辑Dialog
      dialogState: false,
      sqyrId: null
    };
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight;
    }
  },
  activated() {
    this.listQuery.listRows = this.$store.state.pageSize;
    if (this.$route.query.account) {
      this.listQuery.keys = this.$route.query.account;
    }
    this.getData();
  },
  methods: {
    //根据条件检索
    handleFilter() {
      this.listQuery.page = 1;
      this.getData();
    },
    //排序
    handleSort(val) {
      this.listQuery._sort = val.order === "ascending" ? "asc" : "desc"
      this.listQuery._order = val.prop ? val.prop : "id"
      this.getData();
    },
    //详情
    detail(id) {
      this.$router.push({
        name: 'sqyrDetail',
        query: { id: id }
      })
    },
    //添加
    add() {
      this.dialogState = true;
    },
    //编辑
    edit(id) {
      this.dialogState = true;
      this.sqyrId = id;
    },
    CB_sqyr(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.sqyrId = null;
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    batchDel() {
      if (this.multipleSelection.length === 0) {
        return this.$message({
          type: "warning",
          message: "请选择需要删除的内容"
        });
      }
      this.deleteData(
        this.multipleSelection.map(item => {
          return item.id;
        })
      );
    },
    //删除
    deleteData(id) {
      this.$confirm("删除后不可恢复，确定要删除吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          sqyrDel({ id: id })
            .then(rs => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getData();
            })
            .catch(() => {
              this.listLoading = false;
            });
        })
        .catch(() => { });
    },
    //获取数据
    getData() {
      this.listLoading = true;
      sqyrList(this.listQuery)
        .then(rs => {
          this.listLoading = false;
          this.dataList = rs.data;
          this.total = rs.count;
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  }
};
</script>

