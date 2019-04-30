<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :style="currentRole() ? ' width:  200px' : ' width: 280px'" :clearable="true" v-model="listQuery.keys" :placeholder=" currentRole() ? '检索：活动名称' : '检索：活动名称、学生姓名、学号'" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(95)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
        <Download v-if="authCheck(301)" v-model="listQuery" :model="$route.name"/>
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(98)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="45" fixed="left" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="name" label="学生姓名" sortable="custom" fixed="left" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="account" label="学号" sortable="custom" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="phone" label="联系电话" />
        <el-table-column v-if="!currentRole()" min-width="110" prop="szbj" label="所在班级" sortable="custom" />
        <el-table-column min-width="200" prop="title" label="活动名称" show-overflow-tooltip />
        <el-table-column min-width="250" prop="cdrw" label="个人承担主要任务" show-overflow-tooltip />
        <el-table-column min-width="250" prop="hdfgm" label="活动覆盖面" show-overflow-tooltip />
        <el-table-column min-width="250" prop="hdcx" label="活动成效" show-overflow-tooltip />
        <el-table-column min-width="120" prop="file" label="活动照片" show-overflow-tooltip>
          <template slot-scope="d">
            <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
              <i class="el-icon-document" />
              活动照片
            </a>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(96)" type="primary" size="mini" plain icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
            <el-button v-if="authCheck(98)" type="danger" size="mini" plain icon="el-icon-delete" @click="deleteData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :hdzz-id="hdzzId" @CB-hdzz="CB_hdzz" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令
import NewEdit from "./newEdit";
import { hdzzList, hdzzDel } from "@/api/dekt/bjxsgz/hdzz";
import { publicMixin } from "@/api/mixins";

export default {
  name: "hdzz",
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
      hdzzId: null
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.7 - 170
    })
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
    //添加
    add() {
      this.dialogState = true;
      this.hdzzId = null;
    },
    //编辑
    edit(id) {
      this.dialogState = true;
      this.hdzzId = id;
    },
    CB_hdzz(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.hdzzId = null;
    },
    //多选
    handleSelectionChange(val) {
      console.log(val)
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
          hdzzDel({ id: id })
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
      hdzzList(this.listQuery)
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
