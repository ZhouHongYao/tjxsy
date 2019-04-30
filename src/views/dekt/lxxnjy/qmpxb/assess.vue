<template>
  <el-dialog v-el-drag-dialog :visible="dialogAssess" :fullscreen="isphone()" :append-to-body="true" :close-on-click-modal="false" title="入党启蒙培训班考核" width="580px" top="20vh" @close="handleClose" @open="openDialog">
    <el-form v-loading="listloading" ref="form" :model="form" :rules="rules" class="padding-right-5" label-suffix="：" label-width="120px" element-loading-text="数据载入中">
      <el-form-item label="学生姓名" prop="name" class="form_item">
        {{ form.name }}
      </el-form-item>
      <el-form-item label="结业考核成绩" prop="jykhcj" class="form_item">
        <el-input v-model="form.jykhcj" autosize placeholder="请填写结业考核成绩" clearable />
      </el-form-item>
      <el-form-item label="现实表现成绩" prop="xsbxcj" class="form_item">
        <el-input v-model="form.xsbxcj" autosize placeholder="请填写现实表现成绩" clearable />
      </el-form-item>
      <el-form-item label="考核结果" prop="khjg" class="form_item">
        <el-radio-group v-model="form.khjg">
          <el-radio :label="2">通过</el-radio>
          <el-radio :label="1">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-waves :loading="loading" type="primary" icon="el-icon-success" @click="handleKeep()"> 提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import plupload from "@/components/plupload/index";
import waves from "@/directive/waves"; // 水波纹指令
import { khEdit, khRead } from "@/api/dekt/lxxnjy/qmpxb";
import { publicMixin } from "@/api/mixins";

const form = {
	name: "",
  jykhcj: "",
  xsbxcj: "",
  khjg: 1
};
export default {
  directives: { elDragDialog, waves },
  components: { plupload },
  mixins: [publicMixin],
  props: ["dialogAssess", "assid"],
  data() {
    return {
      listloading: false,
      loading: false,
      form: JSON.parse(JSON.stringify(form)),
      rules: {
        title: [
          {
            required: true,
            message: "请填写课程名称！",
            trigger: "blur"
          }
        ],
        times: [
          {
            required: true,
            message: "请选择课程时间！",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    openDialog() {
      if (this.assid) {
        this.getRead();
      }
    },
    //上传进度
    CB_UploadProgress(file) {
      this.percent = file.percent;
    },
    //上传成功后的回调
    CB_GetFileInfo(res, id) {
      if (res && res.url) {
        this.form.file = res;
        this.percent = 0;
        this.$forceUpdate();
        this.status = "success";
        this.$message({ message: "上传成功", type: "success" });
      } else {
        this.percent = 0;
        this.status = "exception";
        this.$message({ message: "上传失败", type: "error" });
      }
    },
    //刪除图片
    file_close(type) {
      this.form.file.url = "";
      this.form.file.name = "";
      this.form.file.path = "";
      this.$forceUpdate();
    },
    //保存数据
    handleKeep() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let api_type = this.assid ? "put" : "post";
          this.loading = true;
          khEdit(this.form, api_type)
            .then(rs => {
              this.$message({
                message: "提交成功！",
                type: "success"
              });
              this.loading = false;
              this.clear();
              this.$emit("CB-assess", 1);
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
      khRead(this.assid)
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
      this.form = JSON.parse(JSON.stringify(form));
      this.$refs["form"].resetFields();
    },
    //关闭
    handleClose() {
      this.clear();
      this.$emit("CB-assess", false);
    }
  }
};
</script>
