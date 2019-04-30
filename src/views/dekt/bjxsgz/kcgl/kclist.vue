<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input :clearable="true" v-model="listQuery.keys" style="width: 280px;" class="filter-item" placeholder="检索：课程名称、课程编号" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves v-if="authCheck(80)" class="filter-item margin-right-10" type="primary" icon="el-icon-circle-plus-outline" @click="add()">添加</el-button>
        <el-button v-waves v-if="multipleSelection.length >0 && authCheck(83)" class="filter-item" type="danger" icon="el-icon-delete" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @selection-change="handleSelectionChange" @sort-change="handleSort">
        <el-table-column align="center" type="selection" width="45" fixed="left" />
        <el-table-column min-width="110" prop="kcbh" label="课程编号" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="160" prop="title" label="课程名称" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="140" prop="type" label="所属课程类型" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="110" prop="xf" label="学分" show-overflow-tooltip sortable="custom" />
        <el-table-column min-width="260" prop="times" label="课程时间" show-overflow-tooltip>
          <template slot-scope="d">
            <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }}~{{ d.row.times[1] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column min-width="210" prop="address" label="课程地点" show-overflow-tooltip />
        <el-table-column min-width="120" prop="kcrl" label="课程容量" show-overflow-tooltip sortable="custom">
          <template slot-scope="d">
            {{ d.row.bmrs||'0' }} / {{ d.row.kcrl }}
            <el-button type="text" icon="el-icon-search" @click="tz(d.row.kcbh)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column min-width="125" prop="fz_name" label="课程负责老师" show-overflow-tooltip />
        <el-table-column min-width="140" prop="pxdx_title" label="培训对象" show-overflow-tooltip sortable="custom" />
        <el-table-column align="right" label="操作" width="160" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="authCheck(81)" type="info" size="mini" plain icon="el-icon-document" @click="detail(scope.row.id)">详情</el-button>
            <el-dropdown v-if="authCheck(82) || authCheck(83)" class="margin-left-10" trigger="click" @command="handleCommand">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="authCheck(82)" :command="{type:'edit',ID:scope.row.id}">
                  <span class="text-primary">编辑</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(83)" :command="{type:'delete',ID:scope.row.id}">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :tbkc-dialog="tbkcDialog" :kc-id="kcId" @CB-kc="CB_kc" />
    <!-- 详情-->
    <Detail :kc-id="kcId" :detail-dialog="detailDialog" @CB-detail="CB_detail" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import NewEdit from "./tbkc";
import Detail from "./detail";
import { tbkcList, tbkcDel } from "@/api/dekt/bjxsgz/tbkc";

export default {
  name: "tbkc",
  directives: { waves },
  components: { NewEdit, Detail },
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
        _order: "id",
        kid: ""
      },
      multipleSelection: [],
      //详情Dialog
      detailDialog: false,
      //新增、编辑Dialog
      tbkcDialog: false,
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
    this.listQuery.kid = this.$route.query.id || ''
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
      this.tbkcDialog = true;
    },
    //更多
    handleCommand(row) {
      switch (row.type) {
        case "edit":
          this.tbkcDialog = true;
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
      this.tbkcDialog = false;
      this.kcId = null;
    },
    //详情
    detail(id) {
      this.kcId = id;
      this.detailDialog = true;
    },
    CB_detail() {
      this.kcId = null;
      this.detailDialog = false;
    },
    //查看课程报名详情
    tz(kcbh) {
      this.$router.push({
        name: 'ggpyxx',
        query: {
          kcbh: kcbh
        }
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
          tbkcDel({ id: id })
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
      tbkcList(this.listQuery)
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

