<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据载入中">
    <stuInfo v-if="!currentRole() && $route.query.sid" :sid="$route.query.sid" />
    <div class="filter-container">
      <h3>{{ $route.meta.title }}
        <div v-if="currentRole() && authCheck(157)" class="pull-right margin-bottom-10">
          <span v-if="form.can_time && form.can_time.is_can">
            <el-button v-waves type="primary" icon="el-icon-edit" @click="edit()">填写</el-button>
          </span>
          <span v-if="!form.can_time || (!form.can_time.is_can && !form.can_time.time)" class="text-danger font-90">尚未开放填写</span>
          <span v-if="form.can_time && !form.can_time.is_can && form.can_time.time" class="text-danger font-90">填写时间: {{ form.can_time.time }}</span>
        </div>
      </h3>
    </div>
    <el-form label-position="top" class="padding-top-20 margin-left-40">
      <el-form-item label="在承担家庭责任方面做了哪些努力？" class="form_item">
        <div v-html="Trim( form.jtzr )" />
      </el-form-item>
      <el-form-item label="对家乡的发展有哪些关注？" class="form_item">
        <div v-html="Trim( form.jxgz )" />
      </el-form-item>
      <el-form-item label="在服务家乡发展方面做了哪些工作？" class="form_item">
        <div v-html="Trim( form.fwjx )" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import stuInfo from "@/views/grxx/nlcp/components/stuInfo";
import goBack from "@/components/goBack";
import waves from "@/directive/waves"; // 水波纹指令
import { fwjxRead } from "@/api/dekt/zzyrgz/fwjx";
import { publicMixin } from "@/api/mixins";

const form = {
  jtzr: "",
  jxgz: "",
  fwjx: ""
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
        name: 'fwjxEdit'
      })
    },
    //获取数据
    getRead() {
      this.loading = true;
      let id = this.$route.query.id || 's'
      fwjxRead(id)
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

