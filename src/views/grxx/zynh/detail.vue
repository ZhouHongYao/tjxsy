<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据载入中">
    <keep-alive>
      <stuInfo v-if="!currentRole() && $route.query.sid" :sid="$route.query.sid" />
    </keep-alive>
    <div class="filter-container">
      <h3>{{ $route.meta.title }}
        <div v-if="currentRole()" class="pull-right margin-bottom-10">
          <span v-if="form.can_time && form.can_time.is_can">
            <el-button v-waves type="primary" icon="el-icon-edit" @click="edit()">编辑</el-button>
          </span>
          <span v-if="!form.can_time || (!form.can_time.is_can && !form.can_time.time)" class="text-danger font-90">尚未开放填写</span>
          <span v-if="form.can_time && !form.can_time.is_can && form.can_time.time" class="text-danger font-90">填写时间: {{ form.can_time.time }}</span>
        </div>
      </h3>
    </div>
    <el-form label-suffix="：" label-width="130px" class="padding-top-20">
      <el-form-item label="主题" class="form_item">
        {{ form.title || '--' }}
      </el-form-item>
      <el-form-item label="关键词" class="form_item">
        {{ form.gjc_title || '--' }}
      </el-form-item>
      <el-form-item label="正文" class="form_item">
        <div v-html="Trim(form.content)" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import stuInfo from "../nlcp/components/stuInfo";
import goBack from "@/components/goBack";
import waves from "@/directive/waves"; // 水波纹指令
import { zynhRead } from "@/api/grxx/zynh";
import { publicMixin } from "@/api/mixins";

const form = {
  title: "",
  gjc: "",
  content: "",
  gjc_title: "",
  can_time: {}
}

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
        name: 'zynhEdit'
      })
    },
    //获取数据
    getRead() {
      this.loading = true;
      let id = this.$route.query.id || 's'
      zynhRead(id)
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

