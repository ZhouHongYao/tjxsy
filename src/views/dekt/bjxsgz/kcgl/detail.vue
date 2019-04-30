<template>
  <div>
    <el-dialog :visible="detailDialog" :fullscreen="isphone()" title="课程详情" top="0" width="480px" custom-class="pull-right no-margin" @close="handleClose" @open="openDialog">
      <div v-loading="loading" :style="{ 'height': clientHeight +'px'}" element-loading-text="数据载入中">
        <el-row :gutter="30">
          <el-form ref="form" :model="form" label-suffix="：" label-width="130px">
            <el-form-item label="课程名称">
              {{ form.title || '--' }}
            </el-form-item>
            <el-form-item label="课程编号">
              {{ form.kcbh || '--' }}
            </el-form-item>
            <el-form-item label="所属课程类型">
              {{ form.type }}
            </el-form-item>
            <el-form-item label="学分">
              {{ form.xf || '--' }}
            </el-form-item>
            <el-form-item label="课程时间">
              {{ form.times[0] }} ~{{ form.times[1] }}
            </el-form-item>
            <el-form-item label="课程容量">
              {{ form.kcrl || '--' }}
            </el-form-item>
            <el-form-item label="课程地点">
              {{ form.address || '--' }}
            </el-form-item>
            <el-form-item label="培训对象">
              {{ form.pxdx_title || '--' }}
            </el-form-item>
            <el-form-item label="课程负责老师">
              {{ form.fz_name }}
            </el-form-item>
            <el-form-item label="备注">
              <div v-html="Trim(form.beizhu)" />
            </el-form-item>
          </el-form>
        </el-row>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { publicMixin } from "@/api/mixins";
import { tbkcRead } from "@/api/dekt/bjxsgz/tbkc";

const form = {
  title: "", //课程名称
  kcbh: "",	//课程编号
  type: "", //所属课程类型
  xf: null, //学分
  kid: "",	//课程id
  times: [], //课程日期
  kcrl: '', // 课程容量
  uid: null,
  address: "", //课程地点
  fz_name: "",	//课程负责老师
  beizhu: ""
};
export default {
  mixins: [publicMixin],
  props: ["detailDialog", "kcId"],
  data() {
    return {
      loading: false,
      form: form
    };
  },
  computed: {
    clientHeight() {
      return this.$store.state.clientHeight + 105;
    }
  },
  methods: {
    //打开
    openDialog() {
      this.getRead();
    },
    //读取数据
    getRead() {
      this.loading = true;
      tbkcRead(this.kcId)
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
      this.form = JSON.parse(JSON.stringify(form));
      this.$emit("CB-detail", false);
    }
  }
};
</script>

