<template>
  <div v-loading="listLoading" class="app-container" element-loading-text="数据载入中">
    <stuInfo v-if="$route.query.sid" :sid="$route.query.sid" />
    <div class="filter-container">
      <h3>{{ $route.meta.title }}</h3>
    </div>
    <el-form label-suffix="：">
      <el-row class="padding-20">
        <el-col :span="24" class="margin-bottom-30">
          <b>已修得学分</b>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="总学分">{{ form.zxf || '--' }}</el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="平均绩点">{{ form.jd || '--' }}</el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="通识必修课">{{ form.tsbxk || '--' }}</el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="通识选修课">{{ form.tsxxk || '--' }}</el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="大类基础课程">{{ form.dljck || '--' }}</el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="专业基础课">{{ form.zyjck || '--' }}</el-form-item>
        </el-col>
        <el-col :span="24" class="margin-bottom-30">
          <b>各科成绩</b>
        </el-col>
        <el-table :data="form.cjData" border style="width: 100%">
          <el-table-column prop="km" label="科目" />
          <el-table-column prop="xf" label="学分" />
          <el-table-column prop="cj" label="成绩" />
        </el-table>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import stuInfo from "@/views/grxx/nlcp/components/stuInfo";
import { cjjbqkRead } from "@/api/xyxx/cjjbqk";
import { publicMixin } from "@/api/mixins";

const form = {
  zxf: "", //总学分
  jd: "", //平均绩点
  tsbxk: "", //通识必修课
  tsxxk: "", //通识选修课
  dljck: "", //大类基础课程
  zyjck: "", //专业基础课,
  cjData: []
};
export default {
  name: "cjjbqkDetail",
  directives: {
    waves
  },
  components: { stuInfo },
  mixins: [publicMixin],
  data() {
    return {
      listLoading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form))
    };
  },
  activated() {
    this.getRead()
  },
  methods: {
    //获取数据
    getRead() {
      this.listloading = true;
      let id = this.$route.query.id || 's'
      cjjbqkRead(id)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.p_bel {
  color: #3e4548 !important;
  font-size: 15px;
  font-weight: 600;
}
</style>
