<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据载入中">
    <stuInfo v-if="!currentRole() && $route.query.sid" :sid="$route.query.sid" />
    <div class="filter-container">
      <h3>{{ $route.meta.title }}
        <div v-if="currentRole() && authCheck(148)" class="pull-right margin-bottom-10">
          <el-button v-waves type="primary" icon="el-icon-edit" @click="edit()">填写</el-button>
        </div>
      </h3>
    </div>
    <el-form label-position="top" label-suffix="：" class="padding-top-20 margin-left-40">
      <el-table :data="form.xxqk" border style="width: 100%" class="margin-bottom-30">
        <el-table-column label="担任班级或学生会干部">
          <template slot="header" slot-scope="scope">
            <span>担任班级或学生会干部</span>
          </template>
          <el-table-column prop="zw" label="职务" min-width="80" show-overflow-tooltip />
          <el-table-column prop="start_time" label="任职时间" min-width="200" show-overflow-tooltip>
            <template slot-scope="d">
              <span v-if="d.row.start_time">{{ d.row.start_time }} ~ {{ d.row.end_time }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dw" label="单位" min-width="150" show-overflow-tooltip />
          <el-table-column prop="zmr" label="证明人" />
        </el-table-column>
      </el-table>
      <el-form-item label="大一学年在哪些方面获得了较大的能力提升" class="form_item">
        <div v-html="Trim( form.nlts )" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import stuInfo from "@/views/grxx/nlcp/components/stuInfo";
import goBack from "@/components/goBack";
import waves from "@/directive/waves"; // 水波纹指令
import { zwczRead } from "@/api/dekt/zzyrgz/zwcz";
import { publicMixin } from "@/api/mixins";

const form = {
  nlts: "",
  xxqk: []
};

export default {
  directives: { waves },
  components: { stuInfo, goBack },
  mixins: [publicMixin],
  data() {
    return {
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      rules: {}
    }
  },
  activated() {
    this.getRead()
  },
  deactivated() {
    this.form = JSON.parse(JSON.stringify(form))
  },
  methods: {
    //编辑
    edit() {
      this.$router.push({
        name: 'zwczEdit'
      })
    },
    //获取数据
    getRead() {
      this.loading = true;
      let id = this.$route.query.id || 's'
      zwczRead(id)
        .then(rs => {
          this.form = rs;
          let data = rs.xsgbll || []
          this.form.xxqk = data.concat(rs.xsgbs || [])
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
}
</script>

