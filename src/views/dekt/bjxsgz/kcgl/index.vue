<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 280px;" class="filter-item" placeholder="检索：课程名称、课程编号" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(75)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(78)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="45" fixed="left" />
        <el-table-column min-width="110" prop="kcbh" label="课程编号" sortable="custom" />
        <el-table-column min-width="160" prop="title" label="课程名称" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="140" prop="type" label="所属课程类型" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="xf" label="学分" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="140" prop="zysc" label="作业上传方式" show-overflow-tooltip sortable="custom">
          <template slot-scope="d">
            {{ d.row.zysc ? d.row.zysc == 2 ? '组长' : '个人' : '--' }}
          </template>
        </el-table-column>
        <el-table-column min-width="140" prop="beizhu" label="备注" show-overflow-tooltip />
        <el-table-column align="right" label="操作" width="180" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(303)" type="info" size="mini" plain icon="el-icon-document" @click="kclist(scope.row.id)">排课信息</el-button>
            <el-dropdown v-if="authCheck(77) || authCheck(78)" class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(77)" :command="{type:'edit',ID:scope.row.id}">
                  <span class="text-primary">编辑</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(78)" :command="{type:'delete',ID:scope.row.id}">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :kc-id="kcId" @CB-kc="CB_kc" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import NewEdit from "./newEdit";
import { kcglList, kcglDel } from "@/api/dekt/bjxsgz/kcgl";

export default {
  name: "kcgl",
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
      kcId: null
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
    //更多
    handleCommand(row) {
      switch (row.type) {
        case "edit":
          this.dialogState = true;
          this.kcId = row.ID;
          break;
        case "delete":
          this.deleteData(row.ID);
          break;
      }
    },
    // dialog 回调
    CB_kc(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.kcId = null;
    },
    //课程列表
    kclist(id) {
      this.$router.push({
        name: 'kclist',
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
          kcglDel({ id: id })
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
      kcglList(this.listQuery)
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

