<template>
  <el-dialog :visible="dialogStatus" :fullscreen="isphone()" title="科创项目" top="0" width="500px" custom-class="pull-right no-margin" @close="handleClose" @open="openDialog">
    <div v-loading="loading" :style="{ 'height': isphone() ? 'auto' :clientHeight +'px'}" element-loading-text="数据载入中">
      <el-row :gutter="30">
        <el-form ref="form" :model="form" label-suffix="：" label-width="110px">
          <el-col :span="24">
            <el-form-item label="项目名称">
              {{ form.xmmc || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目介绍">
              <div v-html="Trim(form.xmjs)" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="学习时间">
              {{ form.times[0] }} ~ {{ form.times[1] }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="国家">
              {{ form.gj || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单位">
              {{ form.dw || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="交流报告">
              <a v-if="form.file && form.file.url" :href="form.file.url" class="text-primary" target="_blank">
                <i class="el-icon-document" />
                交流报告
              </a>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="添加学生">
              {{ form.name }} （{{ form.account }}）
            </el-form-item>
          </el-col>
          <el-col :span="24" class="padding-left-40">
            <LogDetail v-if="gjjlxxId && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20" />
          </el-col>
        </el-form>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import LogDetail from "@/components/LogDetail";
import { gjjlxxRead } from "@/api/xyxx/gjjlxx";
import { publicMixin } from "@/api/mixins";

const form = {
  xmmc: "", //项目名称
  xmjs: "", //项目介绍
  times: [], //学习时间
  gj: "", //国家
  dw: "", //单位
  file: {
    url: "",
    name: "",
    path: ""
  }
};

export default {
  name: "XmlxDetail",
  components: { LogDetail },
  mixins: [publicMixin],
  props: ["dialogStatus", "gjjlxxId"],
  data() {
    return {
      loading: false,
      form: form
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => state.clientHeight + 106
    })
  },
  methods: {
    //打开
    openDialog() {
      this.getRead();
    },
    //读取数据
    getRead() {
      this.loading = true;
      gjjlxxRead(this.gjjlxxId)
        .then(rs => {
          this.form = rs;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //关闭
    handleClose() {
      this.form = form;
      this.$emit("CB-dialogDetail", false);
    }
  }
};
</script>

