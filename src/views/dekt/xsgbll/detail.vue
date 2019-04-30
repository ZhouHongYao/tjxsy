<template>
  <el-dialog :visible="dialogStatus" :fullscreen="isphone()" title="学生干部履历" top="0" width="520px" custom-class="pull-right no-margin" @close="handleClose" @open="openDialog">
    <div v-loading="loading" :style="{ 'height': isphone() ? 'auto' :clientHeight +'px'}" element-loading-text="数据载入中">
      <el-row :gutter="30">
        <el-form ref="form" :model="form" label-suffix="：" label-width="110px">
          <el-col :span="24">
            <el-form-item label="单位">
              {{ form.dw || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="职务">
              {{ form.zw || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="任职时间">
              {{ form.start_time || '--' }} ~ {{ form.end_time || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证明人">
              {{ form.zmr || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="特色亮点工作概况" label-width="140px" style="margin-left: -15px;">
              <div v-if="form.gzgk" v-html="Trim(form.gzgk)" />
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
          <el-col v-if="!currentRole()" :span="24">
            <el-form-item label="添加学生">
              {{ form.name || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24" class="padding-left-40">
            <LogDetail v-if="gbllId && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20" />
          </el-col>
        </el-form>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import LogDetail from "@/components/LogDetail";
import { xsgbllRead } from "@/api/dekt/xsgbll";
import { publicMixin } from "@/api/mixins";

const form = {
  dw: "", //单位
  zw: "", //职务
  start_time: null, //任职时间
  end_time: null, //任职时间
  zmr: "", //证明人
  file: {
    name: "",
    path: "",
    url: ""
  },
  name: "",
  gzgk: "" //特色亮点工作概况
};
export default {
  name: "XmlxDetail",
  components: { LogDetail },
  mixins: [publicMixin],
  props: ["dialogStatus", "gbllId"],
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
      xsgbllRead(this.gbllId)
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

