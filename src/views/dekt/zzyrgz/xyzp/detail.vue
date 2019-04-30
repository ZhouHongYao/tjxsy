<template>
  <div v-loading="loading" class="app-container" element-loading-text="数据载入中">
    <stuInfo v-if="!currentRole() && $route.query.sid" :sid="$route.query.sid" />
    <div class="filter-container">
      <h3>{{ $route.meta.title }}
        <div v-if="currentRole() && authCheck(138)" class="pull-right margin-bottom-10">
          <span v-if="form.can_time && form.can_time.is_can">
            <el-button v-waves type="primary" icon="el-icon-edit" @click="edit()">填写</el-button>
          </span>
          <span v-if="!form.can_time || (!form.can_time.is_can && !form.can_time.time)" class="text-danger font-90">尚未开放填写</span>
          <span v-if="form.can_time && !form.can_time.is_can && form.can_time.time" class="text-danger font-90">填写时间: {{ form.can_time.time }}</span>
        </div>
      </h3>
    </div>
    <el-form label-position="top" class="padding-top-20 margin-left-40">
      <el-form-item label="学习方法和习惯发生哪些改变？" class="form_item">
        <div v-html="Trim( form.ffxg )" />
      </el-form-item>
      <el-form-item label="学习困难出现在哪里?" class="form_item">
        <div v-html="Trim( form.xxkn )" />
      </el-form-item>
      <el-form-item label="擅长哪些科目？感兴趣的科目？非常不擅长的科目?" class="form_item">
        <div v-html="Trim( form.sckm )" />
      </el-form-item>
      <el-form-item label="大一学年学业成绩自我满意度评分" class="form_item">
        {{ form.zwpf || '--' }} <span v-if="form.zwpf">分</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import stuInfo from "@/views/grxx/nlcp/components/stuInfo";
import goBack from "@/components/goBack";
import waves from "@/directive/waves"; // 水波纹指令
import { xyzpRead } from "@/api/dekt/zzyrgz/xyzp";
import { publicMixin } from "@/api/mixins";

const form = {
  ffxg: "", //学习方法和习惯发生哪些改变
  xxkn: "", //学习困难出现在哪里
  sckm: "", //擅长哪些科目？感兴趣的科目？非常不擅长的科目
  zwpf: 0 //大一学年学业成绩自我满意度评分
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
        name: 'xyzpEdit'
      })
    },
    //获取数据
    getRead() {
      this.loading = true;
      let id = this.$route.query.id || 's'
      xyzpRead(id)
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

