<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据载入中">
    <stuInfo v-if="!currentRole() && $route.query.sid" :sid="$route.query.sid" />
    <div class="filter-container">
      <h3>{{ $route.meta.title }}
        <div v-if="currentRole() && authCheck(153)" class="pull-right margin-bottom-10">
          <el-button v-waves type="primary" icon="el-icon-edit" @click="edit()">填写</el-button>
        </div>
      </h3>
    </div>
    <el-form label-position="top" label-suffix="：" class="padding-top-20 margin-left-40">
      <el-form-item label="服务集体" class="form_item">
        <div v-html="Trim( form.content )" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import stuInfo from "@/views/grxx/nlcp/components/stuInfo";
import goBack from "@/components/goBack";
import waves from "@/directive/waves"; // 水波纹指令
import { fwjtRead } from "@/api/dekt/zzyrgz/fwjt";
import { publicMixin } from "@/api/mixins";

const form = {
  content: "" //服务集体
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
        name: 'fwjtEdit'
      })
    },
    //获取数据
    getRead() {
      this.loading = true;
      let id = this.$route.query.id || 's'
      fwjtRead(id)
        .then(rs => {
          this.form = rs;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
}
</script>

