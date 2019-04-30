<template>
  <el-dialog :visible="dialogStatus" :fullscreen="isphone()" title="教室借用申请" top="0" width="500px" custom-class="pull-right no-margin" @close="handleClose" @open="openDialog">
    <div v-loading="loading" :style="{ 'height': isphone() ? 'auto' :clientHeight +'px'}" element-loading-text="数据载入中">
      <el-row :gutter="30">
        <el-form ref="form" :model="form" label-suffix="：" label-width="110px">
          <el-col :span="24">
            <el-form-item label="教室名称">
              {{ form.title || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="教室地点">
              {{ form.address || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="借用时间">
              {{ form.time }} {{ form.times[0] }}~ {{ form.times[1] }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用途">
              <div v-html="Trim(form.yt)" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="添加学生">
              {{ form.name }} （{{ form.account }}）
            </el-form-item>
          </el-col>
          <el-col :span="24" class="padding-left-40">
            <LogDetail v-if="jid && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20">
              <span v-if="form.shenhe_status==2"> {{ form.beizhu }}</span>
            </LogDetail>
          </el-col>
        </el-form>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import LogDetail from "@/components/LogDetail";
import { jssqRead } from "@/api/rcgl/jssq";
import { publicMixin } from "@/api/mixins";

const form = {
  title: '', //教室名称
  address: '', //教室地点
  time: "", //借用日期
  times: [], //借用时间段
  yt: "" //用途
};
export default {
  name: "XmlxDetail",
  components: { LogDetail },
  mixins: [publicMixin],
  props: ["dialogStatus", "jid"],
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
      jssqRead(this.jid)
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

