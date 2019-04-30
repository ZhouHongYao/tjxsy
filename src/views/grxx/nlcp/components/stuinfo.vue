<template>
  <div>
    <h4>学生个人信息
      <goBack v-if="!type||type!='edit'" class="pull-right" />
    </h4>
    <el-form label-suffix="：" label-width="100px">
      <el-row :gutter="30">
        <el-col :sm="12" :md="12" :lg="8">
          <el-form-item label="姓名" class="form_item">
            {{ form.name ||'--' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="12" :lg="8">
          <el-form-item label="学号" class="form_item">
            {{ form.account ||'--' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="12" :lg="8">
          <el-form-item label="性别" class="form_item">
            {{ form.sex ? form.sex == 1 ? '男' : '女' : '--' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="12" :lg="8">
          <el-form-item label="所在班级" class="form_item">
            {{ form.szbj ||'--' }}
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="12" :lg="8">
          <el-form-item label="联系电话" class="form_item">
            {{ form.phone ||'--' }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <hr class="hr_balel">
  </div>
</template>

<script>
import goBack from "@/components/goBack";
import { jbxxRead } from "@/api/grxx/jbxx";

export default {
  components: { goBack },
  props: ["sid", "type"],
  data() {
    return {
      form: {}
    }
  },
  activated() {
    if (this.sid) {
      this.getInfo();
    }
	},
  methods: {
    //获取详情
    getInfo() {
      jbxxRead(this.sid)
        .then(rs => {
          this.form = rs;
        })
        .catch(() => { });
    }
  }
}
</script>
<style scoped>
.hr_balel {
  border: 0;
  background-color: #e4e4e4;
  height: 1px;
}
</style>
