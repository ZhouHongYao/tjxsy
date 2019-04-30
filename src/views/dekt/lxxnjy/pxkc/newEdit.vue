<template>
  <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="700px" top="15vh" @close="handleClose" @open="openDialog">
    <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
        <el-form-item label="课程编号" prop="kcbh">
          <el-input v-model="form.kcbh" placeholder="请填写课程编号" clearable />
        </el-form-item>
        <el-form-item label="课程名称" prop="title">
          <el-input v-model="form.title" placeholder="请填写课程名称" clearable />
        </el-form-item>
        <el-form-item label="课程时间" prop="times">
          <el-date-picker v-model="form.times" :unlink-panels="true" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="学时" prop="xs">
          <el-input v-model="form.xs" placeholder="请填写学时" clearable />
        </el-form-item>
        <el-form-item label="课程地点" prop="address">
          <el-input v-model="form.address" placeholder="请填写课程地点" clearable />
        </el-form-item>
        <el-form-item label="发布状态" prop="fbzt">
          <el-radio-group v-model="form.fbzt">
            <el-radio :label="2">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息" prop="beizhu">
          <el-input :autosize="{ minRows: 6, maxRows: 10}" v-model="form.beizhu" type="textarea" maxlength="300" placeholder="备注信息，非必填项" />
          还可填写
          <span class="text-danger">{{ 300 - (form.beizhu ? form.beizhu.length : 0) }}</span> 个字符
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { pxkcEdit, pxkcRead } from "@/api/dekt/lxxnjy/pxkc";
import { publicMixin } from "@/api/mixins";

const form = {
  title: "", //课程名称
  kcbh: "",	//课程编号
  xs: "", //学时
  beizhu: ""
};
export default {
  directives: { elDragDialog, waves },
  mixins: [publicMixin],
  props: ["dialogState", "kcId"],
  data() {
    return {
      title: "添加课程",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      rules: {
        kcbh: [{
          required: true,
          message: "请填写课程编号！",
          trigger: "blur"
        }],
        title: [{
          required: true,
          message: "请填写课程名称！",
          trigger: "blur"
        }],
        times: [{
          required: true,
          message: "请选择课程时间！",
          trigger: "change"
        }],
        fbzt: [{
          required: true,
          message: "请选择发布状态！",
          trigger: "change"
        }]
      }
    };
  },
  computed: {
    ...mapState({
      clientHeight: state => (state.clientHeight + 200) * 0.7 - 170
    })
  },
  methods: {
    openDialog() {
      if (this.kcId) {
        this.title = "编辑课程";
        this.getRead();
      }
    },
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let api_type = this.kcId ? "put" : "post";
          this.loading = true;
          pxkcEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-kc", 1);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    //获取详情
    getRead() {
      this.listloading = true;
      pxkcRead(this.kcId)
        .then(rs => {
          this.form = rs;
          this.listloading = false;
        })
        .catch(() => {
          this.listloading = false;
        });
    },
    //清空数据
    clear() {
      this.title = "添加课程";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-kc", false);
    }
  }
};
</script>
