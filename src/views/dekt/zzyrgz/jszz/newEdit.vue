<template>
  <div>
    <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="700px" top="15vh" @close="handleClose" @open="openDialog">
      <div :style="{'height':isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
        <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="135px" element-loading-text="数据载入中">
          <el-form-item label="学生姓名" prop="name" class="form_item">
            <el-input v-model="form.name" autosize placeholder="请填写学生姓名(按回车健确认)" clearable @blur="checkStu()" @keyup.enter.native="checkStu()" @change="clearStu()" />
          </el-form-item>
          <el-form-item label="资助名称" prop="zzmc" class="form_item">
            <el-input v-model="form.zzmc" autosize placeholder="请填写资助名称" clearable />
          </el-form-item>
          <el-form-item label="资助单位" prop="zzdw" class="form_item">
            <el-input v-model="form.zzdw" autosize placeholder="请填写资助单位" clearable />
          </el-form-item>
          <el-form-item label="资助金额（元）" prop="zzje" class="form_item">
            <el-input v-model="form.zzje" autosize placeholder="请填写资助金额（元）" clearable />
          </el-form-item>
          <el-form-item label="校内/校外" prop="type" class="form_item">
            <el-radio-group v-model="form.type">
              <el-radio :label="2">校内</el-radio>
              <el-radio :label="1">校外</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="beizhu">
            <el-input :autosize="{ minRows: 5, maxRows: 10}" v-model="form.beizhu" type="textarea" maxlength="300" placeholder="非必填项，可不填写" />
            还可填写
            <span class="text-danger">{{ 300 - (form.beizhu ? form.beizhu.length : 0) }}</span> 个字符
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { jszzEdit, jszzRead } from "@/api/dekt/zzyrgz/jszz";
import { publicMixin, checkTeacher } from "@/api/mixins";

const form = {
  zzmc: null, //资助名称
  zzdw: null, //资助单位
  zzje: null, //资助金额（元），
  type: 1, //校内、校外
  beizhu: ""
};
export default {
  directives: { elDragDialog, waves },
  mixins: [publicMixin, checkTeacher],
  props: ["dialogState", "jzid"],
  data() {
    return {
      title: "添加接受资助信息",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      //组织者Dialog
      memberStatus: false,
      rules: {
        zzmc: [
          {
            required: true,
            message: "请填写资助名称！",
            trigger: "blur"
          }
        ],
        zzdw: [
          {
            required: true,
            message: "请填写资助单位！",
            trigger: "blur"
          }
        ],
        zzje: [
          {
            required: true,
            message: "请填写资助金额！",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择校内/校外！",
            trigger: "change"
          }
        ]
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
      if (this.jzid) {
        this.title = "编辑接受资助信息";
        this.getRead();
      }
    },
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let api_type = this.jzid ? "put" : "post";
          this.loading = true;
          jszzEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-jz", 1);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    checkStu() {
      if (!this.form.name || this.form.sid) return
      this.changeStudent(this.form.name).then(rs => {
        this.form.sid = rs.sid
      }).catch(() => {
        this.form.sid = null;
      });
    },
    clearStu() {
      this.form.sid = null;
    },
    getRead() {
      this.listloading = true;
      jszzRead(this.jzid)
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
      this.title = "添加接受资助信息";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-jz", false);
    }
  }
};
</script>
