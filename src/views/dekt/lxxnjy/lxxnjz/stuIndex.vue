<template>
  <div>
    <div class="app-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="mc+'报名'" name="first">
          <div class="filter-container">
            <el-input :clearable="true" v-model="listQuery.keys" :placeholder="'检索：'+mc+'名称'" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </div>
          <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
            <el-table-column align="center" type="index" width="45" />
            <el-table-column :label="mc+'名称'" min-width="160" prop="title" show-overflow-tooltip sortable="custom" />
            <el-table-column :label="mc+'截止报名时间'" min-width="160" prop="bmjz_time" show-overflow-tooltip sortable="custom" />
            <el-table-column :label="mc+'时间'" min-width="270" prop="times" show-overflow-tooltip>
              <template slot-scope="d">
                <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
                <span v-else>'--'</span>
              </template>
            </el-table-column>
            <el-table-column :label="mc+'人数'" min-width="140" prop="num" sortable="custom">
              <template slot-scope="d">
                {{ d.row.bmrs || 0 }} / {{ d.row.num }}
              </template>
            </el-table-column>
            <el-table-column :label="mc+'地点'" min-width="150" prop="address" show-overflow-tooltip />
            <el-table-column :width="90" align="center" label="操作" fixed="right" class-name="small-padding fixed-width">
              <template slot-scope="d">
                <span v-if="checkTime(d.row.times[1])" class="text-muted">已结束</span>
                <span v-else>
                  <span v-if="checkTime(d.row.bmjz_time)" class="text-danger">报名已截止</span>
                  <span v-else>
                    <span v-if="d.row.bmrs == d.row.num">
                      <span class="text-warning">已报满</span>
                    </span>
                    <el-button v-else type="primary" size="mini" plain @click="bm(d.row.id)">
                      <svg-icon icon-class="apply" class="margin-right-5" />报名
                    </el-button>
                  </span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="'我的'+mc" name="second">
          <div class="filter-container">
            <el-input :clearable="true" v-model="listQuery.keys" :placeholder="'检索：'+mc+'名称'" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item margin-right-10" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </div>
          <el-table v-loading="listLoading" :data="dataList" :max-height="clientHeight" element-loading-text="数据载入中" highlight-current-row fit stripe @sort-change="handleSort">
            <el-table-column align="center" type="index" width="45" />
            <el-table-column :label="mc+'名称'" min-width="160" prop="title" show-overflow-tooltip sortable="custom" />
            <el-table-column :label="mc+'时间'" min-width="270" prop="times" show-overflow-tooltip>
              <template slot-scope="d">
                <span v-if="d.row.times && d.row.times[0]">{{ d.row.times[0] }} ~ {{ d.row.times[1] }}</span>
                <span v-else>'--'</span>
              </template>
            </el-table-column>
            <el-table-column :label="mc+'地点'" min-width="150" prop="address" show-overflow-tooltip />
            <el-table-column min-width="110" prop="cyjs" label="参与角色" show-overflow-tooltip sortable="custom">
              <template slot-scope="d">
                {{ d.row.cyjs ? d.row.cyjs==1 ? '组织者' : '参与者' : '--' }}
              </template>
            </el-table-column>
            <el-table-column min-width="200" prop="cyqk" label="具体参与情况" show-overflow-tooltip />
            <el-table-column min-width="200" prop="shgw" label="收获与感悟" show-overflow-tooltip />
            <el-table-column :label="mc+'反馈'" min-width="200" prop="hdfk" show-overflow-tooltip />
            <el-table-column min-width="110" prop="smj" label="证明材料" show-overflow-tooltip>
              <template slot-scope="d">
                <a v-if="d.row.file && d.row.file.url" :href="d.row.file.url" class="text-primary" target="_blank">
                  <i class="el-icon-document" />
                  证明材料
                </a>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column :width="200" align="right" label="操作" fixed="right" class-name="small-padding fixed-width">
              <template slot-scope="d">
                <span v-if="isTj(d.row.times[1])" class="text-warning margin-right-10">{{ mc }}尚未结束</span>
                <el-button v-else type="primary" size="mini" plain icon="el-icon-edit" @click="edit(d.row.id)">反馈</el-button>
                <el-button v-if="d.row.cyjs==2 && checkTime(d.row.bmjz_time)" type="danger" size="mini" plain icon="el-icon-circle-close-outline" @click="qxbm(d.row.id)">取消报名</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <Page v-model="listQuery" :total="total" />
    <NewEdit :dialog-state="dialogState" :hdid="hdid" :mc="mc" @CB-hd="CB_hd" />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import NewEdit from "./newEdit";
import { cxhdList, hdbmList, hdbm, hdbmDel } from "@/api/dekt/txhdsj/cxhd";
import { publicMixin } from "@/api/mixins";

export default {
  name: "cxhd",
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
      multipleSelection: [],
      activeName: 'first',
      //新增、编辑Dialog
      dialogState: false,
      hdid: null,
      mc: ""
    };
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight;
    }
  },
  activated() {
    this.mc = this.$route.meta.mc || '讲座'
    this.listQuery.listRows = this.$store.state.pageSize;
    this.getData()
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
      this.getData()
    },
    //排序
    handleSort(val) {
      this.listQuery._sort = val.order === "ascending" ? "asc" : "desc"
      this.listQuery._order = val.prop ? val.prop : "id"
      this.getData()
    },
    //添加
    add() {
      this.dialogState = true;
    },
    //判断截止状态
    checkTime(time) {
      let newtime = new Date(time);
      let now = new Date();
      return newtime.getTime() < now.getTime()
    },
    //报名
    bm(id) {
      this.$confirm("确定要参加该" + this.mc + "吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          hdbm({ id: id })
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
        })
        .catch(() => { });
    },
    qxbm(id) {
      this.$confirm("确定要参加该" + this.mc + "吗？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          hdbmDel({ id: id })
            .then(rs => {
              this.$message({
                message: "取消成功！",
                type: "success"
              });
              this.listLoading = false;
              this.getData();
            })
            .catch(() => {
              this.listLoading = false;
            });
        })
        .catch(() => { });
    },
    //编辑
    edit(id, type) {
      this.dialogState = true;
      this.hdid = id;
    },
    // dialog 回调
    CB_hd(val) {
      if (val === 1) {
        this.getData();
      }
      this.dialogState = false;
      this.hdid = null;
    },
    getData() {
      this.listLoading = true;
      if (this.activeName == "second") {
        //获取已报名数据
        hdbmList(this.listQuery)
          .then(rs => {
            this.listLoading = false;
            this.dataList = rs.data;
            this.total = rs.count;
          })
          .catch(() => {
            this.listLoading = false;
          });
      } else {
        //获取未报名数据
        cxhdList(this.$route.name, this.listQuery)
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
