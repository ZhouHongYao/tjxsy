<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 220px;" class="filter-item" placeholder="检索：学年名称" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(254)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add()">添加</el-button>
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(257)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="45" fixed="left" />
        <el-table-column min-width="160" prop="title" label="学年名称" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="140" prop="is_mr" label="是否默认年份" sortable="custom">
          <template slot-scope="d">
            <span :class="d.row.is_mr && d.row.is_mr == 2 ? 'text-success':'text-muted' ">
              {{ d.row.is_mr ? d.row.is_mr == 2 ? '是' : "否" : '--' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column min-width="260" prop="times" label="进行阶段" show-overflow-tooltip/>
        <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(256)" type="primary" size="mini" plain icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
            <el-button v-if="authCheck(257)" type="danger" size="mini" plain icon="el-icon-delete" @click="deleteData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :yid="yid" @CB-years="CB_years" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import NewEdit from "./newEdit";
import { yearsList, yearsDel } from "@/api/years";

export default {
  name: "year",
  directives: { waves },
  components: { NewEdit },
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
      yid: null
    };
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight;
    }
  },
  activated() {
    this.listQuery.listRows = this.$store.state.pageSize;
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
    //添加
    add() {
      this.dialogState = true;
    },
    //编辑
    edit(id, type) {
      this.dialogState = true;
      this.yid = id;
    },
    // dialog 回调
    CB_years(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.yid = null;
    },
    //课程列表
    list(id) {
      this.$router.push({
        name: 'ltjzlist',
        query: { id: id }
      })
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
          yearsDel({ id: id })
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
      yearsList(this.listQuery)
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
