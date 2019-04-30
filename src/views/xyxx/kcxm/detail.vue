<template>
  <el-dialog :visible="dialogStatus" :fullscreen="isphone()" title="科创项目" top="0" width="500px" custom-class="pull-right no-margin" @close="handleClose" @open="openDialog">
    <div v-loading="loading" :style="{ 'height': isphone() ? 'auto' :clientHeight +'px'}" element-loading-text="数据载入中">
      <el-row :gutter="30">
        <el-form ref="form" :model="form" label-suffix="：" label-width="110px">
          <el-col :span="24">
            <el-form-item label="项目名称">
              {{ form.title || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目类别">
              {{ form.type_title || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="获奖等级">
              {{ form.hjdj_title || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目介绍">
              <div v-html="Trim(form.xmjs)" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目成员">
              <span v-if="form.member&&form.member.length>0">
                <span v-for="(v,ind) in form.member" :key="ind"><span v-if="ind">，</span>{{ v.name }}</span>
              </span>
              <span v-else>--</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="指导老师">
              {{ form.zdjs || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="立项年月">
              {{ form.lx_time || '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实践报告">
              <a v-if="form.sjbg_file && form.sjbg_file.url" :href="form.sjbg_file.url" class="text-primary margin-right-20" target="_blank">
                <i class="el-icon-document" />
                实践报告
              </a>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="获奖证书">
              <a v-if="form.hjzs_file && form.hjzs_file.url" :href="form.hjzs_file.url" class="text-primary" target="_blank">
                <i class="el-icon-document" />
                获奖证书
              </a>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="添加学生">
              {{ form.name }} （{{ form.account }}）
            </el-form-item>
          </el-col>
          <el-col :span="24" class="padding-left-40">
            <LogDetail v-if="xmid && form.shenhelog && form.shenhelog.length>0" v-model="form" class="margin-bottom-20" />
          </el-col>
        </el-form>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import LogDetail from "@/components/LogDetail";
import { kcxmRead } from "@/api/xyxx/kcxm";
import { publicMixin } from "@/api/mixins";

const form = {
  title: "", //项目名称
  type: "", //项目类别
  hjdj: "", //获奖等级
  xmjs: "", //项目介绍
  zdjs: "", //指导老师
  lx_time: "",
  sjbg_file: {
    url: "",
    name: "",
    path: ""
  },
  hjzs_file: {
    url: "",
    name: "",
    path: ""
  },
  member: []
}

export default {
  name: "XmlxDetail",
  components: { LogDetail },
  mixins: [publicMixin],
  props: ["dialogStatus", "xmid"],
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
      kcxmRead(this.xmid)
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

