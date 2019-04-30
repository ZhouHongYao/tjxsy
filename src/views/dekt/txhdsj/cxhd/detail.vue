<template>
  <el-dialog :visible="dialogStatus" :fullscreen="isphone()" title="反馈信息" top="0" width="480px" custom-class="pull-right no-margin" @close="handleClose" @open="openDialog">
    <div :style="{ 'height': isphone() ? 'auto' :clientHeight +'px'}">
      <el-row>
        <el-form v-loading="loading" label-suffix="：" label-width="130px" element-loading-text="数据载入中">
          <el-col :span="24">
            <el-form-item label="学生姓名">
              {{ form.name || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="学号">
              {{ form.account || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参与角色">
              {{ form.cyjs ? form.cyjs==1 ? '组织者' : '参与者' : '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="签到状态">
              {{ form.qd_time ? '已签到' : '未签到' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="具体参与情况">
              <div v-html="Trim(form.cyqk)" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="收获与感悟">
              <div v-html="Trim(form.shgw)" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="反馈">
              <div v-html="Trim(form.hdfk)" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证明材料">
              <a v-if="form.file && form.file.url" :href="form.file.url" class="text-primary" target="_blank">
                <i class="el-icon-document" />
                证明材料
              </a>
              <span v-else>--</span>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { publicMixin } from "@/api/mixins";
import { hdRead } from "@/api/dekt/txhdsj/cxhd";

const form = {
  title: "",
  name: "",
  account: "",
  cyjs: null, //参与角色
  cyqk: '', //具体参与情况
  shgw: '', //活动收获与感悟
  hdfk: '', //活动反馈
  file: {
    url: "",
    path: "",
    name: ""
  }
};

export default {
  mixins: [publicMixin],
  props: ["dialogStatus", "hdId"],
  data() {
    return {
      loading: false,
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
      this.$emit("CB-detail", false);
    },
    //读取数据
    getRead() {
      this.loading = true;
      hdRead(this.hdId)
        .then(rs => {
          this.form = rs;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

