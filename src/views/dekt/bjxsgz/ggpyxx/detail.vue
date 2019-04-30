<template>
  <el-dialog :visible="dialogDetail" :fullscreen="isphone()" title="课程作业详情" top="0" width="480px" custom-class="pull-right no-margin" @close="handleClose" @open="openDialog">
    <div :style="{ 'height': isphone() ? 'auto' :clientHeight +'px'}">
      <el-row>
        <el-form label-suffix="：" label-width="130px">
          <el-col :span="24">
            <el-form-item label="学生姓名">
              {{ data.name || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="学号">
              {{ data.account || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="性别">
              {{ data.sex || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所在班级">
              {{ data.szbj || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="课程名称">
              {{ data.title || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="课程编号">
              {{ data.kcbh || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属课程类型">
              {{ data.type }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="学分">
              {{ data.xf || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="课程时间">
              <span v-if="data.times && data.times[0]">{{ data.times[0] }} ~ {{ data.times[1] }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="课程容量">
              {{ data.kcrl || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="课程地点">
              {{ data.address || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="培训对象">
              {{ data.pxdx_title || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="课程负责老师">
              {{ data.fz_name }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="课程反馈">
              <div v-html="Trim(data.kcfk)" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="课程作业">
              <a v-if="data.file && data.file.url" :href="data.file.url" class="text-primary" target="_blank">
                <i class="el-icon-document" />
                课程作业
              </a>
              <span v-else>--</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <LogDetail v-if="form.id && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20 margin-left-50" />
          </el-col>
        </el-form>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import LogDetail from "@/components/LogDetail";
import { publicMixin } from "@/api/mixins";
import { ggpyxxRead } from "@/api/dekt/bjxsgz/ggpyxx";
const form = {
  id: "",
  shenhelog: []
}
export default {
  components: { LogDetail },
  mixins: [publicMixin],
  props: ["dialogDetail", "data"],
  data() {
    return {
      form: JSON.parse(JSON.stringify(form))
    }
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight + 105;
    }
  },
  methods: {
    //打开
    openDialog() {
      this.getRead()
    },
    //关闭
    handleClose() {
      this.form = JSON.parse(JSON.stringify(form))
      this.$emit("CB-detail", false);
    },
    //获取详情
    getRead() {
      ggpyxxRead(this.data.id)
        .then(rs => {
          this.form = rs;
        })
        .catch(() => {
        });
    }
  }
};
</script>

