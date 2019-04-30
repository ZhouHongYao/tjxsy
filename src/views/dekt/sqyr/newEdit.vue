<template>
  <el-dialog v-el-drag-dialog :title="title" :visible="dialogState" :fullscreen="isphone()" :close-on-click-modal="false" width="780px" top="15vh" @close="handleClose" @open="openDialog">
    <div :style="{'height': isphone() ? 'auto' : clientHeight +'px', 'overflow-y': 'auto'}">
      <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
        <el-row>
          <el-col :span="24">
            <el-form-item label="年月" prop="ym" class="form_item">
              <el-date-picker v-model="form.ym" class="filter-item" format="yyyy-MM" value-format="yyyy-MM" type="month" placeholder="评选为模范寝室的时间" align="right" />
            </el-form-item>
            <el-form-item label="学生姓名" prop="name" class="form_item">
              <el-input v-model="form.name" autosize placeholder="请填写学生姓名(按回车健确认)" clearable @blur="checkStu()" @keyup.enter.native="checkStu()" @change="clearStu()" />
            </el-form-item>
            <el-form-item label="所在寝室楼" prop="szqsl" class="form_item">
              <el-input v-model="form.szqsl" placeholder="请填写所在寝室楼" clearable />
            </el-form-item>
            <el-form-item label="寝室号" prop="qsh" class="form_item">
              <el-input v-model="form.qsh" placeholder="请填写寝室号" clearable />
            </el-form-item>
            <el-form-item label="卫生检查评分" prop="ypf" class="form_item">
              <el-input v-model="form.ypf" placeholder="请填写月寝室卫生检查评分" clearable />
            </el-form-item>
            <el-form-item label="评选为模范寝室时间" prop="mfqs_time" class="form_item" label-width="160px">
              <el-date-picker v-model="form.mfqs_time" class="filter-item" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="评选为模范寝室的时间" align="right" />
            </el-form-item>
            <el-form-item label="违章用电时间" prop="wzyd" class="form_item">
              <el-input v-model="form.wzyd" placeholder="请填写违章用电时间" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24" />
        </el-row>
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
import { sqyrEdit, sqyrRead } from "@/api/dekt/sqyr";
import { checkTeacher, publicMixin } from "@/api/mixins";

const form = {
  sid: null,
  name: "",
  szqsl: "", //所在寝室楼
  qsh: "", //寝室号
  ypf: "", //月寝室卫生检查评分
  mfqs_time: null, //评选为模范寝室的时间
  wzyd: "" //违章用电时间
};
export default {
  directives: { elDragDialog, waves },
  mixins: [checkTeacher, publicMixin],
  props: ["dialogState", "sqyrId"],
  data() {
    return {
      title: "添加社区育人",
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      rules: {
        ym: [{
          required: true,
          message: "请选择年月！",
          trigger: "change"
				}],
				name: [{
          required: true,
          message: "请填写学生姓名！",
          trigger: "blur"
        }],
        szqsl: [{
          required: true,
          message: "请填写所在寝室楼！",
          trigger: "blur"
        }],
        qsh: [{
          required: true,
          message: "请填写寝室号！",
          trigger: "blur"
        }],
        ypf: [{
          required: true,
          message: "请填写月寝室卫生检查评分！",
          trigger: "blur"
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
      if (this.sqyrId) {
        this.title = "编辑社区育人";
        this.getRead();
      }
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
    //保存数据
    handleKeep(is_shenhe) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let api_type = this.sqyrId ? "put" : "post";
          this.loading = true;
          sqyrEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-sqyr", 1);
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    getRead() {
      this.listloading = true;
      sqyrRead(this.sqyrId)
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
      this.title = "添加社区育人";
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-sqyr", false);
    }
  }
};
</script>
