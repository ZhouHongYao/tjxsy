<template>
  <div>
    <div class="app-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="课程报名" name="first">
          <div class="filter-container">
            <el-input :clearable="true" v-model="listQuery.keys" style="width: 340px;" class="filter-item" placeholder="检索：课程名称、课程编号、教师姓名、工号" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </div>
          <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="160" prop="title" label="课程名称" show-overflow-tooltip sortable="custom" />
            <el-table-column min-width="110" prop="kcbh" label="课程编号" sortable="custom" />
            <el-table-column min-width="130" prop="type" label="所属课程类型" show-overflow-tooltip sortable="custom" />
            <el-table-column min-width="80" prop="xf" label="学分" show-overflow-tooltip sortable="custom" />
            <el-table-column min-width="270" prop="times" label="课程时间" show-overflow-tooltip>
              <template slot-scope="d">
                <span v-if="d.row.times&&d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="kcrl" label="课程容量" sortable="custom">
              <template slot-scope="d">
                {{ d.row.bmrs || 0 }} / {{ d.row.kcrl }}
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="fz_name" label="负责老师" show-overflow-tooltip sortable="custom" />
            <el-table-column min-width="140" prop="zysc" label="作业上传方式" show-overflow-tooltip>
              <template slot-scope="d">
                {{ d.row.zysc ? d.row.zysc == 2 ? '组长' : '个人' : '--' }}
              </template>
            </el-table-column>
            <el-table-column align="right" label="操作" width="90" fixed="right" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <span v-if="scope.row.kcrl == scope.row.bmrs" class="text-warning">已报满</span>
                <span v-else>
                  <el-button type="primary" size="mini" plain @click="bm(scope.row.id, true)">
                    <svg-icon icon-class="apply" class="margin-right-5" />报名
                  </el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="我的课程" name="second">
          <div class="filter-container">
            <el-input :clearable="true" v-model="listQuery.keys" style="width: 340px;" class="filter-item" placeholder="检索：课程名称、课程编号、教师姓名、工号" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </div>
          <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort" @selection-change="handleSelectionChange">
            <el-table-column align="center" type="index" width="45" fixed="left" />
            <el-table-column min-width="160" prop="title" label="课程名称" show-overflow-tooltip sortable="custom" />
            <el-table-column min-width="110" prop="kcbh" label="课程编号" sortable="custom" />
            <el-table-column min-width="130" prop="type" label="所属课程类型" show-overflow-tooltip sortable="custom" />
            <el-table-column min-width="80" prop="xf" label="学分" show-overflow-tooltip sortable="custom" />
            <el-table-column min-width="270" prop="times" label="课程时间" show-overflow-tooltip>
              <template slot-scope="d">
                <span v-if="d.row.times&&d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="kcrl" label="课程容量" sortable="custom">
              <template slot-scope="d">
                {{ d.row.kcrl || '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="fz_name" label="负责老师" show-overflow-tooltip sortable="custom" />
            <el-table-column min-width="140" prop="zysc" label="作业上传方式" show-overflow-tooltip sortable="custom">
              <template slot-scope="d">
                {{ d.row.zysc ? d.row.zysc == 2 ? '组长' : '个人' : '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="110" prop="is_zz" label="组长">
              <template slot-scope="d">
                {{ d.row.is_zz ? '是':'否' }}
              </template>
            </el-table-column>
            <el-table-column min-width="250" prop="kcfk" label="课程反馈" show-overflow-tooltip>
              <template slot-scope="d">
                {{ d.row.kcfk || '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="120" prop="kczy" label="课程作业" show-overflow-tooltip>
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  课程作业
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align="right" label="操作" width="200" fixed="right" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <span v-if="isTj(scope.row.times[1])" class="text-warning margin-right-10">课程尚未结束</span>
                <span v-else>
                  <el-button v-if="scope.row.zysc && scope.row.zysc== 2 && scope.row.is_zz" type="primary" size="mini" plain icon="el-icon-edit" @click="edit(scope.row.id)">组长提交</el-button>
                  <el-button v-if="scope.row.zysc && scope.row.zysc== 1" type="primary" size="mini" plain icon="el-icon-edit" @click="edit(scope.row.id)">提交作业</el-button>
                </span>
                <el-button v-if="isBm(scope.row.times[0])" type="danger" size="mini" plain icon="el-icon-circle-close-outline" @click="bm(scope.row.id ,false)">取消报名</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :kc-id="kcId" @CB-ggpyxx="CB_ggpyxx" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { ggpyxxList, kcbm, ggpyxxDel } from "@/api/dekt/bjxsgz/ggpyxx";
import { tbkcList } from "@/api/dekt/bjxsgz/tbkc";
import { publicMixin } from "@/api/mixins";
import NewEdit from "./newEdit";

export default {
  name: "ggpyxx",
  directives: { waves },
  components: { NewEdit },
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
      activeName: 'first',
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
    if (!this.currentRole()) {
      this.getKc()
    }
    this.getData();
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
      this.listQuery = {
        listRows: this.$store.state.pageSize,
        page: 1,
        keys: "",
        _sort: "desc",
        _order: "id",
        type: this.$route.meta.type || ''
      }
      this.getData()
    },
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
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //添加
    add() {
      this.dialogState = true;
    },
    //编辑
    edit(id) {
      this.dialogState = true;
      this.kcId = id;
    },
    // dialog 回调
    CB_ggpyxx(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.kcId = null;
    },
    //报名
    bm(id, is_bm) {
      let title = is_bm ? "确定要参加该课程吗？" : "确定要取消该课程的报名吗？"
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (is_bm) {
            this.listLoading = true;
            kcbm({ tbid: id })
              .then(rs => {
                setTimeout(() => {
                  this.$alert(rs, '温馨提示', {
                    confirmButtonText: '确定',
                    callback: action => { }
                  });
                  this.listLoading = false;
                  this.getData();
                }, 300)
              })
              .catch(() => {
                this.listLoading = false;
              });
          } else {
            this.listLoading = true;
            ggpyxxDel({ id: id })
              .then(rs => {
                this.$message({
                  message: "取消报名成功！",
                  type: "success"
                });
                this.listLoading = false;
                this.getData();
              })
              .catch(() => {
                this.listLoading = false;
              });
          }
        })
        .catch(() => { });
    },
    //获取数据
    getData() {
      this.listLoading = true;
      if (this.activeName == "second") {
        //获取已报名数据
        ggpyxxList(this.listQuery)
          .then(rs => {
            this.listLoading = false;
            this.dataList = rs.data || [];
            this.total = rs.count;
          })
          .catch(() => {
            this.listLoading = false;
          });
      } else {
        //获取未报名数据
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
  }
};
</script>

