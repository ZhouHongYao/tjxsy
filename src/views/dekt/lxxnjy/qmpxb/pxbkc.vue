<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 280px;" class="filter-item" placeholder="检索：课程名称、课程编号" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
        <el-table-column align="center" type="index" width="45" fixed="left" />
        <el-table-column min-width="160" prop="title" label="课程名称" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="270" prop="times" label="课程时间" show-overflow-tooltip>
          <template slot-scope="d">
            <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="130" prop="xs" label="学时" show-overflow-tooltip />
        <el-table-column min-width="180" prop="address" label="课程地点" show-overflow-tooltip />
        <el-table-column min-width="180" prop="xd" label="心得/调研报告" show-overflow-tooltip />
        <el-table-column min-width="180" prop="file" label="照片/材料" show-overflow-tooltip>
          <template slot-scope="d">
            <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
              <i class="el-icon-document" />
              照片/材料
            </a>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作" width="100" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(120)" type="primary" size="mini" plain icon="el-icon-edit" @click="edit(scope.row.id)">提交心得</el-button>
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
import { pxkcList } from "@/api/dekt/lxxnjy/pxkc";

export default {
  name: "pxkc",
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
    //编辑
    edit(id, type) {
      this.dialogState = true;
      this.kcId = id;
    },
    // dialog 回调
    CB_kc(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.kcId = null;
    },
    //获取数据
    getData() {
      this.listLoading = true;
      pxkcList(this.listQuery)
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
